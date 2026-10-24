"use client";

import {
  createContext,
  forwardRef,
  useContext,
  type ComponentRef,
  type ReactNode,
} from "react";
import { Combobox as BaseCombobox } from "@base-ui/react/combobox";
import { mergeClassName } from "../../lib/utils";
import { CheckIcon, ChevronDownIcon, CloseIcon, SearchIcon } from "./icons";
import {
  controlClasses,
  controlSizeClasses,
  type ControlSize,
  focusClasses,
  itemClasses,
  popupClasses,
  popupMotionClasses,
  popupSearchClasses,
} from "./styles";

// Keep all three generic parameters: selection values can differ from rendered items.
export type ComboboxProps<
  Value,
  Multiple extends boolean | undefined = false,
  Item = Value,
> = BaseCombobox.Root.Props<Value, Multiple, Item> & { size?: ControlSize };
const ComboboxSizeContext = createContext<ControlSize>("md");
export function Combobox<
  Value,
  Multiple extends boolean | undefined = false,
  Item = Value,
>({ size = "md", ...props }: ComboboxProps<Value, Multiple, Item>) {
  return (
    <ComboboxSizeContext.Provider value={size}>
      <BaseCombobox.Root<Value, Multiple, Item> {...props} />
    </ComboboxSizeContext.Provider>
  );
}
const innerSizes: Record<ControlSize, string> = {
  sm: "h-6 min-h-6 text-label",
  md: "h-7 min-h-7 text-body",
  lg: "h-8 min-h-8 text-body",
};
const chipSizes: Record<ControlSize, string> = {
  sm: "min-h-6 text-label",
  md: "min-h-7 text-body",
  lg: "min-h-8 text-body",
};
export const ComboboxValue = BaseCombobox.Value;
export const ComboboxGroup = BaseCombobox.Group;
export const ComboboxCollection = BaseCombobox.Collection;
export const createComboboxItems = BaseCombobox.createItems;
export const useComboboxFilter = BaseCombobox.useFilter;
export const useComboboxFilteredItems = BaseCombobox.useFilteredItems;

export const ComboboxLabel = forwardRef<
  ComponentRef<typeof BaseCombobox.Label>,
  BaseCombobox.Label.Props
>(function ComboboxLabel({ className, ...props }, ref) {
  return (
    <BaseCombobox.Label
      ref={ref}
      {...props}
      className={mergeClassName("mb-2 block text-body font-medium", className)}
    />
  );
});

export const ComboboxInputGroup = forwardRef<
  ComponentRef<typeof BaseCombobox.InputGroup>,
  BaseCombobox.InputGroup.Props & { size?: ControlSize }
>(function ComboboxInputGroup({ className, size: sizeProp, ...props }, ref) {
  const inheritedSize = useContext(ComboboxSizeContext);
  const size = sizeProp ?? inheritedSize;
  return (
    <ComboboxSizeContext.Provider value={size}>
      <BaseCombobox.InputGroup
        ref={ref}
        {...props}
        data-combobox-input-group=""
        data-size={size}
        className={mergeClassName(
          `flex ${controlSizeClasses[size]} w-full min-w-0 items-center gap-0.5 rounded-lg border border-control-border bg-transparent p-[3px] pr-2 text-primary outline-accent-700 hover:not-data-disabled:not-data-invalid:not-focus-within:not-data-popup-open:border-control-border-hover focus-within:border-accent-700 focus-within:outline-2 focus-within:outline-offset-0 data-popup-open:border-accent-700 data-invalid:border-error-700 data-invalid:focus-within:border-accent-700 data-disabled:cursor-not-allowed data-disabled:text-quaternary`,
          className,
        )}
      />
    </ComboboxSizeContext.Provider>
  );
});

// The input group owns the shared border and focus ring, including chip layouts.
export const ComboboxInput = forwardRef<
  ComponentRef<typeof BaseCombobox.Input>,
  Omit<BaseCombobox.Input.Props, "size"> & { size?: ControlSize }
