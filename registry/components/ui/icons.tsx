import { forwardRef } from "react";
import type { ComponentProps } from "react";

type IconProps = ComponentProps<"svg">;

export const SearchIcon = forwardRef<SVGSVGElement, IconProps>(
  function SearchIcon(props, ref) {
    return (
      <svg
        ref={ref}
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        {...props}
      >
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="m16 16 4 4" />
      </svg>
    );
  },
);

export const CheckIcon = forwardRef<SVGSVGElement, IconProps>(
  function CheckIcon(props, ref) {
    return (
      <svg
        ref={ref}
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        {...props}
      >
        <path d="m5 12 4 4L19 6" />
      </svg>
    );
  },
);

export const CloseIcon = forwardRef<SVGSVGElement, IconProps>(
  function CloseIcon(props, ref) {
    return (
      <svg
        ref={ref}
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        {...props}
      >
        <path d="m6 6 12 12M6 18 18 6" />
      </svg>
    );
  },
);

export const ChevronDownIcon = forwardRef<SVGSVGElement, IconProps>(
  function ChevronDownIcon(props, ref) {
    return (
      <svg
        ref={ref}
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        {...props}
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    );
  },
);

export const MinusIcon = forwardRef<SVGSVGElement, IconProps>(
  function MinusIcon(props, ref) {
    return (
      <svg
        ref={ref}
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        {...props}
      >
        <path d="M5 12h14" />
      </svg>
    );
  },
);

export const PlusIcon = forwardRef<SVGSVGElement, IconProps>(
  function PlusIcon(props, ref) {
    return (
      <svg
        ref={ref}
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        {...props}
      >
        <path d="M5 12h14M12 5v14" />
      </svg>
    );
  },
);
