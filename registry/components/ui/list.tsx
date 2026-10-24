"use client";

import {
  createContext,
  forwardRef,
  useContext,
  type ComponentProps,
  type HTMLAttributes,
} from "react";

import { cn } from "../../lib/utils";

export type ListSize = "sm" | "md" | "lg";

type ListContextValue = {
  divided: boolean;
  hoverable: boolean;
  size: ListSize;
};

const ListContext = createContext<ListContextValue>({
  divided: true,
  hoverable: false,
  size: "md",
});

function useListContext() {
  return useContext(ListContext);
}

const sizeItemClasses: Record<ListSize, string> = {
  sm: "gap-3 py-2.5",
  md: "gap-3 py-3.5",
  lg: "gap-4 py-4",
};

const sizeTitleClasses: Record<ListSize, string> = {
  sm: "text-label",
  md: "text-body",
  lg: "text-body",
};

export interface ListProps extends ComponentProps<"ul"> {
  /** 行间底部分隔线，默认 true */
  divided?: boolean;
  /** 行悬停背景，默认 false */
  hoverable?: boolean;
  size?: ListSize;
}

export const List = forwardRef<HTMLUListElement, ListProps>(function List(
  {
    className,
    divided = true,
    hoverable = false,
    size = "md",
    children,
    ...props
  },
  ref,
) {
  return (
    <ListContext.Provider value={{ divided, hoverable, size }}>
      <ul
        ref={ref}
        role="list"
        {...props}
        data-slot="list"
        data-divided={divided || undefined}
        data-hoverable={hoverable || undefined}
        data-size={size}
        className={cn("flex list-none flex-col p-0 text-body text-primary", className)}
      >
        {children}
      </ul>
    </ListContext.Provider>
  );
});

export interface ListItemProps extends ComponentProps<"li"> {
  /** 覆盖 List 的 divided */
  divided?: boolean;
  /** 覆盖 List 的 hoverable */
  hoverable?: boolean;
}

export const ListItem = forwardRef<HTMLLIElement, ListItemProps>(
  function ListItem(
    { className, divided: dividedProp, hoverable: hoverableProp, ...props },
    ref,
  ) {
    const ctx = useListContext();
    const divided = dividedProp ?? ctx.divided;
    const hoverable = hoverableProp ?? ctx.hoverable;

    return (
      <li
        ref={ref}
        {...props}
        data-slot="list-item"
        data-divided={divided || undefined}
        data-hoverable={hoverable || undefined}
        className={cn(
          "relative flex min-w-0 items-center px-3",
          sizeItemClasses[ctx.size],
          divided && "border-b border-divider last:border-b-0",
          hoverable &&
            "rounded-lg transition-colors duration-150 hover:bg-background-hover focus-within:bg-background-hover motion-reduce:transition-none",
          className,
        )}
      />
    );
  },
);

/** 左侧图标 / 头像等媒体区 */
export const ListItemMedia = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(function ListItemMedia({ className, ...props }, ref) {
  return (
    <div
      ref={ref}
      {...props}
      data-slot="list-item-media"
      className={cn("flex shrink-0 items-center justify-center", className)}
    />
  );
});

/** 中间主内容区（通常包 Title + Description） */
export const ListItemMeta = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(function ListItemMeta({ className, ...props }, ref) {
  return (
    <div
      ref={ref}
      {...props}
      data-slot="list-item-meta"
      className={cn("min-w-0 flex-1", className)}
    />
  );
});

export const ListItemTitle = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(function ListItemTitle({ className, ...props }, ref) {
  const { size } = useListContext();
  return (
    <div
      ref={ref}
      {...props}
      data-slot="list-item-title"
      className={cn(
        "truncate text-primary",
        sizeTitleClasses[size],
        className,
      )}
    />
  );
});

export const ListItemDescription = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(function ListItemDescription({ className, ...props }, ref) {
  return (
    <div
      ref={ref}
      {...props}
      data-slot="list-item-description"
      className={cn("mt-0.5 truncate text-label text-tertiary", className)}
    />
  );
});

/** 右侧操作按钮组 */
export const ListItemActions = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(function ListItemActions({ className, ...props }, ref) {
  return (
    <div
      ref={ref}
      {...props}
      data-slot="list-item-actions"
      className={cn("flex shrink-0 items-center gap-2", className)}
    />
  );
});

/** Alias for the central content slot. */
export const ListItemContent = ListItemMeta;
