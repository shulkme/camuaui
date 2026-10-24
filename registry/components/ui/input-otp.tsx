"use client";

import { createContext, forwardRef, useContext, type ComponentProps, type ComponentRef } from "react";
import { OTPField as BaseOTP } from "@base-ui/react/otp-field";
import { cn, mergeClassName } from "../../lib/utils";
import { controlClasses, type ControlSize } from "./styles";

const InputOTPSizeContext = createContext<ControlSize>("md");
const slotSizes: Record<ControlSize, string> = {
  sm: "size-8 min-h-8 text-label",
  md: "size-9 min-h-9 text-body",
  lg: "size-10 min-h-10 text-body",
};

export type InputOTPProps = Omit<BaseOTP.Root.Props, "length"> & {
  length?: number;
  size?: ControlSize;
};

export const InputOTP = forwardRef<ComponentRef<typeof BaseOTP.Root>, InputOTPProps>(
  function InputOTP({ size = "md", length = 6, children, className, ...props }, ref) {
    return (
      <InputOTPSizeContext.Provider value={size}>
        <BaseOTP.Root
          ref={ref}
          {...props}
          length={length}
          data-size={size}
          data-input-otp=""
          className={mergeClassName("inline-flex max-w-full flex-wrap items-center gap-2", className)}
        >
          {children ?? Array.from({ length }, (_, index) => <InputOTPSlot key={index} />)}
        </BaseOTP.Root>
      </InputOTPSizeContext.Provider>
    );
  },
);

export const InputOTPSlot = forwardRef<
  ComponentRef<typeof BaseOTP.Input>,
  Omit<BaseOTP.Input.Props, "size"> & { size?: ControlSize }
>(function InputOTPSlot({ size: sizeProp, className, ...props }, ref) {
  const inheritedSize = useContext(InputOTPSizeContext);
  const size = sizeProp ?? inheritedSize;
  return (
    <BaseOTP.Input
      ref={ref}
      {...props}
      data-size={size}
      data-input-otp-slot=""
      className={mergeClassName(
        `${controlClasses} ${slotSizes[size]} shrink-0 px-0 text-center font-mono tabular-nums`,
        className,
      )}
    />
  );
});

export const InputOTPGroup = forwardRef<HTMLDivElement, ComponentProps<"div">>(
  function InputOTPGroup({ className, ...props }, ref) {
    return <div ref={ref} {...props} className={cn("inline-flex items-center gap-2", className)} />;
  },
);

export const InputOTPSeparator = forwardRef<
  ComponentRef<typeof BaseOTP.Separator>, BaseOTP.Separator.Props
>(function InputOTPSeparator({ className, children, ...props }, ref) {
  return (
    <BaseOTP.Separator ref={ref} {...props} className={mergeClassName("text-tertiary", className)}>
      {children ?? "–"}
    </BaseOTP.Separator>
  );
});
