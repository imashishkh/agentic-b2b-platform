
import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { ChatContainer } from "@/components/chat/ChatContainer";
import { useChat } from "@/contexts/ChatContext";
import { ChatProvider } from "@/contexts/ChatContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const IndexContent = () => {
  // Get current agent type from chat context
  const { currentAgentType, setCurrentAgentType } = useChat();
  
  return (
    <MainLayout
      currentAgentType={currentAgentType}
      setCurrentAgentType={setCurrentAgentType}
    >
      <ChatContainer />
    </MainLayout>
  );
};

const Index = () => {
  return (
    <ErrorBoundary>
      <ChatProvider>
        <IndexContent />
      </ChatProvider>
    </ErrorBoundary>
  );
};

export default Index;
