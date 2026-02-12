import { Audio } from 'expo-av';
import { useCallback, useEffect, useRef } from 'react';

export function useSound(source: Parameters<typeof Audio.Sound.createAsync>[0]) {
  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    return () => {
      soundRef.current?.unloadAsync();
    };
  }, []);

  const play = useCallback(async () => {
    try {
      // 이전 사운드가 있으면 정리
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
      }
      const { sound } = await Audio.Sound.createAsync(source);
      soundRef.current = sound;
      await sound.playAsync();
    } catch {
      // 무시
    }
  }, [source]);

  return { play };
}
