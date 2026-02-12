import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Bookmark, Volume2 } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, View } from 'react-native';
import { AppContainer } from '@/components/app/app-container';
import { ModalHeader } from '@/components/app/ModalHeader';
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from '@/components/ui/avatar';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { episodeGetReviewItems } from '@/lib/api/generated/episode/episode';
import { useSpeech } from '@/lib/hooks/useSpeech';

export default function EpisodeReviewScreen() {
  const { storyId, episodeId } = useLocalSearchParams();
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ['episode-review', episodeId],
    queryFn: () => episodeGetReviewItems(Number(episodeId)),
  });

  const dialogs = data ?? [];
  const [bookmarked, setBookmarked] = useState<Record<number, boolean>>({});
  const { speak, isSpeakingText } = useSpeech({
    language: 'en-US',
    rate: 0.85,
  });

  if (isLoading || dialogs.length === 0) return null;

  const toggleBookmark = (idx: number) => {
    setBookmarked((p) => ({ ...p, [idx]: !p[idx] }));
  };

  const handleSpeak = (text: string, idx: number) => {
    speak(text, `review-${idx}`, 'female');
  };

  const handleStartQuiz = () => {
    router.replace(`/story/${storyId}/episodes/${episodeId}/quiz`);
  };

  return (
    <>
      <ModalHeader onClose={() => router.back()} />
      <SafeAreaView edges={['bottom']} className="flex-1">
        {/* Header */}
        <Text className="text-center text-lg font-bold text-[#3F414E]">
          Review
        </Text>
        <Text className="mt-1 text-center text-sm text-[#A1A4B2]">
          Episode {episodeId} - {dialogs.length} sentences
        </Text>

        {/* Review Items List */}
        <ScrollView
          className="flex-1 px-6"
          showsVerticalScrollIndicator={false}
        >
          <VStack className="gap-4 py-6">
            {dialogs.map((item, idx) => {
              const dialogue = item.dialogue;
              const isBookmarked = bookmarked[idx];
              const isSpeaking = isSpeakingText(`review-${idx}`);

              return (
                <Box
                  key={idx}
                  className="rounded-2xl border border-[#EBEAEC] bg-white p-4"
                >
                  {/* Character name */}
                  <HStack className="mb-3 items-center justify-between">
                    <HStack className="items-center gap-2">
                      {dialogue.character?.avatarImage && (
                        <Avatar>
                          <AvatarFallbackText>
                            {dialogue.character?.name}
                          </AvatarFallbackText>
                          <AvatarImage
                            source={{ uri: dialogue.character?.avatarImage }}
                          />
                        </Avatar>
                      )}
                      <Text className="text-xs font-bold uppercase tracking-wider text-[#8E97FD]">
                        {dialogue.character?.name ?? 'Narrator'}
                      </Text>
                    </HStack>

                    {/* Action buttons */}
                    <HStack className="gap-2">
                      <Pressable
                        onPress={() => handleSpeak(dialogue.englishText, idx)}
                      >
                        <Box
                          className={`flex h-8 w-8 items-center justify-center rounded-full ${
                            isSpeaking ? 'bg-[#8E97FD]' : 'bg-[#F5F5F9]'
                          }`}
                        >
                          <Volume2
                            size={16}
                            color={isSpeaking ? '#FFFFFF' : '#A1A4B2'}
                          />
                        </Box>
                      </Pressable>

                      <Pressable onPress={() => toggleBookmark(idx)}>
                        <Box
                          className={`flex h-8 w-8 items-center justify-center rounded-full ${
                            isBookmarked ? 'bg-yellow-50' : 'bg-[#F5F5F9]'
                          }`}
                        >
                          <Bookmark
                            size={16}
                            color={isBookmarked ? '#FBBF24' : '#A1A4B2'}
                            fill={isBookmarked ? '#FBBF24' : 'none'}
                          />
                        </Box>
                      </Pressable>
                    </HStack>
                  </HStack>

                  {/* English text */}
                  <Text className="mb-2 rounded-lg bg-gray-100 p-2 text-base font-bold leading-relaxed text-gray-600">
                    {dialogue.englishText}
                  </Text>

                  {/* Korean translation */}
                  <Text className="text-sm font-medium text-[#8E97FD]">
                    {dialogue.koreanText}
                  </Text>
                </Box>
              );
            })}
          </VStack>
        </ScrollView>

        {/* Bottom Button */}
        <Box className="border-t border-[#EBEAEC] px-6 py-4">
          <Button
            className="w-full rounded-[22px] bg-[#8E97FD]"
            onPress={handleStartQuiz}
          >
            <ButtonText className="font-bold text-white">Start Quiz</ButtonText>
          </Button>
        </Box>
      </SafeAreaView>
    </>
  );
}
