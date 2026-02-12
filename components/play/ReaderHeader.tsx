import { useRouter } from 'expo-router';
import { ChevronDown, X } from 'lucide-react-native';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/lib/hooks/theme/useColors';

type SceneItem = { id: number; title: string; order: number };

interface ReaderHeaderProps {
  episodeTitle?: string;
  sceneIndex: number;
  totalScenes: number;
  progress: number;
  alwaysShowTranslation: boolean;
  onToggleTranslation: () => void;
  isCompleted?: boolean;
  scenes?: SceneItem[];
  onSceneSelect?: (index: number) => void;
}

export function ReaderHeader({
  episodeTitle,
  sceneIndex,
  totalScenes,
  progress,
  alwaysShowTranslation,
  onToggleTranslation,
  isCompleted,
  scenes,
  onSceneSelect,
}: ReaderHeaderProps) {
  const router = useRouter();
  const { colors } = useColors();
  const insets = useSafeAreaInsets();
  const [showSceneList, setShowSceneList] = useState(false);

  const handleClose = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  const sceneChipContent = (
    <>
      <Text className="text-xs font-bold text-[#6D6F7B]">
        Scene {sceneIndex + 1}/{totalScenes}
      </Text>
      {isCompleted && <ChevronDown size={12} color="#6D6F7B" />}
    </>
  );

  return (
    <View className="w-full bg-background" style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center justify-between px-4 pb-3 pt-2">
        <Pressable
          onPress={handleClose}
          className="h-10 w-10 items-center justify-center rounded-full"
          hitSlop={8}
        >
          <X size={22} color={colors.onBackground} />
        </Pressable>

        <Text
          className="flex-1 px-2 text-center text-xs font-extrabold uppercase tracking-widest text-[#8E97FD]"
          numberOfLines={1}
        >
          {episodeTitle ?? ''}
        </Text>

        <View className="flex-row items-center gap-2">
          <Pressable
            onPress={onToggleTranslation}
            className={`rounded-full px-3 py-1.5 ${
              alwaysShowTranslation ? 'bg-[#8E97FD]' : 'bg-[#F1F3FF]'
            }`}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text
              className={`text-xs font-bold ${
                alwaysShowTranslation ? 'text-white' : 'text-[#6D6F7B]'
              }`}
            >
              {alwaysShowTranslation ? '해석 ON' : '해석 OFF'}
            </Text>
          </Pressable>

          {isCompleted ? (
            <Pressable
              onPress={() => setShowSceneList(true)}
              className="flex-row items-center gap-1 rounded-full bg-[#F1F3FF] px-3 py-1.5"
            >
              {sceneChipContent}
            </Pressable>
          ) : (
            <View className="rounded-full bg-[#F1F3FF] px-3 py-1.5">
              <Text className="text-xs font-bold text-[#6D6F7B]">
                Scene {sceneIndex + 1}/{totalScenes}
              </Text>
            </View>
          )}
        </View>
      </View>

      <View className="mx-4 mb-4 h-1.5 overflow-hidden rounded-full bg-[#ECECF4]">
        <View
          className="h-full rounded-full bg-[#8E97FD]"
          style={{ width: `${progress}%` }}
        />
      </View>

      {/* Scene list modal */}
      {isCompleted && (
        <Modal
          visible={showSceneList}
          transparent
          animationType="fade"
          onRequestClose={() => setShowSceneList(false)}
        >
          <Pressable
            className="flex-1 bg-black/40"
            onPress={() => setShowSceneList(false)}
          >
            <View
              className="mx-4 mt-2 max-h-[50vh] rounded-2xl bg-white shadow-lg shadow-black/10"
              style={{ marginTop: insets.top + 56 }}
            >
              <Text className="px-4 pb-2 pt-4 text-xs font-bold uppercase tracking-widest text-[#A1A4B2]">
                Scenes
              </Text>
              <ScrollView bounces={false}>
                {scenes?.map((scene, idx) => {
                  const isCurrent = idx === sceneIndex;
                  return (
                    <Pressable
                      key={scene.id}
                      onPress={() => {
                        setShowSceneList(false);
                        onSceneSelect?.(idx);
                      }}
                      className={`flex-row items-center gap-3 px-4 py-3 ${
                        isCurrent ? 'bg-[#F1F3FF]' : ''
                      }`}
                    >
                      <View
                        className={`h-7 w-7 items-center justify-center rounded-full ${
                          isCurrent ? 'bg-[#8E97FD]' : 'bg-[#ECECF4]'
                        }`}
                      >
                        <Text
                          className={`text-xs font-bold ${
                            isCurrent ? 'text-white' : 'text-[#6D6F7B]'
                          }`}
                        >
                          {scene.order}
                        </Text>
                      </View>
                      <Text
                        className={`flex-1 text-sm ${
                          isCurrent
                            ? 'font-bold text-[#8E97FD]'
                            : 'font-medium text-[#3F414E]'
                        }`}
                        numberOfLines={1}
                      >
                        {scene.title}
                      </Text>
                      {isCurrent && (
                        <View className="rounded-full bg-[#8E97FD] px-2 py-0.5">
                          <Text className="text-[10px] font-bold text-white">
                            NOW
                          </Text>
                        </View>
                      )}
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>
          </Pressable>
        </Modal>
      )}
    </View>
  );
}
