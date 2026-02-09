import { useLocalSearchParams, useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import { useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { AppContainer } from '@/components/app/app-container';
import { ModalHeader } from '@/components/app/ModalHeader';
import { SentenceBuildQuiz } from '@/components/quiz/SentenceBuildQuiz';
import { SentenceClozeQuiz } from '@/components/quiz/SentenceClozeQuiz';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import {
  QuizDtoType,
  StartQuizSessionDtoType,
} from '@/lib/api/generated/model';
import { useQuiz } from '@/lib/hooks/quiz/useQuiz';

export default function DailyQuizScreen() {
  const router = useRouter();
  const { quizzes, isLoading, answerQuiz, completeQuiz } = useQuiz(
    StartQuizSessionDtoType.DAILY_QUIZ
  );
  s;

  const [quizIdx, setQuizIdx] = useState(0);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState(false);

  if (isLoading) {
    return (
      <AppContainer showBackButton>
        <View className="flex-1 items-center justify-center bg-white">
          <ActivityIndicator size="large" color="#8E97FD" />
          <Text className="mt-4 text-sm text-[#6D6F7B]">
            데일리 퀴즈 불러오는 중...
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
            데일리 퀴즈가 없어요
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
  const progress = ((quizIdx + 1) / quizzes.length) * 100;

  const canProceed = isCorrect !== null;

  // submit answer button handler
  const handleQuizAnswer = (
    correct: boolean,
    payload: Record<string, unknown>
  ) => {
    setIsCorrect(correct);
    answerQuiz({
      quizId: currentQuiz.id,
      payload,
      isCorrect: correct,
    });
  };

  // next quiz button handler
  const handleNextQuiz = () => {
    if (quizIdx === quizzes.length - 1) {
      finishQuiz();
    } else {
      setQuizIdx((p) => p + 1);
      setIsCorrect(null);
    }
  };

  const finishQuiz = () => {
    completeQuiz();
    router.replace('/quiz/daily/result');
  };

  const renderQuizBody = () => {
    if (currentQuiz.type === QuizDtoType.SENTENCE_BUILD) {
      return (
        <SentenceBuildQuiz
          key={currentQuiz.id}
          data={currentQuiz.data}
          onAnswer={handleQuizAnswer}
        />
      );
    }
    if (currentQuiz.type === QuizDtoType.SENTENCE_CLOZE_BUILD) {
      return (
        <SentenceClozeQuiz
          key={currentQuiz.id}
          data={currentQuiz.data}
          onAnswer={handleQuizAnswer}
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
    <>
      <LottieView autoPlay source={require('@/assets/lotties/confetti.json')} />
      <ModalHeader onClose={() => router.back()} />
      <View className="mx-auto max-w-[600px] flex-1 p-4">
        <VStack className="flex-1">
          {/* Question */}
          <Box className="mb-6">
            <Box className="mb-3 self-start rounded-full bg-[#8E97FD]/10 px-3 py-1">
              <Text className="text-[10px] font-black uppercase tracking-widest text-[#8E97FD]">
                {currentQuiz.type.replace('_', ' ')}
              </Text>
            </Box>

            <Text className="text-xl font-bold leading-tight text-[#3F414E]">
              {currentQuiz.questionKorean}
            </Text>
          </Box>
          {/* Quiz Body */}
          {renderQuizBody()}
          {/* Bottom Actions */}
          <Box className="mt-auto gap-3">
            {/* Next button */}
            <Button
              onPress={handleNextQuiz}
              isDisabled={!canProceed}
              className={`w-full rounded-[22px] ${
                canProceed ? 'bg-[#8E97FD]' : 'bg-gray-200'
              }`}
            >
              <ButtonText className="font-bold text-white">
                {quizIdx === quizzes.length - 1
                  ? 'Finish Learning'
                  : 'Next Question'}
              </ButtonText>
            </Button>
          </Box>
        </VStack>
      </View>
    </>
  );
}
