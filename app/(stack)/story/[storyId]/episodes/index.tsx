import { useQuery } from '@tanstack/react-query';
import { Link, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';

const EPISODES = [
  { id: '1', title: 'The Audition Room', duration: '3-4 min', mode: 'reader' },
  { id: '2', title: 'Text Battle', duration: '4 min', mode: 'chat' },
  { id: '3', title: 'Locked Episode', locked: true },
];

export default function EpisodeListScreen() {
  const { storyId } = useLocalSearchParams();

  const { data: episodes } = useQuery({
    queryKey: ['episodes', storyId],
    queryFn: async () => EPISODES,
  });

  return (
    <ScrollView className="flex-1 space-y-4 bg-black px-5 pt-6">
      <Text className="mb-4 text-2xl font-black text-white">Episodes</Text>

      {episodes?.map((ep) => (
        <Link
          href={`/story/${storyId}/episodes/${ep.id}/play`}
          asChild
          key={ep.id}
        >
          <Pressable
            disabled={ep.locked}
            className={`rounded-xl border p-4 ${
              ep.locked
                ? 'border-slate-700 bg-slate-800/40'
                : 'border-pink-500/50 bg-slate-800'
            }`}
          >
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-lg font-bold text-white">{ep.title}</Text>
                {ep.duration && (
                  <Text className="mt-1 text-xs text-slate-400">
                    {ep.duration}
                  </Text>
                )}
              </View>
              <Text className="font-bold text-pink-500">
                {ep.locked ? 'LOCKED' : 'PLAY'}
              </Text>
            </View>
          </Pressable>
        </Link>
      ))}
    </ScrollView>
  );
}
