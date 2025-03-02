
import React, { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "./components/ErrorBoundary";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const FallbackLoading = () => (
  <div className="flex items-center justify-center h-screen w-full bg-lavender-light">
    <div className="text-xl font-semibold">Loading Agentic Chat...</div>
  </div>
);

const App = () => (
  <ErrorBoundary>
    <BrowserRouter>
      <Suspense fallback={<FallbackLoading />}>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </ErrorBoundary>
);

export default App;
