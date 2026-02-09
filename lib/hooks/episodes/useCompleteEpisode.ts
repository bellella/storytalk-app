import { useMutation } from '@tanstack/react-query';
import { episodeCompleteEpisode } from '@/lib/api/generated/episode/episode';

export function useCompleteEpisode(episodeId: number) {
  const mutation = useMutation({
    mutationFn: async () => {
      return episodeCompleteEpisode(episodeId);
    },
  });
  return mutation.mutateAsync;
}
