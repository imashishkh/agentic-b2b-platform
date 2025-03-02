
import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { ChatMessages } from "@/components/chat/ChatMessages";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatFooter } from "@/components/chat/ChatFooter";
import { ChatProcessor } from "@/components/ChatProcessor";
import { useChat } from "@/contexts/ChatContext";
import { AgentType } from "@/agents/AgentTypes";

export default function ChatView() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { chatId } = useParams<{ chatId: string }>();
  const { messages, addMessage, isAgentTyping, isLoadingExample, setIsAgentTyping } = useChat();
  
  // Create a ref for the ChatProcessor
  const chatProcessorRef = useRef<any>(null);
  
  // State variables for ChatHeader props
  const [showApiSettings, setShowApiSettings] = useState(false);
  const [showProjectPanel, setShowProjectPanel] = useState(false);

  const handleSendMessage = async (message: string) => {
    if (message.trim()) {
      addMessage({
        type: "user",
        content: message,
      });
      
      // Use ChatProcessor to generate a response
      if (chatProcessorRef.current) {
        chatProcessorRef.current.processUserMessage(message);
      } else {
        // Fallback if ChatProcessor isn't ready
        setIsAgentTyping(true);
        setTimeout(() => {
          addMessage({
            type: "agent",
            agentType: AgentType.MANAGER,
            content: "I've received your message. How can I assist you further with your project?",
          });
          setIsAgentTyping(false);
        }, 2000);
      }
    }
  };

  const handleFileUpload = (files: File[]) => {
    if (files.length > 0) {
      addMessage({
        type: "user",
        content: `Uploaded ${files.map(f => f.name).join(", ")}`,
      });
      
      // Use ChatProcessor to process the file
      if (chatProcessorRef.current) {
        chatProcessorRef.current.processUserMessage("Please analyze this file.", files);
      } else {
        // Fallback if ChatProcessor isn't ready
        setIsAgentTyping(true);
        setTimeout(() => {
          addMessage({
            type: "agent",
            agentType: AgentType.MANAGER,
            content: "I've received your file. I'll analyze it and get back to you with my findings shortly.",
          });
          
          setIsAgentTyping(false);
        }, 3000);
      }
    }
  };

  const handleStartWithExample = () => {
    // Implementation for example button
    toast({
      title: "Loading example requirements",
      description: "Please wait while the example is being loaded."
    });
    // Add example implementation here
  };

  const handleClearChat = () => {
    // Implementation for clearing chat
    toast({
      title: "Chat history cleared",
      description: "All messages have been removed from the chat."
    });
    // Add clear chat implementation here
  };

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
      <ChatFooter
        onSendMessage={handleSendMessage}
        handleFileUpload={handleFileUpload}
        handleStartWithExample={handleStartWithExample}
        handleClearChat={handleClearChat}
        isLoadingExample={isLoadingExample}
        isAgentTyping={isAgentTyping}
      />
      <ChatProcessor chatRef={chatProcessorRef} />
    </div>
  );
}
