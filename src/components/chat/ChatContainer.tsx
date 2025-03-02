
import React, { useRef, useState } from "react";
import ChatView from "@/components/ChatView";
import { useChat } from "@/contexts/ChatContext";
import { ChatFooter } from "@/components/chat/ChatFooter";
import { toast } from "sonner";

export function ChatContainer() {
  const { 
    messages, 
    addMessage, 
    clearMessages, 
    isAgentTyping, 
    isLoadingExample 
  } = useChat();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  
  const chatRef = useRef<{ processUserMessage: (message: string, files?: File[]) => void }>(null);
  
  const handleSendMessage = async (message: string) => {
    try {
      if (message.trim() === "") return;
      
      await addMessage({
        content: message,
        type: "user",
      });
      
      // In a real implementation, you would process the message here
      // For now, we'll just simulate a response
      if (uploadedFiles.length > 0) {
        toast.success(`Processing message with ${uploadedFiles.length} file(s)`);
        setUploadedFiles([]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    }
  };
  
  const handleFileUpload = (files: File[]) => {
    if (files.length > 0) {
      setUploadedFiles(files);
      toast.success(`${files.length} file(s) uploaded successfully`);
    }
  };
  
  const handleStartWithExample = () => {
    toast.info("Starting with example project");
    // Implementation would go here
  };
  
  const handleClearChat = () => {
    clearMessages();
    toast.success("Chat cleared");
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
    </div>
  );
}
