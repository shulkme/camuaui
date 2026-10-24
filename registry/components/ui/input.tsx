"use client";

import { forwardRef, type ComponentRef } from "react";

import { Input as BaseInput } from "@base-ui/react/input";
import { mergeClassName } from "../../lib/utils";
import { controlClasses, controlSizeClasses, type ControlSize } from "./styles";

export type InputProps = Omit<BaseInput.Props, "size"> & { size?: ControlSize };

export const Input = forwardRef<ComponentRef<typeof BaseInput>, InputProps>(
  function Input({ className, size = "md", ...props }, ref) {
    return (
      <BaseInput
        ref={ref}
        {...props}
        data-size={size}
        className={mergeClassName(
          `${controlClasses} ${controlSizeClasses[size]}`,
          className,
        )}
      />
    );
  },
);
