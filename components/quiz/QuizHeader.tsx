import React from 'react';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';

type QuizHeaderProps = {
  type: string;
  question: string;
  description: string;
};

export function QuizHeader({ type, question, description }: QuizHeaderProps) {
  return (
    <Box className="mb-6 px-4">
      <Box className="mb-3 self-start rounded-full bg-[#8E97FD]/10 px-3 py-1">
        <Text className="text-[10px] font-black uppercase tracking-widest text-[#8E97FD]">
          {type.replace('_', ' ')}
        </Text>
      </Box>
      <Text className="text-xl font-bold leading-tight text-[#3F414E]">
        {question}
      </Text>
    </Box>
  );
}
