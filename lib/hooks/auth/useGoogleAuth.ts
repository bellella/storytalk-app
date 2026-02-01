import { GoogleSignin } from '@react-native-google-signin/google-signin';
import * as Google from 'expo-auth-session/providers/google';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useState } from 'react';
import { Alert, Platform } from 'react-native';
import { authGoogleLogin } from '@/lib/api/generated/auth/auth';
import { useAuth } from '@/lib/hooks/auth/useAuth';

// This must be called at module level to properly close the popup on web
WebBrowser.maybeCompleteAuthSession();

// Configure Google Sign-In for native platforms
GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
  iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
  scopes: ['profile', 'email'],
});

export const useGoogleAuth = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  // Web Google Auth configuration
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID!,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    redirectUri: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_REDIRECT_URI,
    scopes: ['profile', 'email'],
    responseType: 'id_token',
  });

  /**
   * Send Google ID token to backend and handle login
   */
  const handleGoogleAuth = async (idToken: string) => {
    // Send Google ID token to backend for authentication
    const response = await authGoogleLogin({ idToken });

    if (response.isNew) {
      Alert.alert('Welcome!', 'Registration completed successfully.');
    }

    // Store tokens and set user
    login(response);
  };

  // Handle web authentication response
  useEffect(() => {
    if (response?.type === 'success') {
      const idToken = response.params.id_token;
      if (idToken) {
        handleWebAuth(idToken);
      }
    }
  }, [response]);

  const handleWebAuth = async (idToken: string) => {
    try {
      setLoading(true);
      await handleGoogleAuth(idToken);
    } catch (error: any) {
      console.error('Google login failed:', error);
      Alert.alert(
        'Login Failed',
        error.message || 'An error occurred during authentication.'
      );
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);

      if (Platform.OS === 'web') {
        // Web: Use expo-auth-session
        await promptAsync();
      } else {
        // iOS/Android: Use Google Sign-In SDK
        await GoogleSignin.hasPlayServices();
        const { data } = await GoogleSignin.signIn();

        if (!data?.idToken) {
          throw new Error('Failed to get Google ID token.');
        }

        await handleGoogleAuth(data.idToken);
      }
    } catch (error: any) {
      console.error('Google login failed:', error);
      Alert.alert(
        'Login Failed',
        error.message || 'An error occurred during authentication.'
      );
    } finally {
      if (Platform.OS !== 'web') {
        setLoading(false);
      }
    }
  };

  return {
    signInWithGoogle,
    loading: loading || (Platform.OS === 'web' && !request),
  };
};
