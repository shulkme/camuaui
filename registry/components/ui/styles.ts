// Shared utility strings, kept static so Tailwind can detect every class.
export type ControlSize = "sm" | "md" | "lg";

export const controlSizeClasses: Record<ControlSize, string> = {
  sm: "min-h-8 text-label",
  md: "min-h-9 text-body",
  lg: "min-h-10 text-body",
};

export const focusClasses =
  "outline-accent-700 focus-visible:outline-2 focus-visible:outline-offset-0";

// Keep focus border/outline changes immediate; transition-colors also animates
// outline-color from currentColor as the outline first becomes visible.
export const controlClasses =
  "min-h-8 w-full min-w-0 rounded-lg border border-control-border bg-transparent px-3 text-body text-primary placeholder:text-tertiary outline-accent-700 transition-[color,background-color] duration-150 motion-reduce:transition-none hover:not-disabled:not-data-disabled:not-focus:not-data-popup-open:not-aria-invalid:not-data-invalid:border-control-border-hover focus:border-accent-700 focus:outline-2 focus:outline-offset-0 data-popup-open:border-accent-700 data-popup-open:outline-2 data-popup-open:outline-offset-0 aria-invalid:border-error-700 data-invalid:border-error-700 aria-invalid:focus:border-accent-700 data-invalid:focus:border-accent-700 disabled:cursor-not-allowed disabled:text-quaternary disabled:placeholder:text-quaternary data-disabled:cursor-not-allowed data-disabled:text-quaternary";

export const popupShadowClasses = "shadow-popup";

export const popupClasses = `rounded-lg border-0 bg-surface-raised p-2 text-body text-primary outline-none [--surface-muted:var(--surface-highlight)] ${popupShadowClasses}`;

export const popupMotionClasses =
  "origin-(--transform-origin) transition-[opacity,transform,scale] duration-150 data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0 motion-reduce:transition-none";

export const modalMotionClasses =
  "origin-center transition-[opacity,scale,translate] duration-200 ease-out data-nested-dialog-open:not-data-starting-style:not-data-ending-style:scale-[max(0.88,calc(1-var(--nested-dialogs,0)*0.04))] data-nested-dialog-open:not-data-starting-style:not-data-ending-style:translate-y-[calc(min(var(--nested-dialogs,0),3)*-0.75rem)] data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0 motion-reduce:transition-none";

export const itemClasses =
  "flex min-h-8 cursor-pointer items-center gap-2 rounded-sm px-2 py-1 text-body outline-none select-none data-highlighted:bg-surface-highlight data-disabled:pointer-events-none data-disabled:text-quaternary";

export const iconButtonClasses = `inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-secondary hover:bg-surface-highlight [&>svg]:size-5 ${focusClasses}`;

export const popupSearchClasses =
  "relative flex min-h-9 w-full items-center gap-2 rounded-t-lg rounded-b-none border-0 border-b border-divider px-3 text-body text-primary outline-accent-700 focus-within:outline-2 focus-within:-outline-offset-3";
