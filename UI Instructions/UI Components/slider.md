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
'use client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Icons } from '@/components/ui/icons'

function SignInPage() {
  return (
    <div className="grid w-full grow items-center px-4 sm:justify-center">
      <Card className="w-full sm:w-96">
        <CardHeader>
          <CardTitle>Sign in to Acme Co</CardTitle>
          <CardDescription>Welcome back! Please sign in to continue</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-y-4">
          <div className="grid grid-cols-2 gap-x-4">
            <Button size="sm" variant="outline" type="button">
              <Icons.gitHub className="mr-2 size-4" />
              GitHub
            </Button>
            <Button size="sm" variant="outline" type="button">
              <Icons.google className="mr-2 size-4" />
              Google
            </Button>
          </div>
          
          <p className="flex items-center gap-x-3 text-sm text-muted-foreground before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">
            or
          </p>
          
          <div className="space-y-2">
            <Label>Email address</Label>
            <Input type="email" required />
          </div>
          
          <div className="space-y-2">
            <Label>Password</Label>
            <Input type="password" required />
          </div>
        </CardContent>
        
        <CardFooter>
          <div className="grid w-full gap-y-4">
            <Button>Sign in</Button>
            <Button variant="link" size="sm" asChild>
              <Link href="/signup">
                Don&apos;t have an account? Sign up
              </Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

export { SignInPage };

demo.tsx
'use client'
import { SignInPage } from "@/components/ui/sign-in";

function DemoPage() {
  return (
      <SignInPage />
  )
}

export { DemoPage };
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