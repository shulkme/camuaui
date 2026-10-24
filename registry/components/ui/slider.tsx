"use client";

import {
  forwardRef,
  type ComponentRef,
  type ForwardedRef,
  type RefAttributes,
  type ReactElement,
} from "react";

import { Slider as BaseSlider } from "@base-ui/react/slider";
import { createContext, useContext, type Ref } from "react";
import { mergeClassName } from "../../lib/utils";

export type SliderVariant = "floating" | "inset";
const SliderContext = createContext<{ variant: SliderVariant; range: boolean }>(
  {
    variant: "floating",
    range: false,
  },
);

export type SliderProps<
  Value extends number | readonly number[] = number | readonly number[],
> = BaseSlider.Root.Props<Value> & {
  ref?: Ref<HTMLDivElement>;
  thumbLabels?: string[];
  variant?: SliderVariant;
};

function SliderImpl<Value extends number | readonly number[]>(
  {
    className,
    children,
    thumbLabels,
    variant = "floating",
    ...props
  }: SliderProps<Value>,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const value = props.value ?? props.defaultValue ?? 0;
  const count = Array.isArray(value) ? value.length : 1;
  return (
    <SliderContext.Provider value={{ variant, range: count > 1 }}>
      <BaseSlider.Root
        ref={ref}
        thumbAlignment={variant === "inset" ? "edge" : "center"}
        {...props}
        data-variant={variant}
        className={mergeClassName(
          "w-full min-w-0 data-disabled:opacity-40 data-[orientation=vertical]:w-fit",
          className,
        )}
      >
        {children ?? (
          <SliderControl>
            <SliderTrack>
              <SliderIndicator />
              {Array.from({ length: count }, (_, index) => (
                <SliderThumb
                  key={index}
                  index={index}
                  aria-label={
                    thumbLabels?.[index] ??
                    (count === 1
                      ? props["aria-label"]
                      : index === 0
                        ? "最小值"
                        : "最大值")
                  }
                />
              ))}
            </SliderTrack>
          </SliderControl>
        )}
      </BaseSlider.Root>
    </SliderContext.Provider>
  );
}
export const Slider = forwardRef(SliderImpl) as <
  Value extends number | readonly number[],
>(
  props: SliderProps<Value> & RefAttributes<HTMLDivElement>,
) => ReactElement | null;

export const SliderLabel = BaseSlider.Label;
export const SliderValue = BaseSlider.Value;

export const SliderControl = forwardRef<
  ComponentRef<typeof BaseSlider.Control>,
  BaseSlider.Control.Props
>(function SliderControl({ className, ...props }, ref) {
  const { variant } = useContext(SliderContext);
  return (
    <BaseSlider.Control
      ref={ref}
      {...props}
      className={mergeClassName(
        `flex h-8 touch-none items-center select-none data-[orientation=vertical]:w-8 data-[orientation=vertical]:justify-center ${variant === "inset" ? "mx-0.5 w-[calc(100%-0.25rem)] data-[orientation=vertical]:mx-0 data-[orientation=vertical]:my-0.5 data-[orientation=vertical]:h-39" : "w-full data-[orientation=vertical]:h-40"}`,
        className,
      )}
    />
  );
});

export const SliderTrack = forwardRef<
  ComponentRef<typeof BaseSlider.Track>,
  BaseSlider.Track.Props
>(function SliderTrack({ className, ...props }, ref) {
  const { variant } = useContext(SliderContext);
  return (
    <BaseSlider.Track
      ref={ref}
      {...props}
      className={mergeClassName(
        `relative w-full rounded-full bg-surface-hover data-[orientation=vertical]:h-full ${variant === "inset" ? "isolate h-4 before:pointer-events-none before:absolute before:inset-y-0 before:-inset-x-0.5 before:-z-10 before:rounded-full before:bg-surface-hover data-[orientation=vertical]:w-4 data-[orientation=vertical]:before:-inset-y-0.5 data-[orientation=vertical]:before:inset-x-0" : "h-1.5 data-[orientation=vertical]:w-1.5"}`,
        className,
      )}
    />
  );
});

export const SliderIndicator = forwardRef<
  ComponentRef<typeof BaseSlider.Indicator>,
  BaseSlider.Indicator.Props
>(function SliderIndicator({ className, ...props }, ref) {
  const { variant, range } = useContext(SliderContext);
  // Base UI measures to thumb centers. Extend the visible fill to the capsule
  // edges plus its 2px gap so the fill's 8px arcs share the thumb's 6px centers.
  const appearance =
    variant === "inset"
      ? `bg-transparent before:pointer-events-none before:absolute before:rounded-full before:bg-primary ${
          range
            ? "before:inset-y-0 before:-inset-x-3.5 data-[orientation=vertical]:before:inset-x-0 data-[orientation=vertical]:before:-inset-y-3.5"
            : "before:inset-y-0 before:-left-0.5 before:-right-3.5 rtl:before:-left-3.5 rtl:before:-right-0.5 data-[orientation=vertical]:before:inset-x-0 data-[orientation=vertical]:before:-bottom-0.5 data-[orientation=vertical]:before:-top-3.5"
        }`
      : "bg-primary";
  return (
    <BaseSlider.Indicator
      ref={ref}
      {...props}
      className={mergeClassName(`rounded-full ${appearance}`, className)}
    />
  );
});

export const SliderThumb = forwardRef<
  ComponentRef<typeof BaseSlider.Thumb>,
  BaseSlider.Thumb.Props
>(function SliderThumb({ className, ...props }, ref) {
  const { variant } = useContext(SliderContext);
  return (
    <BaseSlider.Thumb
      ref={ref}
      {...props}
      className={mergeClassName(
        `cursor-pointer rounded-full border-0 select-none data-disabled:cursor-not-allowed has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-0 has-[:focus-visible]:outline-accent-700 [&_input]:cursor-inherit ${variant === "inset" ? "h-3 w-6 bg-primary-foreground shadow-sm hover:not-data-disabled:brightness-95 data-[orientation=vertical]:h-6 data-[orientation=vertical]:w-3" : "size-5 bg-white shadow-[0_0_3px_rgb(0_0_0/0.12),0_0_8px_rgb(0_0_0/0.08)] hover:not-data-disabled:shadow-[0_0_4px_rgb(0_0_0/0.16),0_0_10px_rgb(0_0_0/0.12)]"}`,
        className,
      )}
    />
  );
});
