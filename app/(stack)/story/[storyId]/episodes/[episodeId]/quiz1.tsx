import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  CheckCircle2,
  Eye,
  EyeOff,
  RotateCcw,
  XCircle,
} from 'lucide-react-native';
import { useState } from 'react';
import { Pressable } from 'react-native';
import { AppContainer } from '@/components/app/app-container';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import { Progress, ProgressFilledTrack } from '@/components/ui/progress';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { episodeGetQuizzes } from '@/lib/api/generated/episode/episode';

export default function EpisodeQuizScreen() {
  const { storyId, episodeId } = useLocalSearchParams();
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ['episode-quizzes', episodeId],
    queryFn: () => episodeGetQuizzes(Number(episodeId)),
  });

  const quizzes = data ?? [];
  const [quizIdx, setQuizIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showHint, setShowHint] = useState(false);

  if (isLoading || quizzes.length === 0) return null;

  const currentQuiz = quizzes[quizIdx];
  const progress = ((quizIdx + 1) / quizzes.length) * 100;

  const handleAnswer = (idx: number) => {
    if (isAnswered) return;
    setSelectedAnswer(idx);
    setIsAnswered(true);
  };

  const nextQuiz = () => {
    if (quizIdx === quizzes.length - 1) {
      router.push(`/story/${storyId}/episodes/${episodeId}/result`);
      return;
    }
    setQuizIdx((p) => p + 1);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setShowHint(false);
  };

  return (
    <AppContainer showBackButton>
      <Box className="flex-1 bg-white p-8">
        {/* Header */}
        <HStack className="mb-6 items-center">
          <Pressable onPress={() => router.back()}>
            <Box className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F5F5F9]">
              <RotateCcw size={18} color="#3F414E" />
            </Box>
          </Pressable>

          <Box className="flex-1 px-8">
            <Progress
              value={progress}
              className="h-2 overflow-hidden rounded-full bg-[#F5F5F9]"
            >
              <ProgressFilledTrack className="bg-[#8E97FD]" />
            </Progress>
          </Box>

          <Pressable onPress={() => setShowHint((p) => !p)}>
            <Box
              className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all ${
                showHint ? 'border-[#8E97FD] bg-[#8E97FD]' : 'border-[#EBEAEC]'
              }`}
            >
              {showHint ? (
                <EyeOff size={18} color="white" />
              ) : (
                <Eye size={18} color="#A1A4B2" />
              )}
            </Box>
          </Pressable>
        </HStack>

        <VStack className="flex-1">
          {/* Question */}
          <Box className="mb-6">
            <Box className="mb-3 self-start rounded-full bg-[#8E97FD]/10 px-3 py-1">
              <Text className="text-[10px] font-black uppercase tracking-widest text-[#8E97FD]">
                {currentQuiz.type}
              </Text>
            </Box>

            <Text className="text-xl font-bold leading-tight text-[#3F414E]">
              {currentQuiz.questionEnglish}
            </Text>
          </Box>

          {/* Quiz Card */}
          <Box className="mb-8 flex min-h-[160px] flex-col justify-center rounded-[30px] bg-[#F5F5F9] p-6">
            <Text className="text-lg font-bold italic text-[#3F414E]">
              {currentQuiz.description}
            </Text>

            {showHint && currentQuiz.questionKorean && (
              <Box className="mt-4 border-t border-dashed border-gray-300 pt-4">
                <Text className="text-sm font-bold text-[#8E97FD]">
                  💡 힌트: {currentQuiz.questionKorean}
                </Text>
              </Box>
            )}
          </Box>

          {/* Answers */}
          <VStack className="mb-8 gap-3">
            {currentQuiz.options.map((opt, idx) => {
              const isCorrect = idx === currentQuiz.answerIndex;
              const isSelected = idx === selectedAnswer;

              let cls = 'border-[#EBEAEC] text-[#3F414E]';
              if (isAnswered) {
                if (isCorrect) cls = 'bg-[#8E97FD] text-white border-[#8E97FD]';
                else if (isSelected)
                  cls = 'bg-red-50 text-red-500 border-red-200';
                else cls = 'opacity-40 border-[#EBEAEC] text-[#3F414E]';
              } else {
                cls += ' active:border-[#8E97FD] active:text-[#8E97FD]';
              }

              return (
                <Pressable
                  key={opt.id}
                  disabled={isAnswered}
                  onPress={() => handleAnswer(idx)}
                >
                  <HStack
                    className={`flex-row items-center justify-between rounded-[22px] border-2 p-5 font-bold transition-all ${cls}`}
                  >
                    <Text className="font-bold">{opt.text}</Text>

                    {isAnswered && isCorrect && (
                      <CheckCircle2 size={20} color="white" />
                    )}
                    {isAnswered && isSelected && !isCorrect && (
                      <XCircle size={20} color="#EF4444" />
                    )}
                  </HStack>
                </Pressable>
              );
            })}
          </VStack>

          {/* Bottom Button */}
          <Box className="mt-auto">
            <Button
              onPress={nextQuiz}
              isDisabled={!isAnswered}
              className={`w-full rounded-[22px] ${
                isAnswered ? 'bg-[#8E97FD]' : 'bg-gray-200'
              }`}
            >
              <ButtonText className="font-bold text-white">
                {quizIdx === quizzes.length - 1
                  ? 'Finish Learning'
                  : 'Next Question'}
              </ButtonText>
            </Button>
          </Box>
        </VStack>
      </Box>
    </AppContainer>
  );
}
