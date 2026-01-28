import { Link, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { AppContainer } from '@/components/app/app-container';
import { FloatingContainer } from '@/components/common/FloatingContainer';
import { useEpisode } from '@/lib/hooks/useEpisodes';

export default function EpisodeReviewScreen() {
  const { storyId, episodeId } = useLocalSearchParams();
  const { data: episode } = useEpisode(episodeId as string);

  const review = episode?.postEpisode.reviewSection;
  if (!review) return null;

  return (
    <>
      <AppContainer showBackButton hasFloatButton>
        <View className="flex-1 bg-[#FBFBFD] px-5 pt-3">
          {/* Header */}
          <Text className="text-xs font-extrabold uppercase tracking-widest text-[#8E97FD]">
            Review
          </Text>
          <Text className="mb-6 mt-1 text-2xl font-extrabold text-[#3F414E]">
            {review.title}
          </Text>

          <View className="space-y-4">
            {review.lines.map((line: any, i: number) => (
              <View
                key={i}
                className="rounded-[26px] bg-white px-5 py-4 shadow-sm shadow-black/5"
              >
                <Text className="mb-1 text-xs font-extrabold uppercase tracking-widest text-[#8E97FD]">
                  {line.speaker}
                </Text>

                <Text className="mb-3 text-base leading-relaxed text-[#3F414E]">
                  {line.text}
                </Text>

                <View className="flex-row flex-wrap gap-2">
                  {line.focus.map((tag: string, idx: number) => (
                    <View
                      key={idx}
                      className="rounded-full bg-[#F1F3FF] px-3 py-1"
                    >
                      <Text className="text-xs font-semibold text-[#6D6F7B]">
                        #{tag}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        </View>
      </AppContainer>
      <FloatingContainer>
        <Link href={`/story/${storyId}/episodes/${episodeId}/quiz`} asChild>
          <Pressable className="items-center rounded-full bg-[#8E97FD] py-4 shadow-lg shadow-[#8E97FD]/40">
            <Text className="text-base font-extrabold text-white">
              Start Quiz
            </Text>
          </Pressable>
        </Link>
      </FloatingContainer>
    </>
  );
}
