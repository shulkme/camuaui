"use client";

import {
  createContext,
  forwardRef,
  useContext,
  type ComponentRef,
} from "react";

import { Select as BaseSelect } from "@base-ui/react/select";
import { mergeClassName } from "../../lib/utils";
import { CheckIcon, ChevronDownIcon } from "./icons";
import {
  controlClasses,
  controlSizeClasses,
  type ControlSize,
  itemClasses,
  popupClasses,
  popupMotionClasses,
} from "./styles";

const SelectSizeContext = createContext<ControlSize>("md");
export type SelectProps<
  Value,
  Multiple extends boolean | undefined = false,
> = BaseSelect.Root.Props<Value, Multiple> & { size?: ControlSize };
export function Select<Value, Multiple extends boolean | undefined = false>({
  size = "md",
  ...props
}: SelectProps<Value, Multiple>) {
  return (
    <SelectSizeContext.Provider value={size}>
      <BaseSelect.Root<Value, Multiple> {...props} />
    </SelectSizeContext.Provider>
  );
}
export const SelectValue = BaseSelect.Value;
export const SelectGroup = BaseSelect.Group;

export const SelectLabel = forwardRef<
  ComponentRef<typeof BaseSelect.Label>,
  BaseSelect.Label.Props
>(function SelectLabel({ className, ...props }, ref) {
  return (
    <BaseSelect.Label
      ref={ref}
      {...props}
      className={mergeClassName("mb-2 block text-body font-medium", className)}
    />
  );
});

export const SelectTrigger = forwardRef<
  ComponentRef<typeof BaseSelect.Trigger>,
  BaseSelect.Trigger.Props & { size?: ControlSize }
>(function SelectTrigger(
  { className, children, size: sizeProp, ...props },
  ref,
) {
  const inheritedSize = useContext(SelectSizeContext);
  const size = sizeProp ?? inheritedSize;
  return (
    <BaseSelect.Trigger
      ref={ref}
      {...props}
      data-size={size}
      className={mergeClassName(
        `${controlClasses} ${controlSizeClasses[size]} flex cursor-pointer items-center justify-between gap-3 text-left data-placeholder:text-tertiary data-disabled:data-placeholder:text-quaternary`,
        className,
      )}
    >
      {children ?? <SelectValue />}
      <BaseSelect.Icon className="ml-auto inline-flex shrink-0 text-current transition-transform duration-200 ease-out data-popup-open:rotate-180 motion-reduce:transition-none">
        <ChevronDownIcon />
      </BaseSelect.Icon>
    </BaseSelect.Trigger>
  );
});

export type SelectContentProps = BaseSelect.Popup.Props & {
  positionerProps?: BaseSelect.Positioner.Props;
};

export const SelectContent = forwardRef<
  ComponentRef<typeof BaseSelect.Popup>,
  SelectContentProps
>(function SelectContent(
  { className, children, positionerProps, ...props },
  ref,
) {
  return (
    <BaseSelect.Portal>
      <BaseSelect.Positioner
        sideOffset={6}
        alignItemWithTrigger={false}
        align="start"
        {...positionerProps}
        className={mergeClassName(
          "z-50 outline-none",
          positionerProps?.className,
        )}
      >
        <BaseSelect.Popup
          ref={ref}
          {...props}
          className={mergeClassName(
            `${popupClasses} ${popupMotionClasses} min-w-(--anchor-width) p-1 transition-[opacity,scale,translate] duration-200 ease-out data-[side=bottom]:data-starting-style:-translate-y-2 data-[side=bottom]:data-ending-style:-translate-y-2 data-[side=top]:data-starting-style:translate-y-2 data-[side=top]:data-ending-style:translate-y-2`,
            className,
          )}
        >
          <BaseSelect.List className="max-h-[min(20rem,calc(var(--available-height)-1rem))] overflow-y-auto">
            {children}
          </BaseSelect.List>
        </BaseSelect.Popup>
      </BaseSelect.Positioner>
    </BaseSelect.Portal>
  );
});

export const SelectItem = forwardRef<
  ComponentRef<typeof BaseSelect.Item>,
  BaseSelect.Item.Props
>(function SelectItem({ className, children, ...props }, ref) {
  return (
    <BaseSelect.Item
      ref={ref}
      {...props}
      className={mergeClassName(`${itemClasses} justify-between`, className)}
    >
      <BaseSelect.ItemText>{children}</BaseSelect.ItemText>
      <BaseSelect.ItemIndicator className="ml-3">
        <CheckIcon />
      </BaseSelect.ItemIndicator>
    </BaseSelect.Item>
  );
});

export const SelectGroupLabel = forwardRef<
  ComponentRef<typeof BaseSelect.GroupLabel>,
  BaseSelect.GroupLabel.Props
>(function SelectGroupLabel({ className, ...props }, ref) {
  return (
    <BaseSelect.GroupLabel
      ref={ref}
      {...props}
      className={mergeClassName(
        "px-2 py-2 text-label text-secondary",
        className,
      )}
    />
  );
});
