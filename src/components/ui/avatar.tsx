
import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "@/lib/utils";
import { AgentType } from "@/agents/AgentTypes";

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    )}
    {...props}
  />
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image> & {
    agentType?: AgentType | "USER";
  }
>(({ className, agentType, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

type AvatarFallbackProps = React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback> & {
  agentType?: AgentType | "USER";
  name?: string;
};

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  AvatarFallbackProps
>(({ className, agentType, name, children, ...props }, ref) => {
  // Get the avatar background color based on agent type
  const getAvatarColor = (type?: AgentType | "USER") => {
    switch (type) {
      case AgentType.MANAGER:
        return "bg-purple-600 text-white";
      case AgentType.FRONTEND:
        return "bg-blue-500 text-white";
      case AgentType.BACKEND:
        return "bg-green-600 text-white";
      case AgentType.DATABASE:
        return "bg-amber-600 text-white";
      case AgentType.DEVOPS:
        return "bg-rose-600 text-white";
      case AgentType.UX:
        return "bg-indigo-600 text-white";
      case "USER":
        return "bg-gray-100 text-sayhalo-dark";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  // Get initials from name or use first character of agent type
  const getInitials = () => {
    if (name) {
      const nameParts = name.split(/\s+/);
      if (nameParts.length >= 2) {
        return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
      }
      return name.substring(0, 2).toUpperCase();
    }
    
    if (agentType) {
      return agentType.charAt(0).toUpperCase();
    }
    
    return "?";
  };

  return (
    <AvatarPrimitive.Fallback
      ref={ref}
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full",
        getAvatarColor(agentType),
        className
      )}
      {...props}
    >
      {children || getInitials()}
    </AvatarPrimitive.Fallback>
  );
});
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { Avatar, AvatarImage, AvatarFallback };
