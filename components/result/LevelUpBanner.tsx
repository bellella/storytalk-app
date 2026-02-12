import { Text, View } from 'react-native';
import Animated, {
  FadeInUp,
  ZoomIn,
} from 'react-native-reanimated';

type LevelUpBannerProps = {
  previousLevel: number;
  currentLevel: number;
  visible: boolean;
};

export function LevelUpBanner({
  previousLevel,
  currentLevel,
  visible,
}: LevelUpBannerProps) {
  if (!visible) return null;

  return (
    <Animated.View entering={FadeInUp.delay(200).duration(500)}>
      <View className="mx-1 overflow-hidden rounded-3xl bg-gradient-to-r from-[#8E97FD] to-[#BEC2FF]">
        <View className="items-center bg-[#8E97FD] px-6 py-5">
          <Animated.View entering={ZoomIn.delay(400).duration(400)}>
            <View className="mb-2 h-16 w-16 items-center justify-center rounded-2xl bg-white/20">
              <Text className="text-3xl">🏆</Text>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(600).duration(400)}>
            <Text className="text-xl font-black tracking-wide text-white">
              Level Up!
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(800).duration(400)}>
            <View className="mt-2 flex-row items-center gap-3">
              <View className="items-center rounded-xl bg-white/20 px-4 py-2">
                <Text className="text-[10px] font-bold text-white/70">
                  BEFORE
                </Text>
                <Text className="text-xl font-black text-white">
                  {previousLevel}
                </Text>
              </View>
              <Text className="text-2xl font-bold text-white/60">→</Text>
              <View className="items-center rounded-xl bg-white/30 px-4 py-2">
                <Text className="text-[10px] font-bold text-white/90">
                  AFTER
                </Text>
                <Text className="text-xl font-black text-white">
                  {currentLevel}
                </Text>
              </View>
            </View>
          </Animated.View>
        </View>
      </View>
    </Animated.View>
  );
}
