import clsx from 'clsx';
import { Href, Link } from 'expo-router';
import { Pressable, View } from 'react-native';
import {
  UnitDetailDtoEpisodesItem,
  UnitDetailDtoEpisodesItemStatus,
} from '@/lib/api/generated/model';
import { rgba } from '@/lib/utils/style.utils';
import { HStack } from '../ui/hstack';
import { Text } from '../ui/text';
import { EpisodeIcon } from './EpisodeIcon';

interface EpisodeCardProps {
  href: Href;
  lesson: UnitDetailDtoEpisodesItem;
  primary: string;
}

export function EpisodeCard({ href, lesson, primary }: EpisodeCardProps) {
  const isLocked = lesson.status === UnitDetailDtoEpisodesItemStatus.LOCKED;
  const isAvailable =
    lesson.status === UnitDetailDtoEpisodesItemStatus.AVAILABLE;

  return (
    <Link href={href} asChild>
      <Pressable disabled={isLocked}>
        <View
          className={clsx(
            'rounded-2xl px-3 py-4',
            isAvailable && 'border-primary-500 bg-white',
            isLocked && 'border-outline-200 bg-background-50 opacity-55'
          )}
        >
          <HStack className="items-center">
            <EpisodeIcon status={lesson.status} primary={primary} />
            <View className="ml-4 flex-1">
              <Text
                className="text-foreground font-extrabold"
                numberOfLines={1}
              >
                {lesson.title}
              </Text>

              {!!lesson.description && (
                <Text
                  className="text-muted-foreground mt-2 text-xs"
                  numberOfLines={1}
                >
                  {lesson.description}
                </Text>
              )}

              <Text
                className="mt-2 text-xs font-extrabold uppercase tracking-wider"
                style={{
                  color: isAvailable ? rgba(primary, 1) : 'rgba(0,0,0,0.35)',
                }}
              >
                {isAvailable ? 'NOW LEARNING' : 'LOCKED'}
              </Text>
            </View>
          </HStack>
        </View>
      </Pressable>
    </Link>
  );
}
