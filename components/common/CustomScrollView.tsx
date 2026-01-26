import { cn } from '@gluestack-ui/utils/nativewind-utils';
import React from 'react';
import { Platform, ScrollView } from 'react-native';

type Props = React.ComponentProps<typeof ScrollView> & {
  className?: string;
  style?: any;
  scrollVisible?: 'hover' | 'always';
  scrollThumbColor?: string;
  isFullPage?: boolean;
};

export function CustomScrollView({
  children,
  className = '',
  style,
  scrollVisible = 'hover',
  scrollThumbColor,
  isFullPage = false,
  ...rest
}: Props) {
  const scrollClass =
    scrollVisible === 'hover' ? 'scroll-hover' : 'scroll-always';
  const showsHorizontalScrollIndicator = Platform.OS === 'web';

  return (
    <ScrollView
      className={cn('custom-scroll', scrollClass, className)}
      style={{
        ...(scrollThumbColor && {
          '--scroll-thumb-color': scrollThumbColor,
        }),
        ...style,
      }}
      contentContainerStyle={{
        minHeight: isFullPage ? '100%' : undefined,
      }}
      showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
      showsVerticalScrollIndicator={true}
      {...rest}
    >
      {children}
    </ScrollView>
  );
}
