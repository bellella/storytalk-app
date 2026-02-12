import { useQuery } from '@tanstack/react-query';
import { Link } from 'expo-router';
import { ChevronRight, Users } from 'lucide-react-native';
import { ScrollView } from 'react-native';
import { CharacterAvatar } from '@/components/chat/CharacterAvatar';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { characterFindAll } from '@/lib/api/generated/character/character';

const MAX_DISPLAY = 10;

export function CharacterRankingPreview() {
  const { data } = useQuery({
    queryKey: ['characters'],
    queryFn: () => characterFindAll(),
  });

  const characters = (data ?? []).slice(0, MAX_DISPLAY);

  if (!characters.length) return null;

  return (
    <VStack className="mt-4 mb-6">
      {/* Section Header */}
      <HStack className="mb-4 items-center justify-between">
        <Text className="text-xl font-bold text-[#3F414E]">인기 캐릭터</Text>
        <Link href="/character" asChild>
          <Pressable className="flex-row items-center gap-0.5">
            <Text className="text-xs font-semibold text-[#8E97FD]">
              전체보기
            </Text>
            <ChevronRight size={14} color="#8E97FD" />
          </Pressable>
        </Link>
      </HStack>

      {/* Horizontal Scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 14, paddingRight: 24 }}
      >
        {characters.map((char, index) => (
          <Link
            key={char.id}
            href={{
              pathname: '/character/[id]',
              params: { id: String(char.id) },
            }}
            asChild
          >
            <Pressable className="w-20 items-center">
              {/* Rank Badge */}
              <Box className="mb-1">
                <Text
                  className="text-center text-[10px] font-black"
                  style={{
                    color:
                      index === 0
                        ? '#FFD700'
                        : index === 1
                          ? '#C0C0C0'
                          : index === 2
                            ? '#CD7F32'
                            : '#A1A4B2',
                  }}
                >
                  {index + 1}
                </Text>
              </Box>

              {/* Avatar */}
              <CharacterAvatar
                name={char.name}
                avatarImage={char.avatarImage}
                avatarClassName="h-16 w-16 rounded-full text-2xl"
              />

              {/* Name */}
              <Text
                numberOfLines={1}
                className="mt-2 text-center text-xs font-bold text-[#3F414E]"
              >
                {char.name}
              </Text>

              {/* Follower */}
              <HStack className="mt-0.5 items-center gap-0.5">
                <Users size={8} color="#A1A4B2" />
                <Text className="text-[10px] font-semibold text-[#A1A4B2]">
                  {(char as any).follower ?? 0}
                </Text>
              </HStack>
            </Pressable>
          </Link>
        ))}
      </ScrollView>
    </VStack>
  );
}
