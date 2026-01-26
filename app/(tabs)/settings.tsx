import React, { useState } from "react";
import { ScrollView, Alert, Switch as RNSwitch } from "react-native";
import {
  User,
  Camera,
  AtSign,
  Circle,
  CheckCheck,
  Ban,
  Bell,
  MessageSquare,
  Users,
  Moon,
  Palette,
  Image as ImageIcon,
  HardDrive,
  DownloadCloud,
  HelpCircle,
  AlertTriangle,
  Info,
  ChevronRight,
  LogOut,
} from "lucide-react-native";

// Custom App Container
import { AppContainer } from "@/components/app/app-container";

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
import { Heading } from "@/components/ui/heading";
import { Pressable } from "@/components/ui/pressable";
import { Switch } from "@/components/ui/switch";
import { Divider } from "@/components/ui/divider";
import { Icon } from "@/components/ui/icon";
import { Badge, BadgeText } from "@/components/ui/badge";

// Types
interface SettingItem {
  id: string;
  icon: any;
  label: string;
  value?: string;
  hasToggle?: boolean;
  toggleValue?: boolean;
  hasArrow?: boolean;
  hasBadge?: boolean;
  badgeText?: string;
  iconColor?: string;
}

interface SettingSection {
  title: string;
  items: SettingItem[];
}

