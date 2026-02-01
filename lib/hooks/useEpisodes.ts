import { useQuery } from '@tanstack/react-query';
import episode1 from '@/data/episodes/1.json';
import { episodeGetEpisodeDetail } from '../api/generated/episode/episode';

export function useEpisode(id: string) {
  return useQuery({
    queryKey: ['episode', id],
    queryFn: async () => {
      const response = await episodeGetEpisodeDetail(id);
      return response;
    },
    enabled: !!id,
  });
}
