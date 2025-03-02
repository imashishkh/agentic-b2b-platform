
import React, { useRef, useEffect } from "react";
import { ChatMessage, ChatMessageProps } from "@/components/ChatMessage";

interface ChatMessagesProps {
  messages: ChatMessageProps[];
  isLoadingExample: boolean;
  isAgentTyping: boolean;
}

export function ChatMessages({ 
  messages, 
  isLoadingExample, 
  isAgentTyping 
}: ChatMessagesProps) {
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div 
      ref={chatContainerRef} 
      className="flex-1 overflow-y-auto p-4 bg-blue-50/50"
    >
      {messages.map((message, index) => (
        <ChatMessage key={index} {...message} />
      ))}
      {isLoadingExample && (
        <div className="text-center text-gray-500 my-4">
          <div className="animate-pulse">Loading example project...</div>
        </div>
      )}
      {isAgentTyping && (
        <div className="flex items-start gap-3 mb-4 animate-pulse">
          <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
          <div className="flex flex-col gap-1 max-w-[80%]">
            <div className="h-4 w-24 bg-gray-300 rounded"></div>
            <div className="h-20 w-64 bg-gray-200 rounded-md"></div>
          </div>
        </div>
      )}
    </div>
  );
}
