import { DefaultTheme, DarkTheme, type Theme } from "@react-navigation/native";
import { Colors } from "./colors.generated";

// 네 scheme key 이름에 맞춰서 매핑만 바꾸면 됨.
// (Material scheme 기준이면 primary, background, surface, outline, onSurface 같은 게 있을 거야)
function buildTheme(mode: "light" | "dark"): Theme {
  const c = mode === "dark" ? Colors.scheme.dark : Colors.scheme.light;
  const base = mode === "dark" ? DarkTheme : DefaultTheme;

  return {
    ...base,
    colors: {
      ...base.colors,

      // React Navigation이 실제로 참고하는 6개 키
      primary: c.primary, // 링크/강조색
      background: c.background, // 화면 배경
      card: c.surface, // header / tab bar 배경
      text: c.onBackground ?? c.onSurface, // 글자색(너 토큰에 맞춰 택1)
      border: c.outline, // 구분선
      notification: c.error ?? c.primary, // 뱃지/알림 느낌(없으면 primary)
    },
  };
}
export const expoTheme = {
  light: buildTheme("light"),
  dark: buildTheme("dark"),
}
  