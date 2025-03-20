"use client";

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastTitle,
  Viewport as ToastViewport,
  Provider as ToastProvider,
} from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "next-themes"; // Add this import

export function Toaster() {
  const { toasts } = useToast();
  const { theme } = useTheme(); // Get the current theme

  return (
    <ToastProvider swipeDirection="right">
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
