
import React from "react";
import ReactDOM from "react-dom/client";
import { TooltipProvider } from "@/components/ui/tooltip";
import App from "./App";
import "./index.css";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { UserProvider } from "./components/UserProvider";

try {
  console.log("Application starting...");
  
  // Check if the root element exists
  const rootElement = document.getElementById("root");
  console.log("Root element found:", !!rootElement);
  
  if (!rootElement) {
    console.error("Root element not found in the DOM");
  }
} catch (error) {
  console.error("Error during initialization:", error);
}

// Create a client for React Query
const queryClient = new QueryClient();

// Render the app
try {
  const rootElement = document.getElementById("root");
  if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <ErrorBoundary>
          <QueryClientProvider client={queryClient}>
            <TooltipProvider>
              <UserProvider>
                <App />
                <Toaster />
              </UserProvider>
            </TooltipProvider>
          </QueryClientProvider>
        </ErrorBoundary>
      </React.StrictMode>
    );
    console.log("React app successfully rendered");
  } else {
    console.error("Failed to find root element");
    document.body.innerHTML = '<div style="padding: 20px; font-family: sans-serif;"><h1>Error Loading Application</h1><p>Could not find root element. Please check your console for more details.</p></div>';
  }
} catch (error) {
  console.error("Error rendering React app:", error);
  document.body.innerHTML = '<div style="padding: 20px; font-family: sans-serif;"><h1>Error Loading Application</h1><p>An error occurred while loading the application. Please check your console for more details.</p></div>';
}
