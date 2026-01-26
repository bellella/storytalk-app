import React, { useState, useRef } from "react";
import { FlatList, KeyboardAvoidingView, Platform, View } from "react-native";
import { useRouter } from "expo-router";
import {
  ChevronLeft,
  Phone,
  Video,
  Plus,
  Smile,
  Send,
  Check,
  CheckCheck,
} from "lucide-react-native";

// Gluestack UI Components
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import {
  Avatar,
  AvatarImage,
  AvatarFallbackText,
} from "@/components/ui/avatar";
import { Input, InputField, InputSlot, InputIcon } from "@/components/ui/input";
import { Heading } from "@/components/ui/heading";
import { Pressable } from "@/components/ui/pressable";
import { Icon } from "@/components/ui/icon";
import { AppContainer } from "@/components/app/app-container";

// Types
interface Message {
  id: string;
  text: string;
  timestamp: string;
  sender: "me" | "other";
  status?: "sent" | "delivered" | "read";
}

// Mock Data
const MOCK_MESSAGES: Message[] = [
  {
    id: "1",
    text: "Hey! How are you doing?",
    timestamp: "10:30 AM",
    sender: "other",
    status: "read",
  },
  {
    id: "2",
    text: "I'm doing great, thanks! How about you?",
    timestamp: "10:32 AM",
    sender: "me",
    status: "read",
  },
  {
    id: "3",
    text: "I'm good too! Did you finish the project?",
    timestamp: "10:33 AM",
    sender: "other",
    status: "read",
  },
  {
    id: "4",
    text: "Almost done! Just need to fix a few bugs. Should be ready by tomorrow.",
    timestamp: "10:35 AM",
    sender: "me",
    status: "read",
  },
  {
    id: "5",
    text: "Awesome! Let me know if you need any help.",
    timestamp: "10:36 AM",
    sender: "other",
    status: "delivered",
  },
];

const MOCK_USER = {
  id: "1",
  name: "Sarah Johnson",
  avatar: "https://i.pravatar.cc/150?img=1",
  online: true,
};

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [inputText, setInputText] = useState("");
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);

  const handleSend = () => {
    if (inputText.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: inputText,
        timestamp: new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        }),
        sender: "me",
        status: "sent",
      };
      setMessages([...messages, newMessage]);
      setInputText("");

      // Auto scroll to bottom
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isMe = item.sender === "me";

    return (
      <Box className={`px-4 mb-3 ${isMe ? "items-end" : "items-start"}`}>
        <HStack
          className={`max-w-[80%] gap-2 ${
            isMe ? "flex-row-reverse" : "flex-row"
          }`}
        >
          {!isMe && (
            <Avatar size="xs" className="mt-1">
              <AvatarImage source={{ uri: MOCK_USER.avatar }} />
              <AvatarFallbackText>{MOCK_USER.name}</AvatarFallbackText>
            </Avatar>
          )}

          <VStack className={`gap-1 ${isMe ? "items-end" : "items-start"}`}>
            <Box
              className={`px-4 py-2.5 rounded-2xl ${
                isMe
                  ? "bg-primary-500 rounded-tr-sm"
                  : "bg-background-50 dark:bg-background-800 rounded-tl-sm"
              }`}
            >
              <Text
                size="md"
                className={isMe ? "text-typography-0" : "text-typography-900"}
              >
                {item.text}
              </Text>
            </Box>

            <HStack className="gap-1 items-center px-1">
              <Text size="xs" className="text-typography-400 font-medium">
                {item.timestamp}
              </Text>
              {isMe && item.status && (
                <Icon
                  as={item.status === "read" ? CheckCheck : Check}
                  size="xs"
                  className={
                    item.status === "read"
                      ? "text-primary-500"
                      : "text-typography-400"
                  }
                />
              )}
            </HStack>
          </VStack>
        </HStack>
      </Box>
    );
  };

  return (
    <AppContainer showBackButton>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={0}
      >
        {/* Header */}
        <Box className="px-4 pt-12 pb-3 border-b border-outline-100 dark:border-outline-800 bg-transparent">
          <HStack className="items-center justify-between">
            <HStack className="items-center gap-3 flex-1">
              <Pressable
                onPress={() => router.back()}
                className="p-1 -ml-2 active:opacity-60"
              >
                <Icon
                  as={ChevronLeft}
                  size="xl"
                  className="text-typography-900"
                />
              </Pressable>

              <Avatar size="sm">
                <AvatarImage source={{ uri: MOCK_USER.avatar }} />
                <AvatarFallbackText>{MOCK_USER.name}</AvatarFallbackText>
              </Avatar>

              <VStack>
                <Heading
                  size="sm"
                  className="font-semibold text-typography-900"
                >
                  {MOCK_USER.name}
                </Heading>
                {MOCK_USER.online && (
                  <Text size="xs" className="text-success-500 font-medium">
                    Online
                  </Text>
                )}
              </VStack>
            </HStack>

            <HStack className="gap-1">
              <Pressable className="p-2 rounded-full active:bg-background-50 dark:active:bg-background-800">
                <Icon as={Phone} size="md" className="text-primary-500" />
              </Pressable>
              <Pressable className="p-2 rounded-full active:bg-background-50 dark:active:bg-background-800">
                <Icon as={Video} size="md" className="text-primary-500" />
              </Pressable>
            </HStack>
          </HStack>
        </Box>

        {/* Messages List */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 16 }}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: false })
          }
        />

        {/* Input Area */}
        <Box className="px-4 py-3 border-t border-outline-100 dark:border-outline-800 bg-transparent">
          <HStack className="items-center gap-2">
            <Pressable className="p-2 rounded-full active:bg-background-50 dark:active:bg-background-800">
              <Icon as={Plus} size="md" className="text-primary-500" />
            </Pressable>

            <Input
              variant="rounded"
              size="md"
              className="flex-1 bg-background-50 dark:bg-background-900 border-0 focus:border-primary-500"
            >
              <InputField
                placeholder="Type a message..."
                value={inputText}
                onChangeText={setInputText}
                onSubmitEditing={handleSend}
                returnKeyType="send"
                className="text-typography-900 placeholder:text-typography-400"
              />
              <InputSlot className="pr-3">
                <Pressable>
                  <Icon as={Smile} size="md" className="text-typography-400" />
                </Pressable>
              </InputSlot>
            </Input>

            <Pressable
              onPress={handleSend}
              disabled={!inputText.trim()}
              className={`w-10 h-10 items-center justify-center rounded-full ${
                inputText.trim()
                  ? "bg-primary-500 active:bg-primary-600"
                  : "bg-background-100 dark:bg-background-800"
              }`}
            >
              <Icon
                as={Send}
                size="sm"
                className={
                  inputText.trim() ? "text-typography-0" : "text-typography-400"
                }
              />
            </Pressable>
          </HStack>
        </Box>
      </KeyboardAvoidingView>
    </AppContainer>
  );
}
