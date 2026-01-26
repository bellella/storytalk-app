import { ColorSchemeName, useColorScheme } from "react-native";
import { ThemeMode, useThemeStore } from "../../stores/theme.store";
import { Colors } from "@/theme/colors.generated";

type ColorScheme = keyof typeof Colors.scheme;
type SchemeColors = (typeof Colors.scheme)[ColorScheme];

function getResolvedColorScheme(
  themeMode: ThemeMode,
  systemColorScheme: ColorSchemeName
): ColorScheme {
  if (themeMode === "system") {
    return systemColorScheme ?? "light";
  }
  return themeMode;
}

/**
 * 현재 테마에 맞는 색상을 반환하는 훅
 * - themeMode가 "system"이면 OS 설정을 따름
 * - themeMode가 "light" 또는 "dark"면 해당 테마 사용
 */
export function useColors() {
  const themeMode = useThemeStore((state) => state.themeMode);
  const systemColorScheme = useColorScheme();
  const resolvedScheme = getResolvedColorScheme(themeMode, systemColorScheme);
  return {
    colors: Colors.scheme[resolvedScheme],
    colorScheme: resolvedScheme,
  }
}
