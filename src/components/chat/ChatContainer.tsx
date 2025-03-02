
import React, { useRef, useState } from "react";
import ChatView from "@/components/ChatView";
import { useChat } from "@/contexts/ChatContext";
import { ChatFooter } from "@/components/chat/ChatFooter";
import { toast } from "sonner";
import { ChatProcessor } from "@/components/ChatProcessor";
import { AgentType } from "@/agents/AgentTypes";

export function ChatContainer() {
  const { 
    messages, 
    addMessage, 
    clearMessages, 
    isAgentTyping, 
    isLoadingExample,
    setIsAgentTyping
  } = useChat();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  
  const chatRef = useRef<{ processUserMessage: (message: string, files?: File[]) => void }>(null);
  
  const handleSendMessage = async (message: string) => {
    try {
      if (message.trim() === "") return;
      
      // First, add the user message to the chat
      await addMessage({
        content: message,
        type: "user",
      });
      
      if (chatRef.current) {
        // Process the message using our ChatProcessor
        chatRef.current.processUserMessage(message, uploadedFiles.length > 0 ? uploadedFiles : undefined);
        
        if (uploadedFiles.length > 0) {
          toast.success(`Processing message with ${uploadedFiles.length} file(s)`);
          setUploadedFiles([]);
        }
      } else {
        console.error("ChatProcessor reference is not available");
        // Fallback simple response if ChatProcessor isn't available
        setIsAgentTyping(true);
        setTimeout(() => {
          addMessage({
            type: "agent",
            agentType: AgentType.MANAGER,
            content: "I'm processing your request. How can I assist you further with your project?"
          });
          setIsAgentTyping(false);
        }, 2000);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
      setIsAgentTyping(false);
    }
  };
  
  const handleFileUpload = (files: File[]) => {
    if (files.length > 0) {
      setUploadedFiles(files);
      
      // Add a user message about the file upload
      addMessage({
        type: "user",
        content: `Uploaded ${files.map(f => f.name).join(", ")}`,
      });
      
      // Process the file with minimal message text
      if (chatRef.current) {
        chatRef.current.processUserMessage("Please analyze this file.", files);
      } else {
        // Fallback if ChatProcessor isn't available
        setIsAgentTyping(true);
        setTimeout(() => {
          addMessage({
            type: "agent",
            agentType: AgentType.MANAGER,
            content: "I've received your files. I'll analyze them and get back to you with my findings.",
          });
          setIsAgentTyping(false);
          toast.success(`${files.length} file(s) received`);
        }, 3000);
      }
    }
  };
  
  const handleStartWithExample = () => {
    toast.info("Starting with example project");
    // Add example project message
    addMessage({
      type: "user",
      content: "I want to start with an example e-commerce project",
    });
    
    if (chatRef.current) {
      chatRef.current.processUserMessage("I want to start with an example e-commerce project");
    } else {
      // Fallback if ChatProcessor isn't available
      setIsAgentTyping(true);
      setTimeout(() => {
        addMessage({
          type: "agent",
          agentType: AgentType.MANAGER,
          content: "I've loaded an example e-commerce project for you. This includes a standard product catalog, shopping cart, and checkout flow. Would you like me to explain the architecture or should we customize it to your needs?",
        });
        setIsAgentTyping(false);
      }, 2500);
    }
  };
  
  const handleClearChat = () => {
    clearMessages();
    toast.success("Chat cleared");
    
    // Add welcome message after clearing
    setTimeout(() => {
      addMessage({
        type: "agent",
        agentType: AgentType.MANAGER,
        content: "Hello! I'm DevManager, your AI project manager. How can I help you today?",
      });
    }, 300);
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-hidden">
        <ChatView />
      </div>
      <ChatFooter 
        onSendMessage={handleSendMessage}
        handleFileUpload={handleFileUpload}
        handleStartWithExample={handleStartWithExample}
        handleClearChat={handleClearChat}
        isLoadingExample={isLoadingExample}
        isAgentTyping={isAgentTyping}
      />
      <ChatProcessor chatRef={chatRef} />
    </div>
  );
}
