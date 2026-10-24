"use client";

import { forwardRef, type ComponentRef, type ReactNode } from "react";

import { Menu as BaseMenu } from "@base-ui/react/menu";
import { mergeClassName } from "../../lib/utils";
import { CheckIcon, ChevronDownIcon, CloseIcon, SearchIcon } from "./icons";
import {
  focusClasses,
  itemClasses,
  popupClasses,
  popupMotionClasses,
  popupSearchClasses,
} from "./styles";

export const Menu = BaseMenu.Root;
export const MenuTrigger = BaseMenu.Trigger;
export const MenuGroup = BaseMenu.Group;
export const MenuRadioGroup = BaseMenu.RadioGroup;
export const MenuSub = BaseMenu.SubmenuRoot;
export const MenuFilterProvider = BaseMenu.FilterProvider;
export const createMenuHandle = BaseMenu.createHandle;

export type MenuItemVariant = "default" | "danger";

const menuItemClasses: Record<MenuItemVariant, string> = {
  default: itemClasses,
  danger: `${itemClasses} text-error-800 data-highlighted:bg-error-700/10`,
};

export type MenuItemProps = BaseMenu.Item.Props & {
  variant?: MenuItemVariant;
};

export type MenuLinkItemProps = BaseMenu.LinkItem.Props & {
  variant?: MenuItemVariant;
};

export type MenuContentProps = BaseMenu.Popup.Props & {
  positionerProps?: BaseMenu.Positioner.Props;
  header?: ReactNode;
  showArrow?: boolean;
};

export const MenuContent = forwardRef<
  ComponentRef<typeof BaseMenu.Popup>,
  MenuContentProps
>(function MenuContent(
  { className, children, positionerProps, header, showArrow = false, ...props },
  ref,
) {
  return (
    <BaseMenu.Portal>
      <BaseMenu.Positioner
        sideOffset={6}
        align="start"
        {...positionerProps}
        className={mergeClassName(
          "z-50 outline-none",
          positionerProps?.className,
        )}
      >
        <BaseMenu.Popup
          ref={ref}
          {...props}
          className={mergeClassName(
            `${popupClasses} ${popupMotionClasses} min-w-44 max-w-[calc(100vw-2rem)] ${header != null ? "p-0" : "p-1"}`,
            className,
          )}
        >
          {showArrow && (
            <BaseMenu.Arrow
              data-menu-arrow=""
              className="size-3 rotate-45 bg-surface-raised data-[side=bottom]:-top-1.5 data-[side=top]:-bottom-1.5 data-[side=left]:-right-1.5 data-[side=right]:-left-1.5"
            />
          )}
          {header}
          <BaseMenu.List
            className={
              header != null
                ? "max-h-[min(20rem,calc(var(--available-height)-3rem))] overflow-y-auto p-1"
                : "max-h-[min(20rem,calc(var(--available-height)-1rem))] overflow-y-auto"
            }
          >
            {children}
          </BaseMenu.List>
        </BaseMenu.Popup>
      </BaseMenu.Positioner>
    </BaseMenu.Portal>
  );
});

export const MenuSubTrigger = forwardRef<
  ComponentRef<typeof BaseMenu.SubmenuTrigger>,
  BaseMenu.SubmenuTrigger.Props
>(function MenuSubTrigger({ className, children, ...props }, ref) {
  return (
    <BaseMenu.SubmenuTrigger
      ref={ref}
      {...props}
      className={mergeClassName(
        `${itemClasses} justify-between data-popup-open:bg-surface-highlight`,
        className,
      )}
    >
      {children}
      <ChevronDownIcon className="ml-auto -rotate-90 rtl:rotate-90" />
    </BaseMenu.SubmenuTrigger>
  );
});

export const MenuSubContent = forwardRef<
  ComponentRef<typeof BaseMenu.Popup>,
  MenuContentProps
>(function MenuSubContent({ positionerProps, ...props }, ref) {
  return (
    <MenuContent
      ref={ref}
      {...props}
      positionerProps={{
        side: "inline-end",
        align: "start",
        sideOffset: 4,
        alignOffset: -4,
        ...positionerProps,
      }}
    />
  );
});

export const MenuInput = forwardRef<
  ComponentRef<typeof BaseMenu.Input>,
  BaseMenu.Input.Props
