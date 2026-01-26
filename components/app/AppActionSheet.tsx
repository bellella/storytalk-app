import React, { ReactNode } from "react";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
} from "@/components/ui/actionsheet";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
};

export function AppActionSheet({ isOpen, onClose, children }: Props) {
  return (
    <Actionsheet isOpen={isOpen} onClose={onClose}>
      <ActionsheetBackdrop />
      <ActionsheetContent className="w-full max-w-app self-center">
        {children}
      </ActionsheetContent>
    </Actionsheet>
  );
}
