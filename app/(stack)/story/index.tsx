import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator } from 'react-native';
import { useEpisode } from '@/lib/hooks/useEpisodes';

export default function PlayEntry() {
  const { episodeId } = useLocalSearchParams();
  const router = useRouter();
  const { data, isLoading } = useEpisode(episodeId as string);

  if (isLoading) return <ActivityIndicator />;

  //   if (data?.mode === 'chat') {
  //     router.replace('./chat');
  //   } else {
  //     router.replace('./reader');
  //   }

  return 123;
}
