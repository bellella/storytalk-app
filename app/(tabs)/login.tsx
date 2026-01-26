import React from 'react';
import { Image, View } from 'react-native';
import { AppContainer } from '@/components/app/app-container';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { useGoogleAuth } from '@/lib/hooks/auth/useGoogleAuth';

export default function LoginScreen() {
  const { signInWithGoogle, loading } = useGoogleAuth();

  return (
    <AppContainer headerTitle="login" showBackButton disableScroll={true}>
      <View className="h-full flex-1 items-center justify-center">
        <Box className="flex items-center justify-center gap-y-6 p-6">
          {loading ? (
            <Box className="mt-4 items-center justify-center">
              <Spinner size="large" />
              <Text className="mt-2 text-gray-500">Processing login...</Text>
            </Box>
          ) : (
            <Button
              className="bg-blue-600 data-[hover=true]:bg-blue-700"
              onPress={signInWithGoogle}
              isDisabled={loading}
            >
              <Image
                source={require('#/images/icons/google_icon.png')}
                style={{ width: 20, height: 20 }}
              />
              <ButtonText className="text-base font-semibold text-white">
                Sign in with Google
              </ButtonText>
            </Button>
          )}

          <Text className="mt-6 px-6 text-center text-gray-400">
            First-time login will automatically redirect you to the sign-up
            page.
          </Text>
        </Box>
      </View>
    </AppContainer>
  );
}
