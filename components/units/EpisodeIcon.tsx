import { LockIcon } from 'lucide-react-native';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { UnitDetailDtoEpisodesItemStatus } from '@/lib/api/generated/model';
import { rgba } from '@/lib/utils/style.utils';

export function EpisodeIcon({
  status,
  primary,
}: {
  status: UnitDetailDtoEpisodesItemStatus;
  primary: string;
}) {
  if (status === UnitDetailDtoEpisodesItemStatus.COMPLETED) {
    return (
      <View className="h-12 w-12 items-center justify-center rounded-2xl bg-green-100">
        <Text className="text-xl font-extrabold text-green-600">✓</Text>
      </View>
    );
  }

  if (status === UnitDetailDtoEpisodesItemStatus.AVAILABLE) {
    return (
      <View
        className="h-12 w-12 items-center justify-center rounded-2xl"
        style={{ backgroundColor: rgba(primary, 0.14) }}
      >
        <Text
          className="text-xl font-extrabold"
          style={{ color: rgba(primary, 1) }}
        >
          ▶
        </Text>
      </View>
    );
  }

  return (
    <View
      className="h-12 w-12 items-center justify-center rounded-2xl"
      style={{ backgroundColor: 'rgba(0,0,0,0.04)' }}
    >
      <LockIcon color="rgba(0,0,0,0.35)" />
    </View>
  );
}
