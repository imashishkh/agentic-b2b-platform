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
code.tsx?v=2
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { RiCloseFill } from '@remixicon/react'

const filterBadgeVariants = cva(
  "inline-flex items-center bg-background text-tremor-label text-muted-foreground border",
  {
    variants: {
      variant: {
        default: "rounded-tremor-small gap-x-2.5 py-1 pl-2.5 pr-1",
        pill: "rounded-tremor-full gap-x-2.5 py-1 pl-2.5 pr-1",
        avatar: "rounded-tremor-full gap-2 px-1 py-1",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface FilterBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof filterBadgeVariants> {
  label?: string
  value?: string
  avatar?: string
  children?: React.ReactNode
  onRemove?: () => void
}

export function FilterBadge({
  className,
  variant,
  label,
  value,
  avatar,
  children,
  onRemove,
  ...props
}: FilterBadgeProps) {
  if (variant === "avatar") {
    return (
      <span className={cn(filterBadgeVariants({ variant }), className)} {...props}>
        {avatar && (
          <img
            className="inline-block size-5 rounded-tremor-full"
            src={avatar}
            alt=""
          />
        )}
        {children}
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="flex size-5 items-center justify-center rounded-tremor-full text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Remove"
          >
            <RiCloseFill className="size-4 shrink-0" aria-hidden={true} />
          </button>
        )}
      </span>
    )
  }

  return (
    <span className={cn(filterBadgeVariants({ variant }), className)} {...props}>
      {label}
      <span className="h-4 w-px bg-border" />
      <span className="font-medium text-foreground">
        {value}
      </span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className={cn(
            "-ml-1.5 flex size-5 items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground",
            variant === "pill" ? "rounded-tremor-full" : "rounded"
          )}
          aria-label="Remove"
        >
          <RiCloseFill className="size-4 shrink-0" aria-hidden={true} />
        </button>
      )}
    </span>
  )
}

code.demo.tsx?v=1
import { FilterBadge } from "@/components/ui/filter-badge"

export function FilterBadgeDefault() {
  return (
    <div className="flex flex-wrap justify-center gap-4">
      <FilterBadge 
        label="Department"
        value="Sales"
        onRemove={() => {}}
      />
      <FilterBadge 
        label="Location"
        value="Zurich"
        onRemove={() => {}}
      />
      <FilterBadge 
        label="Sales volume"
        value="$100K-5M"
        onRemove={() => {}}
      />
      <FilterBadge 
        label="Status"
        value="Closed"
        onRemove={() => {}}
      />
    </div>
  )
}
```

Copy-paste these files for dependencies:
```tsx
/components/ui/filter-badge.tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { RiCloseFill } from '@remixicon/react'

const filterBadgeVariants = cva(
  "inline-flex items-center bg-background text-tremor-label text-muted-foreground border",
  {
    variants: {
      variant: {
        default: "rounded-tremor-small gap-x-2.5 py-1 pl-2.5 pr-1",
        pill: "rounded-tremor-full gap-x-2.5 py-1 pl-2.5 pr-1",
        avatar: "rounded-tremor-full gap-2 px-1 py-1",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface FilterBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof filterBadgeVariants> {
  label?: string
  value?: string
  avatar?: string
  children?: React.ReactNode
  onRemove?: () => void
}

export function FilterBadge({
  className,
  variant,
  label,
  value,
  avatar,
  children,
  onRemove,
  ...props
}: FilterBadgeProps) {
  if (variant === "avatar") {
    return (
      <span className={cn(filterBadgeVariants({ variant }), className)} {...props}>
        {avatar && (
          <img
            className="inline-block size-5 rounded-tremor-full"
            src={avatar}
            alt=""
          />
        )}
        {children}
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="flex size-5 items-center justify-center rounded-tremor-full text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Remove"
          >
            <RiCloseFill className="size-4 shrink-0" aria-hidden={true} />
          </button>
        )}
      </span>
    )
  }

  return (
    <span className={cn(filterBadgeVariants({ variant }), className)} {...props}>
      {label}
      <span className="h-4 w-px bg-border" />
      <span className="font-medium text-foreground">
        {value}
      </span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className={cn(
            "-ml-1.5 flex size-5 items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground",
            variant === "pill" ? "rounded-tremor-full" : "rounded"
          )}
          aria-label="Remove"
        >
          <RiCloseFill className="size-4 shrink-0" aria-hidden={true} />
        </button>
      )}
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