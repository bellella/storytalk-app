import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import { ArrowRightIcon, Send, SmilePlus } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { io, Socket } from 'socket.io-client';
import { AppContainer } from '@/components/app/app-container';
import { CharacterAvatar } from '@/components/chat/CharacterAvatar';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import {
  chatGetMessages,
  chatMarkAsRead,
  chatSendMessage,
  type ChatGetMessagesResult,
} from '@/lib/api/generated/chat/chat';
import { SendMessageDtoType } from '@/lib/api/generated/model';
import type { ChatMessageDto } from '@/lib/api/generated/model/chatMessageDto';
import { SendMessageDtoOptionsItem } from '@/lib/api/generated/model/sendMessageDtoOptionsItem';
import { cn } from '@/lib/utils/classnames';

const STICKERS = ['🎤', '💜', '😂', '🔥', '🥹', '✨', '🐰', '🩵'];

const APP_HEADER_HEIGHT = 50;

export default function ChatScreen() {
  const queryClient = useQueryClient();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    id: string;
    chatId?: string;
    name?: string;
  }>();

  const characterId = Number(params.id);
  const chatId = params.chatId ? Number(params.chatId) : undefined;

  const { data, isLoading } = useQuery({
    queryKey: ['chatMessages', chatId],
    queryFn: () => chatGetMessages(chatId!, { limit: 50 }),
    enabled: !!chatId,
  });

  const messages = (data as ChatGetMessagesResult | undefined)?.items ?? [];

  const [input, setInput] = useState('');
  const [showStickers, setShowStickers] = useState(false);
  const [needTranslation, setNeedTranslation] = useState(false);
  const [needGrammar, setNeedGrammar] = useState(false);

  const listRef = useRef<FlatList<ChatMessageDto> | null>(null);

  const buildOptions = () => {
    const opts: SendMessageDtoOptionsItem[] = [];
    if (needTranslation) opts.push(SendMessageDtoOptionsItem.NEED_TRANSLATION);
    if (needGrammar)
      opts.push(SendMessageDtoOptionsItem.NEED_GRAMMAR_CORRECTION);
    return opts.length > 0 ? opts : undefined;
  };

  const sendMessageMutation = useMutation({
    mutationFn: ({
      content,
      options,
    }: {
      content: string;
      options?: SendMessageDtoOptionsItem[];
    }) =>
      chatSendMessage(characterId, {
        content,
        type: SendMessageDtoType.TEXT,
        ...(options ? { options } : {}),
      }),
    // 낙관적 업데이트: 유저 메시지를 바로 리스트에 추가
    onMutate: async ({
      content,
    }: {
      content: string;
      options?: SendMessageDtoOptionsItem[];
    }) => {
      if (!chatId) return;

      await queryClient.cancelQueries({
        queryKey: ['chatMessages', chatId],
      });

      const previous = queryClient.getQueryData<
        ChatGetMessagesResult | undefined
      >(['chatMessages', chatId]);

      const tempId = -Date.now();
      const optimisticMessage: ChatMessageDto = {
        id: tempId,
        type: 'text',
        content,
        isFromUser: true,
        createdAt: new Date().toISOString(),
        payload: undefined,
      };

      queryClient.setQueryData<ChatGetMessagesResult | undefined>(
        ['chatMessages', chatId],
        (old) =>
          old
            ? { ...old, items: [...old.items, optimisticMessage] }
            : { items: [optimisticMessage] }
      );

      return { previous, tempId };
    },
    // 에러 나면 이전 상태로 롤백
    onError: (_error, _variables, context) => {
      if (!chatId || !context?.previous) return;
      queryClient.setQueryData(['chatMessages', chatId], context.previous);
    },
    // 성공하면 낙관적 메시지를 실제 user/ai 메시지로 교체
    onSuccess: (res, _variables, context) => {
      if (!chatId) return;

      queryClient.setQueryData<ChatGetMessagesResult | undefined>(
        ['chatMessages', chatId],
        (old) => {
          if (!old) {
            return { items: [res.userMessage, ...res.aiMessages] };
          }

          const withoutOptimistic = context?.tempId
            ? old.items.filter((m) => m.id !== context.tempId)
            : old.items;

          return {
            ...old,
            items: [...withoutOptimistic, res.userMessage, ...res.aiMessages],
          };
        }
      );
    },
  });

  const handleSend = (text: string) => {
    if (!text.trim() || sendMessageMutation.isPending) return;
    sendMessageMutation.mutate({ content: text, options: buildOptions() });
    setInput('');
    setShowStickers(false);
  };

  const scrollToBottom = () => {
    listRef.current?.scrollToEnd({ animated: true });
  };

  useEffect(() => {
    if (!chatId) return;
    chatMarkAsRead(chatId).catch(() => {
      // 읽음 처리 실패는 UI에 영향을 주지 않으므로 무시
    });
  }, [chatId]);

  // socket.io 를 이용한 실시간 메시지 수신
  useEffect(() => {
    if (!chatId) return;

    const baseUrl = process.env.EXPO_PUBLIC_API_URL ?? '';
    // http(s) -> ws(s) 로 변환
    const socketUrl = baseUrl.replace(/^http/, 'ws');

    const socket: Socket = io(socketUrl, {
      path: '/socket.io',
      transports: ['websocket'],
      withCredentials: true,
      auth: {
        // 서버에서 필요하다면 chatId, characterId 를 함께 보낼 수 있음
        chatId,
        characterId,
      },
    });

    // 특정 채팅방(room)에 join
    socket.emit('join', { chatId });

    socket.on('message', (incoming) => {
      queryClient.setQueryData<ChatGetMessagesResult | undefined>(
        ['chatMessages', chatId],
        (old) =>
          old
            ? { ...old, items: [...old.items, incoming] }
            : { items: [incoming] }
      );
      scrollToBottom();
    });

    socket.on('connect_error', () => {
      // 소켓 오류는 UI 에 큰 영향 없으므로 조용히 무시
    });

    return () => {
      socket.emit('leave', { chatId });
      socket.disconnect();
    };
  }, [chatId, characterId, queryClient]);

  return (
    <AppContainer showBackButton disableScroll>
      <SafeAreaView className="flex-1" edges={['bottom']}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={insets.top + APP_HEADER_HEIGHT}
        >
          <View className="h-full">
            {/* Header */}
            <View className="flex-row items-center gap-4 border-b border-[#F1F1F1] px-6 py-4">
              <View className="flex-1 flex-row items-center gap-3">
                <View className="h-10 w-10 items-center justify-center rounded-2xl bg-[#8E97FD] shadow-lg shadow-[#8E97FD]/30">
                  <CharacterAvatar
                    name={params.name ?? '친구'}
                    avatarClassName="h-10 w-10 text-2xl"
                  />
                </View>
                <View>
                  <Text className="font-bold leading-tight text-[#3F414E]">
                    {params.name ?? '친구'}
                  </Text>
                  <Text className="text-xs font-medium text-[#A1A4B2]">
                    {isLoading
                      ? '메시지를 불러오는 중...'
                      : '오늘도 열심히 공부해요!'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Messages */}
            <FlatList
              ref={listRef}
              data={messages}
              keyExtractor={(item) => String(item.id)}
              contentContainerStyle={{
                paddingHorizontal: 20,
                paddingVertical: 24,
              }}
              ItemSeparatorComponent={() => <View className="h-3" />}
              keyboardShouldPersistTaps="handled"
              onContentSizeChange={scrollToBottom}
              onLayout={scrollToBottom}
              renderItem={({ item }) => {
                const isMe = item.isFromUser;
                return (
                  <View
                    className={`flex-row ${
                      isMe ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <View
                      className={`max-w-[75%] rounded-[22px] px-4 py-3
                    ${
                      isMe
                        ? 'rounded-br-md bg-[#8E97FD]'
                        : 'rounded-bl-md bg-[#F5F5F9]'
                    }`}
                    >
                      <Text
                        className={`text-sm font-semibold ${
                          isMe ? 'text-white' : 'text-[#3F414E]'
                        }`}
                      >
                        {item.content}
                      </Text>
                      {item.payload && item.payload.translated && (
                        <Text
                          className={cn(
                            'text-xs',
                            isMe ? 'text-white' : 'text-[#A1A4B2]'
                          )}
                        >
                          {item.payload.translated}
                        </Text>
                      )}
                      {item.payload && item.payload.corrected && (
                        <HStack>
                          <ArrowRightIcon
                            size={14}
                            color={isMe ? 'white' : '#A1A4B2'}
                          />
                          <Text
                            className={cn(
                              'text-xs',
                              isMe ? 'text-white' : 'text-[#A1A4B2]'
                            )}
                          >
                            {item.payload.corrected}
                          </Text>
                        </HStack>
                      )}
                    </View>
                  </View>
                );
              }}
            />

            {/* Sticker Panel */}
            {showStickers && (
              <View className="flex-row flex-wrap gap-y-3 border-t border-[#ECECF2] bg-[#F5F5F9] px-5 py-4">
                {STICKERS.map((s) => (
                  <Pressable
                    key={s}
                    onPress={() => handleSend(s)}
                    className="w-1/5 items-center"
                  >
                    <Text className="text-2xl">{s}</Text>
                  </Pressable>
                ))}
              </View>
            )}

            {/* Options + Input Bar */}
            <View className="border-t border-[#F1F1F1]">
              {/* Option Chips */}
              <View className="flex-row gap-2 px-5 pt-3">
                <Pressable
                  onPress={() => setNeedTranslation((v) => !v)}
                  className={`rounded-full border px-3 py-1 ${
                    needTranslation
                      ? 'border-[#8E97FD] bg-[#8E97FD]'
                      : 'border-[#D1D1D6] bg-white'
                  }`}
                >
                  <Text
                    className={`text-xs font-semibold ${
                      needTranslation ? 'text-white' : 'text-[#6B6B80]'
                    }`}
                  >
                    번역 요청
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setNeedGrammar((v) => !v)}
                  className={`rounded-full border px-3 py-1 ${
                    needGrammar
                      ? 'border-[#8E97FD] bg-[#8E97FD]'
                      : 'border-[#D1D1D6] bg-white'
                  }`}
                >
                  <Text
                    className={`text-xs font-semibold ${
                      needGrammar ? 'text-white' : 'text-[#6B6B80]'
                    }`}
                  >
                    문법 수정
                  </Text>
                </Pressable>
              </View>

              {/* Input Row */}
              <View className="flex-row items-center gap-3 px-5 py-3">
                <Pressable onPress={() => setShowStickers((v) => !v)}>
                  <SmilePlus size={22} color="#8E97FD" />
                </Pressable>

                <TextInput
                  value={input}
                  onChangeText={setInput}
                  onSubmitEditing={() => handleSend(input)}
                  placeholder="메시지를 입력하세요..."
                  placeholderTextColor="#A1A4B2"
                  className="flex-1 rounded-full bg-[#F5F5F9] px-4 py-2 text-sm font-medium text-[#3F414E]"
                />

                <Pressable onPress={() => handleSend(input)}>
                  <Send size={22} color="#8E97FD" />
                </Pressable>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </AppContainer>
  );
}
