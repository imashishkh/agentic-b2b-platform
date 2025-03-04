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
component.tsx
"use client"

import * as React from "react"
import {
  Switch as AriaSwitch,
  SwitchProps as AriaSwitchProps,
  composeRenderProps,
} from "react-aria-components"

import { cn } from "@/lib/utils"

const Switch = ({ children, className, ...props }: AriaSwitchProps) => (
  <AriaSwitch
    className={composeRenderProps(className, (className) =>
      cn(
        "group inline-flex items-center gap-2 text-sm font-medium leading-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-70",
        className
      )
    )}
    {...props}
  >
    {composeRenderProps(children, (children) => (
      <>
        <div
          className={cn(
            "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors",
            /* Focus Visible */
            "group-data-[focus-visible]:outline-none group-data-[focus-visible]:ring-2 group-data-[focus-visible]:ring-ring group-data-[focus-visible]:ring-offset-2 group-data-[focus-visible]:ring-offset-background",
            /* Disabled */
            "group-data-[disabled]:cursor-not-allowed group-data-[disabled]:opacity-50",
            /* Selected */
            "bg-input group-data-[selected]:bg-primary",
            /* Readonly */
            "group-data-[readonly]:cursor-default",
            /* Resets */
            "focus-visible:outline-none"
          )}
        >
          <div
            className={cn(
              "pointer-events-none block size-5 rounded-full bg-background shadow-lg ring-0 transition-transform",
              /* Selected */
              "translate-x-0 group-data-[selected]:translate-x-5"
            )}
          />
        </div>
        {children}
      </>
    ))}
  </AriaSwitch>
)

export { Switch }


demo.tsx
import { Switch } from "@/components/ui/switch"

export function SwitchDemo() {
  return <Switch>Low power mode</Switch>
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