import { useCallback, useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

type DialogueTextProps = {
  englishText: string;
  koreanText: string;
  /** Typing speed in milliseconds per character */
  typingSpeed?: number;
  /** Always show translation (controlled by parent) */
  alwaysShowTranslation?: boolean;
  /** Called when typing animation completes */
  onTypingComplete?: () => void;
  /** Called when user taps during typing to skip animation */
  onSkip?: () => void;
  /** Called when user taps after typing is already complete */
  onNext?: () => void;
  className?: string;
};

export function DialogueText({
  englishText,
  koreanText,
  typingSpeed = 30,
  alwaysShowTranslation = false,
  onTypingComplete,
  onSkip,
  onNext,
  className,
}: DialogueTextProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);

  // Reset when text changes
  useEffect(() => {
    setDisplayedText('');
    setIsTypingComplete(false);
    setShowTranslation(false);
  }, [englishText]);

  // Typing animation
  useEffect(() => {
    if (isTypingComplete) return;

    if (displayedText.length < englishText.length) {
      const timer = setTimeout(() => {
        setDisplayedText(englishText.slice(0, displayedText.length + 1));
      }, typingSpeed);

      return () => clearTimeout(timer);
    } else {
      setIsTypingComplete(true);
      onTypingComplete?.();
    }
  }, [
    displayedText,
    englishText,
    typingSpeed,
    isTypingComplete,
    onTypingComplete,
  ]);

  // Skip typing animation
  const handlePress = useCallback(() => {
    if (isTypingComplete) {
      onNext?.();
    } else {
      setDisplayedText(englishText);
      setIsTypingComplete(true);
      onTypingComplete?.();
      onSkip?.();
    }
  }, [isTypingComplete, englishText, onTypingComplete, onSkip, onNext]);

  const toggleTranslation = useCallback(() => {
    setShowTranslation((prev) => !prev);
  }, []);

  const shouldShowTranslation = alwaysShowTranslation || showTranslation;

  return (
    <View className={`flex-1 ${className}`}>
      {/* English Text - use relative positioning to maintain fixed height */}
      <Pressable onPress={handlePress} className="flex-1">
        <View className="flex-1">
          {/* Invisible full text to reserve space */}
          <Text className="text-lg leading-relaxed text-transparent">
            {englishText}
          </Text>
          {/* Visible typed text overlaid on top */}
          <Text
            className="absolute inset-0 text-lg leading-relaxed text-[#3F414E]"
            numberOfLines={undefined}
          >
            {displayedText}
          </Text>
          {/* Korean translation inline */}
          {shouldShowTranslation && isTypingComplete && (
            <Text
              className="text-sm leading-relaxed text-[#6D6F7B]"
              numberOfLines={2}
            >
              {koreanText}
            </Text>
          )}
        </View>
        {/* Translation row - icon + translation on same line */}
        <Text className="self-end pb-3 text-xs text-[#6D6F7B]">
          {isTypingComplete ? 'Tap ▶' : 'Tap to skip'}
        </Text>
      </Pressable>
    </View>
  );
}
