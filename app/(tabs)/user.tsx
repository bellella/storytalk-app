import {
  Bookmark,
  ChevronRight,
  Flame,
  Settings,
  Star,
} from 'lucide-react-native';
import { Pressable, ScrollView } from 'react-native';
import { AppContainer } from '@/components/app/app-container';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { useUser } from '@/lib/hooks/auth/userUser';

export default function ProfileScreen() {
  const { user } = useUser();
  const savedExpressions = [
    { id: 1, en: 'Confidence just evaporated', ko: '자신감이 증발해버렸어' },
    { id: 2, en: 'Organize books', ko: '책을 정리하다' },
    { id: 3, en: 'Louder than this room', ko: '이 방보다 더 크게' },
  ];

  return (
    <AppContainer showHeaderLogo>
      <Box className="px-6 py-8">
        {/* Header */}
        <Box className="mb-8 flex-row items-center justify-between">
          <Text className="text-3xl font-bold text-[#3F414E]">내 여정</Text>
          <Settings size={24} color="#A1A4B2" />
        </Box>

        {/* User Info */}
        <Box className="mb-10 flex-row items-center gap-5">
          <Box className="h-24 w-24 items-center justify-center rounded-[35px] bg-[#8E97FD] shadow-lg shadow-[#8E97FD]/30">
            <Text className="text-4xl">🙋‍♂️</Text>
          </Box>
          <Box>
            <Text className="text-2xl font-bold text-[#3F414E]">
              {user?.name} 님
            </Text>
            <Text className="font-medium text-[#A1A4B2]">
              Level {user?.level} • Explorer
            </Text>
          </Box>
        </Box>

        {/* Stats */}
        <Box className="mb-10 grid grid-cols-2 gap-4">
          <Box className="rounded-[25px] bg-[#F5F5F9] p-5">
            <Box className="mb-1 flex-row items-center gap-2 text-[#8E97FD]">
              <Flame size={18} color="#8E97FD" />
              <Text className="text-xl font-black text-[#8E97FD]">
                {user?.streakDays}
              </Text>
            </Box>
            <Text className="text-xs font-bold uppercase text-[#A1A4B2]">
              Streak Days
            </Text>
          </Box>

          <Box className="rounded-[25px] bg-[#F5F5F9] p-5">
            <Box className="mb-1 flex-row items-center gap-2 text-[#FFDB9D]">
              <Star size={18} color="#FFDB9D" fill="#FFDB9D" />
              <Text className="text-xl font-black text-[#FFDB9D]">
                {user?.xp}
              </Text>
            </Box>
            <Text className="text-xs font-bold uppercase text-[#A1A4B2]">
              Total EXP
            </Text>
          </Box>
        </Box>

        {/* Current Story */}
        <Text className="mb-4 text-xl font-bold text-[#3F414E]">
          진행 중인 학습
        </Text>
        <Box className="relative mb-10 overflow-hidden rounded-[30px] bg-[#8E97FD] p-6">
          <Box className="relative z-10">
            <Text className="mb-1 text-lg font-bold text-white">
              오디션 장의 긴장감
            </Text>
            <Box className="mb-2 flex-row items-end justify-between">
              <Text className="text-xs font-medium text-white/80">
                진행률 65%
              </Text>
              <Text className="text-xs font-black uppercase tracking-tighter text-white">
                Story
              </Text>
            </Box>
            <Box className="h-2 overflow-hidden rounded-full bg-white/20">
              <Box className="h-full w-[65%] rounded-full bg-white" />
            </Box>
          </Box>

          <Text className="absolute right-[-10px] top-[-10px] text-6xl opacity-20">
            🎤
          </Text>
        </Box>

        {/* Saved Expressions */}
        <Box className="mb-4 flex-row items-center justify-between">
          <Text className="text-xl font-bold text-[#3F414E]">보관된 표현</Text>
          <Pressable>
            <Text className="text-sm font-bold text-[#8E97FD]">전체보기</Text>
          </Pressable>
        </Box>

        <Box className="space-y-3">
          {savedExpressions.map((item) => (
            <Pressable
              key={item.id}
              className="group flex-row items-center justify-between rounded-[25px] border border-[#F1F1F1] p-5 active:border-[#8E97FD]"
            >
              <Box className="flex-row items-center gap-4">
                <Box className="h-10 w-10 items-center justify-center rounded-xl bg-[#F5F5F9]">
                  <Bookmark
                    size={18}
                    color={item.id === 1 ? '#8E97FD' : '#A1A4B2'}
                    fill={item.id === 1 ? '#8E97FD' : 'none'}
                  />
                </Box>
                <Box>
                  <Text className="font-bold text-[#3F414E]">{item.en}</Text>
                  <Text className="text-xs font-medium text-[#A1A4B2]">
                    {item.ko}
                  </Text>
                </Box>
              </Box>

              <ChevronRight size={18} color="#EBEAEC" />
            </Pressable>
          ))}
        </Box>
      </Box>
    </AppContainer>
  );
}
