import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '@/lib/hooks/auth/useAuth';
import { useAuthStore } from '@/lib/stores/auth.store';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { restoreUser } = useAuth();
  const isRestoring = useAuthStore((state) => state.isRestoring);

  useEffect(() => {
    restoreUser();
  }, []);

  if (isRestoring) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <>{children}</>;
}
