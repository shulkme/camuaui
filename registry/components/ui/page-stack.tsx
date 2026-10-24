"use client";

import {
  Children, Fragment, createContext, forwardRef, isValidElement,
  useContext, useEffect, useLayoutEffect, useRef, useState,
  type ComponentPropsWithoutRef, type CSSProperties, type ReactNode,
} from "react";
import { cn } from "../../lib/utils";

const useBrowserLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;
const PageStackContext = createContext<{ values: string[]; value: string } | null>(null);

export interface PageStackProps extends ComponentPropsWithoutRef<"div"> {
  /** Active page. Declare pages in parent-to-child order. */
  value: string;
  /** Transition duration in milliseconds. */
  duration?: number;
}

function collectPages(children: ReactNode): string[] {
  return Children.toArray(children).flatMap((child) => {
    if (!isValidElement<{ value: string; children?: ReactNode }>(child)) return [];
    if (child.type === Fragment) return collectPages(child.props.children);
    if (child.type !== PageStackPage) throw new Error("PageStack children must be PageStackPage elements.");
    return [child.props.value];
  });
}

export const PageStack = forwardRef<HTMLDivElement, PageStackProps>(function PageStack(
  { value, duration = 300, children, className, style, ...props }, ref,
) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [height, setHeight] = useState<number>();
  const values = collectPages(children);
  if (new Set(values).size !== values.length || !values.includes(value)) {
    throw new Error("PageStack requires unique page values and a value matching one of its pages.");
  }

  useBrowserLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const pages = Array.from(root.querySelectorAll<HTMLDivElement>(":scope > [data-page-stack-page]"));
    const active = pages.find((page) => page.dataset.pageStackPage === value);
    if (!active) return;
    const focusWasInside = pages.some((page) => page !== active && page.contains(document.activeElement));
    // Use the DOM attribute directly for both React 18 and React 19.
    for (const page of pages) page.toggleAttribute("inert", page !== active);
    if (focusWasInside) active.focus({ preventScroll: true });
    const measure = () => setHeight(active.getBoundingClientRect().height);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(active);
    return () => observer.disconnect();
  }, [value, children]);

  return (
    <PageStackContext.Provider value={{ value, values }}>
      <div
        {...props}
        ref={(node) => {
          rootRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        data-page-stack=""
        className={cn("relative isolate overflow-hidden transition-[height] duration-(--page-stack-duration) ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none", className)}
        style={{ height, "--page-stack-duration": `${Math.max(0, duration)}ms`, ...style } as CSSProperties}
      >
        {children}
      </div>
    </PageStackContext.Provider>
  );
});

export interface PageStackPageProps extends ComponentPropsWithoutRef<"div"> {
  value: string;
}

export const PageStackPage = forwardRef<HTMLDivElement, PageStackPageProps>(function PageStackPage(
  { value, className, style, ...props }, ref,
) {
  const context = useContext(PageStackContext);
  if (!context) throw new Error("PageStackPage must be inside PageStack.");
  const index = context.values.indexOf(value);
  const activeIndex = context.values.indexOf(context.value);
  const active = value === context.value;
  return (
    <div
      {...props}
      ref={ref}
      tabIndex={props.tabIndex ?? -1}
      data-page-stack-page={value}
      data-active={active ? "" : undefined}
      aria-hidden={active ? undefined : true}
      className={cn(
        "top-0 left-0 flow-root w-full min-w-0 outline-none transition-[translate,visibility] [transition-duration:var(--page-stack-duration),0ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
        active ? "visible relative z-10 [transition-delay:0ms]" : "invisible pointer-events-none absolute [transition-delay:0ms,var(--page-stack-duration)] motion-reduce:[transition-delay:0ms]",
        className,
      )}
      style={{ translate: `${Math.sign(index - activeIndex) * 100}% 0`, ...style }}
    />
  );
});
