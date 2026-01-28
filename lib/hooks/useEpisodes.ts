import { useQuery } from '@tanstack/react-query';
import episode1 from '@/data/episodes/1.json';

export function useEpisode(id: string) {
  return useQuery({
    queryKey: ['episode', id],
    queryFn: async () => {
      if (id === '1') return episode1;
      throw new Error('Not found');
    },
    enabled: !!id,
  });
}
