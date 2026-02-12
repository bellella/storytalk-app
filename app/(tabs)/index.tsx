import React from 'react';
import { AppContainer } from '@/components/app/app-container';
import { CharacterRankingPreview } from '@/components/character/CharacterRankingPreview';
import { HomeHeader } from '@/components/home';
import { StoryGrid } from '@/components/home/StoryGrid';
import { View } from '@/components/ui/view';
import { useUser } from '@/lib/hooks/auth/userUser';

export default function HomeScreen() {
  const { user } = useUser();

  return (
    <AppContainer showHeaderLogo>
      <View className="px-6">
        <HomeHeader
          userName={user?.name}
          dailyQuizCompleted={user?.dailyStatus?.quizCompleted}
        />

        {/* ---------- Characters ---------- */}
        <CharacterRankingPreview />

        {/* ---------- Stories ---------- */}
        <StoryGrid />
      </View>
    </AppContainer>
  );
}
