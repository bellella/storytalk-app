import { router } from 'expo-router';
import { useShallow } from 'zustand/react/shallow';
import {
  RegisterProfileDto,
  SocialLoginResponseDto,
} from '@/lib/api/generated/model';
import { userCompleteProfile, userGetMe } from '@/lib/api/generated/user/user';
import { useAuthStore } from '@/lib/stores/auth.store';
import { tokenStorage } from '@/lib/utils/token-storage';
import { User } from '@/types/user.type';

export const useAuth = () => {
  const {
    setUser,
    resetUser,
    setIsRestoring,
    setIsLoggedIn,
    setTempTokens,
    tempTokens,
  } = useAuthStore(
    useShallow((state) => ({
      setUser: state.setUser,
      resetUser: state.resetUser,
      setIsRestoring: state.setIsRestoring,
      setIsLoggedIn: state.setIsLoggedIn,
      setTempTokens: state.setTempTokens,
      tempTokens: state.tempTokens,
    }))
  );

  /**
   * Login with social login response
   * Stores tokens securely and sets user in state
   */
  const login = async (response: SocialLoginResponseDto) => {
    const { user, tokens, isNew } = response;
    // registering
    if (isNew) {
      setTempTokens(tokens);
      router.push('/auth/register');
    } else {
      // Store tokens securely
      tokenStorage.setTokens(tokens.accessToken, tokens.refreshToken);
      const user = await userGetMe();
      setUser(user);
      setIsLoggedIn(true);
      router.replace('/');
    }
  };
  // register finish
  const register = async (profile: RegisterProfileDto) => {
    if (!tempTokens) {
      return;
    }
    await userCompleteProfile(profile);
    tokenStorage.setTokens(tempTokens.accessToken, tempTokens.refreshToken);
    const user = await userGetMe();
    setUser(user);
    setIsLoggedIn(true);
    router.replace('/');
  };

  /**
   * Logout and clear auth state
   */
  const logout = async () => {
    await tokenStorage.clearTokens();
    resetUser();
  };

  /**
   * Restore user session from stored tokens
   * Called on app startup to check for existing session
   */
  const restoreUser = async () => {
    try {
      setIsRestoring(true);

      const accessToken = await tokenStorage.getAccessToken();
      if (!accessToken) {
        return;
      }

      // Token exists, fetch user info
      // The axios interceptor will automatically attach the token
      const user = await userGetMe();
      setUser(user);
    } catch (error) {
      // Token invalid or expired, clear it
      console.error('Failed to restore user session:', error);
      await tokenStorage.clearTokens();
    } finally {
      setIsRestoring(false);
    }
  };

  return {
    login,
    logout,
    restoreUser,
    register,
  };
};
