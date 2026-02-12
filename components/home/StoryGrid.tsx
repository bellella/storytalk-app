import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { BookOpen } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView } from 'react-native';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { storyGetStories, storyGetTags } from '@/lib/api/generated/story/story';
import { Button, ButtonText } from '../ui/button';

export function StoryGrid() {
  const [selectedTag, setSelectedTag] = useState<string | undefined>(undefined);

  const { data: tags } = useQuery({
    queryKey: ['storyTags'],
    queryFn: () => storyGetTags(),
  });

  const { data } = useQuery({
    queryKey: ['stories', selectedTag],
    queryFn: () => storyGetStories(selectedTag ? { tag: selectedTag } : {}),
  });

  const stories = data?.items ?? [];

  return (
    <View>
      {/* Tag Chips */}
      {(tags?.length ?? 0) > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-5"
          contentContainerStyle={{ gap: 8 }}
        >
          <Button
            size="xs"
            onPress={() => setSelectedTag(undefined)}
            action="primary"
            variant={selectedTag === undefined ? 'solidChip' : 'outlineChip'}
          >
            <ButtonText>전체</ButtonText>
          </Button>
          {tags?.map((tag) => (
            <Button
              size="xs"
              key={tag.id}
              onPress={() => setSelectedTag(tag.slug)}
              action="primary"
              variant={selectedTag === tag.slug ? 'solidChip' : 'outlineChip'}
            >
              <ButtonText>
                {tag.icon ? `${tag.icon} ` : ''}
                {tag.slug}
              </ButtonText>
            </Button>
          ))}
        </ScrollView>
      )}

      {/* Story Grid */}
      <View className="mb-6 flex-row flex-wrap justify-between">
        {stories.map((story) => (
          <Link href={`/story/${story.id}`} key={story.id} asChild>
            <Pressable className="mb-6 w-[48%]">
              <View className="relative mb-3 aspect-[3/4] items-center justify-center overflow-hidden rounded-xl bg-primary shadow-lg">
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
                {story.totalEpisodes} Episodes
              </Text>
            </Pressable>
          </Link>
        ))}
      </View>
    </View>
  );
}
