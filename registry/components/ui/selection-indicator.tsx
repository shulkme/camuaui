import { forwardRef } from "react";
import type { ComponentPropsWithRef } from "react";
import { cn } from "../../lib/utils";

// Shared by Tabs and Segmented; the owning primitive supplies the measurements.
export const SelectionIndicator = forwardRef<
  HTMLSpanElement,
  ComponentPropsWithRef<"span">
>(function SelectionIndicator({ className, ...props }, ref) {
  return (
    <span
      ref={ref}
      {...props}
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute top-0 left-0 -z-10 h-(--active-tab-height) w-(--active-tab-width) translate-x-(--active-tab-left) translate-y-(--active-tab-top) rounded-full bg-surface-muted transition-[translate,width,height] duration-250 ease-out motion-reduce:transition-none",
        className,
      )}
    />
  );
});
