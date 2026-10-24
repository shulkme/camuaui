"use client";

import { forwardRef, type ComponentProps, type ComponentRef } from "react";

import { AlertDialog as BaseDialog } from "@base-ui/react/alert-dialog";
import { cn, mergeClassName } from "../../lib/utils";
import { ButtonSizeContext } from "./button";
import { CloseIcon } from "./icons";
import { iconButtonClasses, modalMotionClasses, popupClasses } from "./styles";

export const Dialog = BaseDialog.Root;
export const DialogTrigger = BaseDialog.Trigger;
export const DialogClose = BaseDialog.Close;
export const DialogCancel = BaseDialog.Close;
export const DialogAction = BaseDialog.Close;
export const createDialogHandle = BaseDialog.createHandle;

export const DialogFooter = forwardRef<HTMLDivElement, ComponentProps<"div">>(
  function DialogFooter({ className, ...props }, ref) {
    return (
      <ButtonSizeContext.Provider value="md">
        <div
          ref={ref}
          {...props}
          data-dialog-footer=""
          className={cn(
            "flex flex-wrap items-center justify-end gap-3",
            className,
          )}
        />
      </ButtonSizeContext.Provider>
    );
  },
);

export interface DialogContentProps extends BaseDialog.Popup.Props {
  showCloseButton?: boolean;
}

export const DialogContent = forwardRef<
  ComponentRef<typeof BaseDialog.Popup>,
  DialogContentProps
>(function DialogContent(
  { children, className, showCloseButton = false, ...props },
  ref,
) {
  return (
    <BaseDialog.Portal>
      <BaseDialog.Backdrop forceRender className="fixed inset-0 z-50 min-h-dvh bg-scrim transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none" />
      <BaseDialog.Viewport className="fixed inset-0 z-50 grid place-items-center overflow-y-auto p-4">
        <BaseDialog.Popup
          ref={ref}
          {...props}
          className={mergeClassName(
            `${popupClasses} relative max-h-[calc(100dvh-2rem)] w-full max-w-lg overflow-y-auto rounded-3xl p-6 ${modalMotionClasses}`,
            className,
          )}
        >
          {children}
          {showCloseButton && (
            <BaseDialog.Close
              aria-label="关闭对话框"
              className={`${iconButtonClasses} absolute top-3 right-3`}
            >
              <CloseIcon />
            </BaseDialog.Close>
          )}
        </BaseDialog.Popup>
      </BaseDialog.Viewport>
    </BaseDialog.Portal>
  );
});

export const DialogTitle = forwardRef<
  ComponentRef<typeof BaseDialog.Title>,
  BaseDialog.Title.Props
>(function DialogTitle({ className, ...props }, ref) {
  return (
    <BaseDialog.Title
      ref={ref}
      {...props}
      className={mergeClassName("text-base font-semibold", className)}
    />
  );
});

export const DialogDescription = forwardRef<
  ComponentRef<typeof BaseDialog.Description>,
  BaseDialog.Description.Props
>(function DialogDescription({ className, ...props }, ref) {
  return (
    <BaseDialog.Description
      ref={ref}
      {...props}
      className={mergeClassName("mt-2 text-body text-tertiary", className)}
    />
  );
});
