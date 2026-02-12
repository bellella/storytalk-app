import React from 'react';
import { HomeCategoryCard } from '@/components/home/HomeCategoryCard';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';

type HomeHeaderProps = {
  userName?: string | null;
  dailyQuizCompleted?: boolean;
};

export function HomeHeader({ userName, dailyQuizCompleted }: HomeHeaderProps) {
  return (
    <View className="mb-8">
      {/* Greeting */}
      <Text className="mt-4 text-3xl font-bold">
        좋은 아침이에요! {userName ?? ''}
      </Text>
      <Text className="mb-8 mt-1 text-lg font-medium text-[#A1A4B2]">
        오늘도 즐거운 학습 되세요.
      </Text>

      {/* Categories */}
      <View className="flex-row gap-4">
        <HomeCategoryCard
          title="상황별 회화"
          sub="Situational Conversation"
          href="/units"
          containerClassName="bg-primary"
          textClassName="text-white"
        />
        <HomeCategoryCard
          title="데일리 학습"
          sub="Daily Learning"
          href={
            dailyQuizCompleted ? '/quiz/daily?isReview=true' : '/quiz/daily'
          }
          containerClassName="bg-[#FFDEA6]"
          textClassName="text-[#3F414E]"
          completed={dailyQuizCompleted}
        />
      </View>
    </View>
  );
}
