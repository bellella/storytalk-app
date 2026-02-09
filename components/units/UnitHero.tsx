import { View } from 'react-native';
import { rgba } from '@/lib/utils/style.utils';
import { Text } from '../ui/text';

export function UnitHero({
  unitOrder,
  title,
  description,
  primary,
  progressPercent,
}: {
  unitOrder: number;
  title: string;
  description?: string | null;
  primary: string; // "r,g,b"
  progressPercent: number; // 0~100
  onContinue?: () => void;
}) {
  const pct = Math.max(0, Math.min(100, progressPercent));

  return (
    <View className="mt-4">
      {/* title */}
      <Text
        className="mb-2 mt-4 text-2xl font-extrabold text-gray-700"
        style={{ color: rgba(primary, 1) }}
      >
        UNIT {unitOrder}
      </Text>
      <Text className="text-2xl font-extrabold text-gray-700">{title}</Text>

      {/* description (2줄) */}
      {!!description && (
        <Text
          className="mb-3 mt-7 text-sm leading-6 text-gray-700"
          style={{ lineHeight: 1.6 }}
        >
          {description}
        </Text>
      )}

      <Text
        className="mt-2 text-xs font-bold text-gray-700"
        style={{ color: rgba(primary, 1) }}
      >
        진행률 <Text className="font-extrabold">{pct}%</Text>
      </Text>
      {/* thin progress */}
      <View
        className="mt-4 h-2 w-full overflow-hidden rounded-full"
        style={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
      >
        <View
          className="h-full rounded-full"
          style={{
            width: `${Math.max(2, pct)}%`,
            backgroundColor: rgba(primary, 0.55),
          }}
        />
      </View>
    </View>
  );
}
