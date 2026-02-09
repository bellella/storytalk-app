import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { episodeGetQuizzes } from '@/lib/api/generated/episode/episode';
import {
  StartQuizSessionDtoType,
  SubmitQuizAnswerDtoPayload,
} from '@/lib/api/generated/model';
import {
  quizCompleteSession,
  quizStartSession,
  quizSubmitAnswer,
} from '@/lib/api/generated/quiz/quiz';

export function useQuiz(episodeId: number, type: StartQuizSessionDtoType) {
  const { data, isLoading } = useQuery({
    queryKey: ['quiz', episodeId],
    queryFn: async () => {
      const response = await episodeGetQuizzes(episodeId);
      return response;
    },
  });
  const startQuizMutation = useStartQuiz(episodeId, type);
  useEffect(() => {
    if (data) {
      startQuizMutation.mutateAsync();
    }
  }, [data]);
  const quizSessionId = startQuizMutation.data?.id ?? 0;
  const answerQuizMutation = useAnswerQuiz(quizSessionId);
  const completeQuizMutation = useCompleteQuiz(quizSessionId);
  return {
    quizzes: data ?? [],
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
