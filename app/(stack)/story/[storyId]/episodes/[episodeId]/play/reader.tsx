import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { AppContainer } from '@/components/app/app-container';
import { Image } from '@/components/ui/image';
import { useEpisode } from '@/lib/hooks/useEpisodes';

export default function StoryReaderScreen() {
  const { storyId, episodeId } = useLocalSearchParams();
  const router = useRouter();
  const { data: episode, isLoading } = useEpisode(episodeId as string);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [eventIndex, setEventIndex] = useState(0);
  const [popup, setPopup] = useState<any | null>(null);
  const currentScene = episode?.scenes?.[sceneIndex];
  const currentEvent = currentScene?.dialogues?.[eventIndex];
  const totalEvents = currentScene?.dialogues?.length ?? 1;
  const progress = (eventIndex / totalEvents) * 100;

  useEffect(() => {
    if (currentEvent?.type === 'image') {
      setPopup(currentEvent);
    }
  }, [currentEvent]);

  const handleNext = () => {
    if (popup) {
      setPopup(null);
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
  };

  // const activeChar = useMemo(() => {
  //   if (!currentEvent?.characterId) return null;
  //   return episode.characters.find((c) => c.id === currentEvent.characterId);
  // }, [currentEvent, episode]);

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
    <AppContainer showBackButton disableScroll>
      <Pressable onPress={handleNext} className="h-full select-none">
        <View
          className="flex-1 bg-cover"
          style={{ backgroundImage: `url(${currentScene?.bgImageUrl})` }}
        >
          {/* Header */}
          <View className="bg-background pb-5">
            <View className="flex-row items-center justify-between px-5 pb-3 pt-3">
              <Text className="text-xs font-extrabold uppercase tracking-widest text-[#8E97FD]">
                {episode?.title}
              </Text>

              <View className="rounded-full bg-[#F1F3FF] px-3 py-1">
                <Text className="text-xs font-bold text-[#6D6F7B]">
                  Scene {sceneIndex + 1}/{episode?.scenes.length}
                </Text>
              </View>
            </View>

            {/* Progress */}
            <View className="mx-5 h-1.5 overflow-hidden rounded-full bg-[#ECECF4]">
              <View
                className="h-full rounded-full bg-[#8E97FD]"
                style={{ width: `${progress}%` }}
              />
            </View>
          </View>

          {/* Main Content */}
          <View className="flex-1 justify-end pb-8">
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
                  <Text className="mt-3 text-center text-xs font-bold uppercase text-[#8E97FD]">
                    Tap to continue
                  </Text>
                </View>
              </Pressable>
            )}

            {/* Character Image */}
            {currentEvent?.imageUrl && currentEvent?.type === 'dialogue' && (
              <View className="items-center">
                <Image
                  source={{ uri: currentEvent.imageUrl }}
                  className="h-[62vh] w-[58vh]"
                  resizeMode="contain"
                />
              </View>
            )}

            {/* Dialogue */}
            {currentEvent?.type === 'dialogue' && (
              <View className="mx-4 rounded-[28px] bg-white px-6 py-5 shadow-lg shadow-black/5">
                <Text className="mb-1 text-xs font-extrabold uppercase tracking-widest text-[#8E97FD]">
                  {currentEvent.characterName}
                </Text>
                <Text className="text-lg leading-relaxed text-[#3F414E]">
                  {currentEvent.englishText}
                </Text>

                <View className="mt-3 items-end">
                  <Text className="text-xs font-bold text-[#C5C7D6]">
                    Tap ▶
                  </Text>
                </View>
              </View>
            )}

            {/* Narration */}
            {currentEvent?.type === 'narration' && (
              <View className="mx-6 my-auto rounded-full bg-black/30 px-6 py-6 shadow-lg">
                <Text className="text-center text-lg italic leading-relaxed text-white">
                  {currentEvent.englishText}
                </Text>
              </View>
            )}
          </View>
        </View>
      </Pressable>
    </AppContainer>
  );
}
