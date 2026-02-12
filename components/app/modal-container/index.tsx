import React from 'react';
import { View } from 'react-native';
import { ModalHeader } from '@/components/app/ModalHeader';

interface ModalContainerProps {
  children: React.ReactNode;
}

export function ModalContainer({ children }: ModalContainerProps) {
  return (
    <View className="flex-1 items-center bg-background">
      <ModalHeader />
      <View className="w-full max-w-[600px] flex-1 px-4">{children}</View>
    </View>
  );
}
