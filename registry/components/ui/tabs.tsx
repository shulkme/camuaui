"use client";

import { forwardRef, type ComponentRef } from "react";

import { Tabs as BaseTabs } from "@base-ui/react/tabs";
import { createContext, useContext } from "react";
import { mergeClassName } from "../../lib/utils";
import { focusClasses } from "./styles";
import { SelectionIndicator } from "./selection-indicator";

export type TabsVariant = "pill" | "underline";
export interface TabsProps extends BaseTabs.Root.Props {
  variant?: TabsVariant;
}

const TabsVariantContext = createContext<TabsVariant>("pill");

export const Tabs = forwardRef<ComponentRef<typeof BaseTabs.Root>, TabsProps>(
  function Tabs({ className, variant = "pill", ...props }, ref) {
    return (
      <TabsVariantContext.Provider value={variant}>
        <BaseTabs.Root
          ref={ref}
          {...props}
          data-variant={variant}
          className={mergeClassName(
            "flex flex-col gap-4 data-[orientation=vertical]:flex-row",
            className,
          )}
        />
      </TabsVariantContext.Provider>
    );
  },
);

export const TabsList = forwardRef<
  ComponentRef<typeof BaseTabs.List>,
  BaseTabs.List.Props
>(function TabsList({ className, children, ...props }, ref) {
  return (
    <BaseTabs.List
      ref={ref}
      {...props}
      className={mergeClassName(
        "relative isolate inline-flex w-fit max-w-full gap-1 overflow-auto data-[orientation=vertical]:flex-col",
        className,
      )}
    >
      {children}
      <TabsIndicator />
    </BaseTabs.List>
  );
});

function TabsIndicator() {
  const variant = useContext(TabsVariantContext);
  return (
    <BaseTabs.Indicator
      renderBeforeHydration
      data-tabs-indicator={variant}
      render={variant === "pill" ? <SelectionIndicator /> : undefined}
      className={
        variant === "pill"
          ? undefined
          : "pointer-events-none absolute top-[calc(var(--active-tab-top)+var(--active-tab-height)-2px)] left-[calc(var(--active-tab-left)+var(--active-tab-width)/2-8px)] h-0.5 w-4 rounded-full bg-primary transition-[left,top] duration-250 ease-out motion-reduce:transition-none"
      }
    />
  );
}

export const TabsTrigger = forwardRef<
  ComponentRef<typeof BaseTabs.Tab>,
  BaseTabs.Tab.Props
>(function TabsTrigger({ className, ...props }, ref) {
  const variant = useContext(TabsVariantContext);
  const appearance =
    variant === "pill"
      ? "rounded-full bg-transparent"
      : "rounded-lg bg-transparent pb-2 data-active:font-semibold";
  return (
    <BaseTabs.Tab
      ref={ref}
      {...props}
      className={mergeClassName(
        `min-h-8 shrink-0 cursor-pointer px-4 text-body text-secondary hover:not-data-disabled:text-primary data-active:text-primary data-disabled:cursor-not-allowed data-disabled:text-quaternary ${focusClasses} ${appearance}`,
        className,
      )}
    />
  );
});

export const TabsContent = forwardRef<
  ComponentRef<typeof BaseTabs.Panel>,
  BaseTabs.Panel.Props
>(function TabsContent({ className, ...props }, ref) {
  return (
    <BaseTabs.Panel
      ref={ref}
      {...props}
      className={mergeClassName(`min-w-0 text-body ${focusClasses}`, className)}
    />
  );
});
