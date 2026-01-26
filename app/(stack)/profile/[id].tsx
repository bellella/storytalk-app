import React, { useState } from "react";
import { ScrollView, Dimensions, View } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  ChevronLeft,
  MoreHorizontal,
  Calendar,
  Users,
  MapPin,
  MessageCircle,
  UserPlus,
  UserCheck,
  Image as ImageIcon,
} from "lucide-react-native";

// Custom App Container (CRITICAL)
import { AppContainer } from "@/components/app/app-container";

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
import { Heading } from "@/components/ui/heading";
import { Pressable } from "@/components/ui/pressable";
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import { Icon } from "@/components/ui/icon";
import { Image } from "@/components/ui/image";

// Types
interface UserProfile {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio: string;
  online: boolean;
  mutualFriends: number;
  isFriend: boolean;
  joinedDate: string;
  location: string;
  photos: string[];
}

interface InfoItem {
  icon: any;
  label: string;
  value: string;
}

// Mock Data
const MOCK_USER: UserProfile = {
  id: "1",
  name: "Sarah Johnson",
  username: "@sarahj",
  avatar: "https://i.pravatar.cc/150?img=1",
  bio: "Adventure seeker | Coffee enthusiast | Living my best life ✨",
  online: true,
  mutualFriends: 12,
  isFriend: false,
  joinedDate: "January 2023",
  location: "San Francisco, CA",
  photos: [
    "https://picsum.photos/400/400?random=1",
    "https://picsum.photos/400/400?random=2",
    "https://picsum.photos/400/400?random=3",
    "https://picsum.photos/400/400?random=4",
    "https://picsum.photos/400/400?random=5",
    "https://picsum.photos/400/400?random=6",
  ],
};

const { width } = Dimensions.get("window");

export default function UserProfileScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [isFriend, setIsFriend] = useState(MOCK_USER.isFriend);

  const infoItems: InfoItem[] = [
    { icon: Calendar, label: "Joined", value: MOCK_USER.joinedDate },
    {
      icon: Users,
      label: "Mutual Friends",
      value: `${MOCK_USER.mutualFriends} friends`,
    },
    { icon: MapPin, label: "Location", value: MOCK_USER.location },
  ];

  const handleMessage = () => {
    router.push(`/chat/${id}` as any);
  };

  const handleToggleFriend = () => {
    setIsFriend(!isFriend);
  };

  return (
    <AppContainer showBackButton>
      {/* Cover Photo */}
      <Box className="h-64 bg-primary-500 overflow-hidden relative">
        {/* Using a Gradient-like styling or Image here */}
        <Box className="absolute inset-0 bg-blue-500 opacity-80" />
        <Image
          source={{ uri: "https://picsum.photos/800/400?blur=2" }}
          alt="Cover Photo"
          className="w-full h-full opacity-60"
          resizeMode="cover"
        />
      </Box>

      {/* Profile Content */}
      <Box className="px-5 -mt-20 relative z-10">
        {/* Avatar & Status */}
        <HStack className="items-end justify-between mb-4">
          <Box className="relative">
            <Avatar
              size="2xl"
              className="border-4 border-background-0 dark:border-background-950 w-32 h-32 bg-background-200"
            >
              <AvatarImage source={{ uri: MOCK_USER.avatar }} />
            </Avatar>
            {MOCK_USER.online && (
              <Box className="absolute bottom-2 right-2 w-6 h-6 bg-success-500 border-4 border-background-0 dark:border-background-950 rounded-full" />
            )}
          </Box>
        </HStack>

        {/* Name & Bio */}
        <VStack className="gap-1 mb-6">
          <Heading size="2xl" className="font-bold text-typography-900">
            {MOCK_USER.name}
          </Heading>
          <Text className="text-primary-500 font-medium text-md mb-2">
            {MOCK_USER.username}
          </Text>
          <Text className="text-typography-600 dark:text-typography-300 leading-md">
            {MOCK_USER.bio}
          </Text>
        </VStack>

        {/* Action Buttons */}
        <HStack className="gap-3 mb-6">
          <Button
            size="md"
            variant={isFriend ? "outline" : "solid"}
            action={isFriend ? "secondary" : "primary"}
            className={`flex-1 rounded-xl ${
              isFriend ? "border-outline-300" : "bg-primary-500"
            }`}
            onPress={handleToggleFriend}
          >
            <ButtonIcon
              as={isFriend ? UserCheck : UserPlus}
              className={isFriend ? "text-typography-500" : "text-white"}
            />
            <ButtonText
              className={`ml-2 font-medium ${
                isFriend ? "text-typography-600" : "text-white"
              }`}
            >
              {isFriend ? "Friends" : "Add Friend"}
            </ButtonText>
          </Button>

          <Button
            size="md"
            className="flex-1 bg-background-100 dark:bg-background-800 rounded-xl active:bg-background-200"
            onPress={handleMessage}
          >
            <ButtonIcon
              as={MessageCircle}
              className="text-typography-900 dark:text-typography-100"
            />
            <ButtonText className="ml-2 font-medium text-typography-900 dark:text-typography-100">
              Message
            </ButtonText>
          </Button>
        </HStack>

        <Divider className="my-2 bg-outline-100 dark:bg-outline-900" />

        {/* Info Section */}
        <VStack className="py-4 gap-5">
          <Heading
            size="sm"
            className="font-bold text-typography-900 uppercase tracking-wider"
          >
            About
          </Heading>

          {infoItems.map((item) => (
            <HStack key={item.label} className="items-center gap-4">
              <Box className="w-10 h-10 items-center justify-center bg-background-50 dark:bg-background-800 rounded-full">
                <Icon
                  as={item.icon}
                  size="md"
                  className="text-typography-500"
                />
              </Box>
              <VStack className="flex-1 gap-0.5">
                <Text
                  size="xs"
                  className="text-typography-400 font-medium uppercase"
                >
                  {item.label}
                </Text>
                <Text className="text-base font-medium text-typography-900">
                  {item.value}
                </Text>
              </VStack>
            </HStack>
          ))}
        </VStack>

        <Divider className="my-4 bg-outline-100 dark:bg-outline-900" />

        {/* Photos Section */}
        <VStack className="gap-4">
          <HStack className="items-center justify-between">
            <Heading
              size="sm"
              className="font-bold text-typography-900 uppercase tracking-wider"
            >
              Photos
            </Heading>
            <Pressable className="active:opacity-70">
              <Text className="text-primary-500 font-semibold text-sm">
                See All
              </Text>
            </Pressable>
          </HStack>

          {/* Custom Grid Layout using Flex */}
          <Box className="flex-row flex-wrap gap-2">
            {MOCK_USER.photos.map((photo, index) => (
              <Pressable
                key={index}
                className="w-[31%] aspect-square rounded-xl overflow-hidden active:opacity-90 bg-background-100 dark:bg-background-800"
              >
                <Image
                  source={{ uri: photo }}
                  alt={`User photo ${index + 1}`}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </Pressable>
            ))}
          </Box>
        </VStack>
      </Box>
    </AppContainer>
  );
}
