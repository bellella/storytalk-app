import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { Image } from '@/components/ui/image';
import { useEpisode } from '@/lib/hooks/useEpisodes';

type ChatMessage = {
  id: string;
  character?: string;
  text: string;
  translation?: string;
  showTranslation?: boolean;
  type: 'dialogue' | 'narration';
};

type BubblePosition = 'single' | 'first' | 'middle' | 'last';

export default function StoryChatScreen() {
  const { storyId, episodeId } = useLocalSearchParams();
  const router = useRouter();
  const { data: episode, isLoading } = useEpisode(episodeId as string);

  const [sceneIndex, setSceneIndex] = useState(0);
  const [eventIndex, setEventIndex] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const scrollRef = useRef<ScrollView>(null);

  const currentScene = episode?.scenes?.[sceneIndex];
  const currentEvent = currentScene?.events?.[eventIndex];

  const characters = episode?.characters ?? [];

  useEffect(() => {
    setMessages([]);
    setEventIndex(0);
  }, [sceneIndex]);

  useEffect(() => {
    if (!currentEvent) return;

    if (currentEvent.type === 'dialogue' || currentEvent.type === 'narration') {
      const newMsg: ChatMessage = {
        id: `${sceneIndex}-${eventIndex}`,
        character: currentEvent.character,
        text: currentEvent.text,
        translation: fakeTranslate(currentEvent.text),
        type: currentEvent.type,
      };

      setMessages((prev) => [...prev, newMsg]);

      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 50);
    }
  }, [currentEvent]);

  const handleNext = () => {
    const nextEventIdx = eventIndex + 1;

    if (nextEventIdx >= (currentScene?.events.length ?? 0)) {
      if (sceneIndex + 1 < episode.scenes.length) {
        setSceneIndex(sceneIndex + 1);
      } else {
        router.replace(`/story/${storyId}/episodes/${episodeId}/review`);
      }
      return;
    }

    const nextEvent = currentScene?.events?.[nextEventIdx];
    if (nextEvent?.type === 'scene_transition') {
      setSceneIndex(nextEvent.toSceneIndex - 1);
    } else {
      setEventIndex(nextEventIdx);
    }
  };

  const toggleTranslation = (id: string) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, showTranslation: !m.showTranslation } : m
      )
    );
  };

  const getBubblePosition = (index: number): BubblePosition => {
    const current = messages[index];
    const prev = messages[index - 1];
    const next = messages[index + 1];

    if (current.type === 'narration') return 'single';

    const samePrev = prev?.character === current.character && prev?.type === 'dialogue';
    const sameNext = next?.character === current.character && next?.type === 'dialogue';

    if (!samePrev && !sameNext) return 'single';
    if (!samePrev && sameNext) return 'first';
    if (samePrev && sameNext) return 'middle';
    return 'last';
  };

  const getBubbleStyle = (position: BubblePosition, isRight: boolean) => {
    const base = 'px-4 py-2';

    if (isRight) {
      switch (position) {
        case 'single':
          return `${base} rounded-2xl rounded-br-md`;
        case 'first':
          return `${base} rounded-2xl rounded-br-md`;
        case 'middle':
          return `${base} rounded-l-2xl rounded-r-md`;
        case 'last':
          return `${base} rounded-2xl rounded-tr-md`;
      }
    } else {
      switch (position) {
        case 'single':
          return `${base} rounded-2xl rounded-bl-md`;
        case 'first':
          return `${base} rounded-2xl rounded-bl-md`;
        case 'middle':
          return `${base} rounded-r-2xl rounded-l-md`;
        case 'last':
          return `${base} rounded-2xl rounded-tl-md`;
      }
    }
  };

  if (isLoading || !episode) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <ActivityIndicator color="white" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 pb-3 pt-14">
        <Text className="text-xs font-bold uppercase tracking-widest text-white/80">
          {episode.episodeTitle}
        </Text>
        <View className="rounded-md bg-black/40 px-2 py-1">
          <Text className="text-xs text-white/60">
            Sc {sceneIndex + 1}/{episode.scenes.length}
          </Text>
        </View>
      </View>

      {/* Chat Area */}
      <ScrollView
        ref={scrollRef}
        className="flex-1 px-4"
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {messages.map((msg, index) => {
          const char = characters.find((c) => c.id === msg.character);
          const isNarration = msg.type === 'narration';
          const isRiley = msg.character === 'riley';
          const position = getBubblePosition(index);
          const showAvatar = position === 'single' || position === 'first';
          const showName = position === 'single' || position === 'first';

          if (isNarration) {
            return (
              <Pressable
                key={msg.id}
                onPress={() => toggleTranslation(msg.id)}
                className="my-3"
              >
                <View className="mx-auto max-w-[85%] rounded-xl bg-white/10 px-4 py-3">
                  <Text className="text-center italic text-slate-300">
                    {msg.text}
                  </Text>
                  {msg.showTranslation && (
                    <Text className="mt-2 text-center text-sm text-slate-400">
                      {msg.translation}
                    </Text>
                  )}
                </View>
              </Pressable>
            );
          }

          return (
            <View
              key={msg.id}
              className={`flex-row items-end gap-2 ${
                position === 'single' || position === 'last' ? 'mb-3' : 'mb-1'
              } ${isRiley ? 'flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              <View className="w-9">
                {showAvatar && char && (
                  <View
                    className={`h-9 w-9 items-center justify-center overflow-hidden rounded-full ${char.color}`}
                  >
                    {char.image ? (
                      <Image
                        source={{ uri: char.image }}
                        className="h-full w-full"
                        resizeMode="cover"
                      />
                    ) : (
                      <Text className="text-sm font-bold text-white">
                        {char.name[0]}
                      </Text>
                    )}
                  </View>
                )}
              </View>

              {/* Bubble */}
              <View className={`max-w-[75%] ${isRiley ? 'items-end' : 'items-start'}`}>
                {showName && char && (
                  <Text className={`mb-1 text-xs font-medium text-slate-400 ${isRiley ? 'mr-1' : 'ml-1'}`}>
                    {char.name}
                  </Text>
                )}
                <Pressable onPress={() => toggleTranslation(msg.id)}>
                  <View
                    className={`${getBubbleStyle(position, isRiley)} ${
                      isRiley ? 'bg-pink-500' : 'bg-slate-700'
                    }`}
                  >
                    <Text className="text-base leading-relaxed text-white">
                      {msg.text}
                    </Text>
                    {msg.showTranslation && (
                      <Text className="mt-2 text-sm text-white/70">
                        {msg.translation}
                      </Text>
                    )}
                  </View>
                </Pressable>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Bottom Tap Area */}
      <Pressable
        onPress={handleNext}
        className="border-t border-white/10 bg-black py-4"
      >
        <Text className="text-center text-xs text-white/60">
          Tap to continue
        </Text>
      </Pressable>
    </View>
  );
}

function fakeTranslate(text: string) {
  return `👉 ${text} (Korean translation here)`;
}
