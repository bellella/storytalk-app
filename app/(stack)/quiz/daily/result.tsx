import { useLocalSearchParams, useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import { Text, View } from 'react-native';
import { AppContainer } from '@/components/app/app-container';
import { FloatingContainer } from '@/components/common/FloatingContainer';
import { Button, ButtonText } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import { DailyQuizResult, EpisodeResult } from '@/types/result.type';

export default function DailyQuizResultScreen() {
  const { result: resultJson } = useLocalSearchParams();
  const result: DailyQuizResult = JSON.parse((resultJson as string) || '{}');
  const quiz = result.quiz;
  const xp = result.xp;
  const router = useRouter();

  return (
    <>
      <AppContainer showBackButton>
        <LottieView
          autoPlay
          style={{
            width: 200,
            height: 200,
            backgroundColor: '#eee',
          }}
          // Find more Lottie files at https://lottiefiles.com/featured
          source={require('@/assets/lotties/test1.json')}
        />
        <View className="flex-1 px-5 pt-3">
          {/* Header */}
          <Text className="text-xs font-extrabold uppercase tracking-widest text-[#8E97FD]">
            결과
          </Text>
          <Text className="mt-1 text-3xl font-extrabold text-[#3F414E]">
            {quiz.score}점
          </Text>
          <Text className="mt-2 text-sm font-semibold text-[#6D6F7B]"></Text>

          {/* EXP Card */}
          <View className="mt-6 rounded-[28px] bg-white px-6 py-5 shadow-sm shadow-black/5">
            <View className="flex-row items-center justify-between">
              <Text className="text-sm font-bold text-[#3F414E]">
                경험치 획득
              </Text>
              <Text className="text-sm font-extrabold text-[#8E97FD]">
                +{xp.xpGranted} EXP
              </Text>
            </View>

            {xp.requiredTotalXp && (
              <View className="mt-3 h-2 w-full rounded-full bg-[#ECECF4]">
                <View
                  className="h-full rounded-full bg-[#8E97FD]"
                  style={{
                    width: `${(xp.totalXp / xp.requiredTotalXp) * 100}%`,
                  }}
                />
              </View>
            )}

            <View className="mt-2 flex-row justify-between">
              <Text className="text-xs font-medium text-[#A1A4B2]">
                Lv.{xp.currentLevel}
              </Text>
              <Text className="text-xs font-medium text-[#A1A4B2]">
                다음 레벨까지 {xp.xpToNextLevel ?? 0} EXP
              </Text>
            </View>
          </View>

          {/* Summary */}
          <Text className="mt-6 text-sm font-bold text-[#3F414E]">
            정답 {quiz.correctCount} / {quiz.totalCount}개
          </Text>

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
