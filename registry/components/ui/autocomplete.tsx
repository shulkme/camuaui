"use client";

import { createContext, forwardRef, useContext, type ComponentRef, type ReactElement } from "react";
import { Autocomplete as BaseAutocomplete } from "@base-ui/react/autocomplete";
import { mergeClassName } from "../../lib/utils";
import { ChevronDownIcon, CloseIcon } from "./icons";
import { controlClasses, controlSizeClasses, focusClasses, itemClasses, popupClasses, popupMotionClasses, type ControlSize } from "./styles";

const AutocompleteSizeContext = createContext<ControlSize>("md");
const AutocompleteGroupContext = createContext(false);
const innerSizes: Record<ControlSize, string> = {
  sm: "h-6 min-h-6 text-label",
  md: "h-7 min-h-7 text-body",
  lg: "h-8 min-h-8 text-body",
};
export type AutocompleteProps<Item> = BaseAutocomplete.Root.Props<Item> & { size?: ControlSize };

// Match the primitive's grouped/flat overloads so object item callbacks stay typed.
export function Autocomplete<Groups extends readonly { items: readonly unknown[] }[]>(
  props: Omit<AutocompleteProps<Groups[number]["items"][number]>, "items"> & { items: Groups },
): ReactElement;
export function Autocomplete<Item>(
  props: Omit<AutocompleteProps<Item>, "items"> & { items?: readonly Item[] },
): ReactElement;
export function Autocomplete<Item>({ size = "md", ...props }: AutocompleteProps<Item>) {
  return (
    <AutocompleteSizeContext.Provider value={size}>
      <BaseAutocomplete.Root<Item>
        {...props}
        // Groups use the same runtime Root; only the overload's items type differs.
        items={props.items as readonly Item[] | undefined}
      />
    </AutocompleteSizeContext.Provider>
  );
}

export const AutocompleteValue = BaseAutocomplete.Value;
export const AutocompleteGroup = BaseAutocomplete.Group;
export const AutocompleteCollection = BaseAutocomplete.Collection;
export const AutocompleteRow = BaseAutocomplete.Row;
export const useAutocompleteFilter = BaseAutocomplete.useFilter;
export const useAutocompleteFilteredItems = BaseAutocomplete.useFilteredItems;

export const AutocompleteInputGroup = forwardRef<
  ComponentRef<typeof BaseAutocomplete.InputGroup>, BaseAutocomplete.InputGroup.Props & { size?: ControlSize }
>(function AutocompleteInputGroup({ size: sizeProp, className, ...props }, ref) {
  const inheritedSize = useContext(AutocompleteSizeContext);
  const size = sizeProp ?? inheritedSize;
  return (
    <AutocompleteSizeContext.Provider value={size}>
      <AutocompleteGroupContext.Provider value={true}>
        <BaseAutocomplete.InputGroup
          ref={ref} {...props} data-size={size} data-autocomplete-input-group=""
          className={mergeClassName(
            `flex ${controlSizeClasses[size]} w-full min-w-0 items-center gap-0.5 rounded-lg border border-control-border bg-transparent p-[3px] pr-2 text-primary outline-accent-700 hover:not-data-disabled:not-data-invalid:not-focus-within:not-data-popup-open:border-control-border-hover focus-within:border-accent-700 focus-within:outline-2 focus-within:outline-offset-0 data-popup-open:border-accent-700 data-invalid:border-error-700 data-invalid:focus-within:border-accent-700 data-disabled:cursor-not-allowed data-disabled:text-quaternary`,
            className,
          )}
        />
      </AutocompleteGroupContext.Provider>
    </AutocompleteSizeContext.Provider>
  );
});

export const AutocompleteInput = forwardRef<
  ComponentRef<typeof BaseAutocomplete.Input>, Omit<BaseAutocomplete.Input.Props, "size"> & { size?: ControlSize }
>(function AutocompleteInput({ size: sizeProp, className, ...props }, ref) {
  const inheritedSize = useContext(AutocompleteSizeContext);
  const grouped = useContext(AutocompleteGroupContext);
  const size = sizeProp ?? inheritedSize;
  return (
    <BaseAutocomplete.Input
      ref={ref} {...props} data-size={size}
      className={mergeClassName(
        grouped
          ? `${innerSizes[size]} w-full min-w-0 flex-1 bg-transparent px-2 text-primary placeholder:text-tertiary outline-none data-disabled:cursor-not-allowed data-disabled:text-quaternary data-disabled:placeholder:text-quaternary`
          : `${controlClasses} ${controlSizeClasses[size]}`,
        className,
      )}
    />
  );
});

export const AutocompleteTrigger = forwardRef<
  ComponentRef<typeof BaseAutocomplete.Trigger>, BaseAutocomplete.Trigger.Props
