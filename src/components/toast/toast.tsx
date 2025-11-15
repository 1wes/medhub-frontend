// src/components/ToastNotification.tsx
import React, { useEffect } from "react";
import { notification } from "antd";

export type NotificationType = "success" | "info" | "warning" | "error";

interface ToastNotificationProps {
  open: boolean;
  type: NotificationType;
  message: string;
  description: string;
  duration?: number;
  onClose?: () => void;
}

const ToastNotification: React.FC<ToastNotificationProps> = ({
  open,
  type,
  message,
  description,
  duration = 3,
  onClose,
}) => {
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    if (open) {
      api[type]({
        message,
        description,
        duration,
        placement: "bottomRight",
        onClose,
      });
    }
  }, [open, api, type, message, description, duration, onClose]);

  return <>{contextHolder}</>;
};

export default ToastNotification;
