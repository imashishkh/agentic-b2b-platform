
import React from "react";
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import { useToast } from "@/components/ui/use-toast";

interface ClerkAuthProviderProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export function ClerkAuthProvider({ children, requireAuth = false }: ClerkAuthProviderProps) {
  const { toast } = useToast();
  
  // Check for publishable key
  const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 
    process.env.VITE_CLERK_PUBLISHABLE_KEY;
    
  // For demo purposes, if no key is provided, we'll use a placeholder
  // In production, you would want to require a valid key
  const clerkKey = PUBLISHABLE_KEY || "pk_test_placeholder_key";
  
  if (!PUBLISHABLE_KEY) {
    console.warn("Missing Clerk publishable key. Authentication will be in demo mode.");
    
    // Show warning toast - only in development
    if (process.env.NODE_ENV === "development") {
      setTimeout(() => {
        toast({
          title: "Authentication Demo Mode",
          description: "Add VITE_CLERK_PUBLISHABLE_KEY to your environment variables for full authentication.",
          variant: "destructive"
        });
      }, 1000);
    }
  }

  return (
    <ClerkProvider publishableKey={clerkKey}>
      {requireAuth ? (
        <>
          <SignedIn>{children}</SignedIn>
          <SignedOut>
            <div className="p-4 text-center">
              <h2 className="text-lg font-semibold mb-2">Authentication Required</h2>
              <p className="mb-4">Please sign in to continue using this application.</p>
              {/* We're not using RedirectToSignIn as per instructions */}
              <p>Sign in using the button in the sidebar.</p>
            </div>
          </SignedOut>
        </>
      ) : (
        // No authentication required, just render children
        children
      )}
    </ClerkProvider>
  );
}
