
import React, { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { ChatContainer } from "@/components/chat/ChatContainer";
import { useChat } from "@/contexts/ChatContext";
import { ChatProvider } from "@/contexts/ChatContext";

const IndexContent = () => {
  // State to toggle API settings modal
  const [showApiSettings, setShowApiSettings] = useState(false);
  
  // Get current agent type from chat context
  const { currentAgentType, setCurrentAgentType } = useChat();
  
  return (
    <MainLayout
      currentAgentType={currentAgentType}
      setCurrentAgentType={setCurrentAgentType}
      showApiSettings={showApiSettings}
      setShowApiSettings={setShowApiSettings}
    >
      <ChatContainer
        onSendMessage={() => {}} // This prop is not used as the ChatContainer manages message handling internally
      />
    </MainLayout>
  );
};

const Index = () => {
  return (
    <ChatProvider>
      <IndexContent />
    </ChatProvider>
  );
};

export default Index;
