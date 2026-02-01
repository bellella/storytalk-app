import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { AppContainer } from '@/components/app/app-container';
import { Button, ButtonText } from '@/components/ui/button';
import { useSocialLogin } from '@/lib/hooks/auth/useSocialLogin';

export default function SocialLoginScreen() {
  const {
    user,
    loginWithGoogle,
    loginWithApple,
    loginWithKakao,
    loginWithNaver,
  } = useSocialLogin();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreeMarketing, setAgreeMarketing] = useState(false);

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
          <Button variant="outline" onPress={loginWithGoogle}>
            <ButtonText>Google로 시작하기</ButtonText>
          </Button>

          <Button variant="outline" onPress={loginWithApple}>
            <ButtonText>Apple로 시작하기</ButtonText>
          </Button>

          <Button variant="outline" onPress={loginWithKakao}>
            <ButtonText>Kakao로 시작하기</ButtonText>
          </Button>

          <Button variant="outline" onPress={loginWithNaver}>
            <ButtonText>Naver로 시작하기</ButtonText>
          </Button>
        </View>
      </View>
    </AppContainer>
  );
}
