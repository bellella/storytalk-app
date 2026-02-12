import { useQuery } from '@tanstack/react-query';
import { Link, useLocalSearchParams } from 'expo-router';
import { BookOpen, Gift, Heart, MessageCircle } from 'lucide-react-native';
import { Image, Pressable } from 'react-native';
import { AppContainer } from '@/components/app/app-container';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { characterFindOne } from '@/lib/api/generated/character/character';
import { storyGetStories } from '@/lib/api/generated/story/story';

export default function CharacterDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const characterId = Number(id);

  const { data: character } = useQuery({
    queryKey: ['characters', characterId],
    queryFn: () => characterFindOne(characterId),
  });

  const { data: storiesData } = useQuery({
    queryKey: ['stories'],
    queryFn: () => storyGetStories(),
  });

  const stories = storiesData?.items ?? [];

  if (!character) return null;

  const affinity = character.affinity ?? 0;
  const affinityPercent = Math.min(affinity, 100);
  const affinityLabel =
    affinity >= 80
      ? '절친'
      : affinity >= 50
        ? '친한 사이'
        : affinity >= 20
          ? '아는 사이'
          : '첫 만남';

  return (
    <AppContainer showBackButton>
      {/* Hero Illustration (1:1.5 ratio) */}
      <Box
        className="w-full overflow-hidden bg-[#F0F0FA]"
        style={{ aspectRatio: 1 / 1.5 }}
      >
        <Image
          source={{ uri: character.mainImage || character.avatarImage }}
          className="h-full w-full"
          resizeMode="cover"
        />
      </Box>

      {/* Character Info */}
      <VStack className="-mt-6 rounded-t-[28px] bg-background px-6 pt-8">
        {/* Name + Chat Button */}
        <HStack className="items-start justify-between">
          <VStack className="flex-1">
            <Text className="text-2xl font-black text-[#3F414E]">
              {character.name}
            </Text>
            {character.personality && (
              <Text className="mt-1 text-sm font-semibold text-[#8E97FD]">
                {character.personality}
              </Text>
            )}
          </VStack>
          <Link
            href={{
              pathname: '/chats/[id]',
              params: {
                id: String(character.id),
                name: character.name,
              },
            }}
            asChild
          >
            <Pressable className="h-11 w-11 items-center justify-center rounded-full bg-[#8E97FD]">
              <MessageCircle size={20} color="#fff" fill="#fff" />
            </Pressable>
          </Link>
        </HStack>

        {/* Description */}
        {character.description && (
          <Box className="mt-5 rounded-2xl bg-white p-5">
            <Text className="text-sm leading-relaxed text-[#5E5D66]">
              {character.description}
            </Text>
          </Box>
        )}

        {/* Relationship Section */}
        <VStack className="mt-8">
          <HStack className="mb-3 items-center gap-2">
            <Heart size={16} color="#8E97FD" fill="#8E97FD" />
            <Text className="text-base font-bold text-[#3F414E]">
              나와의 관계
            </Text>
          </HStack>

          <Box className="rounded-2xl bg-white p-5">
            <HStack className="items-center justify-between">
              <Text className="text-sm font-semibold text-[#3F414E]">
                호감도
              </Text>
              <Text className="text-sm font-bold text-[#8E97FD]">
                {affinity} / 100
              </Text>
            </HStack>
            {/* Progress Bar */}
            <Box className="mt-3 h-2.5 overflow-hidden rounded-full bg-[#F0F0FA]">
              <Box
                className="h-full rounded-full bg-[#8E97FD]"
                style={{ width: `${affinityPercent}%` }}
              />
            </Box>
            <Text className="mt-2 text-xs text-[#A1A4B2]">
              {affinityLabel} 단계
            </Text>
          </Box>
        </VStack>

        {/* Stories Section */}
        {stories.length > 0 && (
          <VStack className="mt-8">
            <HStack className="mb-3 items-center gap-2">
              <BookOpen size={16} color="#8E97FD" />
              <Text className="text-base font-bold text-[#3F414E]">
                출연 스토리
              </Text>
            </HStack>

            <VStack className="gap-y-3">
              {stories.map((story) => (
                <Link
                  key={story.id}
                  href={{
                    pathname: '/story/[storyId]',
                    params: { storyId: String(story.id) },
                  }}
                  asChild
                >
                  <Pressable className="flex-row items-center gap-4 rounded-2xl bg-white p-4 active:bg-[#F5F5F9]">
                    <Box className="h-16 w-12 overflow-hidden rounded-xl bg-[#F0F0FA]">
                      {story.coverImage ? (
                        <Image
                          source={{ uri: story.coverImage }}
                          className="h-full w-full"
                          resizeMode="cover"
                        />
                      ) : (
                        <Box className="h-full w-full items-center justify-center">
                          <BookOpen size={20} color="#A1A4B2" />
                        </Box>
                      )}
                    </Box>
                    <VStack className="flex-1">
                      <Text className="text-sm font-bold text-[#3F414E]">
                        {story.title}
                      </Text>
                      <Text
                        numberOfLines={1}
                        className="mt-1 text-xs text-[#A1A4B2]"
                      >
                        {story.description ?? ''}
                      </Text>
                      <HStack className="mt-1.5 items-center gap-2">
                        <Text className="text-[10px] font-semibold uppercase text-[#8E97FD]">
                          {String(story.level)}
                        </Text>
                        <Text className="text-[10px] text-[#A1A4B2]">
                          {story.totalEpisodes}화
                        </Text>
                      </HStack>
                    </VStack>
                  </Pressable>
                </Link>
              ))}
            </VStack>
          </VStack>
        )}

        {/* Gifts Section */}
        <VStack className="mb-20 mt-8">
          <HStack className="mb-3 items-center gap-2">
            <Gift size={16} color="#8E97FD" />
            <Text className="text-base font-bold text-[#3F414E]">
              주고받은 선물
            </Text>
          </HStack>

          <Box className="items-center rounded-2xl bg-white py-10">
            <Gift size={32} color="#D1D1D6" />
            <Text className="mt-3 text-sm text-[#A1A4B2]">
              아직 주고받은 선물이 없어요
            </Text>
          </Box>
        </VStack>
      </VStack>
    </AppContainer>
  );
}
