import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Pressable } from 'react-native';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { SentenceClozeDataDto } from '@/lib/api/generated/model';
import { hapticMedium } from '@/lib/utils/haptics';
import { TokenChip } from './TokenChip';
import type { QuizHandle } from './types';

type SentenceClozeQuizProps = {
  data: SentenceClozeDataDto;
  onAnswer: (isCorrect: boolean, payload: Record<string, unknown>) => void;
  onCanSubmitChange?: (canSubmit: boolean) => void;
};

export const SentenceClozeQuiz = forwardRef<QuizHandle, SentenceClozeQuizProps>(
  ({ data, onAnswer, onCanSubmitChange }, ref) => {
    const [slotAnswers, setSlotAnswers] = useState<Record<string, string>>({});
    const [isAnswered, setIsAnswered] = useState(false);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

    const canCheck = data?.slotIds?.every((sid) => !!slotAnswers[sid]) ?? false;

    const handleSubmit = () => {
      if (isAnswered || !canCheck) return;
      const correct = data.slotIds.every(
        (sid) => slotAnswers[sid] === data.answerBySlot[sid]
      );
      setIsAnswered(true);
      setIsCorrect(correct);
      const answerText = data.slotIds.map((sid) => slotAnswers[sid]).join(' ');
      onAnswer(correct, { answerText });
    };

    useImperativeHandle(ref, () => ({ submit: handleSubmit }));

    const updateSlot = (slotId: string, choiceId: string) => {
      hapticMedium();
      setSlotAnswers((prev) => {
        const next = { ...prev, [slotId]: choiceId };
        const allFilled = data.slotIds.every((sid) => !!next[sid]);
        onCanSubmitChange?.(allFilled);
        return next;
      });
    };

    const clearSlot = (slotId: string) => {
      setSlotAnswers((prev) => {
        const next = { ...prev };
        delete next[slotId];
        onCanSubmitChange?.(false);
        return next;
      });
    };

    const renderPart = (
      p: SentenceClozeDataDto['parts'][number],
      idx: number
    ) => {
      if (p.type === 'text') {
        return (
          <Text key={`t-${idx}`} className="text-base font-bold text-[#3F414E]">
            {p.t}
          </Text>
        );
      }

      const filledId = slotAnswers[p.slotId];
      const filledText =
        data.choices.find((c) => c.id === filledId)?.t ??
        (filledId ? '(unknown)' : '_____');

      const slotCorrect =
        isAnswered && filledId && filledId === data.answerBySlot[p.slotId];
      const slotWrong =
        isAnswered && filledId && filledId !== data.answerBySlot[p.slotId];

      return (
        <Pressable
          key={`s-${p.slotId}-${idx}`}
          disabled={isAnswered}
          onPress={() => clearSlot(p.slotId)}
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

    if (!data) {
      return (
        <Box className="mb-8 rounded-2xl bg-red-50 p-4">
          <Text className="font-bold text-red-600">
            Invalid SENTENCE_CLOZE_BUILD data
          </Text>
        </Box>
      );
    }

    return (
      <VStack className="mb-8 gap-4">
        {!!data.promptKorean && (
          <Box className="rounded-2xl bg-[#F5F5F9] p-4">
            <Text className="text-sm font-bold text-[#3F414E]">
              {data.promptKorean}
            </Text>
          </Box>
        )}

        <Box className="rounded-[22px] bg-[#F5F5F9] p-4">
          <HStack className="flex-row flex-wrap items-center">
            {data.parts.map(renderPart)}
          </HStack>
          {!isAnswered && (
            <Text className="mt-3 text-xs font-bold text-[#A1A4B2]">
              Tip: Tap a blank to clear it.
            </Text>
          )}
        </Box>

        <HStack className="flex-row flex-wrap gap-2">
          {data.choices.map((c) => {
            const used = Object.values(slotAnswers).includes(c.id);
            return (
              <TokenChip
                key={c.id}
                text={c.t}
                used={used}
                disabled={isAnswered}
                onPress={() => {
                  const empty = data.slotIds.find((sid) => !slotAnswers[sid]);
                  if (!empty) return;
                  updateSlot(empty, c.id);
                }}
              />
            );
          })}
        </HStack>
      </VStack>
    );
  }
);
