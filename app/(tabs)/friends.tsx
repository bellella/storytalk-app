import React, { useState } from "react";
import { SectionList } from "react-native";
import { useRouter } from "expo-router";
import {
  Search,
  UserPlus,
  MoreHorizontal,
  Users,
  User,
} from "lucide-react-native";

// Gluestack UI Components (Modular Imports)
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import {
  Avatar,
  AvatarImage,
  AvatarFallbackText,
} from "@/components/ui/avatar";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Heading } from "@/components/ui/heading";
import { Pressable } from "@/components/ui/pressable";
import { Button, ButtonText } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { AppContainer } from "@/components/app/app-container";

// Types
interface Friend {
  id: string;
  name: string;
  avatar: string;
  username: string;
  online: boolean;
  mutualFriends?: number;
}

interface FriendSection {
  title: string;
  data: Friend[];
}

// Mock Data
const MOCK_ONLINE_FRIENDS: Friend[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    username: "@sarahj",
    avatar: "https://i.pravatar.cc/150?img=1",
    online: true,
  },
  {
    id: "2",
    name: "Mike Chen",
    username: "@mikechen",
    avatar: "https://i.pravatar.cc/150?img=13",
    online: true,
  },
  {
    id: "5",
    name: "Jessica Lee",
    username: "@jesslee",
    avatar: "https://i.pravatar.cc/150?img=9",
    online: true,
  },
];

const MOCK_ALL_FRIENDS: Friend[] = [
  {
    id: "3",
    name: "Emma Wilson",
    username: "@emmaw",
    avatar: "https://i.pravatar.cc/150?img=5",
    online: false,
  },
  {
    id: "4",
    name: "Alex Rodriguez",
    username: "@alexr",
    avatar: "https://i.pravatar.cc/150?img=12",
    online: false,
  },
  {
    id: "6",
    name: "David Kim",
    username: "@dkim",
    avatar: "https://i.pravatar.cc/150?img=14",
    online: false,
  },
  {
    id: "7",
    name: "Lisa Anderson",
    username: "@lisaa",
    avatar: "https://i.pravatar.cc/150?img=10",
    online: false,
  },
];

const MOCK_SUGGESTIONS: Friend[] = [
  {
    id: "8",
    name: "Tom Brown",
    username: "@tombrown",
    avatar: "https://i.pravatar.cc/150?img=15",
    online: false,
    mutualFriends: 5,
  },
  {
    id: "9",
    name: "Sophie Taylor",
    username: "@sophiet",
    avatar: "https://i.pravatar.cc/150?img=16",
    online: true,
    mutualFriends: 3,
  },
];

export default function FriendsScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const sections: FriendSection[] = [
    { title: "Online Now", data: MOCK_ONLINE_FRIENDS },
    {
      title: "All Friends",
      data: [...MOCK_ONLINE_FRIENDS, ...MOCK_ALL_FRIENDS],
    },
    { title: "Suggestions", data: MOCK_SUGGESTIONS },
  ];

  const filteredSections = sections
    .map((section) => ({
      ...section,
      data: section.data.filter(
        (friend) =>
          friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          friend.username.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((section) => section.data.length > 0);

  const renderFriendItem = ({
    item,
    section,
  }: {
    item: Friend;
    section: FriendSection;
  }) => {
    const isSuggestion = section.title === "Suggestions";

    return (
      <Pressable onPress={() => router.push(`/profile/${item.id}` as any)}>
        <Box className="px-5 py-3 active:bg-background-50 dark:active:bg-background-900">
          <HStack className="items-center gap-3">
            {/* Avatar */}
            <Box className="relative">
              <Avatar size="md" className="bg-primary-500">
                <AvatarFallbackText className="text-white">
                  {item.name}
                </AvatarFallbackText>
                <AvatarImage source={{ uri: item.avatar }} alt={item.name} />
              </Avatar>
              {item.online && (
                <Box className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-success-500 border-2 border-background-0 dark:border-background-950 rounded-full" />
              )}
            </Box>

            {/* Info */}
            <VStack className="flex-1 gap-0.5">
              <Heading size="sm" className="font-semibold text-typography-900">
                {item.name}
              </Heading>
              <Text size="sm" className="text-typography-500">
                {item.username}
                {isSuggestion && item.mutualFriends && (
                  <Text size="sm" className="text-typography-400">
                    {" "}
                    • {item.mutualFriends} mutual
                  </Text>
                )}
              </Text>
            </VStack>

            {/* Action */}
            {isSuggestion ? (
              <Button
                size="xs"
                variant="solid"
                action="primary"
                className="bg-primary-500 rounded-full px-4"
              >
                <ButtonText className="text-white font-medium text-xs">
                  Add
                </ButtonText>
              </Button>
            ) : (
              <Pressable className="p-2 rounded-full active:bg-background-100 dark:active:bg-background-800">
                <Icon
                  as={MoreHorizontal}
                  size="md"
                  className="text-typography-400"
                />
              </Pressable>
            )}
          </HStack>
        </Box>
      </Pressable>
    );
  };

  const renderSectionHeader = ({ section }: { section: FriendSection }) => (
    <Box className="px-5 py-2 bg-background-50 dark:bg-background-900 border-y border-outline-50 dark:border-outline-900">
      <Text
        size="xs"
        className="font-bold text-typography-500 uppercase tracking-wider"
      >
        {section.title}{" "}
        <Text size="xs" className="text-typography-400 font-medium">
          ({section.data.length})
        </Text>
      </Text>
    </Box>
  );

  return (
    <AppContainer showHeaderLogo>
      {/* Header Section */}
      <Box className="pt-10 pb-2 px-5 bg-background-300 dark:bg-background-950 border-b border-outline-100 dark:border-outline-900">
        <HStack className="items-center justify-between mb-4">
          <Heading size="3xl" className="font-bold text-typography-900">
            Friends
          </Heading>
          <Pressable className="p-2 bg-background-50 dark:bg-background-800 rounded-full active:opacity-70">
            <Icon as={UserPlus} size="md" className="text-primary-500" />
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
            placeholder="Search friends..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="text-typography-900 placeholder:text-typography-400"
          />
        </Input>
      </Box>

      {/* Friends List */}
      <SectionList
        sections={filteredSections}
        renderItem={renderFriendItem}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={true}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <Box className="flex-1 items-center justify-center py-32 opacity-50">
            <Box className="p-6 bg-background-50 dark:bg-background-900 rounded-full mb-4">
              <Icon as={Users} size="xl" className="text-typography-400" />
            </Box>
            <Text className="text-typography-500 text-center font-medium">
              No friends found
            </Text>
          </Box>
        }
      />
    </AppContainer>
  );
}
