import { Pressable } from 'react-native';
import { rgba } from '@/lib/utils/style.utils';
import { Text } from '../ui/text';

export function UnitPill({
  active,
  label,
  color,
  onPress,
}: {
  active: boolean;
  label: string;
  color: string; // "r,g,b"
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="mr-2 rounded-full px-4 py-2"
      style={{
        backgroundColor: active ? rgba(color, 0.14) : 'rgba(0,0,0,0.03)',
      }}
    >
      <Text
        className="text-xs font-extrabold"
        style={{ color: active ? rgba(color, 1) : 'rgba(0,0,0,0.50)' }}
        numberOfLines={1}
      >
        {label}
      </Text>
    </Pressable>
  );
}
