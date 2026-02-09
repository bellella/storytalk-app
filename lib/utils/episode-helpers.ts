import type { StoryDetailDtoEpisodesItem } from '@/lib/api/generated/model';
import type { EpisodeCardItem, EpisodeStatus } from '@/lib/types/episode';

/**
 * StoryDetailDtoEpisodesItem에서 에피소드 상태를 유추합니다.
 * - isCompleted → COMPLETED
 * - userEpisode 존재 & !isCompleted → AVAILABLE (진행 중)
 * - userEpisode 없음 & 이전 에피소드 완료 또는 첫 에피소드 → AVAILABLE
 * - 그 외 → LOCKED
 */
export function getStoryEpisodeStatus(
  ep: StoryDetailDtoEpisodesItem,
  index: number,
  episodes: StoryDetailDtoEpisodesItem[]
): EpisodeStatus {
  if (ep.userEpisode?.isCompleted) return 'COMPLETED';
  if (ep.userEpisode) return 'AVAILABLE'; // 시작했지만 미완료

  // 첫 에피소드이거나 이전 에피소드가 완료된 경우
  if (index === 0) return 'AVAILABLE';
  const prev = episodes[index - 1];
  if (prev?.userEpisode?.isCompleted) return 'AVAILABLE';

  return 'LOCKED';
}

/** StoryDetailDtoEpisodesItem 배열을 EpisodeCardItem 배열로 변환 */
export function toEpisodeCardItems(
  episodes: StoryDetailDtoEpisodesItem[]
): EpisodeCardItem[] {
  return episodes.map((ep, i) => ({
    id: ep.id,
    title: ep.title,
    description: ep.duration,
    status: getStoryEpisodeStatus(ep, i, episodes),
  }));
}
