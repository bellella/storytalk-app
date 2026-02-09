import { Stack } from 'expo-router';

export default function StackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="story/[storyId]/episodes/[episodeId]/play/reader"
        options={{
          presentation: 'fullScreenModal',
          animation: 'none',
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="story/[storyId]/episodes/[episodeId]/quiz"
        options={{
          presentation: 'fullScreenModal',
          animation: 'none',
        }}
      />
      <Stack.Screen
        name="story/[storyId]/episodes/[episodeId]/review"
        options={{
          presentation: 'fullScreenModal',
          animation: 'none',
        }}
      />
    </Stack>
  );
}
