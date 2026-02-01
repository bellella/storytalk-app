import { ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import '@/global.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColors } from '@/lib/hooks/theme/useColors';
import { useInitialize } from '@/lib/hooks/useInitialize';
import { useLayoutStore } from '@/lib/stores/layout.store';
import { expoTheme } from '@/theme/expoTheme';

const queryClient = new QueryClient();

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  useInitialize();
  const { colorScheme } = useColors();
  const { updateMaxContentWidth } = useLayoutStore();

  return (
    <GluestackUIProvider mode={colorScheme}>
      <ThemeProvider value={expoTheme[colorScheme]}>
        <QueryClientProvider client={queryClient}>
          <SafeAreaView
            edges={['top', 'bottom']}
            className="flex-1 bg-background"
          >
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="(stack)" options={{ headerShown: false }} />
              <Stack.Screen
                name="modal"
                options={{ presentation: 'modal', title: 'Modal' }}
              />
            </Stack>
          </SafeAreaView>
          <StatusBar style="auto" />
        </QueryClientProvider>
      </ThemeProvider>
    </GluestackUIProvider>
  );
}
