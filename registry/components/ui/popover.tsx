"use client";

import { forwardRef, type ComponentRef } from "react";

import { Popover as BasePopover } from "@base-ui/react/popover";
import { mergeClassName } from "../../lib/utils";
import { popupClasses, popupMotionClasses } from "./styles";

export const Popover = BasePopover.Root;
export const PopoverTrigger = BasePopover.Trigger;
export const PopoverClose = BasePopover.Close;

export type PopoverContentProps = BasePopover.Popup.Props & {
  positionerProps?: BasePopover.Positioner.Props;
};

export const PopoverContent = forwardRef<
  ComponentRef<typeof BasePopover.Popup>,
  PopoverContentProps
>(function PopoverContent({ className, positionerProps, ...props }, ref) {
  return (
    <BasePopover.Portal>
      <BasePopover.Positioner
        sideOffset={8}
        align="start"
        {...positionerProps}
        className={mergeClassName("z-50", positionerProps?.className)}
      >
        <BasePopover.Popup
          ref={ref}
          {...props}
          className={mergeClassName(
            `${popupClasses} ${popupMotionClasses} w-72 max-w-[calc(100vw-2rem)] space-y-3 p-4`,
            className,
          )}
        />
      </BasePopover.Positioner>
    </BasePopover.Portal>
  );
});

export const PopoverTitle = forwardRef<
  ComponentRef<typeof BasePopover.Title>,
  BasePopover.Title.Props
>(function PopoverTitle({ className, ...props }, ref) {
  return (
    <BasePopover.Title
      ref={ref}
      {...props}
      className={mergeClassName("font-semibold", className)}
    />
  );
});

export const PopoverDescription = forwardRef<
  ComponentRef<typeof BasePopover.Description>,
  BasePopover.Description.Props
>(function PopoverDescription({ className, ...props }, ref) {
  return (
    <BasePopover.Description
      ref={ref}
      {...props}
      className={mergeClassName("text-body text-tertiary", className)}
    />
  );
});
