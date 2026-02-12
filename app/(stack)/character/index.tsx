import { useQuery } from '@tanstack/react-query';
import { Link } from 'expo-router';
import { Crown, Users } from 'lucide-react-native';
import { Image, Pressable } from 'react-native';
import { AppContainer } from '@/components/app/app-container';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { characterFindAll } from '@/lib/api/generated/character/character';

const RANK_COLORS: Record<number, string> = {
  1: '#FFD700',
  2: '#C0C0C0',
  3: '#CD7F32',
};

export default function CharacterListScreen() {
  const { data, isLoading } = useQuery({
    queryKey: ['characters'],
    queryFn: () => characterFindAll(),
  });

  const characters = data ?? [];

  if (isLoading) return null;

  return (
    <AppContainer showBackButton headerTitle="캐릭터">
      <VStack className="px-6 py-6">
        {/* Top 3 Podium */}
        {characters.length >= 3 && (
          <HStack className="mb-8 items-end justify-center gap-3">
            {[characters[1], characters[0], characters[2]].map((char, idx) => {
              const rank = idx === 0 ? 2 : idx === 1 ? 1 : 3;
              const isFirst = rank === 1;
              return (
                <Link
                  key={char.id}
                  href={{
                    pathname: '/character/[id]',
                    params: { id: String(char.id) },
                  }}
                  asChild
                >
                  <Pressable className="items-center">
                    <Box
                      className="items-center justify-center overflow-hidden rounded-full border-2"
                      style={{
                        borderColor: RANK_COLORS[rank],
                        width: isFirst ? 96 : 72,
                        height: isFirst ? 96 : 72,
                      }}
                    >
                      {char.avatarImage ? (
                        <Image
                          source={{ uri: char.avatarImage }}
                          className="h-full w-full rounded-full"
                          resizeMode="cover"
                        />
                      ) : (
                        <Text className={isFirst ? 'text-4xl' : 'text-2xl'}>
                          {char.name?.charAt(0)}
                        </Text>
                      )}
                    </Box>
                    {/* Rank Badge */}
                    <Box
                      className="-mt-3 items-center justify-center rounded-full"
                      style={{
                        backgroundColor: RANK_COLORS[rank],
                        width: 24,
                        height: 24,
                      }}
                    >
                      {rank === 1 ? (
                        <Crown size={14} color="#fff" fill="#fff" />
                      ) : (
                        <Text className="text-xs font-bold text-white">
                          {rank}
                        </Text>
                      )}
                    </Box>
                    <Text
                      className={`mt-2 font-bold text-[#3F414E] ${
                        isFirst ? 'text-sm' : 'text-xs'
                      }`}
                    >
                      {char.name}
                    </Text>
                    <HStack className="mt-1 items-center gap-1">
                      <Users size={10} color="#A1A4B2" />
                      <Text className="text-[10px] font-semibold text-[#A1A4B2]">
                        {(char as any).follower ?? 0}
                      </Text>
                    </HStack>
                  </Pressable>
                </Link>
              );
            })}
          </HStack>
        )}

        {/* Full Ranking List */}
        <VStack className="gap-y-2">
          {characters.map((char, index) => {
            const rank = index + 1;
            return (
              <Link
                key={char.id}
                href={{
                  pathname: '/character/[id]',
                  params: { id: String(char.id) },
                }}
                asChild
              >
                <Pressable className="flex-row items-center gap-4 rounded-2xl bg-white p-4 active:bg-[#F5F5F9]">
                  {/* Rank */}
                  <Text
                    className="w-7 text-center text-lg font-black"
                    style={{
                      color: RANK_COLORS[rank] ?? '#A1A4B2',
                    }}
                  >
                    {rank}
                  </Text>

                  {/* Avatar */}
                  <Box className="h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-[#F5F5F9]">
                    {char.avatarImage ? (
                      <Image
                        source={{ uri: char.avatarImage }}
                        className="h-full w-full rounded-full"
                        resizeMode="cover"
                      />
                    ) : (
                      <Text className="text-2xl">
                        {char.name?.charAt(0)}
                      </Text>
                    )}
                  </Box>

                  {/* Info */}
                  <VStack className="flex-1">
                    <Text className="text-sm font-bold text-[#3F414E]">
                      {char.name}
                    </Text>
                  </VStack>

                  {/* Follower */}
                  <HStack className="items-center gap-1">
                    <Users size={12} color="#A1A4B2" />
                    <Text className="text-xs font-bold text-[#A1A4B2]">
                      {(char as any).follower ?? 0}
                    </Text>
                  </HStack>
                </Pressable>
              </Link>
            );
          })}
        </VStack>

        {!isLoading && characters.length === 0 && (
          <Box className="items-center py-20">
            <Text className="text-sm text-[#A1A4B2]">
              아직 만난 캐릭터가 없어요
            </Text>
          </Box>
        )}
      </VStack>
    </AppContainer>
  );
}
