import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { AppContainer } from '@/components/app/app-container';
import { Button, ButtonText } from '@/components/ui/button';

export default function RegisterTermsScreen() {
  const router = useRouter();

  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreeMarketing, setAgreeMarketing] = useState(false);

  const canProceed = agreePrivacy && agreeTerms;

  const handleNext = () => {
    if (canProceed) {
      router.push('/auth/register');
    } else {
      alert('필수 약관에 동의해야 진행할 수 있습니다.');
    }
  };

  return (
    <AppContainer headerTitle="terms" showBackButton>
      {/* Header */}
      <Pressable
        onPress={() => router.back()}
        className="mb-8 flex h-10 w-10 items-center justify-center rounded-full border border-gray-300"
      >
        <Text className="text-lg">←</Text>
      </Pressable>

      {/* Title */}
      <Text className="mb-3 text-3xl font-bold">Terms of Service</Text>
      <Text className="mb-12 text-gray-400">
        Story Lingo와 함께하기 위한 약관입니다.
      </Text>

      {/* Checkboxes */}
      <View className="space-y-6">
        <Pressable
          className="flex-row items-center justify-between p-1"
          onPress={() => setAgreePrivacy(!agreePrivacy)}
        >
          <Text className="font-medium text-gray-700">
            개인정보 수집 및 이용 동의
          </Text>
          <View
            className={`h-5 w-5 rounded border ${
              agreePrivacy ? 'border-[#8E97FD] bg-[#8E97FD]' : 'border-gray-300'
            }`}
          />
        </Pressable>

        <Pressable
          className="flex-row items-center justify-between p-1"
          onPress={() => setAgreeTerms(!agreeTerms)}
        >
          <Text className="font-medium text-gray-700">
            서비스 이용약관 동의
          </Text>
          <View
            className={`h-5 w-5 rounded border ${
              agreeTerms ? 'border-[#8E97FD] bg-[#8E97FD]' : 'border-gray-300'
            }`}
          />
        </Pressable>

        <Pressable
          className="flex-row items-center justify-between p-1"
          onPress={() => setAgreeMarketing(!agreeMarketing)}
        >
          <Text className="font-medium text-gray-700">
            마케팅 알림 수신 (선택)
          </Text>
          <View
            className={`h-5 w-5 rounded border ${
              agreeMarketing
                ? 'border-[#8E97FD] bg-[#8E97FD]'
                : 'border-gray-300'
            }`}
          />
        </Pressable>
      </View>

      {/* Next Button */}
      <View className="mt-12">
        <Button
          onPress={handleNext}
          isDisabled={!canProceed}
          className={`w-full rounded-3xl py-5 ${
            canProceed ? 'bg-[#8E97FD]' : 'bg-gray-200'
          }`}
        >
          <ButtonText
            className={`text-sm font-bold uppercase tracking-widest ${
              canProceed ? 'text-white' : 'text-gray-400'
            }`}
          >
            다음 단계
          </ButtonText>
        </Button>
      </View>
    </AppContainer>
  );
}
