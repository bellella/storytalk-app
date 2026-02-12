import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';

type Rect = { x: number; y: number; width: number; height: number };

export function FlyingToken({
  text,
  from,
  to,
  onDone,
}: {
  text: string;
  from: Rect;
  to: Rect;
  onDone: () => void;
}) {
  // 애니메이션 진행률 (0 -> 1)
  const progress = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    // 살짝 작아지면서 이동
    scale.value = withTiming(0.95, { duration: 200 });
    progress.value = withTiming(
      1,
      {
        duration: 220,
        easing: Easing.out(Easing.cubic),
      },
      () => {
        runOnJS(onDone)();
      }
    );
  }, [onDone, progress, scale]);

  const animatedStyle = useAnimatedStyle(() => {
    // from에서 to로 선형 보간
    const x = from.x + (to.x - from.x) * progress.value;
    const y = from.y + (to.y - from.y) * progress.value;

    return {
      transform: [{ translateX: x }, { translateY: y }, { scale: scale.value }],
    };
  });

  return (
    <Animated.View
      style={[styles.container, animatedStyle]}
      pointerEvents="none"
    >
      <Box className="rounded-xl bg-primary px-3 py-2">
        <Text className="text-sm font-bold text-white">{text}</Text>
      </Box>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 9999,
  },
});
