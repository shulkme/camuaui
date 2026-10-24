"use client";

import { forwardRef, type ComponentRef } from "react";

import { Avatar as BaseAvatar } from "@base-ui/react/avatar";
import { mergeClassName } from "../../lib/utils";

export type AvatarShape = "circle" | "square";
export type AvatarProps = BaseAvatar.Root.Props & {
  shape?: AvatarShape;
};
const shapes: Record<AvatarShape, string> = {
  circle: "rounded-full",
  square: "rounded-lg",
};

export const Avatar = forwardRef<
  ComponentRef<typeof BaseAvatar.Root>,
  AvatarProps
>(function Avatar({ className, shape = "circle", ...props }, ref) {
  return (
    <BaseAvatar.Root
      ref={ref}
      {...props}
      data-shape={shape}
      className={mergeClassName(
        `relative inline-flex size-10 shrink-0 items-center justify-center overflow-hidden border border-control-border bg-surface-muted text-body leading-none font-medium text-primary ${shapes[shape]}`,
        className,
      )}
    />
  );
});

export const AvatarImage = forwardRef<
  ComponentRef<typeof BaseAvatar.Image>,
  BaseAvatar.Image.Props
>(function AvatarImage({ className, ...props }, ref) {
  return (
    <BaseAvatar.Image
      ref={ref}
      {...props}
      className={mergeClassName("size-full object-cover", className)}
    />
  );
});

export const AvatarFallback = forwardRef<
  ComponentRef<typeof BaseAvatar.Fallback>,
  BaseAvatar.Fallback.Props
>(function AvatarFallback({ className, ...props }, ref) {
  return (
    <BaseAvatar.Fallback
      ref={ref}
      {...props}
      className={mergeClassName(
        "flex size-full items-center justify-center leading-none",
        className,
      )}
    />
  );
});
