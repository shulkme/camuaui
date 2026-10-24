"use client";

import { forwardRef, type ComponentRef } from "react";

import { Radio as BaseRadio } from "@base-ui/react/radio";
import { mergeClassName } from "../../lib/utils";
import { focusClasses } from "./styles";

export type RadioProps = BaseRadio.Root.Props;

export const Radio = forwardRef<
  ComponentRef<typeof BaseRadio.Root>,
  RadioProps
>(function Radio({ className, children, ...props }, ref) {
  return (
    <BaseRadio.Root
      ref={ref}
      {...props}
      className={mergeClassName(
        `inline-flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-full border border-control-border bg-transparent hover:not-data-disabled:not-data-checked:not-focus:not-aria-invalid:not-data-invalid:border-control-border-hover focus:border-accent-700 data-checked:border-accent-700 data-disabled:cursor-not-allowed data-disabled:opacity-40 ${focusClasses}`,
        className,
      )}
    >
      {children ?? (
        <BaseRadio.Indicator className="size-2 rounded-full bg-accent-700" />
      )}
    </BaseRadio.Root>
  );
});
