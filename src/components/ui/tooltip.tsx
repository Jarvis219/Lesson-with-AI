import { ReactNode } from "react";

type TooltipSide = "top" | "bottom" | "left" | "right";

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  side?: TooltipSide;
}

export function Tooltip({ content, children, side = "top" }: TooltipProps) {
  const positionClass =
    side === "top"
      ? "bottom-full left-1/2 -translate-x-1/2 mb-1"
      : side === "bottom"
      ? "top-full left-1/2 -translate-x-1/2 mt-1"
      : side === "left"
      ? "right-full top-1/2 -translate-y-1/2 mr-1"
      : "left-full top-1/2 -translate-y-1/2 ml-1"; // right

  return (
    <span className="relative inline-block group align-middle">
      {children}
      <span
        className={
          "pointer-events-none absolute z-50 max-w-xs whitespace-pre-wrap rounded-md bg-gray-900 px-2 py-1 text-xs text-white shadow-sm opacity-0 transition-opacity duration-150 group-hover:opacity-100 " +
          positionClass
        }
        role="tooltip">
        {content}
      </span>
    </span>
  );
}
