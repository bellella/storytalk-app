import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { BookOpen, Moon } from 'lucide-react-native';
import React from 'react';
import { ScrollView } from 'react-native';
import { AppContainer } from '@/components/app/app-container';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { storyGetStories } from '@/lib/api/generated/story/story';

type Category = {
  id: number;
  title: string;
  sub: string;
  time: string;
  color: string;
  text: string;
  icon: string;
};

type Story = {
  id: number;
  title: string;
  category: string;
  time: string;
  color: string;
  icon: string;
};

type Novel = {
  id: number;
  title: string;
  level: string;
  cover: {
    url: string;
    backgroundColor: string;
  };
  episodes: number;
};

const CATEGORIES: Category[] = [
  {
    id: 1,
    title: '기초 코스',
    sub: 'Course',
    time: '3-10 min',
    color: 'bg-primary',
    text: 'text-white',
    icon: '🌱',
  },
  {
    id: 2,
    title: '휴식 모드',
    sub: 'Music',
    time: '5-15 min',
    color: 'bg-[#FFDEA6]',
    text: 'text-[#3F414E]',
    icon: '🎵',
  },
];

export default function HomeScreen() {
  const { data } = useQuery({
    queryKey: ['stories'],
    queryFn: () => storyGetStories(),
  });
  const stories = data?.items ?? [];
  return (
    <AppContainer showHeaderLogo>
      <View className="px-6">
        {/* ---------- Greeting ---------- */}
        <Text className="mt-4 text-3xl font-bold">좋은 아침이에요!</Text>
        <Text className="mb-8 mt-1 text-lg font-medium text-[#A1A4B2]">
          오늘도 즐거운 학습 되세요.
        </Text>

        {/* ---------- Categories ---------- */}
        <View className="mb-8 flex-row gap-4">
          {CATEGORIES.map((cat) => (
            <View
              key={cat.id}
              className={`${cat.color} h-52 flex-1 rounded-[20px] p-5 shadow-sm`}
            >
              <View className="absolute right-4 top-4 opacity-80">
                <Text className="text-3xl">{cat.icon}</Text>
              </View>

              <View>
                <Text className={`text-xl font-bold ${cat.text}`}>
                  {cat.title}
                </Text>
                <Text
                  className={`text-xs font-bold uppercase opacity-70 ${cat.text}`}
                >
                  {cat.sub}
                </Text>
              </View>

              <View className="mt-auto flex-row items-center justify-between">
                <Text className={`text-[10px] font-medium ${cat.text}`}>
                  {cat.time}
                </Text>

                <Link href={`/course/${cat.id}`} asChild>
                  <Pressable className="rounded-full bg-[#EBEAEC] px-4 py-2">
                    <Text className="text-[10px] font-black uppercase text-[#3F414E]">
                      Start
                    </Text>
                  </Pressable>
                </Link>
              </View>
            </View>
          ))}
        </View>

        {/* ---------- Recommended Stories ---------- */}
        {/* <Text className="mb-6 text-2xl font-bold text-[#3F414E]">
          추천 이야기
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-10"
          contentContainerStyle={{ gap: 16, paddingRight: 24 }}
        >
          {stories.map((story) => (
            <Link href={`/story/${story.id}`} key={story.id} asChild>
              <Pressable className="w-40">
                <View
                  className={`${story.coverImage} shadow-inner mb-3 h-40 items-center justify-center rounded-[20px]`}
                >
                  <Image
                    source={{ uri: story.coverImage }}
                    style={{ width: '100%', height: '100%' }}
                  />
                </View>
                <Text className="text-base font-bold leading-tight text-[#3F414E]">
                  {story.title}
                </Text>
                <Text className="mt-1 text-[10px] font-bold uppercase text-[#A1A4B2]">
                  {story.difficulty} • {story.totalEpisodes} Episodes
                </Text>
              </Pressable>
            </Link>
          ))}
        </ScrollView> */}

        {/* ---------- Novel Grid (두 번째 코드 통합) ---------- */}
        <Text className="mb-4 text-xl font-bold text-[#3F414E]">
          Recommended for You
        </Text>

        <View className="mb-6 flex-row flex-wrap justify-between">
          {stories.map((story) => (
            <Link href={`/story/${story.id}`} key={story.id} asChild>
              <Pressable className="mb-6 w-[48%]">
                <View
                  className={`relative mb-3 aspect-[3/4] items-center justify-center overflow-hidden rounded-xl bg-primary shadow-lg`}
                >
                  <Image
                    source={{ uri: story.coverImage }}
                    style={{ width: '100%', height: '100%' }}
                  />
                  <BookOpen size={40} color="#fff" opacity={0.8} />
                </View>

                <Text className="font-bold leading-tight text-[#3F414E]">
                  {story.title}
                </Text>
                <Text className="mt-0.5 text-xs text-[#A1A4B2]">
                  {story.totalEpisodes} Episodes • {story.difficulty}
                </Text>
              </Pressable>
            </Link>
          ))}
        </View>
      </View>
    </AppContainer>
  );
}
