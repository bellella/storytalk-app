import * as Speech from 'expo-speech';
import { useCallback, useState } from 'react';

type VoiceGender = 'male' | 'female';

type UseSpeechOptions = {
  language?: string;
  rate?: number;
  pitch?: number;
};

export function useSpeech(options: UseSpeechOptions = {}) {
  const { language = 'en-US', rate = 0.9, pitch = 1.0 } = options;

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentTextId, setCurrentTextId] = useState<string | null>(null);

  const speak = useCallback(
    async (text: string, textId?: string, gender: VoiceGender = 'female') => {
      //const voices = await Speech.getAvailableVoicesAsync();
      //console.log(voices);
      //const voice = gender === 'male' ? 'Jester' : 'bubbles';
      // Stop any current speech
      await Speech.stop();

      setIsSpeaking(true);
      setCurrentTextId(textId ?? null);

      Speech.speak(text, {
        language,
        rate,
        pitch,
        // Gender-based voice selection can be added later
        // For now, we use default voice
        onDone: () => {
          setIsSpeaking(false);
          setCurrentTextId(null);
        },
        onStopped: () => {
          setIsSpeaking(false);
          setCurrentTextId(null);
        },
        onError: () => {
          setIsSpeaking(false);
          setCurrentTextId(null);
        },
      });
    },
    [language, rate, pitch]
  );

  const stop = useCallback(async () => {
    await Speech.stop();
    setIsSpeaking(false);
    setCurrentTextId(null);
  }, []);

  const isSpeakingText = useCallback(
    (textId: string) => isSpeaking && currentTextId === textId,
    [isSpeaking, currentTextId]
  );

  return {
    speak,
    stop,
    isSpeaking,
    currentTextId,
    isSpeakingText,
  };
}
