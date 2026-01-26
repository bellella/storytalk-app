import React from 'react';
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
    <Box className="bg-background flex-1">
      <AppHeader
        title={headerTitle}
        left={headerLeft}
        right={headerRight}
        showBackButton={showBackButton}
        showLogo={showHeaderLogo}
        showCart={showHeaderCart}
        showSearch={showHeaderSearch}
      />
      <Box className="w-screen flex-1 items-center">
        {disableScroll ? (
          <Box
            className={cn(
              'w-full max-w-[600px] flex-1',
              hasFloatButton ? 'pb-20' : ''
            )}
          >
            {children}
          </Box>
        ) : (
          <CustomScrollView
            className={cn('w-full max-w-[600px]')}
            scrollVisible="always"
            isFullPage={true}
          >
            <SafeAreaView
              edges={['bottom']}
              className={cn('w-full flex-1', hasFloatButton ? 'mb-20' : '')}
            >
              {children}
            </SafeAreaView>
          </CustomScrollView>
        )}
      </Box>
    </Box>
  );
}
