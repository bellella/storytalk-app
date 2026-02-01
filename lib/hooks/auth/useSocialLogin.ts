// Google
import { GoogleSignin } from '@react-native-google-signin/google-signin';
// Kakao
import { login as kakaoLogin } from '@react-native-seoul/kakao-login';
// Naver
import NaverLogin from '@react-native-seoul/naver-login';
import * as AppleAuthentication from 'expo-apple-authentication';
// Apple
import { authAppleLogin, authGoogleLogin } from '@/lib/api/generated/auth/auth';
import { useAuth } from './useAuth';

interface User {
  id: string;
  name?: string;
  email?: string;
  avatar?: string;
}

interface SocialLoginHook {
  loginWithGoogle: () => Promise<void>;
  loginWithApple: () => Promise<void>;
  loginWithKakao: () => Promise<void>;
  loginWithNaver: () => Promise<void>;
}

export const useSocialLogin = (): SocialLoginHook => {
  const { login } = useAuth();

  // --- Google Login ---
  const loginWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const { data } = await GoogleSignin.signIn();
      if (!data?.idToken) {
        throw new Error('Failed to get Google access token.');
      }
      // Get access token from Google Sign-In
      const tokens = await GoogleSignin.getTokens();
      const res = await authGoogleLogin({ idToken: tokens.accessToken });
      login(res);
    } catch (err) {
      console.error('Google login error', err);
    }
  };

  // --- Apple Login ---
  const loginWithApple = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      const identityToken = credential.identityToken!;
      const res = await authAppleLogin({ identityToken });
      login(res);
    } catch (err) {
      console.error('Apple login error', err);
    }
  };

  // --- Kakao Login ---
  const loginWithKakao = async () => {
    try {
      const token = await kakaoLogin();
    } catch (err) {
      console.error('Kakao login error', err);
    }
  };

  // --- Naver Login ---
  const loginWithNaver = async () => {
    try {
      const { failureResponse, successResponse } = await NaverLogin.login();
      if (successResponse) {
      } else {
        console.error('Naver login error', failureResponse);
      }
    } catch (err) {
      console.error('Naver login error', err);
    }
  };

  return {
    loginWithGoogle,
    loginWithApple,
    loginWithKakao,
    loginWithNaver,
  };
};
