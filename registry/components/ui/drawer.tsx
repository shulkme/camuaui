"use client";

import { forwardRef, type ComponentProps, type ComponentRef } from "react";

import { Drawer as BaseDrawer } from "@base-ui/react/drawer";
import { createContext, useContext, type ReactNode } from "react";
import { cn, mergeClassName } from "../../lib/utils";
import { ButtonSizeContext } from "./button";
import { CloseIcon } from "./icons";
import { iconButtonClasses, popupClasses } from "./styles";

export type DrawerSide = "top" | "right" | "bottom" | "left";
const directions = {
  top: "up",
  right: "right",
  bottom: "down",
  left: "left",
} as const;
const sides = {
  up: "top",
  right: "right",
  down: "bottom",
  left: "left",
} as const;
const DrawerContext = createContext({
  side: "bottom" as DrawerSide,
  hasSnapPoints: false,
  modal: true,
});
export type DrawerSnapPoint = BaseDrawer.Root.SnapPoint;
export interface DrawerProps<Payload = unknown>
  extends BaseDrawer.Root.Props<Payload> {
  side?: DrawerSide;
}

export function Drawer<Payload = unknown>({
  side: sideProp,
  swipeDirection,
  ...props
}: DrawerProps<Payload>) {
  const side = sideProp ?? (swipeDirection ? sides[swipeDirection] : "bottom");
  return (
    <DrawerContext.Provider
      value={{
        side,
        hasSnapPoints: Boolean(props.snapPoints?.length),
        modal: props.modal !== false,
      }}
    >
      <BaseDrawer.Root {...props} swipeDirection={directions[side]} />
    </DrawerContext.Provider>
  );
}
export const DrawerTrigger = BaseDrawer.Trigger;
export const DrawerClose = BaseDrawer.Close;
export const DrawerProvider = BaseDrawer.Provider;
export const DrawerSwipeArea = BaseDrawer.SwipeArea;
export const DrawerVirtualKeyboardProvider = BaseDrawer.VirtualKeyboardProvider;
export const createDrawerHandle = BaseDrawer.createHandle;

export const DrawerFooter = forwardRef<HTMLDivElement, ComponentProps<"div">>(
  function DrawerFooter({ className, ...props }, ref) {
    return (
      <ButtonSizeContext.Provider value="md">
        <div
          ref={ref}
          {...props}
          data-drawer-footer=""
          className={cn(
            "flex flex-wrap items-center justify-end gap-3",
            className,
          )}
        />
      </ButtonSizeContext.Provider>
    );
  },
);

export const DrawerIndent = forwardRef<
  ComponentRef<typeof BaseDrawer.Indent>,
  BaseDrawer.Indent.Props
>(function DrawerIndent({ className, ...props }, ref) {
  return (
    <BaseDrawer.Indent
      ref={ref}
      {...props}
      className={mergeClassName(
        "drawer-indent-motion relative bg-surface",
        className,
      )}
    />
  );
});

export const DrawerIndentBackground = forwardRef<
  ComponentRef<typeof BaseDrawer.IndentBackground>,
  BaseDrawer.IndentBackground.Props
>(function DrawerIndentBackground({ className, ...props }, ref) {
  return (
    <BaseDrawer.IndentBackground
      ref={ref}
      {...props}
      className={mergeClassName("absolute inset-0 bg-surface-muted", className)}
    />
  );
});

const viewportClasses: Record<DrawerSide, string> = {
  bottom: "items-end justify-center",
  top: "items-start justify-center",
  left: "items-stretch justify-start",
  right: "items-stretch justify-end",
};
const panelClasses: Record<DrawerSide, string> = {
  bottom: "w-full max-w-lg",
  top: "w-full max-w-lg",
  left: "h-full max-h-full w-full max-w-sm",
  right: "h-full max-h-full w-full max-w-sm",
};

export interface DrawerContentProps extends BaseDrawer.Popup.Props {
  showCloseButton?: boolean;
  contentProps?: BaseDrawer.Content.Props;
  portalProps?: BaseDrawer.Portal.Props;
  viewportProps?: BaseDrawer.Viewport.Props;
  backdropProps?: BaseDrawer.Backdrop.Props;
  showBackdrop?: boolean;
  showHandle?: boolean;
  header?: ReactNode;
  footer?: ReactNode;
  stacked?: boolean;
}

