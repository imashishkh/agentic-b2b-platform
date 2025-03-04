You are given a task to integrate an existing React component in the codebase

The codebase should support:
- shadcn project structure  
- Tailwind CSS
- Typescript

If it doesn't, provide instructions on how to setup project via shadcn CLI, install Tailwind or Typescript.

Determine the default path for components and styles. 
If default path for components is not /components/ui, provide instructions on why it's important to create this folder
Copy-paste this component to /components/ui folder:
```tsx
code.tsx?v=1
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { IconType } from "@remixicon/react"

const statusBadgeVariants = cva(
  "inline-flex items-center gap-x-2.5 rounded-tremor-full bg-background px-2.5 py-1.5 text-tremor-label border",
  {
    variants: {
      status: {
        success: "",
        error: "",
        default: "",
      },
    },
    defaultVariants: {
      status: "default",
    },
  }
)

interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusBadgeVariants> {
  leftIcon?: IconType
  rightIcon?: IconType
  leftLabel: string
  rightLabel: string
}

export function StatusBadge({
  className,
  status,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  leftLabel,
  rightLabel,
  ...props
}: StatusBadgeProps) {
  return (
    <span className={cn(statusBadgeVariants({ status }), className)} {...props}>
      <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
        {LeftIcon && (
          <LeftIcon 
            className={cn(
              "-ml-0.5 size-4 shrink-0",
              status === "success" && "text-emerald-600 dark:text-emerald-500",
              status === "error" && "text-red-600 dark:text-red-500"
            )} 
            aria-hidden={true}
          />
        )}
        {leftLabel}
      </span>
      <span className="h-4 w-px bg-border" />
      <span className="inline-flex items-center gap-1.5 text-muted-foreground">
        {RightIcon && (
          <RightIcon 
            className="-ml-0.5 size-4 shrink-0" 
            aria-hidden={true}
          />
        )}
        {rightLabel}
      </span>
    </span>
  )
}

code.demo.tsx?v=1
import { StatusBadge } from "@/components/ui/status-badge"
import {
  RiCheckboxCircleFill,
  RiCloseCircleFill,
  RiCloseCircleLine,
  RiShieldCheckLine,
} from '@remixicon/react'

export function StatusBadgeDemo() {
  return (
    <div className="flex flex-wrap justify-center gap-4">
      <StatusBadge 
        leftIcon={RiShieldCheckLine}
        rightIcon={RiCloseCircleLine}
        leftLabel="Protection"
        rightLabel="SSO login"
        status="success"
      />
      <StatusBadge 
        leftIcon={RiCheckboxCircleFill}
        rightIcon={RiCloseCircleLine}
        leftLabel="Live"
        rightLabel="Audit trails"
        status="success"
      />
      <StatusBadge 
        leftIcon={RiCloseCircleFill}
        rightIcon={RiShieldCheckLine}
        leftLabel="Safety checks"
        rightLabel="Production"
        status="error"
      />
    </div>
  )
}
```

Copy-paste these files for dependencies:
```tsx
/components/ui/status-badge.tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { IconType } from "@remixicon/react"

const statusBadgeVariants = cva(
  "inline-flex items-center gap-x-2.5 rounded-tremor-full bg-background px-2.5 py-1.5 text-tremor-label border",
  {
    variants: {
      status: {
        success: "",
        error: "",
        default: "",
      },
    },
    defaultVariants: {
      status: "default",
    },
  }
)

interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusBadgeVariants> {
  leftIcon?: IconType
  rightIcon?: IconType
  leftLabel: string
  rightLabel: string
}

export function StatusBadge({
  className,
  status,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  leftLabel,
  rightLabel,
  ...props
}: StatusBadgeProps) {
  return (
    <span className={cn(statusBadgeVariants({ status }), className)} {...props}>
      <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
        {LeftIcon && (
          <LeftIcon 
            className={cn(
              "-ml-0.5 size-4 shrink-0",
              status === "success" && "text-emerald-600 dark:text-emerald-500",
              status === "error" && "text-red-600 dark:text-red-500"
            )} 
            aria-hidden={true}
          />
        )}
        {leftLabel}
      </span>
      <span className="h-4 w-px bg-border" />
      <span className="inline-flex items-center gap-1.5 text-muted-foreground">
        {RightIcon && (
          <RightIcon 
            className="-ml-0.5 size-4 shrink-0" 
            aria-hidden={true}
          />
        )}
        {rightLabel}
      </span>
    </span>
  )
}
```

Install NPM dependencies:
```bash
@remixicon/react, class-variance-authority
```

Extend existing tailwind.config.js with this code:
```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      borderRadius: {
        'tremor-default': '0.5rem',
        'tremor-small': '0.375rem',
        'tremor-full': '9999px',
      },
      fontSize: {
        'tremor-label': ['0.75rem'],
      },
    }
  }
}
```

Implementation Guidelines
 1. Analyze the component structure and identify all required dependencies
 2. Review the component's argumens and state
 3. Identify any required context providers or hooks and install them
 4. Questions to Ask
 - What data/props will be passed to this component?
 - Are there any specific state management requirements?
 - Are there any required assets (images, icons, etc.)?
 - What is the expected responsive behavior?
 - What is the best place to use this component in the app?

Steps to integrate
 0. Copy paste all the code above in the correct directories
 1. Install external dependencies
 2. Fill image assets with Unsplash stock images you know exist
 3. Use lucide-react icons for svgs or logos if component requires them


IMPORTANT: Create all mentioned files in full, without abbreviations. Do not use placeholders like "insert the rest of the code here" – output every line of code exactly as it is, so it can be copied and pasted directly into the project.