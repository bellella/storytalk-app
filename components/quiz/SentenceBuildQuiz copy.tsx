import { useMemo, useState } from 'react';
import { Pressable } from 'react-native';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { QuizDtoData } from '@/lib/api/generated/model/quizDtoData';
import { parseSentenceBuildData } from '@/lib/utils/quiz-helpers';

type SentenceBuildQuizProps = {
  data: QuizDtoData | undefined;
  onComplete: (isCorrect: boolean) => void;
};

export function SentenceBuildQuiz({ data, onComplete }: SentenceBuildQuizProps) {
  const [selectedTokenIds, setSelectedTokenIds] = useState<string[]>([]);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const parsed = useMemo(() => parseSentenceBuildData(data), [data]);

  if (!parsed) {
    return (
      <Box className="mb-8 rounded-2xl bg-red-50 p-4">
        <Text className="font-bold text-red-600">
          Invalid SENTENCE_BUILD data
        </Text>
      </Box>
    );
  }

  const built =
    selectedTokenIds
      .map((id) => parsed.tokenTextMap[id])
      .filter(Boolean)
      .join(' ') + (parsed.punctuation ?? '');

  const canCheck = selectedTokenIds.length > 0;

  const handleSubmit = () => {
    if (isAnswered) return;
    const correct =
      selectedTokenIds.join('|') === parsed.answerTokenIds.join('|');
    setIsAnswered(true);
    setIsCorrect(correct);
    onComplete(correct);
  };

  const handleReset = () => {
    setSelectedTokenIds([]);
    setIsAnswered(false);
    setIsCorrect(null);
  };

  return (
    <VStack className="mb-8 gap-4">
      {/* Built sentence display */}
      <Box className="min-h-[64px] rounded-[22px] bg-[#F5F5F9] p-4">
        <Text className="text-base font-bold text-[#3F414E]">
          {built.trim()
            ? built
            : 'Tap the words below to build the sentence.'}
        </Text>

        {!isAnswered && selectedTokenIds.length > 0 && (
          <HStack className="mt-3 gap-4">
            <Pressable
              onPress={() => setSelectedTokenIds((p) => p.slice(0, -1))}
            >
              <Text className="text-xs font-bold text-[#8E97FD]">
                ↩︎ Remove last
              </Text>
            </Pressable>
            <Pressable onPress={() => setSelectedTokenIds([])}>
              <Text className="text-xs font-bold text-[#8E97FD]">
                ⟲ Clear all
              </Text>
            </Pressable>
          </HStack>
        )}
      </Box>

      {/* Token chips */}
      <HStack className="flex-row flex-wrap gap-2">
        {parsed.tokensAll.map((tk) => {
          const used = selectedTokenIds.includes(tk.id);
          return (
            <Pressable
              key={tk.id}
              disabled={isAnswered || used}
              onPress={() => setSelectedTokenIds((p) => [...p, tk.id])}
            >
              <Box
                className={`rounded-2xl px-4 py-3 ${
                  used || isAnswered ? 'bg-primary opacity-50' : 'bg-primary'
                }`}
              >
                <Text className="font-bold text-white">{tk.t}</Text>
              </Box>
            </Pressable>
          );
        })}
      </HStack>

      {/* Result feedback */}
      {isAnswered && (
        <Box
          className={`rounded-2xl p-4 ${
            isCorrect ? 'bg-[#8E97FD]/10' : 'bg-red-50'
          }`}
        >
          <Text
            className={`font-bold ${
              isCorrect ? 'text-[#8E97FD]' : 'text-red-600'
            }`}
          >
            {isCorrect ? '✅ Correct!' : '❌ Try again.'}
          </Text>
        </Box>
      )}

      {/* Check / Try Again button */}
      {!isAnswered ? (
        <Button
          onPress={handleSubmit}
          isDisabled={!canCheck}
          className={`w-full rounded-xl ${
            canCheck ? 'bg-[#8E97FD]' : 'bg-gray-200'
          }`}
        >
          <ButtonText className="font-bold text-white">Check</ButtonText>
        </Button>
      ) : (
        !isCorrect && (
          <Pressable onPress={handleReset}>
            <Text className="mt-2 text-center text-sm font-bold text-[#8E97FD]">
              Try again
            </Text>
          </Pressable>
        )
      )}
    </VStack>
  );
}
