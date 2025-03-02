
import React, { createContext, useContext, ReactNode } from "react";

// Create a mock user structure that matches what we need
interface MockUser {
  id: string;
  fullName: string;
  imageUrl: string;
  username: string;
  email: string;
}

// Create a mock user context
const MockUserContext = createContext<{ user: MockUser | null; isSignedIn: boolean; isLoaded: boolean }>({
  user: null,
  isSignedIn: false,
  isLoaded: true
});

// Create a hook to access the mock user
export const useMockUser = () => useContext(MockUserContext);

// Provider component that wraps children
export const MockUserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Create a mock user
  const mockUser: MockUser = {
    id: "mock-user-id",
    fullName: "Demo User",
    imageUrl: "/placeholder.svg",
    username: "demouser",
    email: "demo@example.com"
  };

  return (
    <MockUserContext.Provider value={{ user: mockUser, isSignedIn: true, isLoaded: true }}>
      {children}
    </MockUserContext.Provider>
  );
};
