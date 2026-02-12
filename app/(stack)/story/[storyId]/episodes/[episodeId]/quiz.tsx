import {
  RelativePathString,
  useLocalSearchParams,
  useRouter,
} from 'expo-router';
import { useRef, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { AppContainer } from '@/components/app/app-container';
import {
  LottieOverlay,
  LottieOverlayRef,
} from '@/components/app/LottieOverlay';
import { ModalContainer } from '@/components/app/modal-container';
import { QuizHeader } from '@/components/quiz/QuizHeader';
import { SentenceBuildQuiz } from '@/components/quiz/SentenceBuildQuiz';
import { SentenceClozeQuiz } from '@/components/quiz/SentenceClozeQuiz';
import { SentenceFeedback } from '@/components/quiz/SentenceFeedback';
import { SpeakRepeatQuiz } from '@/components/quiz/SpeakRepeatQuiz';
import type { QuizHandle } from '@/components/quiz/types';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import {
  QuizDtoType,
  SentenceBuildDataDto,
  SentenceClozeDataDto,
  SpeakRepeatDataDto,
  StartQuizSessionDtoType,
} from '@/lib/api/generated/model';
import { useCompleteEpisode } from '@/lib/hooks/episodes/useCompleteEpisode';
import { useQuiz } from '@/lib/hooks/quiz/useQuiz';
import { useSound } from '@/lib/hooks/useSound';
import { hapticLight } from '@/lib/utils/haptics';
import { EpisodeResult } from '@/types/result.type';

export default function EpisodeQuizScreen() {
  const router = useRouter();
  const { episodeId, storyId } = useLocalSearchParams();
  const completeEpisode = useCompleteEpisode(Number(episodeId));

  const { quizzes, isLoading, answerQuiz, completeQuiz } = useQuiz(
    StartQuizSessionDtoType.EPISODE,
    Number(episodeId)
  );

  const [quizIdx, setQuizIdx] = useState(0);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [canSubmit, setCanSubmit] = useState(false);
  const quizRef = useRef<QuizHandle>(null);
  const lottieRef = useRef<LottieOverlayRef>(null);
  const correctSound = useSound(require('@/assets/audio/correct.mp3'));

  const isAnswered = isCorrect !== null;

  if (isLoading) {
    return (
      <AppContainer showBackButton>
        <View className="flex-1 items-center justify-center bg-white">
          <ActivityIndicator size="large" color="#8E97FD" />
          <Text className="mt-4 text-sm text-[#6D6F7B]">
            퀴즈 불러오는 중...
          </Text>
        </View>
      </AppContainer>
    );
  }

  if (quizzes.length === 0) {
    return (
      <AppContainer showBackButton>
        <View className="flex-1 items-center justify-center bg-white px-8">
          <Text className="text-center text-lg font-bold text-[#3F414E]">
            이 에피소드에 퀴즈가 없어요
          </Text>
          <Text className="mt-2 text-center text-sm text-[#6D6F7B]">
            다른 화면으로 이동해 주세요.
          </Text>
          <Button
            onPress={() => router.back()}
            className="mt-6 w-full max-w-xs rounded-[22px] bg-[#8E97FD]"
          >
            <ButtonText className="font-bold text-white">뒤로 가기</ButtonText>
          </Button>
        </View>
      </AppContainer>
    );
  }

  const currentQuiz = quizzes[quizIdx];
  const isLast = quizIdx === quizzes.length - 1;

  const handleQuizAnswer = (
    correct: boolean,
    payload: Record<string, unknown>
  ) => {
    setIsCorrect(correct);
    if (correct) {
      hapticLight();
      lottieRef.current?.play();
      correctSound.play();
    }
    answerQuiz({
      quizId: currentQuiz.id,
      payload,
      isCorrect: correct,
    });
  };

  const handleNextQuiz = () => {
    if (isLast) {
      finishQuiz();
    } else {
      setQuizIdx((p) => p + 1);
      setIsCorrect(null);
      setCanSubmit(false);
    }
  };

  const handleSubmit = () => {
    quizRef.current?.submit();
  };

  const finishQuiz = async () => {
    const quizResult = await completeQuiz();
    const episodeResult = await completeEpisode();
    const resultObject: EpisodeResult = {
      quiz: quizResult,
      xp: episodeResult.xp,
      episode: episodeResult.episode,
      rewards: episodeResult.rewards,
    };
    router.replace({
      pathname:
        `/story/${storyId}/episodes/${episodeId}/result` as RelativePathString,
      params: {
        result: JSON.stringify(resultObject),
      },
    });
  };

  const renderQuizBody = () => {
    if (currentQuiz.type === QuizDtoType.SENTENCE_BUILD) {
      return (
        <SentenceBuildQuiz
          ref={quizRef}
          key={currentQuiz.id}
          data={currentQuiz.data as SentenceBuildDataDto}
          onAnswer={handleQuizAnswer}
          onCanSubmitChange={setCanSubmit}
        />
      );
    }
    if (currentQuiz.type === QuizDtoType.SENTENCE_CLOZE_BUILD) {
      return (
        <SentenceClozeQuiz
          ref={quizRef}
          key={currentQuiz.id}
          data={currentQuiz.data as SentenceClozeDataDto}
          onAnswer={handleQuizAnswer}
          onCanSubmitChange={setCanSubmit}
        />
      );
    }
    if (currentQuiz.type === QuizDtoType.SPEAK_REPEAT) {
      return (
        <SpeakRepeatQuiz
          ref={quizRef}
          key={currentQuiz.id}
          data={currentQuiz.data as SpeakRepeatDataDto}
          onAnswer={handleQuizAnswer}
          onCanSubmitChange={setCanSubmit}
        />
      );
    }
    return (
      <Box className="mb-8 rounded-2xl bg-yellow-50 p-4">
        <Text className="font-bold text-yellow-700">
          Unsupported quiz type: {currentQuiz.type}
        </Text>
      </Box>
    );
  };

  return (
    <ModalContainer>
      <LottieOverlay
        ref={lottieRef}
        source={require('@/assets/lotties/test1.json')}
      />
      <View className="w-full flex-1 pb-24">
        <QuizHeader
          type={currentQuiz.type}
          question={currentQuiz.questionKorean ?? ''}
          description={currentQuiz.description ?? ''}
        />
        {renderQuizBody()}
      </View>

      {/* 하단 고정: 피드백 + 버튼 */}
      <View className="absolute bottom-0 left-0 right-0 bg-white px-5 pb-8 pt-3">
        {isAnswered && (
          <SentenceFeedback
            isCorrect={isCorrect}
            questionEnglish={currentQuiz.questionEnglish}
            explanation={currentQuiz.description}
          />
        )}
        <Button
          onPress={isAnswered ? handleNextQuiz : handleSubmit}
          isDisabled={!isAnswered && !canSubmit}
          className={`mt-3 w-full rounded-xl ${
            isAnswered
              ? isCorrect
                ? 'bg-[#4CAF50]'
                : 'bg-[#EF5350]'
              : canSubmit
                ? 'bg-[#8E97FD]'
                : 'bg-gray-200'
          }`}
        >
          <ButtonText className="font-bold text-white">
            {isAnswered ? (isLast ? '학습 완료' : '다음 문제') : '제출하기'}
          </ButtonText>
        </Button>
      </View>
    </ModalContainer>
  );
}
