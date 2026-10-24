"use client";

import { forwardRef, type ComponentRef } from "react";

import { CheckboxGroup as BaseCheckboxGroup } from "@base-ui/react/checkbox-group";
import { mergeClassName } from "../../lib/utils";

export type CheckboxGroupProps = BaseCheckboxGroup.Props;

export const CheckboxGroup = forwardRef<
  ComponentRef<typeof BaseCheckboxGroup>,
  CheckboxGroupProps
>(function CheckboxGroup({ className, ...props }, ref) {
  return (
    <BaseCheckboxGroup
      ref={ref}
      {...props}
      className={mergeClassName("flex flex-col gap-3", className)}
    />
  );
});
