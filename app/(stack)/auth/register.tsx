import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { AppContainer } from '@/components/app/app-container';
import { Button, ButtonText } from '@/components/ui/button';
import { useAuth } from '@/lib/hooks/auth/useAuth';

export default function RegisterFormScreen() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState('');

  const handleRegister = async () => {
    await register({
      name,
    });
    alert('회원가입 성공!');
    router.replace('/'); // 가입 후 로그인 화면 이동
  };

  return (
    <AppContainer headerTitle="register" showBackButton>
      <Text className="mb-3 text-3xl font-bold">회원가입</Text>
      <Text className="mb-12 text-gray-400">
        Story Lingo 계정을 만들어 이야기를 시작해보세요.
      </Text>

      <View className="space-y-4">
        {/* 이메일 */}
        <TextInput
          placeholder="이름"
          value={name}
          onChangeText={setName}
          className="w-full rounded-3xl border border-gray-300 px-6 py-4 text-sm"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      {/* 가입 버튼 */}
      <View className="mt-12">
        <Button
          onPress={handleRegister}
          className="w-full rounded-3xl bg-[#8E97FD] py-5"
        >
          <ButtonText className="text-sm font-bold uppercase tracking-widest text-white">
            회원가입
          </ButtonText>
        </Button>
      </View>

      {/* 로그인 이동 */}
      <View className="mt-8 flex-row justify-center">
        <Text className="text-sm text-gray-400">이미 계정이 있으신가요?</Text>
        <Pressable onPress={() => router.push('/auth/login')}>
          <Text className="ml-1 text-sm font-bold text-[#8E97FD]">로그인</Text>
        </Pressable>
      </View>
    </AppContainer>
  );
}
