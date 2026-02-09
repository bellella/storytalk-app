import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { BookOpen, Heart, Star } from 'lucide-react-native';
import React, { useRef } from 'react';
import { Dimensions, Pressable, Text, View } from 'react-native';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';
import { StoryListItemDto } from '@/lib/api/generated/model';
import { storyGetStories } from '@/lib/api/generated/story/story';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.6;
const CARD_HEIGHT = CARD_WIDTH * 1;

const PASTEL_COLORS = [
  'bg-[#FFE8EC]',
  'bg-[#E8F0FF]',
  'bg-[#FFF3E0]',
  'bg-[#E8FFE8]',
  'bg-[#F3E8FF]',
  'bg-[#E8FFFD]',
];

const DIFFICULTY_LABEL: Record<number, string> = {
  1: 'Beginner',
  2: 'Elementary',
  3: 'Intermediate',
  4: 'Advanced',
  5: 'Expert',
};

const DIFFICULTY_COLOR: Record<number, string> = {
  1: 'bg-[#A8E6CF]',
  2: 'bg-[#88D8B0]',
  3: 'bg-[#FFD3B6]',
  4: 'bg-[#FFAAA5]',
  5: 'bg-[#FF8B94]',
};

function StoryCard({
  story,
  index,
}: {
  story: StoryListItemDto;
  index: number;
}) {
  const bgColor = PASTEL_COLORS[index % PASTEL_COLORS.length];
  const diffLabel =
    DIFFICULTY_LABEL[story.difficulty] ?? `Lv.${story.difficulty}`;
  const diffColor = DIFFICULTY_COLOR[story.difficulty] ?? 'bg-[#E8EAFF]';

  return (
    <Link href={`/story/${story.id}`} asChild>
      <Pressable>
        <View
          className={`mx-2 overflow-hidden rounded-3xl bg-white`}
          style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
        >
          {/* Cover Image */}
          <View className="flex-1 overflow-hidden rounded-b-none rounded-t-3xl">
            {story.coverImage ? (
              <Image
                source={{ uri: story.coverImage }}
                style={{ width: '100%', height: '100%' }}
                contentFit="cover"
              />
            ) : (
              <View className="flex-1 items-center justify-center">
                <BookOpen size={48} color="#8E97FD" opacity={0.4} />
              </View>
            )}
          </View>

          {/* Info Card */}
          <View className="px-5 py-4">
            {/* Difficulty Badge */}
            <View className="mb-2 flex-row items-center gap-2">
              <View className={`rounded-full px-2.5 py-0.5 ${diffColor}`}>
                <Text className="text-[10px] font-bold text-white">
                  {diffLabel}
                </Text>
              </View>
              <View className="flex-row items-center gap-1">
                <Heart size={12} color="#FF8B94" fill="#FF8B94" />
                <Text className="text-[10px] font-semibold text-[#FF8B94]">
                  {story.likeCount}
                </Text>
              </View>
            </View>

            {/* Title */}
            <Text
              className="text-base font-bold text-[#3F414E]"
              numberOfLines={1}
            >
              {story.title}
            </Text>

            {/* Description */}
            {story.description && (
              <Text className="mt-1 text-xs text-[#A1A4B2]" numberOfLines={2}>
                {story.description}
              </Text>
            )}

            {/* Episodes */}
            <View className="mt-2 flex-row items-center gap-1">
              <Star size={12} color="#FFD700" fill="#FFD700" />
              <Text className="text-[11px] font-semibold text-[#6D6F7B]">
                {story.totalEpisodes} Episodes
              </Text>
            </View>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

export function StoryCarousel() {
  const carouselRef = useRef<ICarouselInstance>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['stories'],
    queryFn: () => storyGetStories(),
  });

  const stories = data?.items ?? [];

  if (isLoading || stories.length === 0) {
    return null;
  }

  return (
    <View className="mb-8">
      <Text className="mb-4 px-6 text-xl font-bold text-[#3F414E]">
        추천 스토리
      </Text>

      <Carousel
        ref={carouselRef}
        data={stories}
        width={CARD_WIDTH + 16}
        height={CARD_HEIGHT + 8}
        style={{ width: SCREEN_WIDTH }}
        loop={true}
        renderItem={({ item, index }) => (
          <StoryCard story={item} index={index} />
        )}
      />
    </View>
  );
}
