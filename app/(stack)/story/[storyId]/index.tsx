import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import { Heart } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Image, Pressable, ScrollView } from 'react-native';
import { AppContainer } from '@/components/app/app-container';
import { EpisodeCard } from '@/components/episode/EpisodeCard';
import { StoryHero } from '@/components/episode/StoryHero';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { storyGetStoryDetail } from '@/lib/api/generated/story/story';
import { useColors } from '@/lib/hooks/theme/useColors';
import { toEpisodeCardItems } from '@/lib/utils/episode-helpers';

const PRIMARY_RGB = '142, 151, 253'; // #8E97FD

export default function StoryDetailScreen() {
  const { storyId } = useLocalSearchParams();
  const { colors } = useColors();
  const { data, isLoading } = useQuery({
    queryKey: ['story', storyId],
    queryFn: () => storyGetStoryDetail(Number(storyId)),
  });

  const [liked, setLiked] = useState(false);

  const episodeCards = useMemo(
    () => toEpisodeCardItems(data?.episodes ?? []),
    [data?.episodes]
  );

  const progressPercent = useMemo(() => {
    const eps = data?.episodes ?? [];
    if (!eps.length) return 0;
    const completed = eps.filter((e) => e.userEpisode?.isCompleted).length;
    return Math.round((completed / eps.length) * 100);
  }, [data?.episodes]);

  if (isLoading || !data) return null;

  const { title, description, coverImage, characters } = data;

  return (
    <AppContainer showBackButton>
      {/* Cover Image */}
      <Box className="h-[300px] w-full overflow-hidden">
        <Image
          source={{
            uri:
              coverImage ??
              'https://mina-test-images.s3.ap-northeast-2.amazonaws.com/riley.png',
          }}
          className="h-full w-full"
          resizeMode="cover"
        />
      </Box>

      {/* Hero + Progress */}
      <VStack className="px-3">
        <StoryHero
          title={title}
          description={description}
          primary={PRIMARY_RGB}
          progressPercent={progressPercent}
        />
      </VStack>
      {/* Characters */}
      {!!characters?.length && (
        <VStack className="mb-6 mt-6 px-3">
          <Text className="mb-4 text-lg font-bold text-[#3F414E]">
            Characters
          </Text>
          <ScrollView horizontal className="flex-row gap-4">
            {characters.map((char) => (
              <VStack key={char.id} className="min-w-[70px] items-center">
                <Box className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-[#F5F5F9] text-3xl">
                  {char.avatarImage ? (
                    <Image
                      source={{ uri: char.avatarImage }}
                      className="h-full w-full rounded-full"
                      resizeMode="cover"
                    />
                  ) : (
                    <Text>{char.name?.charAt(0)}</Text>
                  )}
                </Box>
                <Text className="text-xs font-bold text-[#3F414E]">
                  {char.name}
                </Text>
                <Text className="mt-1 text-center text-[10px] leading-tight text-[#A1A4B2]">
                  {char.description}
                </Text>
              </VStack>
            ))}
          </ScrollView>
        </VStack>
      )}
      {/* Episodes */}
      <VStack className="px-3">
        <HStack className="mt-7 items-center justify-end">
          <Text className="text-muted-foreground text-sm font-bold">
            {episodeCards.length} episodes
          </Text>
        </HStack>

        <VStack className="mb-20 mt-3 gap-y-3">
          {episodeCards.map((ep) => (
            <EpisodeCard
              key={ep.id}
              episode={ep}
              primary={PRIMARY_RGB}
              href={`/story/${storyId}/episodes/${ep.id}/play`}
            />
          ))}
        </VStack>
      </VStack>
    </AppContainer>
  );
}
