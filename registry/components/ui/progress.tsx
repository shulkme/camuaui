"use client";

import { forwardRef, type ComponentRef } from "react";

import { Progress as BaseProgress } from "@base-ui/react/progress";
import { mergeClassName } from "../../lib/utils";

export const Progress = forwardRef<
  ComponentRef<typeof BaseProgress.Root>,
  BaseProgress.Root.Props
>(function Progress({ children, className, ...props }, ref) {
  return (
    <BaseProgress.Root
      ref={ref}
      {...props}
      className={mergeClassName("w-full space-y-2", className)}
    >
      {children ?? (
        <ProgressTrack>
          <ProgressIndicator />
        </ProgressTrack>
      )}
    </BaseProgress.Root>
  );
});

export const ProgressLabel = BaseProgress.Label;
export const ProgressValue = BaseProgress.Value;

export const ProgressTrack = forwardRef<
  ComponentRef<typeof BaseProgress.Track>,
  BaseProgress.Track.Props
>(function ProgressTrack({ className, ...props }, ref) {
  return (
    <BaseProgress.Track
      ref={ref}
      {...props}
      className={mergeClassName(
        "h-1.5 w-full overflow-hidden rounded-full bg-surface-hover",
        className,
      )}
    />
  );
});

export const ProgressIndicator = forwardRef<
  ComponentRef<typeof BaseProgress.Indicator>,
  BaseProgress.Indicator.Props
>(function ProgressIndicator({ className, ...props }, ref) {
  return (
    <BaseProgress.Indicator
      ref={ref}
      {...props}
      className={mergeClassName(
        "h-full rounded-full bg-primary transition-[width] duration-150 motion-reduce:transition-none data-indeterminate:w-1/3 data-indeterminate:animate-pulse motion-reduce:animate-none",
        className,
      )}
    />
  );
});
