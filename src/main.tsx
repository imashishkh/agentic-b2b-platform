
import React from "react";
import ReactDOM from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import App from "./App";
import "./index.css";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { UserProvider } from "./components/UserProvider";

// Create a client for React Query
const queryClient = new QueryClient();

// Get Clerk publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const clerkEnabled = PUBLISHABLE_KEY && PUBLISHABLE_KEY !== "pk_test_placeholder";

// Render the app
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          {clerkEnabled ? (
            <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
              <UserProvider>
                <App />
                <Toaster />
              </UserProvider>
            </ClerkProvider>
          ) : (
            <UserProvider>
              <App />
              <Toaster />
            </UserProvider>
          )}
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
