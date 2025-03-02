
import React, { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { ChatContainer } from "@/components/chat/ChatContainer";
import { useChat } from "@/contexts/ChatContext";
import { ChatProvider } from "@/contexts/ChatContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ClerkProvider } from "@clerk/clerk-react";

// Default placeholder for publishable key
// In a production environment, this should be properly configured
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || "pk_test_placeholder";

const IndexContent = () => {
  // Get current agent type from chat context
  const { currentAgentType, setCurrentAgentType } = useChat();
  const [showApiSettings, setShowApiSettings] = useState(false);
  
  return (
    <MainLayout
      currentAgentType={currentAgentType}
      setCurrentAgentType={setCurrentAgentType}
      showApiSettings={showApiSettings}
      setShowApiSettings={setShowApiSettings}
    >
      <ChatContainer />
    </MainLayout>
  );
};

const Index = () => {
  return (
    <ErrorBoundary>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <ChatProvider>
          <IndexContent />
        </ChatProvider>
      </ClerkProvider>
    </ErrorBoundary>
  );
};

export default Index;
