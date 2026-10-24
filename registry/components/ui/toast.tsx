"use client";

import { forwardRef, type ComponentRef } from "react";

import { Toast as BaseToast } from "@base-ui/react/toast";
import { mergeClassName } from "../../lib/utils";
import { CloseIcon } from "./icons";
import { iconButtonClasses, popupShadowClasses } from "./styles";

export const toast = BaseToast.createToastManager();
export const useToast = BaseToast.useToastManager;

export const Toast = forwardRef<
  ComponentRef<typeof BaseToast.Root>,
  BaseToast.Root.Props
>(function Toast({ className, ...props }, ref) {
  return (
    <BaseToast.Root
      ref={ref}
      swipeDirection={["left", "right", "down"]}
      {...props}
      className={mergeClassName(
        `toast-motion absolute right-0 bottom-0 w-full origin-bottom rounded-3xl border-0 bg-surface-raised text-body text-primary outline-none select-none focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-accent-700 [--surface-muted:var(--surface-highlight)] ${popupShadowClasses}`,
        className,
      )}
    />
  );
});

export function ToastProvider({
  children,
  ...props
}: BaseToast.Provider.Props) {
  return (
    <BaseToast.Provider
      toastManager={toast}
      timeout={5000}
      limit={3}
      {...props}
    >
      {children}
      <Toaster />
    </BaseToast.Provider>
  );
}

export function Toaster() {
  const { toasts } = BaseToast.useToastManager();
  return (
    <BaseToast.Portal>
      <BaseToast.Viewport className="fixed right-4 bottom-4 z-100 w-[calc(100vw-2rem)] max-w-sm outline-none sm:right-6 sm:bottom-6">
        {toasts.map((item) => (
          <Toast key={item.id} toast={item}>
            <BaseToast.Content className="relative overflow-hidden p-6 transition-opacity duration-200 data-behind:opacity-0 data-expanded:opacity-100 motion-reduce:transition-none">
              <div className="pr-8">
                <BaseToast.Title className="font-semibold">
                  {item.title}
                </BaseToast.Title>
                {item.description && (
                  <BaseToast.Description className="mt-1 text-tertiary">
                    {item.description}
                  </BaseToast.Description>
                )}
                {item.actionProps && (
                  <BaseToast.Action
                    className={mergeClassName(
                      "mt-3 cursor-pointer rounded-full bg-surface-highlight px-3 py-1.5 text-label font-medium hover:bg-surface-hover",
                      item.actionProps.className,
                    )}
                  />
                )}
              </div>
              <BaseToast.Close
                aria-label="关闭通知"
                className={`${iconButtonClasses} absolute top-4 right-4`}
              >
                <CloseIcon />
              </BaseToast.Close>
            </BaseToast.Content>
          </Toast>
        ))}
      </BaseToast.Viewport>
    </BaseToast.Portal>
  );
}
