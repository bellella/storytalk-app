import React, { useMemo, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { QuizDtoData } from '@/lib/api/generated/model/quizDtoData';
import { hapticLight } from '@/lib/utils/haptics';
import { measureInWindowAsync } from '@/lib/utils/measure-in-window';
import { parseSentenceBuildData } from '@/lib/utils/quiz-helpers';
import { FlyingToken } from './FlyingToken';

type SentenceBuildQuizProps = {
  data: QuizDtoData | undefined;
  onAnswer: (isCorrect: boolean, payload: Record<string, unknown>) => void;
};

type Rect = { x: number; y: number; width: number; height: number };

export function SentenceBuildQuiz({ data, onAnswer }: SentenceBuildQuizProps) {
  const [selectedTokenIds, setSelectedTokenIds] = useState<string[]>([]);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // overlay로 날아다니는 토큰
  const [flying, setFlying] = useState<null | {
    id: string;
    text: string;
    from: Rect;
    to: Rect;
  }>(null);

  // 애니메이션 중인 토큰 인덱스 (렌더되자마자 숨기기 위해)
  const [animatingIdx, setAnimatingIdx] = useState<number | null>(null);

  const parsed = useMemo(() => parseSentenceBuildData(data), [data]);

  // 측정용 ref들
  const rootRef = useRef<View>(null);
  const sourceRefs = useRef<Record<string, any>>({});
  const targetRefs = useRef<Record<string, any>>({});

  if (!parsed) {
    return (
      <Box className="mb-8 rounded-2xl bg-red-50 p-4">
        <Text className="font-bold text-red-600">
          Invalid SENTENCE_BUILD data
        </Text>
      </Box>
    );
  }

  const canCheck = selectedTokenIds.length > 0;

  const handleSubmit = () => {
    if (isAnswered) return;
    const correct =
      selectedTokenIds.join('|') === parsed.answerTokenIds.join('|');
    setIsAnswered(true);
    setIsCorrect(correct);
    const answerText = selectedTokenIds
      .map((id) => parsed.tokenTextMap[id])
      .join(' ');
    onAnswer(correct, { answerText });
  };

  const handleReset = () => {
    setSelectedTokenIds([]);
    setIsAnswered(false);
    setIsCorrect(null);
    setAnimatingIdx(null);
    setFlying(null);
  };

  const pickTokenWithAnimation = async (id: string) => {
    if (isAnswered) return;
    if (selectedTokenIds.includes(id)) return;

    hapticLight();

    const text = parsed.tokenTextMap[id] ?? '';
    const srcRef = sourceRefs.current[id];

    // 다음 인덱스 미리 계산
    const nextIndex = selectedTokenIds.length;

    if (!srcRef || !rootRef.current) {
      // ref가 없으면 그냥 추가
      setSelectedTokenIds((p) => [...p, id]);
      return;
    }

    try {
      // 컨테이너 위치 측정 (좌표 보정용)
      const containerRect = await measureInWindowAsync(rootRef);
      const fromAbsolute = await measureInWindowAsync({ current: srcRef });

      // 컨테이너 기준 상대 좌표로 변환
      const from = {
        x: fromAbsolute.x - containerRect.x,
        y: fromAbsolute.y - containerRect.y,
        width: fromAbsolute.width,
        height: fromAbsolute.height,
      };

      // 1) 애니메이션 중인 인덱스 설정 (타겟 토큰 숨기기 위해)
      setAnimatingIdx(nextIndex);

      // 2) 상태 업데이트로 target 토큰을 렌더 (숨겨진 상태로)
      setSelectedTokenIds((p) => [...p, id]);

      // 3) 레이아웃 반영 이후 target 위치 측정 (2프레임 정도 기다리면 안정적)
      requestAnimationFrame(() => {
        requestAnimationFrame(async () => {
          const tgtRef = targetRefs.current[`${id}-${nextIndex}`];
          if (!tgtRef) return;

          const toAbsolute = await measureInWindowAsync({ current: tgtRef });

          // 컨테이너 기준 상대 좌표로 변환
          const to = {
            x: toAbsolute.x - containerRect.x,
            y: toAbsolute.y - containerRect.y,
            width: toAbsolute.width,
            height: toAbsolute.height,
          };

          // 4) overlay flying 토큰 띄우고 애니메이션
          setFlying({ id, text, from, to });
        });
      });
    } catch {
      setAnimatingIdx(null);
      setSelectedTokenIds((p) => [...p, id]);
    }
  };

  return (
    <View ref={rootRef} style={{ position: 'relative', overflow: 'visible' }}>
      {/* overlay flying token */}
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

      <VStack className="mb-8 gap-4">
        {/* Built sentence display: 텍스트 대신 토큰 박스들로 렌더 */}
        <Box className="min-h-[150px] rounded-[22px] bg-white p-4">
          {selectedTokenIds.length === 0 ? (
            <Text className="text-base font-bold"></Text>
          ) : (
            <HStack className="flex-row flex-wrap gap-2">
              {selectedTokenIds.map((id, idx) => {
                const t = parsed.tokenTextMap[id];
                if (!t) return null;
                // 애니메이션 중인 토큰은 투명하게 (자리는 차지하되 안 보이게)
                const isAnimating = idx === animatingIdx;
                return (
                  <Box
                    key={`${id}-${idx}`}
                    // target 측정을 위해 ref 저장
                    ref={(r: any) => {
                      if (r) targetRefs.current[`${id}-${idx}`] = r;
                    }}
                    className="rounded-2xl bg-primary px-4 py-3"
                    style={{ opacity: isAnimating ? 0 : 1 }}
                  >
                    <Text className="font-bold text-white">{t}</Text>
                  </Box>
                );
              })}
              {!!parsed.punctuation && (
                <Text className="ml-1 text-base font-bold text-[#3F414E]">
                  {parsed.punctuation}
                </Text>
              )}
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
                onPress={() => pickTokenWithAnimation(tk.id)}
              >
                <Box
                  // source 측정을 위해 ref 저장
                  ref={(r: any) => {
                    if (r) sourceRefs.current[tk.id] = r;
                  }}
                  className={`rounded-2xl px-4 py-3 ${
                    used || isAnswered ? 'bg-primary opacity-50' : 'bg-primary'
                  }`}
                >
                  <Text className={used ? 'text-primary' : 'text-white'}>
                    {tk.t}
                  </Text>
                </Box>
              </Pressable>
            );
          })}
        </HStack>

        {/* Result feedback */}
        {isAnswered && (
          <Box
            className={`rounded-2xl p-4 ${isCorrect ? 'bg-[#8E97FD]/10' : 'bg-red-50'}`}
          >
            <Text
              className={`font-bold ${isCorrect ? 'text-[#8E97FD]' : 'text-red-600'}`}
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
            className={`w-full rounded-xl ${canCheck ? 'bg-[#8E97FD]' : 'bg-gray-200'}`}
          >
            <ButtonText className="font-bold text-white">제출하기</ButtonText>
          </Button>
        ) : (
          !isCorrect && (
            <Pressable onPress={handleReset}>
              <Text className="mt-2 text-center text-sm font-bold text-[#8E97FD]">
                다시 시도하기
              </Text>
            </Pressable>
          )
        )}
      </VStack>
    </View>
  );
}
