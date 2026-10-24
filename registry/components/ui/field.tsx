"use client";

import { forwardRef, type ComponentRef } from "react";

import { Field as BaseField } from "@base-ui/react/field";
import { mergeClassName } from "../../lib/utils";
import { controlClasses } from "./styles";

export const Field = forwardRef<
  ComponentRef<typeof BaseField.Root>,
  BaseField.Root.Props
>(function Field({ className, ...props }, ref) {
  return (
    <BaseField.Root
      ref={ref}
      {...props}
      className={mergeClassName("flex min-w-0 flex-col gap-2", className)}
    />
  );
});

export const FieldLabel = forwardRef<
  ComponentRef<typeof BaseField.Label>,
  BaseField.Label.Props
>(function FieldLabel({ className, ...props }, ref) {
  return (
    <BaseField.Label
      ref={ref}
      {...props}
      className={mergeClassName(
        "text-body font-medium data-disabled:text-quaternary",
        className,
      )}
    />
  );
});

export const FieldDescription = forwardRef<
  ComponentRef<typeof BaseField.Description>,
  BaseField.Description.Props
>(function FieldDescription({ className, ...props }, ref) {
  return (
    <BaseField.Description
      ref={ref}
      {...props}
      className={mergeClassName("text-label text-tertiary", className)}
    />
  );
});

export const FieldError = forwardRef<
  ComponentRef<typeof BaseField.Error>,
  BaseField.Error.Props
>(function FieldError({ className, ...props }, ref) {
  return (
    <BaseField.Error
      ref={ref}
      {...props}
      className={mergeClassName("text-label text-error-900", className)}
    />
  );
});

export const FieldControl = forwardRef<
  ComponentRef<typeof BaseField.Control>,
  BaseField.Control.Props
>(function FieldControl({ className, ...props }, ref) {
  return (
    <BaseField.Control
      ref={ref}
      {...props}
      className={mergeClassName(controlClasses, className)}
    />
  );
});

export const FieldValidity = BaseField.Validity;
export const FieldItem = BaseField.Item;
