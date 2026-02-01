import React from 'react';
import { View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '@/components/app/app-container/AppHeader';
import { CustomScrollView } from '@/components/common/CustomScrollView';
import { Box } from '@/components/ui/box';
import { cn } from '@/lib/utils/classnames';

interface AppContainerProps {
  showHeaderLogo?: boolean;
  showBackButton?: boolean;
  headerTitle?: string;
  headerLeft?: React.ReactNode;
  headerRight?: React.ReactNode;
  showHeaderCart?: boolean;
  showHeaderSearch?: boolean;
  onPressCart?: () => void;
  disableScroll?: boolean;
  hasFloatButton?: boolean;
  children: React.ReactNode;
}

export function AppContainer({
  showHeaderLogo = false,
  showBackButton = false,
  headerTitle,
  headerLeft,
  headerRight,
  showHeaderCart = false,
  showHeaderSearch = false,
  onPressCart,
  disableScroll = false,
  hasFloatButton = false,
  children,
}: AppContainerProps) {
  return (
    <View className="flex-1 bg-background">
      <AppHeader
        title={headerTitle}
        left={headerLeft}
        right={headerRight}
        showBackButton={showBackButton}
        showLogo={showHeaderLogo}
        showSearch={showHeaderSearch}
      />
      <Box className="w-screen flex-1 items-center">
        {disableScroll ? (
          <Box className={cn('w-full flex-1', hasFloatButton ? 'pb-20' : '')}>
            {children}
          </Box>
        ) : (
          <CustomScrollView
            className={cn('w-full')}
            scrollVisible="always"
            isFullPage={true}
          >
            <View
              className={cn(
                'h-full w-full max-w-[600px]',
                hasFloatButton ? 'mb-20' : ''
              )}
            >
              {children}
            </View>
          </CustomScrollView>
        )}
      </Box>
    </View>
  );
}
