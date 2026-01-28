import { useLocalSearchParams, useRouter } from 'expo-router';
import { Check, X } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { AppContainer } from '@/components/app/app-container';
import { useEpisode } from '@/lib/hooks/useEpisodes';

export default function EpisodeQuizScreen() {
  const { episodeId } = useLocalSearchParams();
  const router = useRouter();
  const { data: episode } = useEpisode(episodeId as string);

  const questions = useMemo(() => {
    if (!episode?.postEpisode?.quizSection) return [];
    const { readingComprehension, vocabulary, scriptPractice } =
      episode.postEpisode.quizSection;
    return [...readingComprehension, ...vocabulary, ...scriptPractice];
  }, [episode]);

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const current = questions[index];
  const correctIndex = current?.answer;

  const handleSelect = (choiceIndex: number) => {
    if (selected !== null) return;

    const nextAnswers = [...answers];
    nextAnswers[index] = choiceIndex;
    setAnswers(nextAnswers);
    setSelected(choiceIndex);
    setShowResult(true);

    setTimeout(() => {
      if (index + 1 >= questions.length) {
        router.replace({
          pathname: './result',
          params: {
            answers: JSON.stringify(nextAnswers),
          },
        });
      } else {
        setIndex((i) => i + 1);
        setSelected(null);
        setShowResult(false);
      }
    }, 900);
  };

  if (!current) return null;

  return (
    <AppContainer showBackButton>
      <View className="flex-1 bg-[#FBFBFD] px-5 pt-3">
        {/* Progress */}
        <View className="mb-4 h-1 w-full rounded-full bg-[#ECECF4]">
          <View
            className="h-full rounded-full bg-[#8E97FD]"
            style={{
              width: `${((index + 1) / questions.length) * 100}%`,
            }}
          />
        </View>

        {/* Header */}
        <Text className="text-xs font-extrabold uppercase tracking-widest text-[#8E97FD]">
          Question {index + 1} / {questions.length}
        </Text>

        <Text className="mb-6 mt-2 whitespace-pre-line text-2xl font-extrabold leading-snug text-[#3F414E]">
          {current.question}
        </Text>

        {current.sentence && (
          <View className="mb-5 rounded-[18px] bg-white px-4 py-3 shadow-sm shadow-black/5">
            <Text className="italic leading-relaxed text-[#6D6F7B]">
              {current.sentence}
            </Text>
          </View>
        )}

        {/* Options */}
        <View className="space-y-3">
          {current.options.map((option: string, i: number) => {
            const isSelected = selected === i;
            const isCorrect = correctIndex === i;
            const isWrong = isSelected && !isCorrect;

            return (
              <Pressable
                key={i}
                onPress={() => handleSelect(i)}
                disabled={selected !== null}
                className={`rounded-[22px] border px-5 py-4 transition-all
                ${
                  isCorrect && showResult
                    ? 'border-[#58CC02] bg-[#58CC02]/10'
                    : isWrong
                      ? 'border-[#FF6B6B] bg-[#FF6B6B]/10'
                      : 'border-[#ECECF4] bg-white'
                }
              `}
              >
                <View className="flex-row items-center justify-between">
                  <Text
                    className={`flex-1 text-base font-semibold
                    ${
                      isCorrect && showResult
                        ? 'text-[#2E7D32]'
                        : isWrong
                          ? 'text-[#C62828]'
                          : 'text-[#3F414E]'
                    }
                  `}
                  >
                    {option}
                  </Text>

                  {showResult && isCorrect && (
                    <Check size={20} color="#2E7D32" />
                  )}
                  {showResult && isWrong && <X size={20} color="#C62828" />}
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* Feedback Text */}
        {showResult && (
          <View className="mt-6 items-center">
            <Text
              className={`text-sm font-extrabold uppercase tracking-widest
              ${selected === correctIndex ? 'text-[#58CC02]' : 'text-[#FF6B6B]'}
            `}
            >
              {selected === correctIndex ? 'Correct!' : 'Try again'}
            </Text>
          </View>
        )}
      </View>
    </AppContainer>
  );
}
