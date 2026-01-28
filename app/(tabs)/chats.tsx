import { Link } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { Pressable, ScrollView } from 'react-native';
import { AppContainer } from '@/components/app/app-container';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';

export default function ChatsScreen() {
  const friends = [
    { id: 1, name: 'Anna', img: '👩‍🦰', online: true },
    { id: 2, name: 'Jake', img: '👱‍♂️', online: true },
    { id: 3, name: 'Sera', img: '👩', online: false },
    { id: 4, name: 'Kevin', img: '👨‍🦱', online: true },
    { id: 5, name: 'Liam', img: '👦', online: false },
  ];

  const messages = [
    {
      id: 1,
      name: 'Anna',
      lastMsg: '오늘 공부한 표현 정말 유용했어!',
      time: '14:20',
      unread: 2,
      img: '👩‍🦰',
    },
    {
      id: 2,
      name: 'Jake',
      lastMsg: '오디션 스토리 다 끝냈어? 🎤',
      time: '12:05',
      unread: 0,
      img: '👱‍♂️',
    },
    {
      id: 3,
      name: 'StoryLingo Bot',
      lastMsg: '새로운 스토리가 업데이트 되었습니다!',
      time: '어제',
      unread: 0,
      img: '🦉',
    },
  ];

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
              key={friend.id}
              className="flex min-w-[60px] flex-col items-center gap-2"
            >
              <Box className="relative">
                <Box className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EBEAEC] text-2xl">
                  <Text>{friend.img}</Text>
                </Box>
                {friend.online && (
                  <Box className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white bg-[#58CC02]" />
                )}
              </Box>
              <Text className="text-xs font-bold text-[#3F414E]">
                {friend.name}
              </Text>
            </Box>
          ))}
        </ScrollView>
      </Box>

      {/* Chat list */}
      <Box className="space-y-2 px-6">
        {messages.map((msg) => (
          <Link key={msg.id} href={`/chats/${msg.id}`} asChild>
            <Pressable className="flex flex-row items-center gap-4 rounded-[25px] p-4 active:bg-[#F5F5F9]">
              <Box className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#EBEAEC] bg-[#F5F5F9] text-2xl">
                <Text>{msg.img}</Text>
              </Box>
              <Box className="flex-1">
                <Box className="mb-1 flex-row items-center justify-between">
                  <Text className="font-bold text-[#3F414E]">{msg.name}</Text>
                  <Text className="text-[10px] font-medium text-[#A1A4B2]">
                    {msg.time}
                  </Text>
                </Box>
                <Text
                  numberOfLines={1}
                  className="max-w-[180px] truncate text-sm text-[#A1A4B2]"
                >
                  {msg.lastMsg}
                </Text>
              </Box>

              {msg.unread > 0 && (
                <Box className="flex h-5 w-5 items-center justify-center rounded-full bg-[#8E97FD]">
                  <Text className="text-[10px] font-bold text-white">
                    {msg.unread}
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
