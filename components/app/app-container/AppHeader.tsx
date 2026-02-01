import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { ArrowLeft, Moon, Star, User } from 'lucide-react-native';
import { View } from 'react-native';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { useColors } from '@/lib/hooks/theme/useColors';

type AppHeaderProps = {
  title?: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
  showLogo?: boolean;
  showBackButton?: boolean;
  showSearch?: boolean;
};

export function AppHeader({
  title,
  left,
  right,
  showLogo = false,
  showBackButton = false,
  showSearch = false,
}: AppHeaderProps) {
  const router = useRouter();
  const { colors } = useColors();
  const iconColor = colors.onBackground;

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  return (
    <View className="w-screen items-center">
      <View className="max-w-app z-50 h-[50px] w-full flex-row items-center justify-between self-center px-4 py-3">
        <View className="w-1/4">
          {left}
          {showBackButton && (
            <Pressable onPress={handleBack}>
              <ArrowLeft size={20} color={iconColor} />
            </Pressable>
          )}
          <View />
          {showLogo ? (
            <View className="flex-row items-center gap-2">
              <Text className="text-lg font-black uppercase tracking-[0.2em] text-[#3F414E]">
                Story
              </Text>
              <View className="h-8 w-8 items-center justify-center rounded-xl bg-[#8E97FD]">
                <Moon size={16} color="#fff" fill="#fff" />
              </View>
              <Text className="text-lg font-black uppercase tracking-[0.2em] text-[#3F414E]">
                Talk
              </Text>
            </View>
          ) : null}
        </View>
        <View className="flex-1">
          {title && (
            <Text size="lg" bold className="flex-1 text-center">
              {title}
            </Text>
          )}
        </View>
        <View className="w-1/4 flex-row items-center justify-end gap-4">
          {right}
          <Star size={20} color="#facc15" />
          <Link href="/auth/login">
            <User size={20} color={iconColor} />
          </Link>
          {showSearch && (
            <Link href="/">
              <Ionicons name="search" size={20} color={iconColor} />
            </Link>
          )}
        </View>
      </View>
    </View>
  );
}
