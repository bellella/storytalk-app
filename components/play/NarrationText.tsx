import { Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

type NarrationTextProps = {
  englishText: string;
  koreanText: string;
  alwaysShowTranslation: boolean;
  eventIndex: number;
};

export function NarrationText({
  englishText,
  koreanText,
  alwaysShowTranslation,
  eventIndex,
}: NarrationTextProps) {
  const lines = englishText.split('\n');

  return (
    <View className="mx-6 my-auto rounded-2xl border border-white/20 bg-black/80 px-8 py-5">
      {lines.map((line, i) => (
        <Animated.View
          key={`${eventIndex}-${i}`}
          entering={FadeInDown.delay(i * 400).duration(800)}
        >
          <Text className="text-center text-lg italic leading-loose text-white/90">
            {line}
          </Text>
        </Animated.View>
      ))}
      {alwaysShowTranslation && (
        <Animated.View
          key={`${eventIndex}-kr`}
          entering={FadeInDown.delay(lines.length * 400).duration(500)}
        >
          <Text className="mt-3 text-center text-sm leading-relaxed text-white/60">
            {koreanText}
          </Text>
        </Animated.View>
      )}
    </View>
  );
}
