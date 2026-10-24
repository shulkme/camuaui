"use client";

import { forwardRef, type ComponentRef } from "react";

import { Switch as BaseSwitch } from "@base-ui/react/switch";
import { mergeClassName } from "../../lib/utils";
import { focusClasses } from "./styles";

export type SwitchSize = "sm" | "md";
export type SwitchProps = BaseSwitch.Root.Props & { size?: SwitchSize };

export const Switch = forwardRef<
  ComponentRef<typeof BaseSwitch.Root>,
  SwitchProps
>(function Switch({ className, children, size = "md", ...props }, ref) {
  return (
    <BaseSwitch.Root
      ref={ref}
      {...props}
      data-size={size}
      className={mergeClassName(
        `inline-flex shrink-0 cursor-pointer items-center rounded-full bg-surface-hover p-0.5 transition-colors duration-150 motion-reduce:transition-none hover:not-data-disabled:not-data-checked:bg-[color-mix(in_srgb,var(--surface-hover),var(--primary)_8%)] data-checked:bg-accent-700 data-checked:hover:not-data-disabled:bg-accent-800 data-disabled:cursor-not-allowed data-disabled:opacity-40 ${focusClasses} ${size === "sm" ? "h-4 w-7" : "h-5 w-9"}`,
        className,
      )}
    >
      {children ?? (
        <BaseSwitch.Thumb
          className={`block rounded-full bg-white transition-transform duration-150 motion-reduce:transition-none ${size === "sm" ? "size-3 data-checked:translate-x-3" : "size-4 data-checked:translate-x-4"}`}
        />
      )}
    </BaseSwitch.Root>
  );
});
