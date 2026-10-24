"use client";

import { forwardRef, type ComponentRef } from "react";

import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";
import { mergeClassName } from "../../lib/utils";
import { popupMotionClasses, popupShadowClasses } from "./styles";

export const Tooltip = BaseTooltip.Root;
export const TooltipTrigger = BaseTooltip.Trigger;

export function TooltipProvider(props: BaseTooltip.Provider.Props) {
  return <BaseTooltip.Provider delay={350} {...props} />;
}

export type TooltipContentProps = BaseTooltip.Popup.Props & {
  positionerProps?: BaseTooltip.Positioner.Props;
};

export const TooltipContent = forwardRef<
  ComponentRef<typeof BaseTooltip.Popup>,
  TooltipContentProps
>(function TooltipContent({ className, positionerProps, ...props }, ref) {
  return (
    <BaseTooltip.Portal>
      <BaseTooltip.Positioner
        sideOffset={8}
        {...positionerProps}
        className={mergeClassName("z-70", positionerProps?.className)}
      >
        <BaseTooltip.Popup
          ref={ref}
          {...props}
          className={mergeClassName(
            `max-w-64 rounded-lg border-0 bg-primary px-3 py-2 text-label text-primary-foreground ${popupShadowClasses} ${popupMotionClasses}`,
            className,
          )}
        />
      </BaseTooltip.Positioner>
    </BaseTooltip.Portal>
  );
});
