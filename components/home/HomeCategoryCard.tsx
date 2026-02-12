import { Href, Link } from 'expo-router';
import { CircleCheck } from 'lucide-react-native';
import React from 'react';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';

type HomeCategoryCardProps = {
  title: string;
  sub: string;
  href: Href;
  containerClassName: string;
  textClassName: string;
  completed?: boolean;
};

export function HomeCategoryCard({
  title,
  sub,
  href,
  containerClassName,
  textClassName,
  completed,
}: HomeCategoryCardProps) {
  return (
    <Link href={href} asChild>
      <Pressable
        className={`${containerClassName} h-52 flex-1 rounded-[20px] p-5`}
      >
        <View>
          <Text className={`text-xl font-bold ${textClassName}`}>{title}</Text>
          <Text
            className={`text-xs font-bold uppercase opacity-70 ${textClassName}`}
          >
            {sub}
          </Text>
        </View>

        <View className="mt-auto gap-2">
          {completed && (
            <View className="flex-row items-center gap-1.5">
              <CircleCheck size={14} color="#22C55E" fill="#22C55E" />
              <Text className="text-[10px] font-bold text-[#22C55E]">
                오늘의 학습 완료!
              </Text>
            </View>
          )}
          <Pressable className="self-start rounded-full bg-[#EBEAEC] px-4 py-2">
            <Text className="text-[10px] font-black uppercase text-[#3F414E]">
              {completed ? '복습하기' : 'Start Now'}
            </Text>
          </Pressable>
        </View>
      </Pressable>
    </Link>
  );
}

