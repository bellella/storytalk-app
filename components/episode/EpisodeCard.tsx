import clsx from 'clsx';
import { Href, Link } from 'expo-router';
import { Pressable, View } from 'react-native';
import type { EpisodeCardItem } from '@/lib/types/episode';
import { rgba } from '@/lib/utils/style.utils';
import { HStack } from '../ui/hstack';
import { Text } from '../ui/text';
import { EpisodeIcon } from './EpisodeIcon';

interface EpisodeCardProps {
  href: Href;
  episode: EpisodeCardItem;
  primary: string;
}

export function EpisodeCard({ href, episode, primary }: EpisodeCardProps) {
  const isLocked = episode.status === 'LOCKED';
  const isAvailable = episode.status === 'AVAILABLE';

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
            <EpisodeIcon status={episode.status} primary={primary} />
            <View className="ml-4 flex-1">
              <Text
                className="text-foreground font-extrabold"
                numberOfLines={1}
              >
                {episode.title}
              </Text>

              {!!episode.description && (
                <Text
                  className="text-muted-foreground mt-2 text-xs"
                  numberOfLines={1}
                >
                  {episode.description}
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
