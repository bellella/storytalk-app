import { Tabs } from 'expo-router';
import { Home, MessageCircle, Settings, Users } from 'lucide-react-native';
import React from 'react';
import { HapticTab } from '@/components/haptic-tab';
import { Icon } from '@/components/ui/icon';
import { useColors } from '@/lib/hooks/theme/useColors';

export default function TabLayout() {
  const { colors } = useColors();
  const iconColor = colors.primary;
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: iconColor,
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <Icon as={Home} size="xl" style={{ color }} />
          ),
        }}
      />
      <Tabs.Screen
        name="chats"
        options={{
          title: 'Chats',
          tabBarIcon: ({ color }) => (
            <Icon as={MessageCircle} size="xl" style={{ color }} />
          ),
        }}
      />
      <Tabs.Screen
        name="friends"
        options={{
          title: 'Friends',
          tabBarIcon: ({ color }) => (
            <Icon as={Users} size="xl" style={{ color }} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => (
            <Icon as={Settings} size="xl" style={{ color }} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="login"
        options={{
          href: null,
          title: 'login',
        }}
      />
    </Tabs>
  );
}
