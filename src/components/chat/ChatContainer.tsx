
import React, { useRef } from "react";
import { Chat } from "@/components/Chat";
import { ChatInput } from "@/components/chat-input";
import { useChat } from "@/contexts/ChatContext";
import { FileUploadButton } from "@/components/chat-input/FileUploadButton";
import { Button } from "@/components/ui/button";

export function ChatContainer() {
  const chatRef = useRef<{ processUserMessage: (message: string, files?: File[]) => void }>(null);
  const { isAgentTyping } = useChat();
  
  // Forward the message handling to the Chat component
  const handleSendMessage = (message: string) => {
    if (chatRef.current) {
      chatRef.current.processUserMessage(message);
    }
  };
  
  const handleFileUpload = (files: File[]) => {
    if (chatRef.current && files.length > 0) {
      chatRef.current.processUserMessage(`I've uploaded a file: ${files[0].name}`, files);
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-hidden">
        <Chat chatRef={chatRef} />
      </div>
      <div className="p-4 border-t">
        <div className="flex items-center gap-2">
          <FileUploadButton onChange={handleFileUpload} />
          <ChatInput 
            onSendMessage={handleSendMessage} 
            isDisabled={isAgentTyping} 
          />
          <Button variant="outline" size="sm">
            Example
          </Button>
        </div>
      </div>
    </div>
  );
}
