import { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { XpProgressDto } from '@/lib/api/generated/model';

type XpProgressCardProps = {
  xp: XpProgressDto;
  onLevelUpAnimationStart?: () => void;
};

export function XpProgressCard({
  xp,
  onLevelUpAnimationStart,
}: XpProgressCardProps) {
  const barWidth = useSharedValue(0);
  const xpCounter = useSharedValue(0);
  const levelScale = useSharedValue(1);
  const showLevelUp = useSharedValue(0);

  const requiredXp = xp.requiredTotalXp ?? 0;
  const startPercent = requiredXp
    ? Math.max(0, (xp.totalXp - xp.xpGranted) / requiredXp)
    : 0;
  const endPercent = requiredXp ? Math.min(1, xp.totalXp / requiredXp) : 0;

  useEffect(() => {
    // Initial state
    barWidth.value = startPercent;
    xpCounter.value = 0;

    const delay = 400;

    if (xp.leveledUp) {
      // Phase 1: fill to 100%
      barWidth.value = withSequence(
        withTiming(1, { duration: 800 }),
        // Phase 2: reset to 0, then fill to new percent
        withDelay(
          400,
          withSequence(
            withTiming(0, { duration: 0 }),
            withTiming(endPercent, { duration: 800 })
          )
        )
      );

      // Show level up after phase 1
      setTimeout(() => {
        onLevelUpAnimationStart?.();
        showLevelUp.value = withTiming(1, { duration: 400 });
        levelScale.value = withSequence(
          withTiming(1.3, { duration: 200 }),
          withTiming(1, { duration: 200 })
        );
      }, 900);
    } else {
      // Simple animation from start to end
      barWidth.value = withDelay(
        delay,
        withTiming(endPercent, { duration: 1000 })
      );
    }

    // XP counter animation
    xpCounter.value = withDelay(
      delay,
      withTiming(xp.xpGranted, { duration: 800 })
    );
  }, []);

  const barStyle = useAnimatedStyle(() => ({
    width: `${barWidth.value * 100}%`,
  }));

  const levelBadgeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: levelScale.value }],
  }));

  const levelUpStyle = useAnimatedStyle(() => ({
    opacity: showLevelUp.value,
    transform: [{ scale: 0.8 + showLevelUp.value * 0.2 }],
  }));

  const displayLevel = xp.leveledUp ? xp.currentLevel : xp.currentLevel;
  const previousLevel = xp.previousLevel;

  return (
    <Animated.View entering={FadeInDown.delay(300).duration(600)}>
      <View className="mx-1 rounded-3xl bg-white px-6 py-5 shadow-sm shadow-black/10">
        {/* Header row */}
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <View className="h-8 w-8 items-center justify-center rounded-full bg-[#F1EFFF]">
              <Text className="text-sm">⚡</Text>
            </View>
            <Text className="text-base font-bold text-[#1B1B21]">
              Experience
            </Text>
          </View>
          <Animated.View entering={FadeIn.delay(500).duration(400)}>
            <View className="rounded-full bg-[#F1EFFF] px-3 py-1">
              <Text className="text-sm font-extrabold text-[#4C54B6]">
                +{xp.xpGranted} XP
              </Text>
            </View>
          </Animated.View>
        </View>

        {/* Level badge + Progress bar */}
        {requiredXp > 0 && (
          <View className="mt-4">
            <View className="flex-row items-center gap-3">
              {/* Level badge */}
              <Animated.View style={levelBadgeStyle}>
                <View className="h-10 w-10 items-center justify-center rounded-xl bg-[#8E97FD]">
                  <Text className="text-[10px] font-bold text-white/70">
                    LV
                  </Text>
                  <Text className="-mt-1 text-sm font-black text-white">
                    {displayLevel}
                  </Text>
                </View>
              </Animated.View>

              {/* Bar */}
              <View className="flex-1">
                <View className="h-3 w-full overflow-hidden rounded-full bg-[#ECECF4]">
                  <Animated.View style={[barStyle, { height: '100%' }]}>
                    <View className="h-full rounded-full bg-tertiary" />
                  </Animated.View>
                </View>
                <View className="mt-1.5 flex-row justify-between">
                  <Text className="text-[11px] font-medium text-[#A1A4B2]">
                    {xp.totalXp} XP
                  </Text>
                  <Text className="text-[11px] font-medium text-[#A1A4B2]">
                    {xp.xpToNextLevel != null
                      ? `${xp.xpToNextLevel} XP to next`
                      : 'MAX'}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Level Up indicator */}
        {xp.leveledUp && (
          <Animated.View style={levelUpStyle}>
            <View className="mt-4 items-center rounded-2xl bg-[#F1EFFF] py-3">
              <Text className="text-lg font-black tracking-wider text-[#4C54B6]">
                LEVEL UP!
              </Text>
              <Text className="mt-0.5 text-xs font-semibold text-[#8E97FD]">
                Lv.{previousLevel} → Lv.{displayLevel}
              </Text>
            </View>
          </Animated.View>
        )}
      </View>
    </Animated.View>
  );
}
