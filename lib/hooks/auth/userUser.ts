import { useShallow } from 'zustand/react/shallow';
import { useAuthStore } from '@/lib/stores/auth.store';

export function useUser() {
  const { user, isLoggedIn } = useAuthStore(
    useShallow((state) => ({
      user: state.user,
      isLoggedIn: state.isLoggedIn,
    }))
  );
  return { user, isLoggedIn };
}
