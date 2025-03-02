
import React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

export interface TooltipProps {
  children: React.ReactNode;
  tooltip?: string; // Make tooltip optional
  className?: string;
}

export function Tooltip({ children, tooltip, className }: TooltipProps) {
  // Only render the tooltip if the tooltip prop is provided
  if (!tooltip) {
    return <>{children}</>;
  }

  return (
    <TooltipPrimitive.Provider>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>
          {children}
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Content 
          className={`z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-xs text-popover-foreground shadow-md animate-in fade-in-50 data-[side=bottom]:slide-in-from-top-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1 data-[side=top]:slide-in-from-bottom-1 ${className || ""}`}
        >
          {tooltip}
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}

// Re-export all the components needed for custom tooltips
export { 
  TooltipPrimitive
};
