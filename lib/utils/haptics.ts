import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

/**
 * 약한 진동 (선택, 탭 등)
 */
export function hapticLight() {
  if (Platform.OS === 'web') return;
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

/**
 * 중간 진동 (확인, 토글 등)
 */
export function hapticMedium() {
  if (Platform.OS === 'web') return;
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
}

/**
 * 강한 진동 (경고, 에러 등)
 */
export function hapticHeavy() {
  if (Platform.OS === 'web') return;
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
}

/**
 * 성공 피드백
 */
export function hapticSuccess() {
  if (Platform.OS === 'web') return;
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
}

/**
 * 경고 피드백
 */
export function hapticWarning() {
  if (Platform.OS === 'web') return;
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
}

/**
 * 에러 피드백
 */
export function hapticError() {
  if (Platform.OS === 'web') return;
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
}

/**
 * 선택 변경 피드백 (가장 약함)
 */
export function hapticSelection() {
  if (Platform.OS === 'web') return;
  Haptics.selectionAsync();
}
