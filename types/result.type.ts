import {
  EpisodeMetaDto,
  EpisodeRewardDto,
  QuizScoreDto,
  XpProgressDto,
} from '@/lib/api/generated/model';

export interface EpisodeResult {
  quiz: QuizScoreDto;
  xp: XpProgressDto;
  episode: EpisodeMetaDto;
  rewards: EpisodeRewardDto[];
}

export interface DailyQuizResult {
  quiz: QuizScoreDto;
  xp?: XpProgressDto;
}
