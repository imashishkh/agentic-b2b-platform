
import React, { useRef } from "react";
import { useParams } from "react-router-dom";
import { ChatMessages } from "@/components/chat/ChatMessages";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatProcessor } from "@/components/ChatProcessor";
import { useChat } from "@/contexts/ChatContext";
import { AgentType } from "@/agents/AgentTypes";

export default function ChatView() {
  const { chatId } = useParams<{ chatId: string }>();
  const { messages, isAgentTyping, isLoadingExample } = useChat();
  
  // Create a ref for the ChatProcessor
  const chatProcessorRef = useRef<any>(null);
  
  // State variables for ChatHeader props
  const [showApiSettings, setShowApiSettings] = React.useState(false);
  const [showProjectPanel, setShowProjectPanel] = React.useState(false);

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background">
      <ChatHeader 
        setShowApiSettings={setShowApiSettings}
        showProjectPanel={showProjectPanel}
        setShowProjectPanel={setShowProjectPanel}
      />
      <div className="flex-1 overflow-auto">
        <ChatMessages 
          messages={messages} 
          isLoadingExample={isLoadingExample} 
          isAgentTyping={isAgentTyping} 
        />
      </div>
      {/* Chat input is deliberately removed from here - will be provided by ChatContainer */}
      <ChatProcessor chatRef={chatProcessorRef} />
    </div>
  );
}
