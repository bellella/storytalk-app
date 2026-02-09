import { useMemo, useState } from 'react';
import { Pressable } from 'react-native';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { QuizDtoData } from '@/lib/api/generated/model/quizDtoData';
import {
  parseSentenceClozeData,
  SentenceClozeParsed,
} from '@/lib/utils/quiz-helpers';

type SentenceClozeQuizProps = {
  data: QuizDtoData | undefined;
  onAnswer: (isCorrect: boolean, payload: Record<string, unknown>) => void;
};

export function SentenceClozeQuiz({ data, onAnswer }: SentenceClozeQuizProps) {
  const [slotAnswers, setSlotAnswers] = useState<Record<string, string>>({});
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const parsed = useMemo(() => parseSentenceClozeData(data), [data]);

  if (!parsed) {
    return (
      <Box className="mb-8 rounded-2xl bg-red-50 p-4">
        <Text className="font-bold text-red-600">
          Invalid SENTENCE_CLOZE_BUILD data
        </Text>
      </Box>
    );
  }

  const canCheck = parsed.slotIds.every((sid) => !!slotAnswers[sid]);

  const handleSubmit = () => {
    if (isAnswered || !canCheck) return;

    const correct = parsed.slotIds.every(
      (sid) => slotAnswers[sid] === parsed.answerBySlot[sid]
    );

    setIsAnswered(true);
    setIsCorrect(correct);
    const answerText = parsed.slotIds.map((sid) => slotAnswers[sid]).join(' ');
    onAnswer(correct, { answerText });
  };

  const handleReset = () => {
    setSlotAnswers({});
    setIsAnswered(false);
    setIsCorrect(null);
  };

  const renderPart = (p: SentenceClozeParsed['parts'][number], idx: number) => {
    if (p.type === 'text') {
      return (
        <Text key={`t-${idx}`} className="text-base font-bold text-[#3F414E]">
          {p.t}
        </Text>
      );
    }

    const filledId = slotAnswers[p.slotId];
    const filledText =
      parsed.choices.find((c) => c.id === filledId)?.t ??
      (filledId ? '(unknown)' : '_____');

    const slotCorrect =
      isAnswered && filledId && filledId === parsed.answerBySlot[p.slotId];
    const slotWrong =
      isAnswered && filledId && filledId !== parsed.answerBySlot[p.slotId];

    return (
      <Pressable
        key={`s-${p.slotId}-${idx}`}
        disabled={isAnswered}
        onPress={() => {
          setSlotAnswers((prev) => {
            const next = { ...prev };
            delete next[p.slotId];
            return next;
          });
        }}
      >
        <Box
          className={`mx-1 mb-1 rounded-xl border-2 px-3 py-2 ${
            slotCorrect
              ? 'border-[#8E97FD] bg-[#8E97FD]/10'
              : slotWrong
                ? 'border-red-200 bg-red-50'
                : 'border-[#EBEAEC] bg-white'
          }`}
        >
          <Text className="text-base font-bold text-[#3F414E]">
            {filledText}
          </Text>
        </Box>
      </Pressable>
    );
  };

  return (
    <VStack className="mb-8 gap-4">
      {/* Korean prompt */}
      {!!parsed.promptKorean && (
        <Box className="rounded-2xl bg-[#F5F5F9] p-4">
          <Text className="text-sm font-bold text-[#3F414E]">
            {parsed.promptKorean}
          </Text>
        </Box>
      )}

      {/* Sentence with slots */}
      <Box className="rounded-[22px] bg-[#F5F5F9] p-4">
        <HStack className="flex-row flex-wrap items-center">
          {parsed.parts.map(renderPart)}
        </HStack>
        {!isAnswered && (
          <Text className="mt-3 text-xs font-bold text-[#A1A4B2]">
            Tip: Tap a blank to clear it.
          </Text>
        )}
      </Box>

      {/* Choice chips */}
      <HStack className="flex-row flex-wrap gap-2">
        {parsed.choices.map((c) => {
          const used = Object.values(slotAnswers).includes(c.id);
          return (
            <Pressable
              key={c.id}
              disabled={isAnswered || used}
              onPress={() => {
                const empty = parsed.slotIds.find((sid) => !slotAnswers[sid]);
                if (!empty) return;
                setSlotAnswers((prev) => ({ ...prev, [empty]: c.id }));
              }}
            >
              <Box
                className={`rounded-2xl px-4 py-3 ${
                  used || isAnswered ? 'bg-primary opacity-50' : 'bg-primary'
                }`}
              >
                <Text className="font-bold text-white">{c.t}</Text>
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
          className={`w-full rounded-[22px] ${
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
