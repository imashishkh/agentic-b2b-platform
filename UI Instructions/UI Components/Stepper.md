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
"use client";

import { cn } from "@/lib/utils";
import { LoaderCircle } from "lucide-react";
import * as React from "react";
import { createContext, useContext } from "react";
import { CheckIcon } from "@radix-ui/react-icons";

// Types
type StepperContextValue = {
  activeStep: number;
  setActiveStep: (step: number) => void;
  orientation: "horizontal" | "vertical";
};

type StepItemContextValue = {
  step: number;
  state: StepState;
  isDisabled: boolean;
  isLoading: boolean;
};

type StepState = "active" | "completed" | "inactive" | "loading";

// Contexts
const StepperContext = createContext<StepperContextValue | undefined>(undefined);
const StepItemContext = createContext<StepItemContextValue | undefined>(undefined);

const useStepper = () => {
  const context = useContext(StepperContext);
  if (!context) {
    throw new Error("useStepper must be used within a Stepper");
  }
  return context;
};

const useStepItem = () => {
  const context = useContext(StepItemContext);
  if (!context) {
    throw new Error("useStepItem must be used within a StepperItem");
  }
  return context;
};

// Components
interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: number;
  value?: number;
  onValueChange?: (value: number) => void;
  orientation?: "horizontal" | "vertical";
}

const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
  (
    { defaultValue = 0, value, onValueChange, orientation = "horizontal", className, ...props },
    ref,
  ) => {
    const [activeStep, setInternalStep] = React.useState(defaultValue);

    const setActiveStep = React.useCallback(
      (step: number) => {
        if (value === undefined) {
          setInternalStep(step);
        }
        onValueChange?.(step);
      },
      [value, onValueChange],
    );

    const currentStep = value ?? activeStep;

    return (
      <StepperContext.Provider
        value={{
          activeStep: currentStep,
          setActiveStep,
          orientation,
        }}
      >
        <div
          ref={ref}
          className={cn(
            "group/stepper inline-flex data-[orientation=horizontal]:w-full data-[orientation=horizontal]:flex-row data-[orientation=vertical]:flex-col",
            className,
          )}
          data-orientation={orientation}
          {...props}
        />
      </StepperContext.Provider>
    );
  },
);
Stepper.displayName = "Stepper";

// StepperItem
interface StepperItemProps extends React.HTMLAttributes<HTMLDivElement> {
  step: number;
  completed?: boolean;
  disabled?: boolean;
  loading?: boolean;
}

const StepperItem = React.forwardRef<HTMLDivElement, StepperItemProps>(
  (
    { step, completed = false, disabled = false, loading = false, className, children, ...props },
    ref,
  ) => {
    const { activeStep } = useStepper();

    const state: StepState =
      completed || step < activeStep ? "completed" : activeStep === step ? "active" : "inactive";

    const isLoading = loading && step === activeStep;

    return (
      <StepItemContext.Provider value={{ step, state, isDisabled: disabled, isLoading }}>
        <div
          ref={ref}
          className={cn(
            "group/step flex items-center group-data-[orientation=horizontal]/stepper:flex-row group-data-[orientation=vertical]/stepper:flex-col",
            className,
          )}
          data-state={state}
          {...(isLoading ? { "data-loading": true } : {})}
          {...props}
        >
          {children}
        </div>
      </StepItemContext.Provider>
    );
  },
);
StepperItem.displayName = "StepperItem";

// StepperTrigger
interface StepperTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

const StepperTrigger = React.forwardRef<HTMLButtonElement, StepperTriggerProps>(
  ({ asChild = false, className, children, ...props }, ref) => {
    const { setActiveStep } = useStepper();
    const { step, isDisabled } = useStepItem();

    if (asChild) {
      return <div className={className}>{children}</div>;
    }

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center gap-3 disabled:pointer-events-none disabled:opacity-50",
          className,
        )}
        onClick={() => setActiveStep(step)}
        disabled={isDisabled}
        {...props}
      >
        {children}
      </button>
    );
  },
);
StepperTrigger.displayName = "StepperTrigger";

// StepperIndicator
interface StepperIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

const StepperIndicator = React.forwardRef<HTMLDivElement, StepperIndicatorProps>(
  ({ asChild = false, className, children, ...props }, ref) => {
    const { state, step, isLoading } = useStepItem();

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground data-[state=active]:bg-primary data-[state=completed]:bg-primary data-[state=active]:text-primary-foreground data-[state=completed]:text-primary-foreground",
          className,
        )}
        data-state={state}
        {...props}
      >
        {asChild ? (
          children
        ) : (
          <>
            <span className="transition-all group-data-[loading=true]/step:scale-0 group-data-[state=completed]/step:scale-0 group-data-[loading=true]/step:opacity-0 group-data-[state=completed]/step:opacity-0 group-data-[loading=true]/step:transition-none">
              {step}
            </span>
            <CheckIcon
              className="absolute scale-0 opacity-0 transition-all group-data-[state=completed]/step:scale-100 group-data-[state=completed]/step:opacity-100"
              size={16}
              strokeWidth={2}
              aria-hidden="true"
            />
            {isLoading && (
              <span className="absolute transition-all">
                <LoaderCircle
                  className="animate-spin"
                  size={14}
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </span>
            )}
          </>
        )}
      </div>
    );
  },
);
StepperIndicator.displayName = "StepperIndicator";

// StepperTitle
const StepperTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-sm font-medium", className)} {...props} />
  ),
);
StepperTitle.displayName = "StepperTitle";

// StepperDescription
const StepperDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
));
StepperDescription.displayName = "StepperDescription";

// StepperSeparator
const StepperSeparator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "m-0.5 bg-muted group-data-[orientation=horizontal]/stepper:h-0.5 group-data-[orientation=vertical]/stepper:h-12 group-data-[orientation=horizontal]/stepper:w-full group-data-[orientation=vertical]/stepper:w-0.5 group-data-[orientation=horizontal]/stepper:flex-1 group-data-[state=completed]/step:bg-primary",
          className,
        )}
        {...props}
      />
    );
  },
);
StepperSeparator.displayName = "StepperSeparator";

export {
  Stepper,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
};


demo.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTrigger,
} from "@/components/ui/stepper";
import { useState } from "react";

const steps = [1, 2, 3, 4];

function Component() {
  const [currentStep, setCurrentStep] = useState(2);
  const [isLoading, setIsLoading] = useState(false);

  const handleNextStep = () => {
    setIsLoading(true);
    setTimeout(() => {
      setCurrentStep((prev) => prev + 1);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="mx-auto max-w-xl space-y-8 text-center min-w-[300px]">
      <Stepper value={currentStep} onValueChange={setCurrentStep}>
        {steps.map((step) => (
          <StepperItem
            key={step}
            step={step}
            className="[&:not(:last-child)]:flex-1"
            loading={isLoading}
          >
            <StepperTrigger asChild>
              <StepperIndicator />
            </StepperTrigger>
            {step < steps.length && <StepperSeparator />}
          </StepperItem>
        ))}
      </Stepper>
      <div className="flex justify-center space-x-4">
        <Button
          variant="outline"
          className="w-32"
          onClick={() => setCurrentStep((prev) => prev - 1)}
          disabled={currentStep === 1}
        >
          Prev step
        </Button>
        <Button
          variant="outline"
          className="w-32"
          onClick={handleNextStep}
          disabled={currentStep > steps.length}
        >
          Next step
        </Button>
      </div>
      <p className="mt-2 text-xs text-muted-foreground" role="region" aria-live="polite">
        Controlled stepper with checkmarks and loading state
      </p>
    </div>
  );
}

export { Component };

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