
import React, { ReactNode, useEffect, useState } from "react";
import { useUser as useClerkUser, useAuth as useClerkAuth } from "@clerk/clerk-react";
import { MockUserProvider, useMockUser, useAuth as useMockAuth } from "./MockUserProvider";

// Check if Clerk is available by looking for the environment variable
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const isClerkConfigured = PUBLISHABLE_KEY && PUBLISHABLE_KEY !== "pk_test_placeholder";

// Custom hook that tries Clerk first, falls back to mock
export const useUser = () => {
  if (isClerkConfigured) {
    try {
      // Try to use Clerk's useUser
      return useClerkUser();
    } catch (error) {
      console.warn("Clerk authentication error, falling back to mock user:", error);
      // If that fails, use our mock
      return useMockUser();
    }
  } else {
    // No Clerk key, use mock
    return useMockUser();
  }
};

// Custom hook that tries Clerk first, falls back to mock
export const useAuth = () => {
  if (isClerkConfigured) {
    try {
      // Try to use Clerk's useAuth
      return useClerkAuth();
    } catch (error) {
      console.warn("Clerk authentication error, falling back to mock auth:", error);
      // If that fails, use our mock
      return useMockAuth();
    }
  } else {
    // No Clerk key, use mock
    return useMockAuth();
  }
};

// User provider component that provides real or mock data
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [usingMock, setUsingMock] = useState(!isClerkConfigured);

  useEffect(() => {
    if (!isClerkConfigured) {
      console.info("Running in development mode with mock authentication. Set VITE_CLERK_PUBLISHABLE_KEY for real authentication.");
    }
  }, []);

  // Always use MockUserProvider when Clerk is not configured
  return usingMock ? (
    <MockUserProvider>{children}</MockUserProvider>
  ) : (
    <>{children}</>
  );
};
