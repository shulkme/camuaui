"use client";

import { forwardRef, type ComponentRef } from "react";
import { ContextMenu as BaseContextMenu } from "@base-ui/react/context-menu";
import { mergeClassName } from "../../lib/utils";
import { popupClasses, popupMotionClasses } from "./styles";

// Base UI shares these primitives with Menu, so keep one styled implementation.
export {
  MenuItem as ContextMenuItem,
  MenuLinkItem as ContextMenuLinkItem,
  MenuGroup as ContextMenuGroup,
  MenuGroupLabel as ContextMenuGroupLabel,
  MenuSeparator as ContextMenuSeparator,
  MenuCheckboxItem as ContextMenuCheckboxItem,
  MenuRadioGroup as ContextMenuRadioGroup,
  MenuRadioItem as ContextMenuRadioItem,
  MenuSub as ContextMenuSub,
  MenuSubTrigger as ContextMenuSubTrigger,
} from "./menu";

export type {
  MenuItemVariant as ContextMenuItemVariant,
  MenuItemProps as ContextMenuItemProps,
  MenuLinkItemProps as ContextMenuLinkItemProps,
} from "./menu";

export const ContextMenu = BaseContextMenu.Root;
export const ContextMenuTrigger = BaseContextMenu.Trigger;

export type ContextMenuContentProps = BaseContextMenu.Popup.Props & {
  positionerProps?: BaseContextMenu.Positioner.Props;
};

export const ContextMenuContent = forwardRef<
  ComponentRef<typeof BaseContextMenu.Popup>,
  ContextMenuContentProps
>(function ContextMenuContent(
  { className, children, positionerProps, ...props },
  ref,
) {
  return (
    <BaseContextMenu.Portal>
      <BaseContextMenu.Positioner
        {...positionerProps}
        className={mergeClassName(
          "z-50 outline-none",
          positionerProps?.className,
        )}
      >
        <BaseContextMenu.Popup
          ref={ref}
          {...props}
          className={mergeClassName(
            `${popupClasses} ${popupMotionClasses} min-w-44 max-w-[calc(100vw-2rem)] max-h-(--available-height) overflow-y-auto p-1`,
            className,
          )}
        >
          {children}
        </BaseContextMenu.Popup>
      </BaseContextMenu.Positioner>
    </BaseContextMenu.Portal>
  );
});

export const ContextMenuSubContent = forwardRef<
  ComponentRef<typeof BaseContextMenu.Popup>,
  ContextMenuContentProps
>(function ContextMenuSubContent({ positionerProps, ...props }, ref) {
  return (
    <ContextMenuContent
      ref={ref}
      {...props}
      positionerProps={{
        sideOffset: -4,
        alignOffset: -4,
        ...positionerProps,
      }}
    />
  );
});
