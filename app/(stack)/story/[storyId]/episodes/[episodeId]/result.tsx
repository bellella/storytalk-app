import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import {
  LottieOverlay,
  LottieOverlayRef,
} from '@/components/app/LottieOverlay';
import { FloatingContainer } from '@/components/common/FloatingContainer';
import { LevelUpBanner } from '@/components/result/LevelUpBanner';
import { QuizScoreHeader } from '@/components/result/QuizScoreHeader';
import { XpProgressCard } from '@/components/result/XpProgressCard';
import { Button, ButtonText } from '@/components/ui/button';
import { EpisodeRewardDtoType } from '@/lib/api/generated/model';
import { EpisodeResult } from '@/types/result.type';

const REWARD_ICONS: Record<string, string> = {
  [EpisodeRewardDtoType.CHARACTER_UNLOCK]: '👤',
  [EpisodeRewardDtoType.ITEM]: '🎁',
};

export default function EpisodeResultScreen() {
  const { storyId, episodeId, result: resultJson } = useLocalSearchParams();
  const result: EpisodeResult = JSON.parse((resultJson as string) || '{}');
  const { quiz, xp, episode, rewards } = result;
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
          {/* Episode info chip */}
          {episode && (
            <Animated.View entering={FadeInDown.duration(500)}>
              <View className="items-center pt-6">
                <View className="rounded-full bg-[#ECECF4] px-4 py-1.5">
                  <Text className="text-xs font-bold text-[#454652]">
                    "{episode.storyTitle}" EP.{episode.episodeOrder}
                  </Text>
                </View>
              </View>
            </Animated.View>
          )}

          {/* Score header */}
          <QuizScoreHeader
            quiz={quiz}
            title="Episode Complete!"
            subtitle={episode?.episodeTitle}
          />

          {/* XP Card */}
          <View className="mt-4 px-4">
            <XpProgressCard
              xp={xp}
              onLevelUpAnimationStart={() => {
                lottieRef.current?.play();
                setShowLevelUp(true);
              }}
            />
          </View>

          {/* Level Up Banner */}
          {xp.leveledUp && (
            <View className="mt-4 px-4">
              <LevelUpBanner
                previousLevel={xp.previousLevel}
                currentLevel={xp.currentLevel}
                visible={showLevelUp}
              />
            </View>
          )}

          {/* Rewards */}
          {rewards && rewards.length > 0 && (
            <Animated.View entering={FadeInDown.delay(600).duration(500)}>
              <View className="mt-4 px-4">
                <View className="mx-1 rounded-3xl bg-white px-6 py-5 shadow-sm shadow-black/10">
                  <View className="flex-row items-center gap-2">
                    <Text className="text-sm">🎉</Text>
                    <Text className="text-base font-bold text-[#1B1B21]">
                      Rewards
                    </Text>
                  </View>
                  <View className="mt-3 gap-2.5">
                    {rewards.map((reward) => (
                      <View
                        key={reward.id}
                        className="flex-row items-center gap-3 rounded-2xl bg-[#F5F2FB] px-4 py-3"
                      >
                        <View className="h-10 w-10 items-center justify-center rounded-xl bg-white">
                          <Text className="text-lg">
                            {REWARD_ICONS[reward.type] ?? '✨'}
                          </Text>
                        </View>
                        <View className="flex-1">
                          <Text className="text-xs font-bold uppercase tracking-wider text-[#8E97FD]">
                            {reward.type.replace('_', ' ')}
                          </Text>
                          <Text className="text-sm font-semibold text-[#1B1B21]">
                            {(reward.payload as { name?: string })?.name ??
                              'New Reward'}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            </Animated.View>
          )}
        </ScrollView>
      </View>

      {/* Bottom CTA */}
      <FloatingContainer>
        <View className="flex-row gap-3">
          <Button
            onPress={() => router.replace('./review')}
            className="flex-1 rounded-2xl bg-[#ECECF4] py-4"
          >
            <ButtonText className="font-bold text-[#454652]">Review</ButtonText>
          </Button>
          <Link
            replace
            href={`/story/${storyId}/episodes/${episodeId}`}
            asChild
          >
            <Button className="flex-[2] rounded-2xl bg-[#8E97FD] py-4">
              <ButtonText className="font-bold text-white">Continue</ButtonText>
            </Button>
          </Link>
        </View>
      </FloatingContainer>
    </>
  );
}
