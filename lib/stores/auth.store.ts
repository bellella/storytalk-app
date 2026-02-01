import { create } from 'zustand';
import { tokens, UserProfile } from '@/types/user.type';

type AuthState = {
  user: UserProfile | null;
  isRestoring: boolean;
  isLoggedIn: boolean;
  isRegistering: boolean;
  tempTokens: tokens | null;
};

type AuthActions = {
  setUser: (user: UserProfile) => void;
  setIsRestoring: (isRestoring: boolean) => void;
  setIsRegistering: (isRegistering: boolean) => void;
  resetUser: () => void;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  setTempTokens: (tempTokens: tokens) => void;
};

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  user: null,
  isRestoring: true,
  isLoggedIn: false,
  isRegistering: false,
  tempTokens: null,
  setIsLoggedIn: (isLoggedIn: boolean) => set({ isLoggedIn }),
  setUser: (user: UserProfile) => set({ user, isLoggedIn: true }),
  setIsRestoring: (isRestoring: boolean) => set({ isRestoring }),
  setIsRegistering: (isRegistering: boolean) => set({ isRegistering }),
  setTempTokens: (tempTokens: tokens | null) => set({ tempTokens }),
  resetUser: () => set({ user: null, isLoggedIn: false, isRegistering: false }),
}));
