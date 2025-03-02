
import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Input Component
 * 
 * A customized input element with consistent styling that integrates
 * with the design system. Supports all standard HTML input attributes.
 * 
 * Features responsive text sizing and consistent styling across viewports.
 * 
 * @prop className - Additional CSS classes to apply
 * @prop type - Input type (text, password, etc.)
 * @prop ...props - All standard HTML input attributes
 */
const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm",
          "ring-offset-background placeholder:text-muted-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
