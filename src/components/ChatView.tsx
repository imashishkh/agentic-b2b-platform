
import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useChatActions } from "@/hooks/useChatActions";
import { ChatMessages } from "@/components/chat/ChatMessages";
import { ChatInput } from "@/components/chat-input";
import { useMobileView } from "@/hooks/use-mobile";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatProcessor } from "@/components/ChatProcessor";
import { useChatContext } from "@/contexts";

export default function ChatView() {
  const { isMobile } = useMobileView();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isAgentTyping, setIsAgentTyping] = useState<boolean>(false);
  const { chatId } = useParams<{ chatId: string }>();
  const { messages, knowledgeResources, isLoadingExample } = useChatContext();
  const { sendMessage, sendFiles } = useChatActions();

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
            sendFiles(Array.from(e.target.files!));
            setIsUploading(false);
            setUploadProgress(0);
            setFiles([]);
            
            // Set agent typing animation after file upload completes
            setIsAgentTyping(true);
            // Simulate agent processing time after file upload
            setTimeout(() => {
              setIsAgentTyping(false);
            }, 3000);
          }, 500);
        }
      }, 200);
    }
  };

  const handleSendMessage = (message: string) => {
    if (message.trim()) {
      sendMessage(message);
      setIsAgentTyping(true);
      // Simulate agent typing time after sending message
      setTimeout(() => {
        setIsAgentTyping(false);
      }, 2000);
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
      <ChatHeader />
      <div className="flex-1 overflow-hidden relative">
        <ChatMessages 
          messages={messages} 
          isLoadingExample={isLoadingExample} 
          isAgentTyping={isAgentTyping} 
        />
        <ChatInput
          onSendMessage={handleSendMessage}
          onFileUpload={handleFileUpload}
          files={files}
          onClearFiles={handleClearFiles}
          isUploading={isUploading}
          uploadProgress={uploadProgress}
        />
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          multiple
        />
      </div>
      <ChatProcessor />
    </div>
  );
}
