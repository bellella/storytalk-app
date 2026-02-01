import NaverLogin from '@react-native-seoul/naver-login';
import { useEffect } from 'react';
import { useAuth } from './auth/useAuth';

export function useInitialize() {
  const { restoreUser } = useAuth();
  useEffect(() => {
    restoreUser();
    // NaverLogin.initialize({
    //   appName: process.env.EXPO_PUBLIC_APP_NAME!,
    //   consumerKey: process.env.EXPO_PUBLIC_NAVER_CLIENT_ID!,
    //   consumerSecret: process.env.EXPO_PUBLIC_NAVER_CLIENT_SECRET!,
    //   serviceUrlSchemeIOS: process.env.EXPO_PUBLIC_SERVICE_URL_SCHEME_IOS!,
    //   disableNaverAppAuthIOS: true,
    // });
  }, []);
}
