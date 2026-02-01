import { useQuery } from '@tanstack/react-query';
import { episodeGetEpisodeDetail } from '../api/generated/episode/episode';

export function useEpisode(id: string | number) {
  const numericId = typeof id === 'string' ? Number(id) : id;
  return useQuery({
    queryKey: ['episode', numericId],
    queryFn: async () => {
      const response = await episodeGetEpisodeDetail(numericId);
      return response;
    },
    enabled: !!numericId && !isNaN(numericId),
  });
}
