
import React, { ReactNode } from "react";
import { useUser as useClerkUser } from "@clerk/clerk-react";
import { MockUserProvider, useMockUser } from "./MockUserProvider";

// Custom hook that tries Clerk first, falls back to mock
export const useUser = () => {
  try {
    // Try to use Clerk's useUser
    return useClerkUser();
  } catch (error) {
    // If that fails, use our mock
    return useMockUser();
  }
};

// User provider component that provides real or mock data
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Check if Clerk is available
  const isClerkAvailable = () => {
    try {
      useClerkUser();
      return true;
    } catch (error) {
      return false;
    }
  };

  // Use the appropriate provider
  return isClerkAvailable() ? (
    <>{children}</>
  ) : (
    <MockUserProvider>{children}</MockUserProvider>
  );
};
