import { useRouter } from 'expo-router';
import { X } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/lib/hooks/theme/useColors';

interface ReaderHeaderProps {
  episodeTitle?: string;
  sceneIndex: number;
  totalScenes: number;
  progress: number;
  alwaysShowTranslation: boolean;
  onToggleTranslation: () => void;
}

export function ReaderHeader({
  episodeTitle,
  sceneIndex,
  totalScenes,
  progress,
  alwaysShowTranslation,
  onToggleTranslation,
}: ReaderHeaderProps) {
  const router = useRouter();
  const { colors } = useColors();
  const insets = useSafeAreaInsets();

  const handleClose = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  return (
    <View className="w-full bg-background" style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center justify-between px-4 pb-3 pt-2">
        <Pressable
          onPress={handleClose}
          className="h-10 w-10 items-center justify-center rounded-full"
          hitSlop={8}
        >
          <X size={22} color={colors.onBackground} />
        </Pressable>

        <Text
          className="flex-1 px-2 text-center text-xs font-extrabold uppercase tracking-widest text-[#8E97FD]"
          numberOfLines={1}
        >
          {episodeTitle ?? ''}
        </Text>

        <View className="flex-row items-center gap-2">
          <Pressable
            onPress={onToggleTranslation}
            className={`rounded-full px-3 py-1.5 ${
              alwaysShowTranslation ? 'bg-[#8E97FD]' : 'bg-[#F1F3FF]'
            }`}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text
              className={`text-xs font-bold ${
                alwaysShowTranslation ? 'text-white' : 'text-[#6D6F7B]'
              }`}
            >
              {alwaysShowTranslation ? '해석 ON' : '해석 OFF'}
            </Text>
          </Pressable>

          <View className="rounded-full bg-[#F1F3FF] px-3 py-1.5">
            <Text className="text-xs font-bold text-[#6D6F7B]">
              Scene {sceneIndex + 1}/{totalScenes}
            </Text>
          </View>
        </View>
      </View>

      <View className="mx-4 mb-4 h-1.5 overflow-hidden rounded-full bg-[#ECECF4]">
        <View
          className="h-full rounded-full bg-[#8E97FD]"
          style={{ width: `${progress}%` }}
        />
      </View>
    </View>
  );
}