>(function MenuInput({ className, ...props }, ref) {
  return (
    <div data-popup-search="" className={popupSearchClasses}>
      <SearchIcon className="pointer-events-none shrink-0 text-tertiary" />
      <BaseMenu.Input
        ref={ref}
        {...props}
        className={mergeClassName(
          "min-h-7 w-full min-w-0 flex-1 bg-transparent text-body text-primary placeholder:text-tertiary outline-none",
          className,
        )}
      />
    </div>
  );
});

export const MenuClear = forwardRef<
  ComponentRef<typeof BaseMenu.Clear>,
  BaseMenu.Clear.Props
>(function MenuClear({ className, children, ...props }, ref) {
  return (
    <BaseMenu.Clear
      ref={ref}
      aria-label="清除搜索"
      {...props}
      className={mergeClassName(
        `inline-flex size-6 cursor-pointer items-center justify-center rounded-sm text-secondary hover:bg-surface-hover ${focusClasses}`,
        className,
      )}
    >
      {children ?? <CloseIcon />}
    </BaseMenu.Clear>
  );
});

export const MenuEmpty = forwardRef<
  ComponentRef<typeof BaseMenu.Empty>,
  BaseMenu.Empty.Props
>(function MenuEmpty({ className, ...props }, ref) {
  return (
    <BaseMenu.Empty
      ref={ref}
      {...props}
      className={mergeClassName(
        "px-2 py-4 text-center text-body text-tertiary",
        className,
      )}
    />
  );
});

export const MenuItem = forwardRef<
  ComponentRef<typeof BaseMenu.Item>,
  MenuItemProps
>(function MenuItem({ className, variant = "default", ...props }, ref) {
  return (
    <BaseMenu.Item
      ref={ref}
      {...props}
      data-variant={variant}
      className={mergeClassName(menuItemClasses[variant], className)}
    />
  );
});

export const MenuLinkItem = forwardRef<
  ComponentRef<typeof BaseMenu.LinkItem>,
  MenuLinkItemProps
>(function MenuLinkItem({ className, variant = "default", ...props }, ref) {
  return (
    <BaseMenu.LinkItem
      ref={ref}
      {...props}
      data-variant={variant}
      className={mergeClassName(menuItemClasses[variant], className)}
    />
  );
});

export const MenuGroupLabel = forwardRef<
  ComponentRef<typeof BaseMenu.GroupLabel>,
  BaseMenu.GroupLabel.Props
>(function MenuGroupLabel({ className, ...props }, ref) {
  return (
    <BaseMenu.GroupLabel
      ref={ref}
      {...props}
      className={mergeClassName(
        "px-2 py-2 text-label text-secondary",
        className,
      )}
    />
  );
});

export const MenuSeparator = forwardRef<
  ComponentRef<typeof BaseMenu.Separator>,
  BaseMenu.Separator.Props
>(function MenuSeparator({ className, ...props }, ref) {
  return (
    <BaseMenu.Separator
      ref={ref}
      {...props}
      className={mergeClassName("my-1 h-px bg-divider", className)}
    />
  );
});

export const MenuCheckboxItem = forwardRef<
  ComponentRef<typeof BaseMenu.CheckboxItem>,
  BaseMenu.CheckboxItem.Props
>(function MenuCheckboxItem({ className, children, ...props }, ref) {
  return (
    <BaseMenu.CheckboxItem
      ref={ref}
      {...props}
      className={mergeClassName(`${itemClasses} justify-between`, className)}
    >
      {children}
      <BaseMenu.CheckboxItemIndicator>
        <CheckIcon />
      </BaseMenu.CheckboxItemIndicator>
    </BaseMenu.CheckboxItem>
  );
});

export const MenuRadioItem = forwardRef<
  ComponentRef<typeof BaseMenu.RadioItem>,
  BaseMenu.RadioItem.Props
>(function MenuRadioItem({ className, children, ...props }, ref) {
  return (
    <BaseMenu.RadioItem
      ref={ref}
      {...props}
      className={mergeClassName(`${itemClasses} justify-between`, className)}
    >
      {children}
      <BaseMenu.RadioItemIndicator>
        <CheckIcon />
      </BaseMenu.RadioItemIndicator>
    </BaseMenu.RadioItem>
  );
});
