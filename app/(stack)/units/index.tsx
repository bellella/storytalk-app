import { useQuery } from '@tanstack/react-query';
import React, { useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { AppContainer } from '@/components/app/app-container';
import { EpisodeCard } from '@/components/episode/EpisodeCard';
import { StoryHero } from '@/components/episode/StoryHero';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { UnitPill } from '@/components/units/UnitPill';
import {
  UnitDetailDto,
  UnitDetailDtoEpisodesItemStatus,
  UnitListItemDto,
} from '@/lib/api/generated/model';
import { unitFindAll, unitFindOne } from '@/lib/api/generated/unit/unit';

export default function UnitsScreen() {
  const { data: units } = useQuery({
    queryKey: ['units'],
    queryFn: () => unitFindAll(),
  });

  const [selectedUnitId, setSelectedUnitId] = useState<number>(1);

  const { data: unitData } = useQuery<UnitDetailDto>({
    queryKey: ['unit', selectedUnitId],
    queryFn: () => unitFindOne(selectedUnitId),
    enabled: !!selectedUnitId,
  });

  const unit = useMemo(() => {
    if (!units?.length) return null;
    return (
      units.find((u: UnitListItemDto) => u.id === selectedUnitId) ?? units[0]
    );
  }, [selectedUnitId, units]);

  if (!units?.length || !unit) {
    return (
      <AppContainer showBackButton>
        <View className="px-4 py-6">
          <Text>No unit found</Text>
        </View>
      </AppContainer>
    );
  }

  const primary = unit.color;

  // 진행률: completed / total
  const progressPercent = useMemo(() => {
    const eps = unitData?.episodes ?? [];
    if (!eps.length) return 0;
    const completed = eps.filter(
      (e) => e.status === UnitDetailDtoEpisodesItemStatus.COMPLETED
    ).length;
    return Math.round((completed / eps.length) * 100);
  }, [unitData]);

  // Continue 대상: available 첫 개
  const firstPlayable = useMemo(() => {
    const eps = unitData?.episodes ?? [];
    return (
      eps.find((e) => e.status === UnitDetailDtoEpisodesItemStatus.AVAILABLE) ??
      null
    );
  }, [unitData]);

  return (
    <AppContainer showBackButton disableScroll>
      <View className="mx-auto max-w-[600px] px-3">
        {/* Unit pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-3"
        >
          <HStack className="items-center pr-3">
            {units.map((u: UnitListItemDto) => (
              <UnitPill
                key={u.id}
                active={u.id === selectedUnitId}
                color={u.color}
                label={`UNIT ${u.order} ${u.story.title}`}
                onPress={() => setSelectedUnitId(u.id)}
              />
            ))}
          </HStack>
        </ScrollView>

        {/* Hero */}
        <StoryHero
          label={`UNIT ${unit.order}`}
          title={unit.story.title}
          description={unit.story.description}
          primary={primary}
          progressPercent={progressPercent}
          onContinue={() => {
            if (!firstPlayable) return;
            console.log('continue:', firstPlayable.id);
          }}
        />

        {/* Section title */}
        <HStack className="mt-7 items-center justify-end">
          <Text className="text-muted-foreground text-sm font-bold">
            {unitData?.episodes?.length ?? 0} lessons
          </Text>
        </HStack>

        <View className="mt-3" />
      </View>
      <ScrollView>
        <VStack className="gap-y-3 px-3">
          {unitData?.episodes?.map((item) => (
            <EpisodeCard
              key={item.id}
              episode={{
                id: item.id,
                title: item.title,
                description: item.description,
                status: item.status,
              }}
              primary={primary}
              href={`/story/${unit.story.id}/episodes/${item.id}/play`}
            />
          ))}
        </VStack>
      </ScrollView>
    </AppContainer>
  );
}
