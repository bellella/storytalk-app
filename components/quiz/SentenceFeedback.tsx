import { Check, X } from 'lucide-react-native';
import { View } from 'react-native';
import { HStack } from '../ui/hstack';
import { Text } from '../ui/text';

type SentenceFeedbackProps = {
  isCorrect: boolean;
  questionEnglish?: string;
  explanation?: string;
};

export function SentenceFeedback({
  isCorrect,
  questionEnglish,
  explanation,
}: SentenceFeedbackProps) {
  return (
    <View
      className={`rounded-2xl px-5 py-4 ${
        isCorrect ? 'bg-[#E8F5E9]' : 'bg-[#FFF3F0]'
      }`}
    >
      <HStack className="items-center gap-2">
        <View
          className={`h-7 w-7 items-center justify-center rounded-full ${
            isCorrect ? 'bg-[#4CAF50]' : 'bg-[#EF5350]'
          }`}
        >
          {isCorrect ? (
            <Check size={16} color="#fff" />
          ) : (
            <X size={16} color="#fff" />
          )}
        </View>
        <Text
          className={`text-base font-bold ${
            isCorrect ? 'text-[#2E7D32]' : 'text-[#C62828]'
          }`}
        >
          {isCorrect ? '정답이에요!' : '아쉬워요'}
        </Text>
      </HStack>

      {!!questionEnglish && (
        <Text
          className={`mt-2 text-sm font-semibold ${
            isCorrect ? 'text-[#2E7D32]' : 'text-[#C62828]'
          }`}
        >
          {questionEnglish}
        </Text>
      )}

      {!!explanation && (
        <Text className="mt-1 text-xs leading-relaxed text-[#6D6F7B]">
          {explanation}
        </Text>
      )}
    </View>
  );
}
