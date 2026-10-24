"use client";

import {
  createContext,
  forwardRef,
  useContext,
  type ComponentRef,
} from "react";

import { NumberField } from "@base-ui/react/number-field";
import { mergeClassName } from "../../lib/utils";
import { MinusIcon, PlusIcon } from "./icons";
import { focusClasses, controlSizeClasses, type ControlSize } from "./styles";

const InputNumberSizeContext = createContext<ControlSize>("md");
const innerSizes: Record<ControlSize, string> = {
  sm: "h-5.5",
  md: "h-6.5",
  lg: "h-7.5",
};
const stepSizes: Record<ControlSize, string> = {
  sm: "size-5.5",
  md: "size-6.5",
  lg: "size-7.5",
};

export interface InputNumberProps extends NumberField.Root.Props {
  size?: ControlSize;
  inputProps?: NumberField.Input.Props;
  decrementLabel?: string;
  incrementLabel?: string;
}

export const InputNumber = forwardRef<
  ComponentRef<typeof NumberField.Root>,
  InputNumberProps
>(function InputNumber(
  {
    children,
    className,
    size = "md",
    inputProps,
    decrementLabel = "减少",
    incrementLabel = "增加",
    "aria-label": ariaLabel,
    ...props
  },
  ref,
) {
  return (
    <InputNumberSizeContext.Provider value={size}>
      <NumberField.Root
        ref={ref}
        {...props}
        data-size={size}
        className={mergeClassName("w-full min-w-0", className)}
      >
        {children ?? (
          <InputNumberGroup>
            <InputNumberDecrement aria-label={decrementLabel}>
              <MinusIcon />
            </InputNumberDecrement>
            <InputNumberInput aria-label={ariaLabel} {...inputProps} />
            <InputNumberIncrement aria-label={incrementLabel}>
              <PlusIcon />
            </InputNumberIncrement>
          </InputNumberGroup>
        )}
      </NumberField.Root>
    </InputNumberSizeContext.Provider>
  );
});

export const InputNumberGroup = forwardRef<
  ComponentRef<typeof NumberField.Group>,
  NumberField.Group.Props & { size?: ControlSize }
>(function InputNumberGroup({ className, size: sizeProp, ...props }, ref) {
  const inheritedSize = useContext(InputNumberSizeContext);
  const size = sizeProp ?? inheritedSize;
  return (
    <InputNumberSizeContext.Provider value={size}>
      <NumberField.Group
        ref={ref}
        {...props}
        data-size={size}
        className={mergeClassName(
          `flex ${controlSizeClasses[size]} items-center rounded-lg border border-control-border bg-transparent p-1 hover:not-focus-within:not-data-disabled:not-has-[[aria-invalid=true]]:border-control-border-hover has-[[aria-invalid=true]]:border-error-700 focus-within:border-accent-700 focus-within:outline-2 focus-within:outline-offset-0 focus-within:outline-accent-700 has-[[aria-invalid=true]]:focus-within:border-accent-700`,
          className,
        )}
      />
    </InputNumberSizeContext.Provider>
  );
});

export const InputNumberInput = forwardRef<
  ComponentRef<typeof NumberField.Input>,
  NumberField.Input.Props
>(function InputNumberInput({ className, ...props }, ref) {
  const size = useContext(InputNumberSizeContext);
  return (
    <NumberField.Input
      ref={ref}
      {...props}
      className={mergeClassName(
        `${innerSizes[size]} w-full min-w-0 bg-transparent px-2 text-center ${size === "sm" ? "text-label" : "text-body"} text-primary placeholder:text-tertiary outline-none data-disabled:cursor-not-allowed data-disabled:text-quaternary data-disabled:placeholder:text-quaternary`,
        className,
      )}
    />
  );
});

const stepClasses = `flex shrink-0 cursor-pointer items-center justify-center rounded-[3px] text-primary hover:not-data-disabled:bg-surface-hover data-disabled:cursor-not-allowed data-disabled:text-quaternary ${focusClasses}`;

export const InputNumberIncrement = forwardRef<
  ComponentRef<typeof NumberField.Increment>,
  NumberField.Increment.Props
>(function InputNumberIncrement({ className, ...props }, ref) {
  const size = useContext(InputNumberSizeContext);
  return (
    <NumberField.Increment
      ref={ref}
      {...props}
      className={mergeClassName(`${stepClasses} ${stepSizes[size]}`, className)}
    />
  );
});

export const InputNumberDecrement = forwardRef<
  ComponentRef<typeof NumberField.Decrement>,
  NumberField.Decrement.Props
>(function InputNumberDecrement({ className, ...props }, ref) {
  const size = useContext(InputNumberSizeContext);
  return (
    <NumberField.Decrement
      ref={ref}
      {...props}
      className={mergeClassName(`${stepClasses} ${stepSizes[size]}`, className)}
    />
  );
});
