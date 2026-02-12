import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils/classnames';
import { Avatar, AvatarImage } from '../ui/avatar';

type CharacterAvatarProps = {
  name: string;
  avatarImage?: string | null;
  /** 오른쪽 아래 초록 점 표시 여부 (읽지 않은 메시지) */
  showUnreadDot?: boolean;
  /** 아바타를 감싸는 컨테이너 클래스 (보통 크기/레이아웃 지정) */
  containerClassName?: string;
  /** 실제 아바타 박스 클래스 (배경/테두리/크기 등) */
  avatarClassName?: string;
};

const getInitialsEmoji = (name: string) => {
  if (!name) return '🦉';
  const first = name.trim().charAt(0).toUpperCase();
  // 간단한 매핑으로 이름에 따라 다른 이모지 제공
  if ('AEIOU'.includes(first)) return '🪽';
  if ('KLMN'.includes(first)) return '🦊';
  if ('RST'.includes(first)) return '🐰';
  return '🦉';
};

export function CharacterAvatar({
  name,
  avatarImage,
  showUnreadDot,
  containerClassName,
  avatarClassName,
}: CharacterAvatarProps) {
  return (
    <Box className={cn('relative', containerClassName)}>
      <Box
        className={cn(
          'flex items-center justify-center rounded-2xl bg-[#EBEAEC]',
          avatarClassName
        )}
      >
        <Avatar>
          <AvatarImage source={{ uri: avatarImage ?? '' }} />
        </Avatar>
      </Box>
      {/* {showUnreadDot && (
        <Box className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white bg-[#58CC02]" />
      )} */}
    </Box>
  );
}
