import { forwardRef } from "react";
import type { ComponentProps } from "react";
import { cn } from "../../lib/utils";

export type CardVariant = "surface" | "background";
export interface CardProps extends ComponentProps<"div"> {
  variant?: CardVariant;
}

const backgrounds: Record<CardVariant, string> = {
  surface: "bg-surface",
  background: "bg-background",
};

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { className, variant = "surface", ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      {...props}
      data-variant={variant}
      className={cn(
        "rounded-2xl p-5 text-body text-primary",
        backgrounds[variant],
        className,
      )}
    />
  );
});

export const CardHeader = forwardRef<HTMLDivElement, ComponentProps<"div">>(
  function CardHeader({ className, ...props }, ref) {
    return (
      <div ref={ref} {...props} className={cn("mb-4 space-y-1.5", className)} />
    );
  },
);

export const CardTitle = forwardRef<HTMLHeadingElement, ComponentProps<"h3">>(
  function CardTitle({ className, ...props }, ref) {
    return (
      <h3
        ref={ref}
        {...props}
        className={cn("text-base font-semibold", className)}
      />
    );
  },
);

export const CardDescription = forwardRef<
  HTMLParagraphElement,
  ComponentProps<"p">
>(function CardDescription({ className, ...props }, ref) {
  return (
    <p
      ref={ref}
      {...props}
      className={cn("text-body text-tertiary", className)}
    />
  );
});

export const CardContent = forwardRef<HTMLDivElement, ComponentProps<"div">>(
  function CardContent({ className, ...props }, ref) {
    return <div ref={ref} {...props} className={cn("space-y-4", className)} />;
  },
);

export const CardFooter = forwardRef<HTMLDivElement, ComponentProps<"div">>(
  function CardFooter({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        {...props}
        className={cn("mt-5 flex flex-wrap items-center gap-3", className)}
      />
    );
  },
);
