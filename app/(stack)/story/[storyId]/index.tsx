import { useLocalSearchParams, useRouter } from 'expo-router';
import { Heart, Play } from 'lucide-react-native';
import { Image, ScrollView, Text, View } from 'react-native';
import { AppContainer } from '@/components/app/app-container';
import { FloatingContainer } from '@/components/common/FloatingContainer';
import { Button, ButtonText } from '@/components/ui/button';

const characters = [
  { id: 1, name: 'Riley', desc: '평범하지만 솔직한 주인공', emoji: '🎤' },
  { id: 2, name: 'Prince', desc: '차가운 톱 아이돌', emoji: '⭐' },
];

export default function StoryDetailScreen() {
  const { storyId } = useLocalSearchParams();
  const router = useRouter();

  return (
    <>
      <AppContainer
        showBackButton
        headerRight={<Heart size={20} color="#FF7AA2" />}
        hasFloatButton
      >
        <Image
          source={{
            uri: 'https://mina-test-images.s3.ap-northeast-2.amazonaws.com/riley.png',
          }}
          className="h-[340px] w-full rounded-b-[32px] bg-primary-500"
          resizeMode="contain"
        />
        <View className="px-5 pt-6">
          {/* Title */}
          <Text className="text-2xl font-extrabold text-[#3F414E]">
            Riley Cyrus: Star Life
          </Text>

          <View className="mt-1 flex-row items-center gap-2">
            <Text className="text-sm font-medium text-[#A1A4B2]">
              아이돌 · 로맨스 · 성장
            </Text>
            <View className="h-1 w-1 rounded-full bg-[#C5C7D6]" />
            <Text className="text-sm font-semibold text-[#8E97FD]">
              추천 레벨 · Intermediate
            </Text>
          </View>

          {/* Description */}
          <Text className="mt-4 leading-6 text-[#6D6F7B]">
            평범한 학생이던 Riley는 우연한 계기로 아이돌 세계에 발을 들이게
            된다. 차가운 스타 Prince와 얽히며 그녀의 일상은 점점 예상치 못한
            방향으로 흘러간다.
          </Text>

          {/* Meta Cards */}
          <View className="mt-6 flex-row gap-3">
            <View className="flex-1 rounded-2xl bg-[#F5F5FF] px-4 py-3">
              <Text className="text-xs font-medium text-[#8E97FD]">상태</Text>
              <Text className="mt-1 text-sm font-bold text-[#3F414E]">
                연재중
              </Text>
            </View>

            <View className="flex-1 rounded-2xl bg-[#FFF5F8] px-4 py-3">
              <Text className="text-xs font-medium text-[#FF7AA2]">
                에피소드
              </Text>
              <Text className="mt-1 text-sm font-bold text-[#3F414E]">
                24화
              </Text>
            </View>

            <View className="flex-1 rounded-2xl bg-[#F6FAFF] px-4 py-3">
              <Text className="text-xs font-medium text-[#6BA4FF]">길이</Text>
              <Text className="mt-1 text-sm font-bold text-[#3F414E]">
                5–7분
              </Text>
            </View>

            <View className="flex-1 rounded-2xl bg-[#FFF9F2] px-4 py-3">
              <Text className="text-xs font-medium text-[#FFB454]">좋아요</Text>
              <Text className="mt-1 text-sm font-bold text-[#3F414E]">
                24.3K
              </Text>
            </View>
          </View>

          {/* Characters */}
          <Text className="mb-3 mt-8 text-base font-bold text-[#3F414E]">
            Characters
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-4">
              {characters.map((c) => (
                <View
                  key={c.id}
                  className="w-[160px] rounded-[24px] bg-white p-4 shadow-sm"
                >
                  <View className="mb-3 h-12 w-12 items-center justify-center rounded-2xl bg-[#8E97FD]">
                    <Text className="text-xl">{c.emoji}</Text>
                  </View>
                  <Text className="font-bold text-[#3F414E]">{c.name}</Text>
                  <Text className="mt-1 text-xs leading-5 text-[#A1A4B2]">
                    {c.desc}
                  </Text>
                </View>
              ))}
            </View>
          </ScrollView>

          {/* Episode Preview */}
          <Text className="mb-3 mt-10 text-base font-bold text-[#3F414E]">
            Preview Episodes
          </Text>

          <View className="gap-4 pb-10">
            {[1, 2, 3].map((i) => (
              <View
                key={i}
                className="flex-row items-center gap-4 rounded-[24px] bg-white p-4 shadow-sm"
              >
                <View className="h-14 w-14 items-center justify-center rounded-2xl bg-[#F5F5F9]">
                  <Play size={18} color="#8E97FD" />
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-[#3F414E]">Episode {i}</Text>
                  <Text className="mt-1 text-xs text-[#A1A4B2]">
                    Riley의 새로운 하루가 시작된다
                  </Text>
                </View>
                <Text className="text-xs font-medium text-[#A1A4B2]">
                  5 min
                </Text>
              </View>
            ))}
          </View>
        </View>
      </AppContainer>
      <FloatingContainer>
        {/* CTA */}
        <Button
          action="primary"
          onPress={() => router.push(`/story/${storyId}/episodes/1/play`)}
        >
          <ButtonText>첫 화 읽기</ButtonText>
        </Button>
      </FloatingContainer>
    </>
  );
}
