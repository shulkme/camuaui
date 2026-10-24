"use client";

import {
  createContext,
  forwardRef,
  useContext,
  type ComponentRef,
} from "react";

import { Button as BaseButton } from "@base-ui/react/button";
import { cn } from "../../lib/utils";
import { focusClasses } from "./styles";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "danger"
  | "outline";
export type ButtonSize = "sm" | "md" | "lg";

export const ButtonSizeContext = createContext<ButtonSize>("md");

const baseClasses = `inline-flex shrink-0 items-center justify-center gap-2 rounded-full border-0 font-sans font-normal whitespace-nowrap select-none cursor-pointer transition-colors duration-150 ease-out motion-reduce:transition-none ${focusClasses} data-disabled:cursor-not-allowed data-disabled:bg-surface-muted data-disabled:text-quaternary [&>svg]:size-4 [&>svg]:shrink-0`;

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-primary-foreground hover:not-data-disabled:bg-primary/85 active:not-data-disabled:bg-primary/70",
  secondary:
    "bg-surface-muted text-primary hover:not-data-disabled:bg-surface-hover active:not-data-disabled:bg-gray-300",
  ghost:
    "bg-transparent text-primary hover:not-data-disabled:bg-surface-muted active:not-data-disabled:bg-surface-hover",
  danger:
    "bg-danger text-danger-foreground hover:not-data-disabled:bg-danger-hover active:not-data-disabled:bg-danger-active",
  outline:
    "border border-control-border bg-transparent text-primary hover:not-data-disabled:bg-surface-muted active:not-data-disabled:bg-surface-hover",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "min-h-8 px-3.5 text-label leading-tight",
  md: "min-h-9 px-4.5 text-body leading-tight",
  lg: "min-h-10 px-5.5 text-body leading-tight",
};

const iconWidthClasses: Record<ButtonSize, string> = {
  sm: "w-8",
  md: "w-9",
  lg: "w-10",
};

export interface ButtonProps extends BaseButton.Props {
  variant?: ButtonVariant;
  size?: ButtonSize;
  onlyIcon?: boolean;
}

export const Button = forwardRef<ComponentRef<typeof BaseButton>, ButtonProps>(
  function Button(
    { variant = "primary", size, onlyIcon = false, className, ...props },
    ref,
  ) {
    const defaultSize = useContext(ButtonSizeContext);
    const buttonSize = size ?? defaultSize;
    const classes = cn(
      baseClasses,
      variantClasses[variant],
      sizeClasses[buttonSize],
      onlyIcon && ["px-0", iconWidthClasses[buttonSize]],
    );

    return (
      <BaseButton
        ref={ref}
        {...props}
        data-variant={variant}
        data-size={buttonSize}
        data-only-icon={onlyIcon ? "" : undefined}
        className={
          typeof className === "function"
            ? (state) => cn(classes, className(state))
            : cn(classes, className)
        }
      />
    );
  },
);