const CURRENT_USER = {
  name: "Alex Morgan",
  username: "@alexmorgan",
  avatar: "https://i.pravatar.cc/150?img=33",
  email: "alex.morgan@example.com",
};

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [readReceipts, setReadReceipts] = useState(true);
  const [onlineStatus, setOnlineStatus] = useState(true);

  const settingSections: SettingSection[] = [
    {
      title: "Account",
      items: [
        {
          id: "edit-profile",
          icon: User,
          label: "Edit Profile",
          hasArrow: true,
        },
        {
          id: "change-avatar",
          icon: Camera,
          label: "Change Avatar",
          hasArrow: true,
        },
        {
          id: "username",
          icon: AtSign,
          label: "Username",
          value: CURRENT_USER.username,
          hasArrow: true,
        },
      ],
    },
    {
      title: "Privacy",
      items: [
        {
          id: "online-status",
          icon: Circle,
          label: "Show Online Status",
          hasToggle: true,
          toggleValue: onlineStatus,
          iconColor: "text-green-500",
        },
        {
          id: "read-receipts",
          icon: CheckCheck,
          label: "Read Receipts",
          hasToggle: true,
          toggleValue: readReceipts,
        },
        { id: "blocked", icon: Ban, label: "Blocked Users", hasArrow: true },
      ],
    },
    {
      title: "Notifications",
      items: [
        {
          id: "push-notifications",
          icon: Bell,
          label: "Push Notifications",
          hasToggle: true,
          toggleValue: notifications,
        },
        {
          id: "message-notifications",
          icon: MessageSquare,
          label: "Message Notifications",
          hasArrow: true,
        },
        {
          id: "group-notifications",
          icon: Users,
          label: "Group Notifications",
          hasArrow: true,
        },
      ],
    },
    {
      title: "Appearance",
      items: [
        {
          id: "dark-mode",
          icon: Moon,
          label: "Dark Mode",
          hasToggle: true,
          toggleValue: darkMode,
        },
        {
          id: "theme",
          icon: Palette,
          label: "Theme Color",
          value: "Blue",
          hasArrow: true,
        },
        {
          id: "chat-wallpaper",
          icon: ImageIcon,
          label: "Chat Wallpaper",
          hasArrow: true,
        },
      ],
    },
    {
      title: "Data & Storage",
      items: [
        {
          id: "storage",
          icon: HardDrive,
          label: "Storage Usage",
          value: "2.3 GB",
          hasArrow: true,
        },
        {
          id: "auto-download",
          icon: DownloadCloud,
          label: "Auto Download",
          hasArrow: true,
        },
      ],
    },
    {
      title: "Support",
      items: [
        { id: "help", icon: HelpCircle, label: "Help Center", hasArrow: true },
        {
          id: "report",
          icon: AlertTriangle,
          label: "Report a Problem",
          hasArrow: true,
        },
        {
          id: "about",
          icon: Info,
          label: "About",
          value: "v1.0.0",
          hasArrow: true,
        },
      ],
    },
  ];

  const handleToggle = (itemId: string, value: boolean) => {
    switch (itemId) {
      case "push-notifications":
        setNotifications(value);
        break;
      case "dark-mode":
        setDarkMode(value);
        break;
      case "read-receipts":
        setReadReceipts(value);
        break;
      case "online-status":
        setOnlineStatus(value);
        break;
    }
  };

  const handleItemPress = (item: SettingItem) => {
    if (!item.hasToggle) {
      Alert.alert(item.label, `Maps to ${item.label} screen`);
    }
  };

  const renderSettingItem = (
    item: SettingItem,
    index: number,
    total: number
  ) => (
    <Box key={item.id}>
      <Pressable
        onPress={() => handleItemPress(item)}
        disabled={item.hasToggle}
        className="active:bg-gray-50 dark:active:bg-gray-800"
      >
        <HStack className="px-5 py-4 items-center gap-4">
          <Box className="w-9 h-9 items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-800">
            <Icon
              as={item.icon}
              size="md"
              className={item.iconColor || "text-primary-500"}
            />
          </Box>

          <VStack className="flex-1 gap-0.5">
            <Text className="text-typography-900 font-medium text-base">
              {item.label}
            </Text>
            {item.value && !item.hasToggle && (
              <Text size="sm" className="text-typography-400">
                {item.value}
              </Text>
            )}
          </VStack>

          {item.hasToggle ? (
            <Switch
              value={item.toggleValue}
              onValueChange={(value) => handleToggle(item.id, value)}
              size="sm"
            />
          ) : (
            <HStack className="items-center gap-2">
              {item.value && (
                <Text size="sm" className="text-typography-500">
                  {item.value}
                </Text>
              )}
              {item.hasBadge && (
                <Badge
                  size="sm"
                  action="error"
                  variant="solid"
                  className="rounded-full px-2"
                >
                  <BadgeText className="text-white">{item.badgeText}</BadgeText>
                </Badge>
              )}
              {item.hasArrow && (
                <Icon
                  as={ChevronRight}
                  size="sm"
                  className="text-typography-400"
                />
              )}
            </HStack>
          )}
        </HStack>
      </Pressable>

      {index < total - 1 && (
        <Divider className="ml-16 bg-outline-100 dark:bg-outline-800" />
      )}
    </Box>
  );

  return (
    <AppContainer showHeaderLogo>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <Box className="pt-10 pb-8 px-5 border-b border-outline-100 dark:border-outline-900">
          <Heading size="3xl" className="font-bold text-typography-900 mb-6">
            Settings
          </Heading>

          <Pressable
            onPress={() =>
              handleItemPress({ id: "profile", icon: User, label: "Profile" })
            }
            className="p-4 rounded-2xl border border-outline-100 dark:border-outline-800 active:bg-gray-50 dark:active:bg-gray-900"
          >
            <HStack className="items-center gap-4">
              <Avatar size="lg" className="bg-primary-500">
                <AvatarImage source={{ uri: CURRENT_USER.avatar }} />
              </Avatar>

              <VStack className="flex-1">
                <Heading size="sm" className="font-bold text-typography-900">
                  {CURRENT_USER.name}
                </Heading>
                <Text size="sm" className="text-typography-500">
                  {CURRENT_USER.email}
                </Text>
              </VStack>

              <Icon
                as={ChevronRight}
                size="md"
                className="text-typography-400"
              />
            </HStack>
          </Pressable>
        </Box>

        {/* Settings Groups */}
        <VStack className="py-4 gap-6">
          {settingSections.map((section) => (
            <VStack key={section.title}>
              <Text className="px-5 mb-2 text-xs font-bold text-typography-500 uppercase tracking-wider">
                {section.title}
              </Text>
              <Box className="border-y border-outline-100 dark:border-outline-900">
                {section.items.map((item, index) =>
                  renderSettingItem(item, index, section.items.length)
                )}
              </Box>
            </VStack>
          ))}

          {/* Logout Button */}
          <Box className="px-5 mt-2 mb-10">
            <Pressable
              onPress={() =>
                Alert.alert("Logout", "Are you sure you want to logout?")
              }
              className="p-4 rounded-xl bg-error-50 dark:bg-error-900/10 active:bg-error-100 dark:active:bg-error-900/20"
            >
              <HStack className="justify-center items-center gap-2">
                <Icon as={LogOut} size="sm" className="text-error-500" />
                <Text className="text-center text-error-500 font-semibold">
                  Log Out
                </Text>
              </HStack>
            </Pressable>
            <Text className="text-center text-typography-400 text-xs mt-4">
              App Version 1.0.0
            </Text>
          </Box>
        </VStack>
      </ScrollView>
    </AppContainer>
  );
}
