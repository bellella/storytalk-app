import { forwardRef } from 'react';
import { Pressable, View } from 'react-native';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils/classnames';

type TokenChipProps = {
  text: string;
  used?: boolean;
  disabled?: boolean;
  onPress?: () => void;
};

export const TokenChip = forwardRef<View, TokenChipProps>(
  ({ text, used, disabled, onPress }, ref) => {
    return (
      <Pressable disabled={disabled || used} onPress={onPress}>
        <View
          ref={ref}
          className={cn(
            'rounded-xl px-3 py-2',
            used ? 'border border-gray-300 bg-gray-300 opacity-50' : 'bg-primary'
          )}
        >
          <Text className={cn('text-sm font-bold', used ? 'text-gray-300' : 'text-white')}>
            {text}
          </Text>
        </View>
      </Pressable>
    );
  }
);
