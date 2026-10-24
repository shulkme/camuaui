"use client";

import { forwardRef, type ComponentRef, type Ref } from "react";
import { ScrollArea as BaseScrollArea } from "@base-ui/react/scroll-area";
import { mergeClassName } from "../../lib/utils";

export type ScrollAreaOrientation = "vertical" | "horizontal" | "both";

// Match Base UI's gradient example: fade only as far as the remaining overflow.
const fadeMasks: Record<ScrollAreaOrientation, string> = {
  vertical: "[mask-image:linear-gradient(to_bottom,transparent_0,black_min(40px,var(--scroll-area-overflow-y-start,0px)),black_calc(100%_-_min(40px,var(--scroll-area-overflow-y-end,40px))),transparent_100%)]",
  horizontal: "[mask-image:linear-gradient(to_right,transparent_0,black_min(40px,var(--scroll-area-overflow-x-start,0px)),black_calc(100%_-_min(40px,var(--scroll-area-overflow-x-end,40px))),transparent_100%)]",
  both: "[mask-image:linear-gradient(to_bottom,transparent_0,black_min(40px,var(--scroll-area-overflow-y-start,0px)),black_calc(100%_-_min(40px,var(--scroll-area-overflow-y-end,40px))),transparent_100%),linear-gradient(to_right,transparent_0,black_min(40px,var(--scroll-area-overflow-x-start,0px)),black_calc(100%_-_min(40px,var(--scroll-area-overflow-x-end,40px))),transparent_100%)] [mask-composite:intersect]",
};

export const ScrollAreaRoot = forwardRef<
  ComponentRef<typeof BaseScrollArea.Root>, BaseScrollArea.Root.Props
>(function ScrollAreaRoot({ className, ...props }, ref) {
  return <BaseScrollArea.Root ref={ref} {...props} className={mergeClassName("group/scroll-area relative min-h-0 min-w-0 overflow-hidden rounded-lg", className)} />;
});

export interface ScrollAreaViewportProps extends BaseScrollArea.Viewport.Props {
  fade?: boolean;
  orientation?: ScrollAreaOrientation;
}

export const ScrollAreaViewport = forwardRef<
  ComponentRef<typeof BaseScrollArea.Viewport>, ScrollAreaViewportProps
>(function ScrollAreaViewport({ className, fade = false, orientation = "vertical", ...props }, ref) {
  return (
    <BaseScrollArea.Viewport
      ref={ref} {...props} data-scroll-area-viewport="" data-fade={fade ? "" : undefined}
      className={mergeClassName(`h-full w-full overscroll-contain rounded-[inherit] outline-accent-700 focus-visible:outline-2 focus-visible:-outline-offset-2 ${fade ? `${fadeMasks[orientation]} [mask-repeat:no-repeat]` : ""}`, className)}
    />
  );
});

export const ScrollAreaContent = forwardRef<
  ComponentRef<typeof BaseScrollArea.Content>, BaseScrollArea.Content.Props
>(function ScrollAreaContent({ className, ...props }, ref) {
  return <BaseScrollArea.Content ref={ref} {...props} className={mergeClassName("min-w-full", className)} />;
});

export const ScrollAreaThumb = forwardRef<
  ComponentRef<typeof BaseScrollArea.Thumb>, BaseScrollArea.Thumb.Props
>(function ScrollAreaThumb({ className, ...props }, ref) {
  return (
    <BaseScrollArea.Thumb
      ref={ref} {...props} data-scroll-area-thumb=""
      className={mergeClassName("h-full w-full rounded-full bg-primary/20 transition-colors hover:bg-primary/30 motion-reduce:transition-none", className)}
    />
  );
});

export const ScrollAreaScrollbar = forwardRef<
  ComponentRef<typeof BaseScrollArea.Scrollbar>, BaseScrollArea.Scrollbar.Props
>(function ScrollAreaScrollbar({ className, orientation = "vertical", children, ...props }, ref) {
  return (
    <BaseScrollArea.Scrollbar
      ref={ref} {...props} orientation={orientation}
      className={mergeClassName(`pointer-events-none z-10 flex touch-none select-none p-0.5 opacity-0 transition-opacity duration-150 data-hovering:pointer-events-auto data-hovering:opacity-100 group-has-[:focus-visible]/scroll-area:pointer-events-auto group-has-[:focus-visible]/scroll-area:opacity-100 motion-reduce:transition-none ${orientation === "vertical" ? "w-2.5" : "h-2.5"}`, className)}
    >
      {children ?? <ScrollAreaThumb />}
    </BaseScrollArea.Scrollbar>
  );
});

export const ScrollAreaCorner = BaseScrollArea.Corner;

export interface ScrollAreaProps extends BaseScrollArea.Root.Props {
  orientation?: ScrollAreaOrientation;
  variant?: "default" | "fade";
  viewportRef?: Ref<HTMLDivElement>;
  viewportProps?: ScrollAreaViewportProps;
  contentProps?: BaseScrollArea.Content.Props;
}

export const ScrollArea = forwardRef<ComponentRef<typeof BaseScrollArea.Root>, ScrollAreaProps>(
  function ScrollArea({ children, orientation = "vertical", variant = "default", viewportRef, viewportProps, contentProps, ...props }, ref) {
    return (
      <ScrollAreaRoot ref={ref} {...props} data-variant={variant}>
        <ScrollAreaViewport ref={viewportRef} fade={variant === "fade"} orientation={orientation} {...viewportProps}>
          <ScrollAreaContent {...contentProps}>{children}</ScrollAreaContent>
        </ScrollAreaViewport>
        {orientation !== "horizontal" && <ScrollAreaScrollbar orientation="vertical" />}
        {orientation !== "vertical" && <ScrollAreaScrollbar orientation="horizontal" />}
        {orientation === "both" && <ScrollAreaCorner />}
      </ScrollAreaRoot>
    );
  },
);
