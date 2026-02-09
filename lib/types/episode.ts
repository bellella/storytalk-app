export type EpisodeStatus = 'COMPLETED' | 'AVAILABLE' | 'LOCKED';

export interface EpisodeCardItem {
  id: number;
  title: string;
  description?: string | null;
  status: EpisodeStatus;
}
