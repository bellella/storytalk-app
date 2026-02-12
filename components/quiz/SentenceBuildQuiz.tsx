import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Pressable, View } from 'react-native';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { SentenceBuildDataDto } from '@/lib/api/generated/model';
import { hapticMedium } from '@/lib/utils/haptics';
import { measureInWindowAsync } from '@/lib/utils/measure-in-window';
import { FlyingToken } from './FlyingToken';
import { TokenChip } from './TokenChip';
import type { QuizHandle } from './types';

type SentenceBuildQuizProps = {
  data: SentenceBuildDataDto;
  onAnswer: (isCorrect: boolean, payload: Record<string, unknown>) => void;
  onCanSubmitChange?: (canSubmit: boolean) => void;
};

type Rect = { x: number; y: number; width: number; height: number };

export const SentenceBuildQuiz = forwardRef<QuizHandle, SentenceBuildQuizProps>(
  ({ data, onAnswer, onCanSubmitChange }, ref) => {
    const [selectedTokenIds, setSelectedTokenIds] = useState<string[]>([]);
    const [isAnswered, setIsAnswered] = useState(false);

    // overlay로 날아다니는 토큰
    const [flying, setFlying] = useState<null | {
      id: string;
      text: string;
      from: Rect;
      to: Rect;
    }>(null);

    // 애니메이션 중인 토큰 인덱스
    const [animatingIdx, setAnimatingIdx] = useState<number | null>(null);

    // 측정용 ref들
    const rootRef = useRef<View>(null);
    const sourceRefs = useRef<Record<string, any>>({});
    const targetRefs = useRef<Record<string, any>>({});

    const handleSubmit = () => {
      if (isAnswered) return;
      const correct =
        selectedTokenIds.join('|') === data.answerTokenIds.join('|');
      setIsAnswered(true);
      const answerText = selectedTokenIds
        .map((id) => data.tokenTextMap[id])
        .join(' ');
      onAnswer(correct, { answerText });
    };

    useImperativeHandle(ref, () => ({ submit: handleSubmit }));

    const updateCanSubmit = (ids: string[]) => {
      onCanSubmitChange?.(ids.length > 0);
    };

    const removeToken = (idx: number) => {
      if (isAnswered) return;
      hapticMedium();
      setSelectedTokenIds((prev) => {
        const next = prev.filter((_, i) => i !== idx);
        updateCanSubmit(next);
        return next;
      });
    };

    const pickTokenWithAnimation = async (id: string) => {
      if (isAnswered) return;
      if (selectedTokenIds.includes(id)) return;

      hapticMedium();

      const text = data.tokenTextMap[id] ?? '';
      const srcRef = sourceRefs.current[id];
      const nextIndex = selectedTokenIds.length;

      if (!srcRef || !rootRef.current) {
        setSelectedTokenIds((p) => {
          const next = [...p, id];
          updateCanSubmit(next);
          return next;
        });
        return;
      }

      try {
        const containerRect = await measureInWindowAsync(rootRef);
        const fromAbsolute = await measureInWindowAsync({ current: srcRef });

        const from = {
          x: fromAbsolute.x - containerRect.x,
          y: fromAbsolute.y - containerRect.y,
          width: fromAbsolute.width,
          height: fromAbsolute.height,
        };

        setAnimatingIdx(nextIndex);
        setSelectedTokenIds((p) => {
          const next = [...p, id];
          updateCanSubmit(next);
          return next;
        });

        requestAnimationFrame(() => {
          requestAnimationFrame(async () => {
            const tgtRef = targetRefs.current[`${id}-${nextIndex}`];
            if (!tgtRef) return;

            const toAbsolute = await measureInWindowAsync({ current: tgtRef });
            const to = {
              x: toAbsolute.x - containerRect.x,
              y: toAbsolute.y - containerRect.y,
              width: toAbsolute.width,
              height: toAbsolute.height,
            };

            setFlying({ id, text, from, to });
          });
        });
      } catch {
        setAnimatingIdx(null);
        setSelectedTokenIds((p) => {
          const next = [...p, id];
          updateCanSubmit(next);
          return next;
        });
      }
    };

    if (!data) {
      return (
        <Box className="mb-8 rounded-2xl bg-red-50 p-4">
          <Text className="font-bold text-red-600">
            Invalid SENTENCE_BUILD data
          </Text>
        </Box>
      );
    }

    return (
      <View ref={rootRef} className="relative w-full overflow-visible">
        {flying && (
          <FlyingToken
            text={flying.text}
            from={flying.from}
            to={flying.to}
            onDone={() => {
              setFlying(null);
              setAnimatingIdx(null);
            }}
          />
        )}

        <VStack className="mb-8 gap-4 rounded-2xl">
          <Box className="min-h-[190px] rounded-xl bg-white p-4">
            <View className="absolute left-0 top-16 w-full border-b-4 border-dashed border-gray-200" />
            <View className="absolute left-0 top-32 w-full border-b-4 border-dashed border-gray-200" />
            <HStack className="flex-row flex-wrap gap-x-1.5 gap-y-6">
              {selectedTokenIds?.map((id, idx) => {
                const t = data.tokenTextMap[id];
                if (!t) return null;
                const isAnimating = idx === animatingIdx;
                return (
                  <Pressable
                    key={`${id}-${idx}`}
                    disabled={isAnswered || isAnimating}
                    onPress={() => removeToken(idx)}
                  >
                    <Box
                      ref={(r: any) => {
                        if (r) targetRefs.current[`${id}-${idx}`] = r;
                      }}
                      className="rounded-xl bg-primary px-3 py-2"
                      style={{ opacity: isAnimating ? 0 : 1 }}
                    >
                      <Text className="text-sm font-bold text-white">{t}</Text>
                    </Box>
                  </Pressable>
                );
              })}
            </HStack>
          </Box>

          <HStack className="mx-[-16px] flex-row flex-wrap gap-2 p-4">
            {data.tokensAll.map((tk) => {
              const used = selectedTokenIds.includes(tk.id);
              return (
                <TokenChip
                  key={tk.id}
                  ref={(r: any) => {
                    if (r) sourceRefs.current[tk.id] = r;
                  }}
                  text={tk.t}
                  used={used}
                  disabled={isAnswered}
                  onPress={() => pickTokenWithAnimation(tk.id)}
                />
              );
            })}
          </HStack>
        </VStack>
      </View>
    );
  }
);
