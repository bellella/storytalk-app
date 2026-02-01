import { Tabs } from 'expo-router';
import {
  Home,
  LucideIcon,
  MessageCircle,
  Settings,
  Users,
} from 'lucide-react-native';
import React from 'react';
import { HapticTab } from '@/components/haptic-tab';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';

type TabIconProps = {
  icon: LucideIcon;
  label: string;
  focused: boolean;
};

function TabIcon({ icon, label, focused }: TabIconProps) {
  return (
    <View className="top-5 items-center gap-1">
      <View
        className={`rounded-2xl p-3 ${
          focused ? 'bg-primary shadow-lg shadow-primary' : ''
        }`}
      >
        <Icon
          as={icon}
          size="lg"
          className={focused ? 'text-white' : 'text-gray-400'}
        />
      </View>
      <Text
        className={`mt-1 text-[10px] font-bold ${
          focused ? 'text-primary' : 'text-gray-400'
        }`}
      >
        {label}
      </Text>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          height: 80,
          borderTopWidth: 1,
          borderTopColor: '#F1F1F1',
          backgroundColor: 'rgba(255,255,255,0.9)',
        },
        tabBarLabelStyle: { display: 'none' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={Home} label="Home" focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="chats"
        options={{
          title: 'Chat',
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={MessageCircle} label="Chat" focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="friends"
        options={{
          title: 'Friends',
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={Users} label="Friends" focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="user"
        options={{
          title: 'My Page',
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={Settings} label="My Page" focused={focused} />
          ),
        }}
      />

      {/* Hidden Routes */}
      <Tabs.Screen name="login" options={{ href: null }} />
      <Tabs.Screen name="settings" options={{ href: null }} />
    </Tabs>
  );
}
