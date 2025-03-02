
import React, { createContext, useContext, ReactNode } from "react";

// Define a simple mock user type
export interface MockUser {
  id: string;
  fullName: string;
  imageUrl: string;
  username: string;
  primaryEmailAddress?: {
    emailAddress: string;
  };
}

// Create context with default values
const UserContext = createContext<{
  user: MockUser;
  isSignedIn: boolean;
  isLoaded: boolean;
}>({
  user: {
    id: "mock-user-id",
    fullName: "Demo User",
    imageUrl: "/placeholder.svg",
    username: "demouser",
    primaryEmailAddress: {
      emailAddress: "demo@example.com"
    }
  },
  isSignedIn: true,
  isLoaded: true
});

// Custom hook to use the user context
export const useUser = () => useContext(UserContext);

// Mock auth function for compatibility
export const useAuth = () => {
  return {
    signOut: async () => {
      console.log("Mock sign out successful");
      return Promise.resolve();
    }
  };
};

// Provider component for the user context
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Create a static mock user
  const mockUser: MockUser = {
    id: "mock-user-id",
    fullName: "Demo User",
    imageUrl: "/placeholder.svg",
    username: "demouser",
    primaryEmailAddress: {
      emailAddress: "demo@example.com"
    }
  };

  return (
    <UserContext.Provider value={{ user: mockUser, isSignedIn: true, isLoaded: true }}>
      {children}
    </UserContext.Provider>
  );
};
