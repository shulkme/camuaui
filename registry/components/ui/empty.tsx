import { forwardRef, type ComponentProps } from "react";
import { cn } from "../../lib/utils";

export const Empty = forwardRef<HTMLDivElement, ComponentProps<"div">>(
  function Empty({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        {...props}
        data-slot="empty"
        className={cn(
          "flex w-full min-w-0 flex-col items-center gap-6 rounded-2xl bg-surface p-6 text-center text-body text-primary sm:p-8",
          className,
        )}
      />
    );
  },
);

export const EmptyHeader = forwardRef<HTMLDivElement, ComponentProps<"div">>(
  function EmptyHeader({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        {...props}
        className={cn("flex w-full max-w-sm flex-col items-center gap-2", className)}
      />
    );
  },
);

export const EmptyIcon = forwardRef<HTMLDivElement, ComponentProps<"div">>(
  function EmptyIcon({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        aria-hidden="true"
        {...props}
        className={cn(
          "mb-2 flex size-12 shrink-0 items-center justify-center rounded-lg bg-surface-muted text-secondary [&>svg]:size-6 [&>svg]:shrink-0",
          className,
        )}
      />
    );
  },
);

export const EmptyTitle = forwardRef<HTMLHeadingElement, ComponentProps<"h3">>(
  function EmptyTitle({ className, ...props }, ref) {
    return <h3 ref={ref} {...props} className={cn("text-base font-semibold text-primary", className)} />;
  },
);

export const EmptyDescription = forwardRef<HTMLParagraphElement, ComponentProps<"p">>(
  function EmptyDescription({ className, ...props }, ref) {
    return <p ref={ref} {...props} className={cn("text-pretty text-body text-tertiary", className)} />;
  },
);

export const EmptyActions = forwardRef<HTMLDivElement, ComponentProps<"div">>(
  function EmptyActions({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        {...props}
        className={cn("flex max-w-full flex-wrap items-center justify-center gap-2", className)}
      />
    );
  },
);

export const EmptyExtra = forwardRef<HTMLDivElement, ComponentProps<"div">>(
  function EmptyExtra({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        {...props}
        className={cn(
          "-mt-3 flex w-full flex-col items-center gap-3 text-label text-tertiary",
          className,
        )}
      />
    );
  },
);
