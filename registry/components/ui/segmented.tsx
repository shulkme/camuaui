"use client";

import {
  forwardRef,
  createContext,
  useContext,
  type ComponentRef,
  type ForwardedRef,
  type RefAttributes,
  type ReactElement,
} from "react";

import type { RadioGroup as BaseRadioGroup } from "@base-ui/react/radio-group";
import {
  useId,
  useImperativeHandle,
  useLayoutEffect,
  useEffect,
  useRef,
} from "react";
import { mergeClassName } from "../../lib/utils";
import { Radio, type RadioProps } from "./radio";
import { RadioGroup } from "./radio-group";
import { SelectionIndicator } from "./selection-indicator";
import type { ControlSize } from "./styles";

export type SegmentedProps<Value = string> = BaseRadioGroup.Props<Value> & {
  size?: ControlSize;
};
const SegmentedSizeContext = createContext<ControlSize>("md");
const itemSizes: Record<ControlSize, string> = {
  sm: "h-7 text-label",
  md: "h-8 text-body",
  lg: "h-9 text-body",
};

const useClientLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

function SegmentedImpl<Value = string>(
  { children, className, size = "md", ...props }: SegmentedProps<Value>,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const rootRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  useImperativeHandle(ref, () => rootRef.current!);

  useClientLayoutEffect(() => {
    const root = rootRef.current;
    const indicator = indicatorRef.current;
    if (!root || !indicator) return;

    const observed = new Set<Element>();
    const resizeObserver = new ResizeObserver(updateIndicator);

    function updateIndicator() {
      if (!root || !indicator) return;
      const items = new Set(root.querySelectorAll("[data-segmented-item]"));
      for (const item of observed) {
        if (!items.has(item)) {
          resizeObserver.unobserve(item);
          observed.delete(item);
        }
      }
      for (const item of items) {
        if (!observed.has(item)) {
          resizeObserver.observe(item);
          observed.add(item);
        }
      }

      const selected = root.querySelector<HTMLElement>(
        "[data-segmented-item][data-checked]",
      );
      if (!selected) {
        indicator.hidden = true;
        return;
      }

      const initial = indicator.hidden;
      if (initial) indicator.style.transition = "none";
      indicator.style.setProperty(
        "--active-tab-left",
        `${selected.offsetLeft}px`,
      );
      indicator.style.setProperty(
        "--active-tab-top",
        `${selected.offsetTop}px`,
      );
      indicator.style.setProperty(
        "--active-tab-width",
        `${selected.offsetWidth}px`,
      );
      indicator.style.setProperty(
        "--active-tab-height",
        `${selected.offsetHeight}px`,
      );
      indicator.hidden = false;
      if (initial) {
        // Commit the initial position before enabling subsequent transitions.
        indicator.getBoundingClientRect();
        indicator.style.removeProperty("transition");
      }
    }

    const mutations = new MutationObserver(updateIndicator);
    mutations.observe(root, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["data-checked"],
    });
    resizeObserver.observe(root);
    updateIndicator();
    return () => {
      mutations.disconnect();
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <SegmentedSizeContext.Provider value={size}>
      <RadioGroup
        {...props}
        ref={rootRef}
        data-role="radiogroup"
        data-size={size}
        className={mergeClassName(
          "relative isolate inline-flex w-fit max-w-full flex-row items-center gap-1 overflow-auto rounded-full bg-surface-muted p-0.5",
          className,
        )}
      >
        {children}
        <SelectionIndicator
          ref={indicatorRef}
          data-segmented-indicator=""
          hidden
          className="bg-white shadow-[0_0_4px_rgb(0_0_0/0.08)]"
        />
      </RadioGroup>
    </SegmentedSizeContext.Provider>
  );
}
export const Segmented = forwardRef(SegmentedImpl) as <Value = string>(
  props: SegmentedProps<Value> & RefAttributes<HTMLDivElement>,
) => ReactElement | null;

export const SegmentedItem = forwardRef<ComponentRef<typeof Radio>, RadioProps>(
  function SegmentedItem(
    {
      className,
      children,
      "aria-label": ariaLabel,
      "aria-labelledby": labelledBy,
      ...props
    },
    ref,
  ) {
    const labelId = useId();
    const size = useContext(SegmentedSizeContext);
    return (
      <Radio
        ref={ref}
        {...props}
        aria-label={ariaLabel}
        aria-labelledby={labelledBy ?? (ariaLabel ? undefined : labelId)}
        data-role="radio"
        data-segmented-item=""
        className={mergeClassName(
          `${itemSizes[size]} w-auto min-w-12 rounded-full border-0 bg-transparent px-3 leading-none font-medium whitespace-nowrap text-primary select-none hover:not-data-disabled:not-data-checked:bg-surface-hover data-checked:bg-transparent data-checked:text-[#111111] data-disabled:text-quaternary data-disabled:opacity-100 data-checked:data-disabled:text-quaternary`,
          className,
        )}
      >
        <span id={labelId} className="leading-none">
          {children}
        </span>
      </Radio>
    );
  },
);
