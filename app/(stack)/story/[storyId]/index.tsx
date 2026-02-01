import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FileText, Heart, Play, RotateCw } from 'lucide-react-native';
import { useState } from 'react';
import { Image, Pressable, ScrollView } from 'react-native';
import { AppContainer } from '@/components/app/app-container';
import { FloatingContainer } from '@/components/common/FloatingContainer';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { storyGetStoryDetail } from '@/lib/api/generated/story/story';
import { useColors } from '@/lib/hooks/theme/useColors';

export default function StoryDetailScreen() {
  const { storyId } = useLocalSearchParams();
  const router = useRouter();
  const { colors } = useColors();
  const { data, isLoading } = useQuery({
    queryKey: ['story', storyId],
    queryFn: () => storyGetStoryDetail(Number(storyId)),
  });

  const [liked, setLiked] = useState(false);

  if (isLoading || !data) return null;

  const { title, description, coverImage, characters, episodes } = data;

  const handleStartEpisode = (ep: any) => {
    router.push(`/story/${storyId}/episodes/${ep.id}/play`);
  };

  const handleReviewEpisode = (ep: any) => {
    router.push(`/story/${storyId}/episodes/${ep.id}/review`);
  };

  const handleQuizEpisode = (ep: any) => {
    router.push(`/story/${storyId}/episodes/${ep.id}/quiz`);
  };

  return (
    <>
      <AppContainer showBackButton>
        <ScrollView className="flex-1 bg-white">
          {/* Cover Image */}
          <Box className="mb-6 h-[340px] w-full overflow-hidden rounded-b-[32px] bg-[#F5F5F9]">
            <Image
              source={{
                uri:
                  coverImage ??
                  'https://mina-test-images.s3.ap-northeast-2.amazonaws.com/riley.png',
              }}
              className="h-full w-full"
              resizeMode="cover"
            />
            <Pressable
              onPress={() => setLiked((p) => !p)}
              className="absolute right-4 top-4 rounded-full bg-white p-2 shadow"
            >
              <Heart
                size={22}
                color={liked ? colors.onError : colors.error}
                fill={liked ? colors.onError : 'none'}
              />
            </Pressable>
          </Box>

          {/* Title & Description */}
          <VStack className="mb-6 space-y-2 px-6">
            <Text className="text-2xl font-black text-[#3F414E]">{title}</Text>
            <Text className="text-sm leading-relaxed text-[#A1A4B2]">
              {description}
            </Text>
          </VStack>

          {/* Characters */}
          <VStack className="mb-6 px-6">
            <Text className="mb-4 text-lg font-bold text-[#3F414E]">
              Characters
            </Text>
            <ScrollView horizontal className="flex-row gap-4">
              {characters?.map((char) => (
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

          {/* Episodes */}
          <VStack className="mb-20 space-y-4 px-6">
            <Text className="mb-4 text-lg font-bold text-[#3F414E]">
              Episodes
            </Text>
            {episodes.map((ep) => (
              <VStack
                key={ep.id}
                className="rounded-[30px] border border-[#F1F1F1] bg-white p-5"
              >
                {/* Episode Header */}
                <HStack className="mb-3 items-start justify-between">
                  <VStack>
                    <Text className="text-sm font-bold text-[#3F414E]">
                      {ep.title}
                    </Text>
                    <Text className="text-[10px] text-[#A1A4B2]">
                      {ep.duration}
                    </Text>
                  </VStack>
                  {ep.userEpisode?.isCompleted && (
                    <Box className="rounded-md bg-green-50 px-2 py-1">
                      <Text className="text-[9px] font-black uppercase text-green-500">
                        학습완료
                      </Text>
                    </Box>
                  )}
                </HStack>

                {/* Progress Bar */}
                <Box className="mb-4 h-1 w-full overflow-hidden rounded-full bg-[#F5F5F9]">
                  <Box
                    className={`h-full bg-[#8E97FD] transition-all`}
                    style={{ width: `${ep.userEpisode?.progressPct ?? 0}%` }}
                  />
                </Box>

                {/* Actions */}
                <HStack className="gap-2">
                  {ep.userEpisode?.progressPct === 100 ? (
                    <>
                      <Button
                        onPress={() => handleReviewEpisode(ep)}
                        className="flex-1 flex-row items-center justify-center gap-2 rounded-xl bg-[#F5F5F9] py-2.5"
                      >
                        <RotateCw size={14} />
                        <ButtonText className="text-[11px] font-bold text-[#3F414E]">
                          리뷰 다시보기
                        </ButtonText>
                      </Button>
                      <Button
                        onPress={() => handleQuizEpisode(ep)}
                        className="flex-1 flex-row items-center justify-center gap-2 rounded-xl bg-[#8E97FD]/10 py-2.5"
                      >
                        <FileText size={14} />
                        <ButtonText className="text-[11px] font-bold text-[#8E97FD]">
                          퀴즈 다시풀기
                        </ButtonText>
                      </Button>
                    </>
                  ) : (
                    <Button
                      onPress={() => handleStartEpisode(ep)}
                      action="primary"
                      className="w-full"
                    >
                      <Play size={14} color={colors.onPrimary} />
                      <ButtonText>
                        {ep.userEpisode?.isCompleted ? '완료' : '에피소드 읽기'}
                      </ButtonText>
                    </Button>
                  )}
                </HStack>
              </VStack>
            ))}
          </VStack>
        </ScrollView>
      </AppContainer>

      <FloatingContainer>
        <Button
          onPress={() =>
            episodes.length > 0 ? handleStartEpisode(episodes[0]) : null
          }
          className="w-full"
          action="primary"
        >
          <ButtonText>첫 화 읽기</ButtonText>
        </Button>
      </FloatingContainer>
    </>
  );
}
