import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  ImageBackground,
  Pressable,
  Text,
  View,
} from 'react-native';
import { HeadingText } from '@/components/play/HeadingText';
import { NarrationText } from '@/components/play/NarrationText';
import { ReaderHeader } from '@/components/play/ReaderHeader';
import { DialogueText } from '@/components/story/DialogueText';
import { Image } from '@/components/ui/image';
import { useEpisodePlay } from '@/lib/hooks/episodes/useEpisodePlay';

export default function StoryPlayScreen() {
  const { storyId, episodeId } = useLocalSearchParams();
  const router = useRouter();
  const {
    episode,
    episodeLoading,
    initialSceneIndex,
    isReady,
    isCompleted,
    updateEpisodeProgress,
  } = useEpisodePlay(Number(episodeId));
  const [sceneIndex, setSceneIndex] = useState(0);
  const [eventIndex, setEventIndex] = useState(0);
  const [popup, setPopup] = useState<any | null>(null);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [alwaysShowTranslation, setAlwaysShowTranslation] = useState(true);
  const [initialized, setInitialized] = useState(false);

  const currentScene = episode?.scenes?.[sceneIndex];
  const currentEvent = currentScene?.dialogues?.[eventIndex];
  const totalEvents = currentScene?.dialogues?.length ?? 1;
  const progress = (eventIndex / totalEvents) * 100;

  // isReady가 되면 initialSceneIndex로 한 번만 세팅
  useEffect(() => {
    if (!isReady || initialized) return;
    setSceneIndex(initialSceneIndex);
    setEventIndex(0);
    setInitialized(true);
  }, [isReady, initialized, initialSceneIndex]);

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

  const completeCurrentScene = useCallback(async () => {
    // 다음씬을 lastSceneId로 설정
    const nextIndex = sceneIndex + 1;
    const nextScene = episode?.scenes?.[nextIndex];
    const result = await updateEpisodeProgress(nextScene?.id ?? 0);
    if (result.success) {
      setSceneIndex(nextIndex);
      setEventIndex(0);
    }
  }, [updateEpisodeProgress, sceneIndex, episode?.scenes]);

  const completeCurrentEpisode = useCallback(async () => {
    router.replace(`/story/${storyId}/episodes/${episodeId}/review`);
  }, [storyId, episodeId]);

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
        // 다음씬
        completeCurrentScene();
      } else {
        // 마지막씬 끝내기
        completeCurrentEpisode();
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

  if (!isReady || episodeLoading) {
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
        isCompleted={isCompleted}
        scenes={episode?.scenes}
        onSceneSelect={(idx) => {
          setSceneIndex(idx);
          setEventIndex(0);
        }}
      />
      <Pressable onPress={handleNext} className="flex-1 select-none">
        <ImageBackground
          className="flex-1"
          source={{ uri: currentScene?.bgImageUrl }}
          resizeMode="cover"
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
                        resizeMode="contain"
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
            {currentEvent?.type === 'dialogue' && (
              <View className="absolute bottom-0 left-0 right-0 items-center">
                <Image
                  source={
                    currentEvent.imageUrl
                      ? { uri: currentEvent.imageUrl }
                      : require('@/assets/images/man.png')
                  }
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

            {/* Heading */}
            {currentEvent?.type === 'heading' && (
              <HeadingText
                englishText={currentEvent.englishText}
                koreanText={currentEvent.koreanText}
                alwaysShowTranslation={alwaysShowTranslation}
              />
            )}

            {/* Narration */}
            {currentEvent?.type === 'narration' && (
              <NarrationText
                englishText={currentEvent.englishText}
                koreanText={currentEvent.koreanText}
                alwaysShowTranslation={alwaysShowTranslation}
                eventIndex={eventIndex}
              />
            )}
          </View>
        </ImageBackground>
      </Pressable>
    </>
  );
}
