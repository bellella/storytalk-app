import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, Star } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable } from 'react-native';
import { AppContainer } from '@/components/app/app-container';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { episodeGetReviewItems } from '@/lib/api/generated/episode/episode';

export default function EpisodeReviewScreen() {
  const { storyId, episodeId } = useLocalSearchParams();
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ['episode-review', episodeId],
    queryFn: () => episodeGetReviewItems(Number(episodeId)),
  });

  const dialogs = data ?? [];
  const [step, setStep] = useState(0);
  const [bookmarked, setBookmarked] = useState<Record<number, boolean>>({});

  if (isLoading || dialogs.length === 0) return null;

  const current = dialogs[step].dialogue;

  const toggleBookmark = (idx: number) => {
    setBookmarked((p) => ({ ...p, [idx]: !p[idx] }));
  };

  const handleNext = () => {
    if (step === dialogs.length - 1) {
      router.push(`/story/${storyId}/episodes/${episodeId}/quiz`);
      return;
    }
    setStep((p) => p + 1);
  };

  return (
    <AppContainer showBackButton>
      <Box className="flex-1 bg-white p-8">
        {/* Header */}
        <HStack className="mb-8 items-center justify-between">
          <Pressable onPress={() => router.back()}>
            <Box className="flex h-10 w-10 items-center justify-center rounded-full border">
              <ChevronLeft size={20} />
            </Box>
          </Pressable>

          <Box className="flex flex-col items-center">
            <Text className="text-sm font-bold text-[#3F414E]">
              Episode {episodeId}
            </Text>
            <HStack className="mt-1 gap-1">
              {dialogs.map((_, i) => (
                <Box
                  key={i}
                  className={`h-1 rounded-full transition-all ${
                    i === step ? 'w-4 bg-[#8E97FD]' : 'w-1 bg-[#EBEAEC]'
                  }`}
                />
              ))}
            </HStack>
          </Box>

          <Pressable onPress={() => toggleBookmark(step)}>
            <Box
              className={`flex h-10 w-10 items-center justify-center rounded-full border transition-colors ${
                bookmarked[step] ? 'border-yellow-200 bg-yellow-50' : ''
              }`}
            >
              <Star
                size={20}
                className={
                  bookmarked[step]
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-[#A1A4B2]'
                }
              />
            </Box>
          </Pressable>
        </HStack>

        {/* Content */}
        <VStack className="flex-1 items-center justify-center text-center">
          <Box className="relative mb-6 flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-[#F5F5F9] text-5xl shadow-lg">
            <Box className="absolute bottom-0 right-0 flex h-10 w-10 items-center justify-center rounded-full border bg-white text-xl shadow-sm">
              <Text>
                {current.character?.avatarImage
                  ? '🙂'
                  : (current.character?.name?.[0] ?? '🙂')}
              </Text>
            </Box>
            <Text className="text-4xl">📖</Text>
          </Box>

          <HStack className="mb-4 items-center gap-2">
            <Box className="h-2 w-2 rounded-full bg-[#8E97FD]" />
            <Text className="text-[12px] font-black uppercase tracking-widest text-[#8E97FD]">
              {current.character?.name ?? 'Narrator'}
            </Text>
          </HStack>

          <Text className="mb-6 px-4 text-2xl font-bold leading-relaxed text-[#3F414E]">
            "{current.englishText}"
          </Text>

          <Box className="rounded-2xl bg-[#F5F5F9] px-6 py-4">
            <Text className="text-base font-semibold leading-relaxed text-[#8E97FD]">
              {current.koreanText}
            </Text>
          </Box>
        </VStack>

        {/* Bottom Button */}
        <Box className="pt-8">
          <Button className="w-full" onPress={handleNext}>
            <ButtonText>
              {step === dialogs.length - 1 ? 'Start Quiz 🚀' : 'Next Dialog'}
            </ButtonText>
          </Button>
        </Box>
      </Box>
    </AppContainer>
  );
}
