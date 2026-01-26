import { useFocusEffect } from '@react-navigation/native';
import { router, usePathname } from 'expo-router';
import { useCallback } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useAuthStore } from '@/lib/stores/auth.store';

export function useAuthGuard() {
  const pathname = usePathname();
  const [isLoggedIn, isRestoring] = useAuthStore(
    useShallow((s) => [s.isLoggedIn, s.isRestoring])
  );
  useFocusEffect(
    useCallback(() => {
      if (isRestoring) return;
      if (isLoggedIn) return;

      router.replace({
        pathname: '/login',
        params: { redirect: pathname },
      });
    }, [isRestoring, isLoggedIn, pathname])
  );
  return { isRestoring };
}
