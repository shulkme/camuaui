"use client";

import {
  forwardRef,
  type ForwardedRef,
  type RefAttributes,
  type ReactElement,
} from "react";

import { Form as BaseForm } from "@base-ui/react/form";
import type { Ref } from "react";
import { mergeClassName } from "../../lib/utils";

function FormImpl<
  Values extends Record<string, unknown> = Record<string, unknown>,
>(
  {
    className,
    ...props
  }: BaseForm.Props<Values> & { ref?: Ref<HTMLFormElement> },
  ref: ForwardedRef<HTMLFormElement>,
) {
  return (
    <BaseForm<Values>
      ref={ref}
      {...props}
      className={mergeClassName("space-y-5", className)}
    />
  );
}
export const Form = forwardRef(FormImpl) as <
  Values extends Record<string, unknown> = Record<string, unknown>,
>(
  props: BaseForm.Props<Values> & {
    ref?: Ref<HTMLFormElement>;
  } & RefAttributes<HTMLFormElement>,
) => ReactElement | null;
