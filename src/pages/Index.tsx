
import React, { useRef, useState } from "react";
import { Chat } from "@/components/Chat";
import { ChatInput } from "@/components/ChatInput";
import { ApiSettings } from "@/components/ApiSettings";
import { Sidebar } from "@/components/Sidebar";
import { AgentType } from "@/agents/AgentTypes";
import { useChat } from "@/contexts/ChatContext";

const Index = () => {
  // State to toggle API settings modal
  const [showApiSettings, setShowApiSettings] = useState(false);
  
  // Reference to chat methods exposed by ChatProcessor
  const chatRef = useRef<{ processUserMessage: (message: string, files?: File[]) => void }>(null);
  
  // Get current agent type from chat context
  const { currentAgentType, setCurrentAgentType } = useChat();
  
  // Handle sending a message via the chat input
  const handleSendMessage = (message: string, files?: File[]) => {
    if (chatRef.current) {
      chatRef.current.processUserMessage(message, files);
    }
  };
  
  return (
    <div className="flex w-full h-screen bg-lavender-light overflow-hidden">
      {/* Sidebar */}
      <Sidebar 
        currentAgentType={currentAgentType}
        setCurrentAgentType={setCurrentAgentType}
        onToggleSettings={() => setShowApiSettings(true)}
      />
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full">
        <div className="flex-1 overflow-hidden">
          <Chat chatRef={chatRef} />
        </div>
        <div className="p-4 bg-white border-t border-gray-200">
          <ChatInput onSendMessage={handleSendMessage} />
        </div>
      </div>
      
      {/* API Settings Modal */}
      {showApiSettings && (
        <ApiSettings onClose={() => setShowApiSettings(false)} />
      )}
    </div>
  );
};

export default Index;
