import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { AppContainer } from '@/components/app/app-container';
import { FloatingContainer } from '@/components/common/FloatingContainer';
import { Button, ButtonText } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import { useEpisode } from '@/lib/hooks/useEpisodes';

export default function EpisodeResultScreen() {
  const { episodeId, answers } = useLocalSearchParams();
  const router = useRouter();
  const userAnswers = JSON.parse((answers as string) || '[]');

  const { data: episode } = useEpisode(episodeId as string);
  const quiz = episode?.postEpisode.quizSection;
  if (!quiz) return null;

  const allQuestions = [
    ...quiz.readingComprehension,
    ...quiz.vocabulary,
    ...quiz.scriptPractice,
  ];

  const correctCount = allQuestions.filter(
    (q: any, i: number) => q.answer === userAnswers[i]
  ).length;

  const score = Math.round((correctCount / allQuestions.length) * 100);

  // 🌱 Mock EXP data (나중에 실제 유저 상태로 교체)
  const gainedExp = Math.round(score * 1.2); // 예: 점수 기반 EXP
  const currentLevel = 12;
  const currentExp = 1840;
  const nextLevelExp = 2500;
  const newExp = currentExp + gainedExp;
  const progress = Math.min(newExp / nextLevelExp, 1);

  const feedbackText =
    score >= 90
      ? '완벽해요! 정말 훌륭한 이해력이에요 💜'
      : score >= 70
        ? '잘했어요! 조금만 더 연습하면 완벽해요 ✨'
        : score >= 50
          ? '좋은 시도였어요! 복습하면 더 좋아질 거예요 🌱'
          : '괜찮아요! 천천히 다시 도전해봐요 💪';

  return (
    <>
      <AppContainer showBackButton>
        <View className="flex-1 px-5 pt-3">
          {/* Header */}
          <Text className="text-xs font-extrabold uppercase tracking-widest text-[#8E97FD]">
            결과
          </Text>
          <Text className="mt-1 text-3xl font-extrabold text-[#3F414E]">
            {score}점
          </Text>
          <Text className="mt-2 text-sm font-semibold text-[#6D6F7B]">
            {feedbackText}
          </Text>

          {/* EXP Card */}
          <View className="mt-6 rounded-[28px] bg-white px-6 py-5 shadow-sm shadow-black/5">
            <View className="flex-row items-center justify-between">
              <Text className="text-sm font-bold text-[#3F414E]">
                경험치 획득
              </Text>
              <Text className="text-sm font-extrabold text-[#8E97FD]">
                +{gainedExp} EXP
              </Text>
            </View>

            <View className="mt-3 h-2 w-full rounded-full bg-[#ECECF4]">
              <View
                className="h-full rounded-full bg-[#8E97FD]"
                style={{ width: `${progress * 100}%` }}
              />
            </View>

            <View className="mt-2 flex-row justify-between">
              <Text className="text-xs font-medium text-[#A1A4B2]">
                Lv.{currentLevel}
              </Text>
              <Text className="text-xs font-medium text-[#A1A4B2]">
                다음 레벨까지 {Math.max(nextLevelExp - newExp, 0)} EXP
              </Text>
            </View>
          </View>

          {/* Summary */}
          <Text className="mt-6 text-sm font-bold text-[#3F414E]">
            정답 {correctCount} / {allQuestions.length}개
          </Text>

          {/* Review List */}
          <ScrollView
            className="mt-4 flex-1"
            contentContainerStyle={{ paddingBottom: 120 }}
            showsVerticalScrollIndicator={false}
          >
            <View className="space-y-4">
              {allQuestions.map((q: any, i: number) => {
                const isCorrect = q.answer === userAnswers[i];
                return (
                  <View
                    key={q.id}
                    className={`rounded-[24px] px-5 py-4 shadow-sm shadow-black/5 ${
                      isCorrect ? 'bg-[#EAF7EF]' : 'bg-[#FFF1F1]'
                    }`}
                  >
                    <Text className="mb-2 font-bold text-[#3F414E]">
                      Q{i + 1}. {q.question}
                    </Text>

                    <Text className="text-sm text-[#6D6F7B]">
                      내 답: {q.options[userAnswers[i]]}
                    </Text>

                    {!isCorrect && (
                      <Text className="mt-1 text-sm font-semibold text-[#58CC02]">
                        정답: {q.options[q.answer]}
                      </Text>
                    )}
                  </View>
                );
              })}
            </View>
          </ScrollView>

          {/* Bottom CTA */}
        </View>
      </AppContainer>
      <FloatingContainer>
        <HStack space="md">
          <Button onPress={() => router.replace('./review')}>
            <ButtonText>리뷰 & 퀴즈 다시풀기</ButtonText>
          </Button>

          <Button onPress={() => router.replace('../quiz')}>
            <ButtonText>다음화 계속하기</ButtonText>
          </Button>
        </HStack>
      </FloatingContainer>
    </>
  );
}
