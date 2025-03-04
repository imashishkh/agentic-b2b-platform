
import React, { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "./components/ErrorBoundary";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import MainLayout from "./components/layout/MainLayout";
import ProductCatalog from "./features/ProductCatalog";
import ProductDetail from "./features/ProductDetail";
import Dashboard from "./features/Dashboard";
import OnboardingFlow from "./features/OnboardingFlow";
import { ThemeProvider } from "./components/ui/theme-provider";
import { ModeToggle } from "./components/ModeToggle";

const FallbackLoading = () => (
  <div className="flex items-center justify-center h-screen w-full bg-lavender-light">
    <div className="text-xl font-semibold">Loading B2B Platform...</div>
  </div>
);

const App = () => (
  <ErrorBoundary>
    <ThemeProvider defaultTheme="light" storageKey="b2b-platform-theme">
      <BrowserRouter>
        <Suspense fallback={<FallbackLoading />}>
          <div className="min-h-screen">
            <div className="fixed top-4 right-4 z-50">
              <ModeToggle />
            </div>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/onboarding" element={<OnboardingFlow />} />
              <Route path="/" element={
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              } />
              <Route path="/products" element={
                <MainLayout>
                  <ProductCatalog />
                </MainLayout>
              } />
              <Route path="/products/:id" element={
                <MainLayout>
                  <ProductDetail />
                </MainLayout>
              } />
              <Route path="/dashboard" element={
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </Suspense>
      </BrowserRouter>
    </ThemeProvider>
  </ErrorBoundary>
);

export default App;
