"use client";

import {
  forwardRef,
  type ForwardedRef,
  type RefAttributes,
  type ReactElement,
} from "react";

import { RadioGroup as BaseRadioGroup } from "@base-ui/react/radio-group";
import { mergeClassName } from "../../lib/utils";

function RadioGroupImpl<Value>(
  { className, ...props }: BaseRadioGroup.Props<Value>,
  ref: ForwardedRef<HTMLDivElement>,
) {
  return (
    <BaseRadioGroup
      ref={ref}
      {...props}
      className={mergeClassName("flex flex-col gap-3", className)}
    />
  );
}
export const RadioGroup = forwardRef(RadioGroupImpl) as <Value>(
  props: BaseRadioGroup.Props<Value> & RefAttributes<HTMLDivElement>,
) => ReactElement | null;
