import { Text, View } from 'react-native';
import Animated, { FadeIn, StretchInX } from 'react-native-reanimated';

type HeadingTextProps = {
  englishText: string;
  koreanText: string;
  alwaysShowTranslation: boolean;
};

export function HeadingText({
  englishText,
  koreanText,
  alwaysShowTranslation,
}: HeadingTextProps) {
  return (
    <View className="mx-6 my-auto items-center justify-center">
      {/* 장식 라인 + 텍스트 */}
      <Animated.View
        entering={StretchInX.duration(400)}
        className="items-center"
      >
        {/* 메인 텍스트 영역 */}
        <View className="rounded-2xl border border-white/20 bg-black/80 px-8 py-5">
          {/* 상단 장식 라인 */}
          <View className="mb-2 flex-row items-center justify-center gap-3">
            <View className="h-px flex-1 bg-white/50" />
            <View className="h-1.5 w-1.5 rounded-full bg-white/70" />
            <View className="h-px flex-1 bg-white/50" />
          </View>
          <Text
            className="text-center text-2xl leading-relaxed text-white"
            style={{ fontWeight: '700', letterSpacing: 1 }}
          >
            {englishText}
          </Text>

          {alwaysShowTranslation && (
            <Animated.View entering={FadeIn.delay(300).duration(400)}>
              <Text className="mt-2 text-center text-sm leading-relaxed text-white/70">
                {koreanText}
              </Text>
            </Animated.View>
          )}
          <View className="mt-2 flex-row items-center justify-center gap-3">
            <View className="h-px flex-1 bg-white/50" />
            <View className="h-1.5 w-1.5 rounded-full bg-white/70" />
            <View className="h-px flex-1 bg-white/50" />
          </View>
        </View>
      </Animated.View>
    </View>
  );
}
