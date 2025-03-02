
import React, { useRef } from "react";
import { Chat } from "@/components/Chat";
import { ChatInput } from "@/components/chat-input";

interface ChatContainerProps {
  onSendMessage: (message: string, files?: File[]) => void;
}

export function ChatContainer({ onSendMessage }: ChatContainerProps) {
  const chatRef = useRef<{ processUserMessage: (message: string, files?: File[]) => void }>(null);
  
  // Forward the message handling to the Chat component
  const handleSendMessage = (message: string, files?: File[]) => {
    if (chatRef.current) {
      chatRef.current.processUserMessage(message, files);
    }
  };
  
  return (
    <>
      <div className="flex-1 overflow-hidden">
        <Chat chatRef={chatRef} />
      </div>
      <div className="p-4 bg-white border-t border-gray-200">
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </>
  );
}
