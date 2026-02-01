import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { AppContainer } from '@/components/app/app-container';
import { Image } from '@/components/ui/image';
import { useEpisode } from '@/lib/hooks/useEpisodes';

type ChatMessage = {
  id: string;
  characterName?: string;
  characterId?: number;
  englishText: string;
  koreanText: string;
  imageUrl?: string;
  showTranslation?: boolean;
  type: string;
};

type BubblePosition = 'single' | 'first' | 'middle' | 'last';

const TranslateIcon = ({ size = 16, color = '#8E97FD' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12.87 15.07l-2.54-2.51.03-.03A17.52 17.52 0 0014.07 6H17V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"
      fill={color}
    />
  </Svg>
);

export default function StoryChatScreen() {
  const { storyId, episodeId } = useLocalSearchParams();
  const router = useRouter();
  const { data: episode, isLoading } = useEpisode(episodeId as string);

  const [sceneIndex, setSceneIndex] = useState(0);
  const [eventIndex, setEventIndex] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [alwaysShowTranslation, setAlwaysShowTranslation] = useState(false);

  const scrollRef = useRef<ScrollView>(null);

  const currentScene = episode?.scenes?.[sceneIndex];
  const currentDialogue = currentScene?.dialogues?.[eventIndex];
  const totalDialogues = currentScene?.dialogues?.length ?? 1;
  const progress = (eventIndex / totalDialogues) * 100;

  useEffect(() => {
    setMessages([]);
    setEventIndex(0);
  }, [sceneIndex]);

  useEffect(() => {
    if (!currentDialogue) return;

    if (
      currentDialogue.type === 'dialogue' ||
      currentDialogue.type === 'narration'
    ) {
      const newMsg: ChatMessage = {
        id: `${sceneIndex}-${eventIndex}`,
        characterName: currentDialogue.characterName,
        characterId: currentDialogue.characterId,
        englishText: currentDialogue.englishText,
        koreanText: currentDialogue.koreanText,
        imageUrl: currentDialogue.imageUrl,
        type: currentDialogue.type,
      };

      setMessages((prev) => [...prev, newMsg]);

      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 50);
    }
  }, [currentDialogue, sceneIndex, eventIndex]);

  const handleNext = useCallback(() => {
    const nextEventIdx = eventIndex + 1;

    if (
      currentScene &&
      episode &&
      nextEventIdx >= currentScene.dialogues.length
    ) {
      if (sceneIndex + 1 < episode.scenes.length) {
        setSceneIndex(sceneIndex + 1);
      } else {
        router.replace(`/story/${storyId}/episodes/${episodeId}/review`);
      }
      return;
    }

    const nextDialogue = currentScene?.dialogues?.[nextEventIdx];
    if (nextDialogue?.type === 'scene_transition') {
      setSceneIndex(nextDialogue.order - 1);
      setEventIndex(0);
    } else {
      setEventIndex(nextEventIdx);
    }
  }, [eventIndex, currentScene, episode, sceneIndex, router, storyId, episodeId]);

  const toggleTranslation = useCallback((id: string) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, showTranslation: !m.showTranslation } : m
      )
    );
  }, []);

  const toggleAlwaysShowTranslation = useCallback(() => {
    setAlwaysShowTranslation((prev) => !prev);
  }, []);

  const getBubblePosition = (index: number): BubblePosition => {
    const current = messages[index];
    const prev = messages[index - 1];
    const next = messages[index + 1];

    if (current.type === 'narration') return 'single';

    const samePrev =
      prev?.characterName === current.characterName && prev?.type === 'dialogue';
    const sameNext =
      next?.characterName === current.characterName && next?.type === 'dialogue';

    if (!samePrev && !sameNext) return 'single';
    if (!samePrev && sameNext) return 'first';
    if (samePrev && sameNext) return 'middle';
    return 'last';
  };

  const getBubbleStyle = (position: BubblePosition, isRight: boolean) => {
    const base = 'px-4 py-3';

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
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator color="#8E97FD" />
      </View>
    );
  }

  // For demo: first character is "me" (right side)
  const myCharacterName = episode.scenes?.[0]?.dialogues?.[0]?.characterName;

  return (
    <AppContainer showBackButton disableScroll>
      <View className="flex-1 bg-[#F8F9FF]">
        {/* Header */}
        <View className="bg-white pb-5">
          <View className="flex-row items-center justify-between px-5 pb-3 pt-3">
            <Text className="text-xs font-extrabold uppercase tracking-widest text-[#8E97FD]">
              {episode?.title}
            </Text>

            <View className="flex-row items-center gap-3">
              {/* Always show translation toggle */}
              <Pressable
                onPress={toggleAlwaysShowTranslation}
                className={`rounded-full px-3 py-1 ${
                  alwaysShowTranslation ? 'bg-[#8E97FD]' : 'bg-[#F1F3FF]'
                }`}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text
                  className={`text-xs font-bold ${
                    alwaysShowTranslation ? 'text-white' : 'text-[#6D6F7B]'
                  }`}
                >
                  {alwaysShowTranslation ? '해석 ON' : '해석 OFF'}
                </Text>
              </Pressable>

              <View className="rounded-full bg-[#F1F3FF] px-3 py-1">
                <Text className="text-xs font-bold text-[#6D6F7B]">
                  Scene {sceneIndex + 1}/{episode?.scenes.length}
                </Text>
              </View>
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

        {/* Chat Area */}
        <ScrollView
          ref={scrollRef}
          className="flex-1 px-4 pt-4"
          contentContainerStyle={{ paddingBottom: 24 }}
        >
          {messages.map((msg, index) => {
            const isNarration = msg.type === 'narration';
            const isMe = msg.characterName === myCharacterName;
            const position = getBubblePosition(index);
            const showAvatar = position === 'single' || position === 'first';
            const showName = position === 'single' || position === 'first';
            const shouldShowTranslation =
              alwaysShowTranslation || msg.showTranslation;

            if (isNarration) {
              return (
                <Pressable
                  key={msg.id}
                  onPress={() => toggleTranslation(msg.id)}
                  className="my-3"
                >
                  <View className="mx-auto max-w-[85%] rounded-2xl bg-[#E8EAFF] px-4 py-3">
                    <Text className="text-center italic text-[#3F414E]">
                      {msg.englishText}
                    </Text>
                    {shouldShowTranslation && (
                      <Text className="mt-2 text-center text-sm text-[#6D6F7B]">
                        {msg.koreanText}
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
                } ${isMe ? 'flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <View className="w-9">
                  {showAvatar && msg.imageUrl && (
                    <View className="h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-[#E8EAFF]">
                      <Image
                        source={{ uri: msg.imageUrl }}
                        className="h-full w-full"
                        resizeMode="cover"
                      />
                    </View>
                  )}
                  {showAvatar && !msg.imageUrl && msg.characterName && (
                    <View className="h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-[#8E97FD]">
                      <Text className="text-sm font-bold text-white">
                        {msg.characterName[0]}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Bubble */}
                <View
                  className={`max-w-[75%] ${isMe ? 'items-end' : 'items-start'}`}
                >
                  {showName && msg.characterName && (
                    <Text
                      className={`mb-1 text-xs font-semibold text-[#8E97FD] ${isMe ? 'mr-1' : 'ml-1'}`}
                    >
                      {msg.characterName}
                    </Text>
                  )}
                  <Pressable onPress={() => toggleTranslation(msg.id)}>
                    <View
                      className={`${getBubbleStyle(position, isMe)} ${
                        isMe ? 'bg-[#8E97FD]' : 'bg-white'
                      } shadow-sm`}
                    >
                      <Text
                        className={`text-base leading-relaxed ${
                          isMe ? 'text-white' : 'text-[#3F414E]'
                        }`}
                      >
                        {msg.englishText}
                      </Text>
                      {shouldShowTranslation && (
                        <View className="mt-2 flex-row items-center gap-1.5 border-t border-black/10 pt-2">
                          <TranslateIcon
                            size={14}
                            color={isMe ? 'rgba(255,255,255,0.7)' : '#8E97FD'}
                          />
                          <Text
                            className={`flex-1 text-sm ${
                              isMe ? 'text-white/80' : 'text-[#6D6F7B]'
                            }`}
                          >
                            {msg.koreanText}
                          </Text>
                        </View>
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
          className="border-t border-[#ECECF4] bg-white py-4"
        >
          <Text className="text-center text-xs font-bold text-[#8E97FD]">
            Tap to continue ▶
          </Text>
        </Pressable>
      </View>
    </AppContainer>
  );
}
