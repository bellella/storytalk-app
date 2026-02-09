import React from 'react';
import { Platform, findNodeHandle } from 'react-native';

type Rect = { x: number; y: number; width: number; height: number };

export function measureInWindowAsync(
  ref: React.RefObject<any>
): Promise<Rect> {
  return new Promise((resolve, reject) => {
    if (!ref.current) {
      return reject(new Error('No ref'));
    }

    if (Platform.OS === 'web') {
      // 웹에서는 getBoundingClientRect 사용
      try {
        // ref.current가 DOM 노드일 수도 있고, _nativeTag를 가진 RN 컴포넌트일 수도 있음
        let element: HTMLElement | null = null;

        if (ref.current instanceof HTMLElement) {
          element = ref.current;
        } else if (ref.current._nativeTag) {
          // React Native Web 컴포넌트
          element = document.querySelector(
            `[data-rnw="${ref.current._nativeTag}"]`
          ) as HTMLElement;
        } else if (typeof ref.current.measure === 'function') {
          // measure 메서드가 있으면 사용
          ref.current.measure(
            (
              _x: number,
              _y: number,
              width: number,
              height: number,
              pageX: number,
              pageY: number
            ) => {
              resolve({ x: pageX, y: pageY, width, height });
            }
          );
          return;
        }

        if (!element && ref.current.getNode) {
          element = ref.current.getNode();
        }

        if (!element) {
          // 마지막 시도: findDOMNode 대안
          const node = findNodeHandle(ref.current);
          if (node && typeof node === 'number') {
            // 네이티브 노드 핸들 - 웹에서는 사용 불가
            return reject(new Error('Cannot measure on web'));
          }
          element = ref.current as unknown as HTMLElement;
        }

        if (element && typeof element.getBoundingClientRect === 'function') {
          const rect = element.getBoundingClientRect();
          resolve({
            x: rect.left,
            y: rect.top,
            width: rect.width,
            height: rect.height,
          });
        } else {
          reject(new Error('Cannot get bounding rect'));
        }
      } catch (e) {
        reject(e);
      }
    } else {
      // 네이티브 (iOS/Android)
      const node = findNodeHandle(ref.current);
      if (!node) {
        return reject(new Error('No node handle'));
      }

      ref.current.measureInWindow(
        (x: number, y: number, width: number, height: number) => {
          resolve({ x, y, width, height });
        }
      );
    }
  });
}