export const DrawerContent = forwardRef<
  ComponentRef<typeof BaseDrawer.Popup>,
  DrawerContentProps
>(function DrawerContent(
  {
    children,
    className,
    showCloseButton = true,
    contentProps,
    portalProps,
    viewportProps,
    backdropProps,
    showBackdrop,
    showHandle = true,
    header,
    footer,
    stacked = true,
    ...props
  },
  ref,
) {
  const { side, hasSnapPoints, modal } = useContext(DrawerContext);
  const vertical = side === "top" || side === "bottom";
  return (
    <BaseDrawer.Portal {...portalProps}>
      {(showBackdrop ?? modal) && (
        <BaseDrawer.Backdrop
          {...backdropProps}
          className={mergeClassName(
            "drawer-backdrop-motion fixed inset-0 z-50 min-h-dvh bg-scrim",
            backdropProps?.className,
          )}
        />
      )}
      <BaseDrawer.Viewport
        {...viewportProps}
        className={mergeClassName(
          `pointer-events-none fixed inset-0 z-50 flex touch-none p-3 ${viewportClasses[side]}`,
          viewportProps?.className,
        )}
      >
        <BaseDrawer.Popup
          ref={ref}
          {...props}
          data-snap-points={hasSnapPoints ? "" : undefined}
          data-side={side}
          data-stacked={stacked && !hasSnapPoints ? "" : undefined}
          className={mergeClassName(
            `${popupClasses} drawer-motion pointer-events-auto relative flex max-h-[calc(100dvh-2rem)] touch-none flex-col rounded-3xl p-0 ${panelClasses[side]} ${hasSnapPoints && vertical ? "h-[calc(100dvh-2rem)]" : ""}`,
            className,
          )}
        >
          {showHandle && (
            <div
              className={`shrink-0 cursor-grab touch-none select-none active:cursor-grabbing ${vertical ? `py-4 ${side === "top" ? "order-last" : ""}` : `absolute inset-y-12 z-10 flex w-5 items-center justify-center ${side === "left" ? "right-0" : "left-0"}`}`}
              data-drawer-handle=""
              aria-hidden="true"
            >
              <div
                className={`rounded-full bg-control-border ${vertical ? "mx-auto h-1 w-10" : "h-10 w-1"}`}
              />
            </div>
          )}
          {header && <div className="drawer-fixed shrink-0">{header}</div>}
          <BaseDrawer.Content
            {...contentProps}
            className={mergeClassName(
              "drawer-content min-h-0 flex-1 touch-auto overflow-y-auto overscroll-contain p-6",
              contentProps?.className,
            )}
          >
            {children}
          </BaseDrawer.Content>
          {footer && (
            <ButtonSizeContext.Provider value="md">
              <div className="drawer-fixed shrink-0" data-drawer-footer="">
                {footer}
              </div>
            </ButtonSizeContext.Provider>
          )}
          {showCloseButton && (
            <BaseDrawer.Close
              aria-label="关闭抽屉"
              className={`${iconButtonClasses} absolute top-3 right-3`}
            >
              <CloseIcon />
            </BaseDrawer.Close>
          )}
        </BaseDrawer.Popup>
      </BaseDrawer.Viewport>
    </BaseDrawer.Portal>
  );
});

export const DrawerTitle = forwardRef<
  ComponentRef<typeof BaseDrawer.Title>,
  BaseDrawer.Title.Props
>(function DrawerTitle({ className, ...props }, ref) {
  return (
    <BaseDrawer.Title
      ref={ref}
      {...props}
      className={mergeClassName("pr-8 text-base font-semibold", className)}
    />
  );
});

export const DrawerDescription = forwardRef<
  ComponentRef<typeof BaseDrawer.Description>,
  BaseDrawer.Description.Props
>(function DrawerDescription({ className, ...props }, ref) {
  return (
    <BaseDrawer.Description
      ref={ref}
      {...props}
      className={mergeClassName("mt-2 text-body text-tertiary", className)}
    />
  );
});
