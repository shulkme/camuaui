"use client";

import { forwardRef, type ComponentRef } from "react";

import { Fieldset as BaseFieldSet } from "@base-ui/react/fieldset";
import { mergeClassName } from "../../lib/utils";

export const FieldSet = forwardRef<
  ComponentRef<typeof BaseFieldSet.Root>,
  BaseFieldSet.Root.Props
>(function FieldSet({ className, ...props }, ref) {
  return (
    <BaseFieldSet.Root
      ref={ref}
      {...props}
      className={mergeClassName("min-w-0 space-y-4", className)}
    />
  );
});

export const FieldSetLegend = forwardRef<
  ComponentRef<typeof BaseFieldSet.Legend>,
  BaseFieldSet.Legend.Props
>(function FieldSetLegend({ className, ...props }, ref) {
  return (
    <BaseFieldSet.Legend
      ref={ref}
      {...props}
      className={mergeClassName("mb-4 text-body font-semibold", className)}
    />
  );
});
