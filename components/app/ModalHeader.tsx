import { useRouter } from 'expo-router';
import { X } from 'lucide-react-native';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { useColors } from '@/lib/hooks/theme/useColors';

interface ModalHeaderProps {
  title?: string;
  right?: React.ReactNode;
  onClose?: () => void;
}

export function ModalHeader({ title, right, onClose }: ModalHeaderProps) {
  const router = useRouter();
  const { colors } = useColors();
  const insets = useSafeAreaInsets();

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  return (
    <View className="w-full bg-background" style={{ paddingTop: insets.top }}>
      <View className="h-[50px] flex-row items-center justify-between px-4">
        <View className="w-10">
          <Pressable
            onPress={handleClose}
            className="h-10 w-10 items-center justify-center rounded-full"
          >
            <X size={22} color={colors.onBackground} />
          </Pressable>
        </View>

        <View className="flex-1">
          {!!title && (
            <Text className="text-center text-base font-bold">{title}</Text>
          )}
        </View>

        <View className="w-10 items-end">{right}</View>
      </View>
    </View>
  );
}
