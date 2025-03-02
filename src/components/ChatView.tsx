
import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { ChatMessages } from "@/components/chat/ChatMessages";
import { ChatInput } from "@/components/chat-input";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatProcessor } from "@/components/ChatProcessor";
import { useChat } from "@/contexts/ChatContext";

export default function ChatView() {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const { chatId } = useParams<{ chatId: string }>();
  const { messages, addMessage, isAgentTyping, isLoadingExample, setIsAgentTyping } = useChat();
  
  // Create a ref for the ChatProcessor
  const chatProcessorRef = useRef<any>(null);
  
  // State variables for ChatHeader props
  const [showApiSettings, setShowApiSettings] = useState(false);
  const [showProjectPanel, setShowProjectPanel] = useState(false);

  const handleSendMessage = (message: string) => {
    if (message.trim()) {
      addMessage({
        type: "user",
        content: message,
      });
      
      setIsAgentTyping(true);
      // Simulate agent typing time after sending message
      setTimeout(() => {
        // Add a response from DevManager
        addMessage({
          type: "agent",
          agentType: "manager",
          content: "I've received your message. How can I assist you further with your project?",
        });
        setIsAgentTyping(false);
      }, 2000);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(Array.from(e.target.files));
      setIsUploading(true);
      
      // Simulate file upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        
        if (progress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            addMessage({
              type: "user",
              content: `Uploaded ${Array.from(e.target.files!).map(f => f.name).join(", ")}`,
            });
            
            setIsAgentTyping(true);
            
            // Simulate agent processing time after file upload
            setTimeout(() => {
              addMessage({
                type: "agent",
                agentType: "manager",
                content: "I've received your file. I'll analyze it and get back to you with my findings shortly.",
              });
              
              setIsAgentTyping(false);
              setIsUploading(false);
              setUploadProgress(0);
              setFiles([]);
            }, 3000);
          }, 500);
        }
      }, 200);
    }
  };

  const handleFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleClearFiles = () => {
    setFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background">
      <ChatHeader 
        setShowApiSettings={setShowApiSettings}
        showProjectPanel={showProjectPanel}
        setShowProjectPanel={setShowProjectPanel}
      />
      <div className="flex-1 overflow-hidden relative">
        <ChatMessages 
          messages={messages} 
          isLoadingExample={isLoadingExample} 
          isAgentTyping={isAgentTyping} 
        />
        <ChatInput
          onSendMessage={handleSendMessage}
          files={files}
          onClearFiles={handleClearFiles}
          isUploading={isUploading}
          uploadProgress={uploadProgress}
          handleFileUpload={handleFileUpload}
        />
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          multiple
        />
      </div>
      <ChatProcessor chatRef={chatProcessorRef} />
    </div>
  );
}
