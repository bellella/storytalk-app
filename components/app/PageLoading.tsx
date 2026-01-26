import React from "react";
import { View } from "react-native";
import { Spinner } from "@/components/ui/spinner";
import { cn } from " @/lib/utils/classnames";

/**
 * Full-screen loading overlay component
 * - Shows a centered spinner with a semi-transparent white overlay
 * - Covers entire screen (100vh/100vw)
 */
type PageLoadingProps = {
  showOverlay?: boolean;
};

export function PageLoading({ showOverlay = false }: PageLoadingProps) {
  return (
    <View className={cn("absolute h-full w-full justify-center items-center z-50", showOverlay && "bg-white/70")}>
      <Spinner size="large" />
    </View>
  );
}
