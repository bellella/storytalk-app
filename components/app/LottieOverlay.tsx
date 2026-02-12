import LottieView from 'lottie-react-native';
import {
  ComponentProps,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { View } from 'react-native';

export type LottieOverlayRef = {
  play: () => void;
};

type LottieOverlayProps = {
  source: ComponentProps<typeof LottieView>['source'];
  loop?: ComponentProps<typeof LottieView>['loop'];
};

export const LottieOverlay = forwardRef<LottieOverlayRef, LottieOverlayProps>(
  ({ source, loop = false }, ref) => {
    const [visible, setVisible] = useState(false);
    const lottieRef = useRef<LottieView>(null);

    useImperativeHandle(ref, () => ({
      play: () => {
        setVisible(true);
        lottieRef.current?.play();
      },
    }));

    if (!visible) return null;

    return (
      <View
        pointerEvents="none"
        className="absolute bottom-0 left-0 right-0 top-0 z-10"
      >
        <LottieView
          ref={lottieRef}
          autoPlay
          loop={loop}
          source={source}
          onAnimationFinish={() => setVisible(false)}
          style={{ flex: 1 }}
        />
      </View>
    );
  }
);
