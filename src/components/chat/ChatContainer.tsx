
import React, { useRef } from "react";
import { Chat } from "@/components/Chat";
import { ChatInput } from "@/components/chat-input";
import { useChat } from "@/contexts/ChatContext";

export function ChatContainer() {
  const chatRef = useRef<{ processUserMessage: (message: string, files?: File[]) => void }>(null);
  const { isAgentTyping } = useChat();
  
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
        <ChatInput onSendMessage={handleSendMessage} isDisabled={isAgentTyping} />
      </div>
    </>
  );
}
