import React, { ReactNode } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type FloatingContainerProps = {
  children: ReactNode;
  className?: string;
};

export function FloatingContainer({
  children,
  className = '',
}: FloatingContainerProps) {
  return (
    <SafeAreaView
      edges={['bottom']}
      className="absolute bottom-0 left-0 right-0 px-4 pb-4"
    >
      <View className={`w-full max-w-[600px] self-center p-3 ${className}`}>
        {children}
      </View>
    </SafeAreaView>
  );
}
