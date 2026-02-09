import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { DialogueText } from '@/components/story/DialogueText';
import { Image } from '@/components/ui/image';
import { useEpisode } from '@/lib/hooks/useEpisodes';
import { ReaderHeader } from './ReaderHeader';

export default function StoryReaderScreen() {
  const { storyId, episodeId } = useLocalSearchParams();
  const router = useRouter();
  const { data: episode, isLoading } = useEpisode(episodeId as string);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [eventIndex, setEventIndex] = useState(0);
  const [popup, setPopup] = useState<any | null>(null);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [alwaysShowTranslation, setAlwaysShowTranslation] = useState(true);

  const currentScene = episode?.scenes?.[sceneIndex];
  const currentEvent = currentScene?.dialogues?.[eventIndex];
  const totalEvents = currentScene?.dialogues?.length ?? 1;
  const progress = (eventIndex / totalEvents) * 100;

  useEffect(() => {
    if (currentEvent?.type === 'image') {
      setPopup(currentEvent);
    }
  }, [currentEvent]);

  // Reset typing state when event changes
  useEffect(() => {
    setIsTypingComplete(false);
  }, [eventIndex, sceneIndex]);

  const handleTypingComplete = useCallback(() => {
    setIsTypingComplete(true);
  }, []);

  const handleNext = useCallback(() => {
    if (popup) {
      setPopup(null);
      return;
    }

    // If typing is not complete, don't proceed (DialogueText handles skip internally)
    if (currentEvent?.type === 'dialogue' && !isTypingComplete) {
      return;
    }

    const nextEventIdx = eventIndex + 1;

    if (
      currentScene &&
      episode &&
      nextEventIdx >= currentScene?.dialogues.length
    ) {
      if (sceneIndex + 1 < episode.scenes.length) {
        setSceneIndex(sceneIndex + 1);
        setEventIndex(0);
      } else {
        router.replace(`/story/${storyId}/episodes/${episodeId}/review`);
      }
      return;
    }

    const nextEvent =
      currentScene?.dialogues?.[nextEventIdx] ?? currentScene?.dialogues[0]!;
    if (nextEvent.type === 'scene_transition') {
      setSceneIndex(nextEvent.order - 1);
      setEventIndex(0);
    } else {
      setEventIndex(nextEventIdx);
    }
  }, [
    popup,
    currentEvent?.type,
    isTypingComplete,
    eventIndex,
    currentScene,
    episode,
    sceneIndex,
    router,
    storyId,
    episodeId,
  ]);

  const toggleAlwaysShowTranslation = useCallback(() => {
    setAlwaysShowTranslation((prev) => !prev);
  }, []);

  const bgGradient = useMemo(() => {
    const bg = currentScene?.bgImageUrl ?? '';
    if (bg.includes('waiting')) return ['#1e3a8a', '#020617'];
    if (bg.includes('hallway')) return ['#020617', '#000'];
    if (bg.includes('bright')) return ['#60a5fa', '#67e8f9'];
    if (bg.includes('stage')) return ['#312e81', '#581c87'];
    return ['#0f172a', '#020617'];
  }, [currentScene]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <ActivityIndicator color="white" />
      </View>
    );
  }

  return (
    <>
      <ReaderHeader
        episodeTitle={episode?.title}
        sceneIndex={sceneIndex}
        totalScenes={episode?.scenes?.length ?? 0}
        progress={progress}
        alwaysShowTranslation={alwaysShowTranslation}
        onToggleTranslation={toggleAlwaysShowTranslation}
      />
      <Pressable onPress={handleNext} className="flex-1 select-none">
        <View
          className="flex-1 bg-cover"
          style={{ backgroundImage: `url(${currentScene?.bgImageUrl})` }}
        >
          {/* Main Content */}
          <View className="flex-1 justify-end">
            {/* Popup */}
            {popup && (
              <Pressable
                onPress={handleNext}
                className="absolute inset-0 z-50 items-center justify-center bg-black/40 px-6"
              >
                <View className="w-full max-w-sm rounded-3xl bg-white p-4 shadow-xl">
                  {popup.imageUrl && (
                    <View className="mb-3 h-44 items-center justify-center rounded-2xl bg-[#F5F6FA]">
                      <Image
                        source={{ uri: popup.imageUrl }}
                        className="h-full w-full"
                        resizeMode="cover"
                      />
                    </View>
                  )}
                  <Text className="text-center text-sm leading-relaxed text-[#3F414E]">
                    {popup.englishText}
                  </Text>
                  <Text className="text-center text-xs font-bold uppercase text-[#8E97FD]">
                    {popup.koreanText}
                  </Text>
                  <Text className="mt-3 text-center text-xs font-bold uppercase text-[#8E97FD]">
                    Tap to continue
                  </Text>
                </View>
              </Pressable>
            )}

            {/* Character Image */}
            {currentEvent?.imageUrl && currentEvent?.type === 'dialogue' && (
              <View className="absolute bottom-0 left-0 right-0 items-center">
                <Image
                  source={{ uri: currentEvent.imageUrl }}
                  className="h-[80vh] w-[60vh]"
                  resizeMode="cover"
                />
              </View>
            )}

            {/* Dialogue */}
            {currentEvent?.type === 'dialogue' && (
              <View className="mx-4 mb-32">
                {/* 말풍선 꼬리 (오른쪽 위) */}
                <View
                  className="absolute -top-3 right-24 z-10"
                  style={{
                    width: 0,
                    height: 0,
                    borderLeftWidth: 12,
                    borderRightWidth: 12,
                    borderBottomWidth: 14,
                    borderLeftColor: 'transparent',
                    borderRightColor: 'transparent',
                    borderBottomColor: '#ffffffe8',
                  }}
                />
                <View className="min-h-[25vh] rounded-[28px] bg-[#ffffffe8] px-6 py-5">
                  <Text className="mb-1 text-xs font-extrabold uppercase tracking-widest text-[#8E97FD]">
                    {currentEvent.characterName}
                  </Text>
                  <DialogueText
                    englishText={currentEvent.englishText}
                    koreanText={currentEvent.koreanText}
                    alwaysShowTranslation={alwaysShowTranslation}
                    onTypingComplete={handleTypingComplete}
                    onNext={handleNext}
                    typingSpeed={20}
                  />
                </View>
              </View>
            )}

            {/* Narration */}
            {currentEvent?.type === 'narration' && (
              <View className="mx-4 my-auto rounded-2xl bg-white p-4">
                {currentEvent.englishText
                  .split(/(?<=\.)\s+/)
                  .map((sentence, i) => (
                    <Animated.View
                      key={`${eventIndex}-${i}`}
                      entering={FadeInDown.delay(i * 400).duration(800)}
                    >
                      <Text className="text-center text-lg italic leading-relaxed">
                        {sentence}
                      </Text>
                    </Animated.View>
                  ))}
                {alwaysShowTranslation && (
                  <Animated.View
                    key={`${eventIndex}-kr`}
                    entering={FadeInDown.delay(
                      currentEvent.englishText.split(/(?<=\.)\s+/).length * 400
                    ).duration(500)}
                  >
                    <Text className="pt-6 text-center text-xs font-bold uppercase text-[#8E97FD]">
                      {currentEvent.koreanText}
                    </Text>
                  </Animated.View>
                )}
              </View>
            )}
          </View>
        </View>
      </Pressable>
    </>
  );
}
