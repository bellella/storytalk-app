import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import {
  episodeCompleteEpisode,
  episodeGetEpisodeDetail,
  episodeStartEpisode,
  episodeUpdateEpisodeProgress,
} from '@/lib/api/generated/episode/episode';

// call start mutation if lastSceneId is not provided
// and get episode detail
export function useEpisodePlay(episodeId: number, lastSceneId?: number) {
  const episodeQuery = useEpisode(episodeId);
  const startMutation = useStartEpisode();
  const updateEpisodeProgressMutation = useUpdateEpisodeProgress(episodeId);
  const completeEpisodeMutation = useCompleteEpisode(episodeId);

  useEffect(() => {
    if (lastSceneId) return;

    // 이미 start 중이면 중복 호출 방지
    if (startMutation.isPending) return;

    startMutation.mutate(episodeId);
  }, [episodeId, lastSceneId]);

  const lastSceneIdResult = lastSceneId ?? startMutation.data?.lastSceneId;

  const isNew = lastSceneIdResult === undefined;

  const isReady = episodeQuery.isSuccess;

  return useMemo(
    () => ({
      episodeLoading: episodeQuery.isLoading,
      episodeId,
      episode: episodeQuery.data,
      episodeQuery,

      lastSceneId: lastSceneIdResult,
      updateEpisodeProgress: updateEpisodeProgressMutation.mutateAsync,
      completeEpisode: completeEpisodeMutation.mutateAsync,
      // 상태
      isStarting: startMutation.isPending,
      startError: startMutation.error,
      isEpisodeLoading: episodeQuery.isLoading,
      episodeError: episodeQuery.error,
      isReady,
    }),
    [
      episodeId,
      episodeQuery.data,
      episodeQuery.isLoading,
      episodeQuery.isSuccess,
      episodeQuery.error,
      startMutation.isPending,
      startMutation.error,
      isReady,
    ]
  );
}

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

export function useStartEpisode() {
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await episodeStartEpisode(id);
      return response;
    },
  });
}

export function useUpdateEpisodeProgress(episodeId: number) {
  return useMutation({
    mutationFn: async (sceneId: number) => {
      return episodeUpdateEpisodeProgress(episodeId, { sceneId });
    },
  });
}

export function useCompleteEpisode(episodeId: number) {
  return useMutation({
    mutationFn: async () => {
      return episodeCompleteEpisode(episodeId);
    },
  });
}
