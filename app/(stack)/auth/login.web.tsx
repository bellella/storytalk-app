import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { AppContainer } from '@/components/app/app-container';
import { Button, ButtonText } from '@/components/ui/button';
import { useGoogleAuth } from '@/lib/hooks/auth/useGoogleAuth';

export default function SocialLoginScreen() {
  const { signInWithGoogle } = useGoogleAuth();

  return (
    <AppContainer headerTitle="login" showBackButton>
      <View className="h-full items-center justify-center">
        <View className="mb-10 text-center">
          <Text className="mb-3 text-center text-3xl font-bold">
            Welcome Back!
          </Text>
          <Text className="text-center text-lg text-gray-400">
            이야기 속으로 다시 빠져볼까요?
          </Text>
        </View>

        {/* Social Login */}
        <View className="gap-y-4">
          <Button variant="outline" onPress={signInWithGoogle}>
            <ButtonText>Google로 시작하기</ButtonText>
          </Button>
        </View>
      </View>
    </AppContainer>
  );
}
