import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { episodeGetQuizzes } from '@/lib/api/generated/episode/episode';
import {
  DailyQuizResponseDto,
  QuizDto,
  StartQuizSessionDtoType,
  SubmitQuizAnswerDtoPayload,
} from '@/lib/api/generated/model';
import {
  quizCompleteSession,
  quizGetDailyQuiz,
  quizStartSession,
  quizSubmitAnswer,
} from '@/lib/api/generated/quiz/quiz';

export function useQuiz(
  type: StartQuizSessionDtoType = StartQuizSessionDtoType.EPISODE,
  episodeId: number = 0
) {
  const { data, isLoading } = useQuery<QuizDto[] | DailyQuizResponseDto>({
    queryKey: ['quiz', episodeId, type],
    queryFn: async () => {
      if (type === StartQuizSessionDtoType.EPISODE) {
        const response = await episodeGetQuizzes(episodeId);
        return response;
      } else if (type === StartQuizSessionDtoType.DAILY_QUIZ) {
        const response = await quizGetDailyQuiz();
        return response;
      }
      return [];
    },
  });
  const startQuizMutation = useStartQuiz(episodeId, type);
  useEffect(() => {
    if (type === StartQuizSessionDtoType.EPISODE && data) {
      startQuizMutation.mutateAsync();
    }
  }, [data, type]);

  const quizSessionId =
    (data as DailyQuizResponseDto)?.session?.id ??
    startQuizMutation.data?.id ??
    0;
  const answerQuizMutation = useAnswerQuiz(quizSessionId);
  const completeQuizMutation = useCompleteQuiz(quizSessionId);
  return {
    quizzes: (data as DailyQuizResponseDto)?.quizzes
      ? (data as DailyQuizResponseDto).quizzes
      : (data as QuizDto[]),
    isLoading,
    answerQuiz: answerQuizMutation.mutateAsync,
    completeQuiz: completeQuizMutation.mutateAsync,
  };
}

export function useStartQuiz(episodeId: number, type: StartQuizSessionDtoType) {
  return useMutation({
    mutationFn: async () => {
      const response = await quizStartSession({
        type,
        episodeId,
      });
      return response;
    },
  });
}

type AnswerQuizData = {
  quizId: number;
  payload: SubmitQuizAnswerDtoPayload;
  isCorrect: boolean;
};

export function useAnswerQuiz(quizSessionId: number) {
  return useMutation({
    mutationFn: async (data: AnswerQuizData) => {
      if (!quizSessionId) {
        throw new Error('Quiz session ID is required');
      }
      const response = await quizSubmitAnswer(quizSessionId, data);
      return response;
    },
  });
}

export function useCompleteQuiz(quizSessionId: number) {
  return useMutation({
    mutationFn: async () => {
      if (!quizSessionId) {
        throw new Error('Quiz session ID is required');
      }
      const response = await quizCompleteSession(quizSessionId);
      return response;
    },
  });
}

// export function useSubmitDailyQuiz() {
//   return useMutation({
//     mutationFn: async (data: SubmitDailyQuizDto) => {
//       const response = await quizSubmitDailyQuiz(data);
//       return response;
//     },
//   });
// }
