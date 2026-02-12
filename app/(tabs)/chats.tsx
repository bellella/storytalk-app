import { useQuery } from '@tanstack/react-query';
import { Link } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { Pressable, ScrollView } from 'react-native';
import { AppContainer } from '@/components/app/app-container';
import { CharacterAvatar } from '@/components/chat/CharacterAvatar';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { friendGetFriends } from '@/lib/api/generated/friend/friend';

export default function ChatsScreen() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['friends'],
    queryFn: () => friendGetFriends(),
  });

  const friends = data ?? [];
  const chatFriends = friends.filter((f) => f.chatId != null);

  return (
    <AppContainer showHeaderLogo>
      <Box className="px-6 py-8">
        {/* Header */}
        <Box className="mb-6 flex-row items-center justify-between">
          <Text className="text-3xl font-bold text-[#3F414E]">채팅</Text>
          <Pressable className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F5F5F9]">
            <Plus size={20} color="#3F414E" />
          </Pressable>
        </Box>

        {/* Friends horizontal list */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-2 pb-6"
          contentContainerStyle={{ gap: 20 }}
        >
          {friends.map((friend) => (
            <Box
              key={friend.characterId}
              className="flex min-w-[60px] flex-col items-center gap-2"
            >
              <CharacterAvatar
                name={friend.name}
                avatarImage={friend.avatarImage}
                showUnreadDot={friend.unreadCount > 0}
                avatarClassName="h-14 w-14 text-2xl"
              />
              <Text className="text-xs font-bold text-[#3F414E]">
                {friend.name}
              </Text>
            </Box>
          ))}
        </ScrollView>
      </Box>

      {/* Chat list */}
      <Box className="space-y-2 px-6">
        {isLoading && (
          <Text className="py-4 text-center text-xs text-[#A1A4B2]">
            채팅 목록을 불러오는 중이에요...
          </Text>
        )}
        {isError && (
          <Text className="py-4 text-center text-xs text-red-500">
            채팅 목록을 불러오지 못했어요. 잠시 후 다시 시도해주세요.
          </Text>
        )}
        {!isLoading &&
          !isError &&
          chatFriends.map((friend) => (
            <Link
              key={friend.chatId ?? friend.characterId}
              href={{
                pathname: '/chats/[id]',
                params: {
                  id: String(friend.characterId),
                  chatId: friend.chatId ? String(friend.chatId) : undefined,
                  name: friend.name,
                },
              }}
              asChild
            >
              <Pressable className="flex flex-row items-center gap-4 rounded-[25px] p-4 active:bg-[#F5F5F9]">
                <CharacterAvatar
                  name={friend.name}
                  avatarImage={friend.avatarImage}
                  avatarClassName="h-14 w-14 border border-[#EBEAEC] bg-[#F5F5F9] text-2xl"
                />
                <Box className="flex-1">
                  <Box className="mb-1 flex-row items-center justify-between">
                    <Text className="font-bold text-[#3F414E]">
                      {friend.name}
                    </Text>
                    <Text className="text-[10px] font-medium text-[#A1A4B2]">
                      {friend.lastMessageAt
                        ? friend.lastMessageAt.slice(11, 16)
                        : ''}
                    </Text>
                  </Box>
                  <Text
                    numberOfLines={1}
                    className="max-w-[180px] truncate text-sm text-[#A1A4B2]"
                  >
                    {friend.lastMessagePreview ?? ''}
                  </Text>
                </Box>

                {friend.unreadCount > 0 && (
                  <Box className="flex h-5 w-5 items-center justify-center rounded-full bg-[#8E97FD]">
                    <Text className="text-[10px] font-bold text-white">
                      {friend.unreadCount}
                    </Text>
                  </Box>
                )}
              </Pressable>
            </Link>
          ))}
      </Box>
    </AppContainer>
  );
}
