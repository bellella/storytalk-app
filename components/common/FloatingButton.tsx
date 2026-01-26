import React, { ReactNode } from "react";
import { View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../ui/button";

type FloatingButtonProps = {
  children: ReactNode;
  onPress?: () => void;
};

export function FloatingButton({ children, onPress }: FloatingButtonProps) {
  return (
    <SafeAreaView
      edges={['bottom']}
      className="absolute bottom-4 left-0 right-0 items-center pb-4"
    >
      <View className="w-full max-w-[600px] px-2">
        <Button
          onPress={onPress}
        >
          {children}
        </Button>
      </View>
    </SafeAreaView>
  );
}
