import * as Speech from 'expo-speech';
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from 'expo-speech-recognition';
import { Mic, MicOff, Volume2 } from 'lucide-react-native';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Animated, Easing, Pressable } from 'react-native';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { SpeakRepeatDataDto } from '@/lib/api/generated/model';
import type { QuizHandle } from './types';

type SpeakRepeatQuizProps = {
  data: SpeakRepeatDataDto;
  onAnswer: (isCorrect: boolean, payload: Record<string, unknown>) => void;
  onCanSubmitChange?: (canSubmit: boolean) => void;
};

export const SpeakRepeatQuiz = forwardRef<QuizHandle, SpeakRepeatQuizProps>(
  ({ data, onAnswer, onCanSubmitChange }, ref) => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [isAnswered, setIsAnswered] = useState(false);
    const [matchedIds, setMatchedIds] = useState<Set<string>>(new Set());

    const pulseAnim = useRef(new Animated.Value(1)).current;
    const requiredTokens = data.check.required;

    const sentenceWords = useMemo(
      () => data.tts.text.split(/\s+/),
      [data.tts.text]
    );

    const updateMatches = useCallback(
      (spokenText: string) => {
        const spoken = spokenText.toLowerCase();
        const next = new Set<string>();
        for (const token of requiredTokens) {
          if (spoken.includes(token.t.toLowerCase())) {
            next.add(token.id);
          }
        }
        setMatchedIds(next);
      },
      [requiredTokens]
    );

    const allMatched = matchedIds.size >= requiredTokens.length;

    // 마이크 맥박 애니메이션
    useEffect(() => {
      if (!isListening) {
        pulseAnim.setValue(1);
        return;
      }
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.25,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );
      loop.start();
      return () => loop.stop();
    }, [isListening, pulseAnim]);

    useSpeechRecognitionEvent('start', () => setIsListening(true));
    useSpeechRecognitionEvent('end', () => setIsListening(false));
    useSpeechRecognitionEvent('error', () => setIsListening(false));

    useSpeechRecognitionEvent('result', (event) => {
      const text = event.results[0]?.transcript ?? '';
      setTranscript(text);
      updateMatches(text);
      onCanSubmitChange?.(!!text);
    });

    const playTts = () => {
      Speech.speak(data.tts.text, {
        language: data.tts.locale,
        rate: data.tts.rate,
        pitch: data.tts.pitch,
      });
    };

    useEffect(() => {
      if (data.tts.autoPlay) playTts();
    }, []);

    const toggleListening = async () => {
      if (isAnswered) return;
      if (isListening) {
        ExpoSpeechRecognitionModule.stop();
        return;
      }
      const { granted } =
        await ExpoSpeechRecognitionModule.requestPermissionsAsync();
      if (!granted) return;

      setTranscript('');
      setMatchedIds(new Set());
      onCanSubmitChange?.(false);

      ExpoSpeechRecognitionModule.start({
        lang: data.tts.locale || 'en-US',
        interimResults: true,
        contextualStrings: requiredTokens.map((t) => t.t),
      });
    };

    const handleSubmit = () => {
      if (isAnswered) return;
      const correct = allMatched;
      setIsAnswered(true);
      onAnswer(correct, { transcript, matchedCount: matchedIds.size });
    };

    useImperativeHandle(ref, () => ({ submit: handleSubmit }));

    const isWordMatched = (word: string) => {
      const clean = word.toLowerCase().replace(/[.,!?;:'"]/g, '');
      return requiredTokens.some(
        (token) => matchedIds.has(token.id) && token.t.toLowerCase() === clean
      );
    };

    return (
      <VStack className="mb-8 gap-4 rounded-2xl">
        {/* 문장 카드 + TTS */}
        <Box className="min-h-[180px] items-center justify-center rounded-xl bg-white p-6">
          <Pressable
            onPress={playTts}
            className="mb-5 h-14 w-14 items-center justify-center rounded-full bg-[#8E97FD]"
          >
            <Volume2 size={24} color="#fff" />
          </Pressable>

          <HStack className="flex-row flex-wrap justify-center gap-x-1.5 gap-y-1">
            {sentenceWords.map((word, idx) => {
              const matched = isWordMatched(word);
              return (
                <Text
                  key={`${word}-${idx}`}
                  className={`text-xl font-bold ${
                    matched ? 'text-[#8E97FD]' : 'text-[#3F414E]'
                  }`}
                  style={
                    matched
                      ? {
                          textDecorationLine: 'underline',
                          textDecorationColor: '#8E97FD',
                        }
                      : undefined
                  }
                >
                  {word}
                </Text>
              );
            })}
          </HStack>
        </Box>

        {/* 실시간 transcript */}
        <Box className="min-h-[60px] rounded-xl bg-[#F5F5F9] px-5 py-4">
          <Text
            className={`text-center text-sm ${
              transcript ? 'font-medium text-[#3F414E]' : 'text-[#A1A4B2]'
            }`}
          >
            {transcript || '마이크 버튼을 눌러 따라 말해보세요'}
          </Text>
        </Box>

        {/* 마이크 버튼 */}
        <Box className="items-center py-4">
          <Pressable onPress={toggleListening} disabled={isAnswered}>
            <Animated.View
              style={[
                {
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: isListening ? '#EF4444' : '#8E97FD',
                  opacity: isAnswered ? 0.4 : 1,
                },
                isListening ? { transform: [{ scale: pulseAnim }] } : undefined,
              ]}
            >
              {isListening ? (
                <MicOff size={32} color="#fff" />
              ) : (
                <Mic size={32} color="#fff" />
              )}
            </Animated.View>
          </Pressable>
          <Text className="mt-3 text-xs font-medium text-[#A1A4B2]">
            {isListening ? '듣고 있어요...' : '탭해서 말하기'}
          </Text>
        </Box>

        {/* 매칭 진행률 */}
        <HStack className="flex-row flex-wrap justify-center gap-2">
          {requiredTokens.map((token) => (
            <Box
              key={token.id}
              className={`rounded-full px-3 py-1 ${
                matchedIds.has(token.id) ? 'bg-[#8E97FD]' : 'bg-[#F5F5F9]'
              }`}
            >
              <Text
                className={`text-xs font-bold ${
                  matchedIds.has(token.id) ? 'text-white' : 'text-[#A1A4B2]'
                }`}
              >
                {token.t}
              </Text>
            </Box>
          ))}
        </HStack>
      </VStack>
    );
  }
);
