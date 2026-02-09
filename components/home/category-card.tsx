import React from 'react';
import { Pressable, View } from 'react-native';
import { HStack } from '@/components/ui/hstack'; // (선택) 안 쓰면 지워도 됨
import { Text } from '@/components/ui/text'; // gluestack Text (프로젝트 경로에 맞게 수정)
import { VStack } from '@/components/ui/vstack'; // gluestack VStack

type CategoryItem = {
  key: string;
  label: string;
  emoji: string;
  // ex: "#8E97FD"
  color: string;
  onPress?: () => void;
};

const CATEGORIES: CategoryItem[] = [
  { key: 'basic', label: '기본회화', emoji: '💬', color: '#8E97FD' },
  { key: 'bizTalk', label: '비지니스회화', emoji: '🤝', color: '#FFC97E' },
  { key: 'bizEng', label: '비지니스 영어', emoji: '📊', color: '#FA6E5A' },
  { key: 'smalltalk', label: '스몰톡', emoji: '☕', color: '#6CB28E' },
  //   { key: 'music', label: '여행 영어', emoji: '🎵', color: '#FFDEA6' },
  //   { key: 'movie', label: '영화', emoji: '🎥', color: '#FFDEA6' },
  //   { key: 'book', label: '책', emoji: '📚', color: '#FFDEA6' },
  //   { key: 'news', label: '뉴스', emoji: '📰', color: '#FFDEA6' },
];

function hexToRgba(hex: string, alpha: number) {
  const h = hex.replace('#', '');
  const full =
    h.length === 3
      ? h
          .split('')
          .map((c) => c + c)
          .join('')
      : h;
  const n = parseInt(full, 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}

export function CategoryCard({
  label,
  emoji,
  color,
  onPress,
}: Pick<CategoryItem, 'label' | 'emoji' | 'color' | 'onPress'>) {
  const bg = hexToRgba(color, 0.1);
  const border = hexToRgba(color, 0.2);

  return (
    <Pressable
      onPress={onPress}
      className="items-center"
      android_ripple={{ color: 'rgba(0,0,0,0.06)', borderless: true }}
      style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
    >
      <VStack space="xs" className="items-center">
        <View
          className="h-14 w-14 items-center justify-center rounded-2xl bg-primary"
          style={
            {
              //backgroundColor: bg,
              //borderColor: border,
              //borderWidth: 1,
            }
          }
        >
          <Text className="text-2xl">{emoji}</Text>
        </View>

        <Text
          className="text-foreground text-[11px] font-bold"
          numberOfLines={1}
        >
          {label}
        </Text>
      </VStack>
    </Pressable>
  );
}

export function CategoryGridSection({
  items = CATEGORIES,
}: {
  items?: CategoryItem[];
}) {
  return (
    <View className="mb-8 px-6 pt-4">
      {/* grid-cols-4 + gap-4 */}
      <View className="flex-row flex-wrap">
        {items.map((item) => (
          <View key={item.key} className="w-1/4 px-2">
            <View className="py-2">
              <CategoryCard
                label={item.label}
                emoji={item.emoji}
                color={item.color}
                onPress={item.onPress}
              />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
