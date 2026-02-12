import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';
import {
  LottieOverlay,
  LottieOverlayRef,
} from '@/components/app/LottieOverlay';
import { FloatingContainer } from '@/components/common/FloatingContainer';
import { LevelUpBanner } from '@/components/result/LevelUpBanner';
import { QuizScoreHeader } from '@/components/result/QuizScoreHeader';
import { XpProgressCard } from '@/components/result/XpProgressCard';
import { Button, ButtonText } from '@/components/ui/button';
import { DailyQuizResult } from '@/types/result.type';

export default function DailyQuizResultScreen() {
  const { result: resultJson, isReview } = useLocalSearchParams();
  const result: DailyQuizResult = JSON.parse((resultJson as string) || '{}');
  const { quiz, xp } = result;
  const router = useRouter();
  const lottieRef = useRef<LottieOverlayRef>(null);
  const [showLevelUp, setShowLevelUp] = useState(false);

  return (
    <>
      <LottieOverlay
        ref={lottieRef}
        source={require('@/assets/lotties/confetti.json')}
        loop
      />
      <View className="flex-1 bg-[#FBF8FF]">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Score header */}
          <QuizScoreHeader
            quiz={quiz}
            title={isReview ? '데일리 학습 완료!' : '복습 완료!'}
            subtitle="Keep up the streak!"
          />

          {/* XP Card */}
          {xp && (
            <View className="mt-4 px-4">
              <XpProgressCard
                xp={xp}
                onLevelUpAnimationStart={() => {
                  lottieRef.current?.play();
                  setShowLevelUp(true);
                }}
              />
            </View>
          )}
          {/* Level Up Banner */}
          {xp?.leveledUp && (
            <View className="mt-4 px-4">
              <LevelUpBanner
                previousLevel={xp.previousLevel}
                currentLevel={xp.currentLevel}
                visible={showLevelUp}
              />
            </View>
          )}
        </ScrollView>
      </View>

      {/* Bottom CTA */}
      <FloatingContainer>
        <Button
          onPress={() => router.back()}
          className="w-full rounded-2xl bg-[#8E97FD] py-4"
        >
          <ButtonText className="font-bold text-white">Done</ButtonText>
        </Button>
      </FloatingContainer>
    </>
  );
}
