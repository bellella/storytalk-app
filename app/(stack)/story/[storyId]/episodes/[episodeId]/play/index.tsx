import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function PlayEntry() {
  const { storyId, episodeId } = useLocalSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (!storyId || !episodeId) return;

    router.replace(`/story/${storyId}/episodes/${episodeId}/play/reader`);
  }, [storyId, episodeId]);

  return null;
}
