import Animated, { FadeInDown } from 'react-native-reanimated';
import { Text, View } from 'react-native';
import { QuizScoreDto } from '@/lib/api/generated/model';

type QuizScoreHeaderProps = {
  quiz: QuizScoreDto;
  title?: string;
  subtitle?: string;
};

export function QuizScoreHeader({
  quiz,
  title = 'Complete!',
  subtitle,
}: QuizScoreHeaderProps) {
  const emoji = quiz.score >= 80 ? '🎉' : quiz.score >= 50 ? '👏' : '💪';

  return (
    <Animated.View entering={FadeInDown.duration(600)}>
      <View className="items-center pb-2 pt-4">
        <Text className="text-5xl">{emoji}</Text>
        <Text className="mt-3 text-2xl font-extrabold text-[#1B1B21]">
          {title}
        </Text>
        {subtitle && (
          <Text className="mt-1 text-sm font-medium text-[#767683]">
            {subtitle}
          </Text>
        )}

        {/* Score ring */}
        <View className="mt-5 h-28 w-28 items-center justify-center rounded-full bg-[#F1EFFF]">
          <Text className="text-4xl font-black text-[#4C54B6]">
            {quiz.score}
          </Text>
          <Text className="text-xs font-bold text-[#8E97FD]">SCORE</Text>
        </View>

        {/* Correct count */}
        <View className="mt-4 flex-row items-center gap-1">
          <View className="h-2 w-2 rounded-full bg-[#4ADE80]" />
          <Text className="text-sm font-semibold text-[#454652]">
            {quiz.correctCount}/{quiz.totalCount} correct
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}