>(function ComboboxInput({ className, size: sizeProp, ...props }, ref) {
  const inheritedSize = useContext(ComboboxSizeContext);
  const size = sizeProp ?? inheritedSize;
  return (
    <BaseCombobox.Input
      ref={ref}
      {...props}
      data-size={size}
      className={mergeClassName(
        `${innerSizes[size]} w-full min-w-0 flex-1 bg-transparent px-2 text-primary placeholder:text-tertiary outline-none data-disabled:cursor-not-allowed data-disabled:text-quaternary data-disabled:placeholder:text-quaternary`,
        className,
      )}
    />
  );
});

export type ComboboxTriggerProps = BaseCombobox.Trigger.Props & {
  variant?: "icon" | "input";
  size?: ControlSize;
};
export const ComboboxTrigger = forwardRef<
  ComponentRef<typeof BaseCombobox.Trigger>,
  ComboboxTriggerProps
>(function ComboboxTrigger(
  { className, children, variant = "icon", size: sizeProp, ...props },
  ref,
) {
  const inheritedSize = useContext(ComboboxSizeContext);
  const size = sizeProp ?? inheritedSize;
  return (
    <BaseCombobox.Trigger
      ref={ref}
      aria-label={variant === "icon" ? "展开选项" : undefined}
      {...props}
      data-size={size}
      className={mergeClassName(
        variant === "input"
          ? `${controlClasses} ${controlSizeClasses[size]} group/combobox-trigger flex cursor-pointer items-center justify-between gap-2 text-left data-placeholder:text-tertiary`
          : `group/combobox-trigger inline-flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-sm bg-transparent text-secondary data-disabled:cursor-not-allowed data-disabled:text-quaternary ${focusClasses}`,
        className,
      )}
    >
      {variant === "input" ? (
        <span className="min-w-0 flex-1 truncate">{children}</span>
      ) : (
        children
      )}
      <BaseCombobox.Icon className="inline-flex shrink-0 items-center justify-center transition-transform duration-200 group-data-popup-open/combobox-trigger:rotate-180 motion-reduce:transition-none">
        <ChevronDownIcon />
      </BaseCombobox.Icon>
    </BaseCombobox.Trigger>
  );
});

export const ComboboxClear = forwardRef<
  ComponentRef<typeof BaseCombobox.Clear>,
  BaseCombobox.Clear.Props
>(function ComboboxClear({ className, children, ...props }, ref) {
  return (
    <BaseCombobox.Clear
      ref={ref}
      aria-label="清除选择"
      {...props}
      className={mergeClassName(
        `inline-flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-sm text-secondary hover:not-data-disabled:bg-surface-hover data-disabled:cursor-not-allowed data-disabled:text-quaternary ${focusClasses}`,
        className,
      )}
    >
      {children ?? <CloseIcon />}
    </BaseCombobox.Clear>
  );
});

export const ComboboxSearchInput = forwardRef<
  ComponentRef<typeof BaseCombobox.Input>,
  BaseCombobox.Input.Props
>(function ComboboxSearchInput({ className, ...props }, ref) {
  return (
    <BaseCombobox.InputGroup
      data-popup-search=""
      className={popupSearchClasses}
    >
      <SearchIcon className="pointer-events-none shrink-0 text-tertiary" />
      <ComboboxInput
        ref={ref}
        {...props}
        size="md"
        className={mergeClassName("min-h-7 px-0", className)}
      />
      <ComboboxClear aria-label="清除搜索" />
    </BaseCombobox.InputGroup>
  );
});

export type ComboboxContentProps = BaseCombobox.Popup.Props & {
  positionerProps?: BaseCombobox.Positioner.Props;
  header?: ReactNode;
};
export const ComboboxContent = forwardRef<
  ComponentRef<typeof BaseCombobox.Popup>,
  ComboboxContentProps
>(function ComboboxContent(
  { className, children, positionerProps, header, ...props },
  ref,
) {
  return (
    <BaseCombobox.Portal>
      <BaseCombobox.Positioner
        sideOffset={6}
        align="start"
        {...positionerProps}
        className={mergeClassName(
          "z-50 outline-none",
          positionerProps?.className,
        )}
      >
        <BaseCombobox.Popup
          ref={ref}
          {...props}
          data-combobox-popup=""
          className={mergeClassName(
            `${popupClasses} ${popupMotionClasses} min-w-(--anchor-width) max-w-(--available-width) p-0`,
            className,
          )}
        >
          {header}
          {children}
        </BaseCombobox.Popup>
      </BaseCombobox.Positioner>
    </BaseCombobox.Portal>
  );
});

