import { useShallow } from 'zustand/react/shallow';
import { useAuthStore } from '@/lib/stores/auth.store';

export const useAuth = () => {
  const { authLogin, authLogout } = useAuthStore(
    useShallow((state) => ({
      authLogin: state.login,
      authLogout: state.logout,
    }))
  );

  const login = async () => {
    await authLogin();
  };

  /**
   * Logout and clear auth state
   */
  const logout = async () => {
    await authLogout();
  };

  return {
    login,
    logout,
  };
};
