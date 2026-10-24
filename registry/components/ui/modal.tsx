"use client";

import { forwardRef, type ComponentProps, type ComponentRef } from "react";

import { Dialog as BaseModal } from "@base-ui/react/dialog";
import { cn, mergeClassName } from "../../lib/utils";
import { ButtonSizeContext } from "./button";
import { CloseIcon } from "./icons";
import { iconButtonClasses, modalMotionClasses, popupClasses } from "./styles";

export const Modal = BaseModal.Root;
export const ModalTrigger = BaseModal.Trigger;
export const ModalClose = BaseModal.Close;

export const ModalFooter = forwardRef<HTMLDivElement, ComponentProps<"div">>(
  function ModalFooter({ className, ...props }, ref) {
    return (
      <ButtonSizeContext.Provider value="md">
        <div
          ref={ref}
          {...props}
          data-modal-footer=""
          className={cn(
            "flex flex-wrap items-center justify-end gap-3",
            className,
          )}
        />
      </ButtonSizeContext.Provider>
    );
  },
);

export interface ModalContentProps extends BaseModal.Popup.Props {
  showCloseButton?: boolean;
}

export const ModalContent = forwardRef<
  ComponentRef<typeof BaseModal.Popup>,
  ModalContentProps
>(function ModalContent(
  { children, className, showCloseButton = true, ...props },
  ref,
) {
  return (
    <BaseModal.Portal>
      <BaseModal.Backdrop forceRender className="fixed inset-0 z-50 min-h-dvh bg-scrim transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none" />
      <BaseModal.Viewport className="fixed inset-0 z-50 grid place-items-center overflow-y-auto p-4">
        <BaseModal.Popup
          ref={ref}
          {...props}
          className={mergeClassName(
            `${popupClasses} relative max-h-[calc(100dvh-2rem)] w-full max-w-lg overflow-y-auto rounded-3xl p-6 ${modalMotionClasses}`,
            className,
          )}
        >
          {children}
          {showCloseButton && (
            <BaseModal.Close
              aria-label="关闭对话框"
              className={`${iconButtonClasses} absolute top-3 right-3`}
            >
              <CloseIcon />
            </BaseModal.Close>
          )}
        </BaseModal.Popup>
      </BaseModal.Viewport>
    </BaseModal.Portal>
  );
});

export const ModalTitle = forwardRef<
  ComponentRef<typeof BaseModal.Title>,
  BaseModal.Title.Props
>(function ModalTitle({ className, ...props }, ref) {
  return (
    <BaseModal.Title
      ref={ref}
      {...props}
      className={mergeClassName("pr-8 text-base font-semibold", className)}
    />
  );
});

export const ModalDescription = forwardRef<
  ComponentRef<typeof BaseModal.Description>,
  BaseModal.Description.Props
>(function ModalDescription({ className, ...props }, ref) {
  return (
    <BaseModal.Description
      ref={ref}
      {...props}
      className={mergeClassName("mt-2 text-body text-tertiary", className)}
    />
  );
});