>(function AutocompleteTrigger({ className, children, ...props }, ref) {
  return (
    <BaseAutocomplete.Trigger
      ref={ref} aria-label="展开建议" {...props}
      className={mergeClassName(`group/autocomplete-trigger inline-flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-sm text-secondary data-disabled:cursor-not-allowed data-disabled:text-quaternary ${focusClasses}`, className)}
    >
      {children ?? (
        <BaseAutocomplete.Icon className="inline-flex items-center justify-center transition-transform duration-200 group-data-popup-open/autocomplete-trigger:rotate-180 motion-reduce:transition-none">
          <ChevronDownIcon />
        </BaseAutocomplete.Icon>
      )}
    </BaseAutocomplete.Trigger>
  );
});

export const AutocompleteClear = forwardRef<
  ComponentRef<typeof BaseAutocomplete.Clear>, BaseAutocomplete.Clear.Props
>(function AutocompleteClear({ className, children, ...props }, ref) {
  return (
    <BaseAutocomplete.Clear
      ref={ref} aria-label="清空输入" {...props}
      className={mergeClassName(`inline-flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-sm text-secondary hover:not-data-disabled:bg-surface-hover data-disabled:cursor-not-allowed ${focusClasses}`, className)}
    >
      {children ?? <CloseIcon />}
    </BaseAutocomplete.Clear>
  );
});

export interface AutocompleteContentProps extends BaseAutocomplete.Popup.Props {
  side?: BaseAutocomplete.Positioner.Props["side"];
  align?: BaseAutocomplete.Positioner.Props["align"];
  sideOffset?: number;
  positionerProps?: BaseAutocomplete.Positioner.Props;
}

export const AutocompleteContent = forwardRef<
  ComponentRef<typeof BaseAutocomplete.Popup>, AutocompleteContentProps
>(function AutocompleteContent({ className, side = "bottom", align = "start", sideOffset = 6, positionerProps, ...props }, ref) {
  return (
    <BaseAutocomplete.Portal>
      <BaseAutocomplete.Positioner
        side={side} align={align} sideOffset={sideOffset} {...positionerProps}
        className={mergeClassName("z-50", positionerProps?.className)}
      >
        <BaseAutocomplete.Popup
          ref={ref} {...props} data-autocomplete-popup=""
          className={mergeClassName(`${popupClasses} ${popupMotionClasses} min-w-(--anchor-width) max-w-(--available-width) p-0`, className)}
        />
      </BaseAutocomplete.Positioner>
    </BaseAutocomplete.Portal>
  );
});

export const AutocompleteList = forwardRef<
  ComponentRef<typeof BaseAutocomplete.List>, BaseAutocomplete.List.Props
>(function AutocompleteList({ className, ...props }, ref) {
  return <BaseAutocomplete.List ref={ref} {...props} className={mergeClassName("max-h-[min(20rem,calc(var(--available-height)-1rem))] overflow-y-auto overscroll-contain p-1 outline-none data-empty:p-0", className)} />;
});

export const AutocompleteItem = forwardRef<
  ComponentRef<typeof BaseAutocomplete.Item>, BaseAutocomplete.Item.Props
>(function AutocompleteItem({ className, ...props }, ref) {
  return <BaseAutocomplete.Item ref={ref} {...props} className={mergeClassName(itemClasses, className)} />;
});

export const AutocompleteEmpty = forwardRef<
  ComponentRef<typeof BaseAutocomplete.Empty>, BaseAutocomplete.Empty.Props
>(function AutocompleteEmpty({ className, ...props }, ref) {
  return <BaseAutocomplete.Empty ref={ref} {...props} className={mergeClassName("px-3 py-4 text-center text-body text-tertiary empty:hidden", className)} />;
});

export const AutocompleteStatus = forwardRef<
  ComponentRef<typeof BaseAutocomplete.Status>, BaseAutocomplete.Status.Props
>(function AutocompleteStatus({ className, ...props }, ref) {
  return <BaseAutocomplete.Status ref={ref} {...props} className={mergeClassName("px-3 py-3 text-body text-tertiary empty:hidden", className)} />;
});

export const AutocompleteGroupLabel = forwardRef<
  ComponentRef<typeof BaseAutocomplete.GroupLabel>, BaseAutocomplete.GroupLabel.Props
>(function AutocompleteGroupLabel({ className, ...props }, ref) {
  return <BaseAutocomplete.GroupLabel ref={ref} {...props} className={mergeClassName("px-2 py-2 text-label text-secondary", className)} />;
});

export const AutocompleteSeparator = forwardRef<
  ComponentRef<typeof BaseAutocomplete.Separator>, BaseAutocomplete.Separator.Props
>(function AutocompleteSeparator({ className, ...props }, ref) {
  return <BaseAutocomplete.Separator ref={ref} {...props} className={mergeClassName("my-1 h-px bg-divider", className)} />;
});
