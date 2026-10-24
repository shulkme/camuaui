"use client";

import { forwardRef, type ComponentRef } from "react";

import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";
import { mergeClassName } from "../../lib/utils";
import { CheckIcon, MinusIcon } from "./icons";
import { focusClasses } from "./styles";

export type CheckboxProps = BaseCheckbox.Root.Props;

export const Checkbox = forwardRef<
  ComponentRef<typeof BaseCheckbox.Root>,
  CheckboxProps
>(function Checkbox({ className, children, ...props }, ref) {
  return (
    <BaseCheckbox.Root
      ref={ref}
      {...props}
      className={mergeClassName(
        `inline-flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-control-border bg-transparent text-white hover:not-data-disabled:not-data-checked:not-data-indeterminate:not-focus:not-aria-invalid:not-data-invalid:border-control-border-hover focus:border-accent-700 data-checked:border-accent-700 data-checked:bg-accent-700 data-indeterminate:border-accent-700 data-indeterminate:bg-accent-700 data-disabled:cursor-not-allowed data-disabled:opacity-40 ${focusClasses}`,
        className,
      )}
    >
      {children ?? (
        <BaseCheckbox.Indicator className="group/indicator flex items-center justify-center">
          <CheckIcon className="group-data-indeterminate/indicator:hidden" />
          <MinusIcon className="hidden group-data-indeterminate/indicator:block" />
        </BaseCheckbox.Indicator>
      )}
    </BaseCheckbox.Root>
  );
});
