
import React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

export interface TooltipProps {
  children: React.ReactNode;
  tooltip?: string; // Make tooltip optional
  className?: string;
}

const TooltipProvider = TooltipPrimitive.Provider;
const TooltipRoot = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;
const TooltipContent = TooltipPrimitive.Content;

export function Tooltip({ children, tooltip, className }: TooltipProps) {
  // Only render the tooltip if the tooltip prop is provided
  if (!tooltip) {
    return <>{children}</>;
  }

  return (
    <TooltipProvider>
      <TooltipRoot>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent 
          className={`z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-xs text-popover-foreground shadow-md animate-in fade-in-50 data-[side=bottom]:slide-in-from-top-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1 data-[side=top]:slide-in-from-bottom-1 ${className || ""}`}
        >
          {tooltip}
        </TooltipContent>
      </TooltipRoot>
    </TooltipProvider>
  );
}

// Export all the components needed for custom tooltips
export { 
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
  TooltipContent
};

// Re-export the primitive for any advanced usage
export { TooltipPrimitive };