export const ComboboxList = forwardRef<
  ComponentRef<typeof BaseCombobox.List>,
  BaseCombobox.List.Props
>(function ComboboxList({ className, ...props }, ref) {
  return (
    <BaseCombobox.List
      ref={ref}
      {...props}
      className={mergeClassName(
        "max-h-[min(20rem,calc(var(--available-height)-3rem))] overflow-y-auto overscroll-contain p-1 outline-none data-empty:p-0",
        className,
      )}
    />
  );
});

export const ComboboxItem = forwardRef<
  ComponentRef<typeof BaseCombobox.Item>,
  BaseCombobox.Item.Props
>(function ComboboxItem({ className, children, ...props }, ref) {
  return (
    <BaseCombobox.Item
      ref={ref}
      {...props}
      className={mergeClassName(`${itemClasses} justify-between`, className)}
    >
      {children}
      <BaseCombobox.ItemIndicator className="ml-auto shrink-0">
        <CheckIcon />
      </BaseCombobox.ItemIndicator>
    </BaseCombobox.Item>
  );
});

export const ComboboxEmpty = forwardRef<
  ComponentRef<typeof BaseCombobox.Empty>,
  BaseCombobox.Empty.Props
>(function ComboboxEmpty({ className, ...props }, ref) {
  return (
    <BaseCombobox.Empty
      ref={ref}
      {...props}
      className={mergeClassName(
        "px-3 py-4 text-center text-body text-tertiary empty:hidden",
        className,
      )}
    />
  );
});

export const ComboboxStatus = forwardRef<
  ComponentRef<typeof BaseCombobox.Status>,
  BaseCombobox.Status.Props
>(function ComboboxStatus({ className, ...props }, ref) {
  return (
    <BaseCombobox.Status
      ref={ref}
      {...props}
      className={mergeClassName(
        "px-3 py-3 text-body text-tertiary empty:hidden",
        className,
      )}
    />
  );
});

export const ComboboxGroupLabel = forwardRef<
  ComponentRef<typeof BaseCombobox.GroupLabel>,
  BaseCombobox.GroupLabel.Props
>(function ComboboxGroupLabel({ className, ...props }, ref) {
  return (
    <BaseCombobox.GroupLabel
      ref={ref}
      {...props}
      className={mergeClassName(
        "px-2 py-2 text-label text-secondary",
        className,
      )}
    />
  );
});

export const ComboboxChips = forwardRef<
  ComponentRef<typeof BaseCombobox.Chips>,
  BaseCombobox.Chips.Props
>(function ComboboxChips({ className, ...props }, ref) {
  return (
    <BaseCombobox.Chips
      ref={ref}
      {...props}
      className={mergeClassName(
        "flex min-w-0 flex-1 flex-wrap items-center gap-1",
        className,
      )}
    />
  );
});

export const ComboboxChip = forwardRef<
  ComponentRef<typeof BaseCombobox.Chip>,
  BaseCombobox.Chip.Props
>(function ComboboxChip({ className, ...props }, ref) {
  const size = useContext(ComboboxSizeContext);
  return (
    <BaseCombobox.Chip
      ref={ref}
      {...props}
      className={mergeClassName(
        `inline-flex ${chipSizes[size]} items-center gap-1 rounded-sm bg-surface-muted py-0.5 pr-1 pl-2 leading-none text-primary data-disabled:text-quaternary ${focusClasses}`,
        className,
      )}
    />
  );
});

export const ComboboxChipRemove = forwardRef<
  ComponentRef<typeof BaseCombobox.ChipRemove>,
  BaseCombobox.ChipRemove.Props
>(function ComboboxChipRemove({ className, children, ...props }, ref) {
  return (
    <BaseCombobox.ChipRemove
      ref={ref}
      aria-label="移除选项"
      {...props}
      className={mergeClassName(
        `inline-flex size-4 cursor-pointer items-center justify-center rounded-sm text-secondary hover:not-data-disabled:bg-surface-hover data-disabled:cursor-not-allowed ${focusClasses}`,
        className,
      )}
    >
      {children ?? <CloseIcon />}
    </BaseCombobox.ChipRemove>
  );
});
