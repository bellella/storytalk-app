import { ArrowLeft, Send, SmilePlus } from 'lucide-react-native';
import { useState } from 'react';
import { FlatList, TextInput } from 'react-native';
import { AppContainer } from '@/components/app/app-container';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';

const STICKERS = ['🎤', '💜', '😂', '🔥', '🥹', '✨', '🐰', '🩵'];

export default function ChatScreen() {
  const [messages, setMessages] = useState([
    { id: 1, text: '오늘 연습 어땠어?', sender: 'other' },
    { id: 2, text: '긴장됐는데 생각보다 괜찮았어 🥹', sender: 'me' },
    { id: 3, text: '오… 그럼 합격각?', sender: 'other' },
  ]);
  const [input, setInput] = useState('');
  const [showStickers, setShowStickers] = useState(false);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { id: Date.now(), text, sender: 'me' }]);
    setInput('');
    setShowStickers(false);
  };

  return (
    <AppContainer showBackButton disableScroll>
      <View className="h-full">
        {/* Header */}
        <View className="flex-row items-center gap-4 border-b border-[#F1F1F1] px-6 py-4">
          <View className="flex-1 flex-row items-center gap-3">
            <View className="h-10 w-10 items-center justify-center rounded-2xl bg-[#8E97FD] shadow-lg shadow-[#8E97FD]/30">
              <Text className="text-base">🎤</Text>
            </View>
            <View>
              <Text className="font-bold leading-tight text-[#3F414E]">
                Riley
              </Text>
              <Text className="text-xs font-medium text-[#A1A4B2]">Online</Text>
            </View>
          </View>
        </View>

        {/* Messages */}
        <FlatList
          data={messages}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 24 }}
          ItemSeparatorComponent={() => <View className="h-3" />}
          renderItem={({ item }) => {
            const isMe = item.sender === 'me';
            return (
              <View
                className={`flex-row ${isMe ? 'justify-end' : 'justify-start'}`}
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
                    {item.text}
                  </Text>
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
                onPress={() => sendMessage(s)}
                className="w-1/5 items-center"
              >
                <Text className="text-2xl">{s}</Text>
              </Pressable>
            ))}
          </View>
        )}

        {/* Input Bar */}
        <View className="flex-row items-center gap-3 border-t border-[#F1F1F1] px-5 py-4">
          <Pressable onPress={() => setShowStickers((v) => !v)}>
            <SmilePlus size={22} color="#8E97FD" />
          </Pressable>

          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="메시지를 입력하세요..."
            placeholderTextColor="#A1A4B2"
            className="flex-1 rounded-full bg-[#F5F5F9] px-4 py-2 text-sm font-medium text-[#3F414E]"
          />

          <Pressable onPress={() => sendMessage(input)}>
            <Send size={22} color="#8E97FD" />
          </Pressable>
        </View>
      </View>
    </AppContainer>
  );
}
