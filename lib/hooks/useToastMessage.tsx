import { useToast, Toast, ToastTitle, ToastDescription } from "@/components/ui/toast";

/**
 * 전역적으로 사용 가능한 토스트 메시지 훅
 * 성공/실패/경고/정보 메시지를 토스트로 표시
 */
export function useToastMessage() {
  const toast = useToast();

  const showError = (error: unknown, title: string = "오류") => {
    let message = "문제가 발생했습니다";

    if (error instanceof Error) {
      message = error.message;
    } else if (typeof error === "string") {
      message = error;
    }

    toast.show({
      placement: "bottom",
      duration: 3000,
      render: ({ id }) => (
        <Toast nativeID={id} action="error" variant="solid">
          <ToastTitle>{title}</ToastTitle>
          <ToastDescription>{message}</ToastDescription>
        </Toast>
      ),
    });
  };

  const showSuccess = (message: string, title?: string) => {
    toast.show({
      placement: "bottom",
      duration: 3000,
      render: ({ id }) => (
        <Toast nativeID={id} action="success" variant="solid">
          {title && <ToastTitle>{title}</ToastTitle>}
          <ToastDescription>{message}</ToastDescription>
        </Toast>
      ),
    });
  };

  const showWarning = (message: string, title: string = "경고") => {
    toast.show({
      placement: "bottom",
      duration: 3000,
      render: ({ id }) => (
        <Toast nativeID={id} action="warning" variant="solid">
          <ToastTitle>{title}</ToastTitle>
          <ToastDescription>{message}</ToastDescription>
        </Toast>
      ),
    });
  };

  const showInfo = (message: string, title: string = "알림") => {
    toast.show({
      placement: "bottom",
      duration: 3000,
      render: ({ id }) => (
        <Toast nativeID={id} action="info" variant="solid">
          <ToastTitle>{title}</ToastTitle>
          <ToastDescription>{message}</ToastDescription>
        </Toast>
      ),
    });
  };

  return {
    showError,
    showSuccess,
    showWarning,
    showInfo,
  };
}
