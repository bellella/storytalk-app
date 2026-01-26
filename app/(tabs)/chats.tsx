import React, { useState } from "react";
import { FlatList } from "react-native";
import { useRouter } from "expo-router";
import {
  Search,
  SquarePen,
  MessageSquareOff,
  CheckCheck,
} from "lucide-react-native";

// Gluestack UI Components (Modular Imports)
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import {
  Avatar,
  AvatarImage,
  AvatarFallbackText,
} from "@/components/ui/avatar";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Pressable } from "@/components/ui/pressable";
import { Icon } from "@/components/ui/icon";
import { AppContainer } from "@/components/app/app-container";

// Types
interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  online: boolean;
  isRead?: boolean;
}

// Mock Data
const MOCK_CHATS: Chat[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    avatar: "https://i.pravatar.cc/150?img=1",
    lastMessage: "Hey! Are we still on for lunch?",
    timestamp: "2m",
    unread: 3,
    online: true,
  },
  {
    id: "2",
    name: "Mike Chen",
    avatar: "https://i.pravatar.cc/150?img=13",
    lastMessage: "Sent the design files. Let me know.",
    timestamp: "10:42 AM",
    unread: 0,
    online: true,
    isRead: true,
  },
  {
    id: "3",
    name: "Emma Wilson",
    avatar: "https://i.pravatar.cc/150?img=5",
    lastMessage: "Can you review the PR?",
    timestamp: "Yesterday",
    unread: 1,
    online: false,
  },
  {
    id: "4",
    name: "Alex Rodriguez",
    avatar: "https://i.pravatar.cc/150?img=12",
    lastMessage: "Sounds great! See you then.",
    timestamp: "Mon",
    unread: 0,
    online: false,
    isRead: true,
  },
  {
    id: "5",
    name: "Jessica Lee",
    avatar: "https://i.pravatar.cc/150?img=9",
    lastMessage: "Thanks for the help!",
    timestamp: "Sun",
    unread: 0,
    online: true,
    isRead: true,
  },
];

export default function ChatsScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const filteredChats = MOCK_CHATS.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChatPress = (chat: Chat) => {
    router.push(`/chat/${chat.id}` as any);
  };

  const renderChatItem = ({ item }: { item: Chat }) => (
    <Pressable
      onPress={() => handleChatPress(item)}
      // 기본 bg 제거, 터치 시(active) 피드백만 유지
      className="active:bg-background-50 dark:active:bg-background-900"
    >
      <Box className="px-5 py-3.5 border-b border-outline-100 dark:border-outline-800">
        <HStack className="gap-4 items-center">
          {/* Avatar Area */}
          <Box className="relative">
            <Avatar size="md" className="bg-primary-500">
              <AvatarFallbackText className="text-white">
                {item.name}
              </AvatarFallbackText>
              <AvatarImage
                source={{ uri: item.avatar }}
                alt={`${item.name}'s avatar`}
              />
            </Avatar>
            {item.online && (
              <Box className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-success-500 border-2 border-white dark:border-black rounded-full" />
            )}
          </Box>

          {/* Content Area */}
          <VStack className="flex-1 gap-1">
            <HStack className="justify-between items-center">
              <Heading size="sm" className="text-typography-900 font-semibold">
                {item.name}
              </Heading>
              <Text size="xs" className="text-typography-500 font-medium">
                {item.timestamp}
              </Text>
            </HStack>

            <HStack className="justify-between items-center gap-2">
              <Text
                numberOfLines={1}
                size="sm"
                className={`flex-1 ${
                  item.unread > 0
                    ? "text-typography-900 font-semibold"
                    : "text-typography-500"
                }`}
              >
                {item.lastMessage}
              </Text>

              {/* Unread Badge or Read Status */}
              {item.unread > 0 ? (
                <Box className="bg-primary-500 px-2 py-0.5 rounded-full min-w-[20px] items-center justify-center">
                  <Text size="2xs" className="text-white font-bold">
                    {item.unread}
                  </Text>
                </Box>
              ) : item.isRead ? (
                <Icon as={CheckCheck} size="xs" className="text-primary-500" />
              ) : null}
            </HStack>
          </VStack>
        </HStack>
      </Box>
    </Pressable>
  );

  return (
    <AppContainer showHeaderSearch showHeaderLogo>
      {/* Header Section */}
      <Box className="pt-10 pb-2 px-5 border-b border-outline-100 dark:border-outline-900">
        <HStack className="justify-between items-center mb-4">
          <Heading size="3xl" className="text-typography-900 font-bold">
            Chats
          </Heading>
          <Pressable className="p-2 bg-background-50 dark:bg-background-800 rounded-full active:opacity-70">
            <Icon as={SquarePen} size="md" className="text-primary-500" />
          </Pressable>
        </HStack>

        {/* Search Bar */}
        <Input
          variant="outline"
          size="md"
          className="rounded-full border-outline-100 bg-background-50 dark:bg-background-900 dark:border-outline-800 focus:border-primary-500"
        >
          <InputSlot className="pl-4">
            <InputIcon as={Search} className="text-typography-400" />
          </InputSlot>
          <InputField
            placeholder="Search messages..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="text-typography-900 placeholder:text-typography-400"
          />
        </Input>
      </Box>

      {/* Chat List */}
      <FlatList
        data={filteredChats}
        renderItem={renderChatItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Box className="flex-1 items-center justify-center py-32 opacity-50">
            <Box className="p-6 bg-background-50 dark:bg-background-900 rounded-full mb-4">
              <Icon
                as={MessageSquareOff}
                size="xl"
                className="text-typography-400"
              />
            </Box>
            <Text className="text-typography-500 text-center font-medium">
              No chats found
            </Text>
          </Box>
        }
      />
    </AppContainer>
  );
}
