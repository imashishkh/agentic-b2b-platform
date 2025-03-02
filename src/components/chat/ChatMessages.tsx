
import React, { useRef, useEffect } from "react";
import { ChatMessage, ChatMessageProps } from "@/components/ChatMessage";
import { AgentTypingAnimation } from "./AgentTypingAnimation";
import { AgentType } from "@/agents/AgentTypes";

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
  }, [messages, isAgentTyping]);

  return (
    <div 
      ref={chatContainerRef} 
      className="flex-1 overflow-y-auto p-4 pb-44 bg-blue-50/50"
      style={{ maxHeight: 'calc(100vh - 160px)' }}
    >
      {messages.map((message, index) => (
        <ChatMessage key={index} {...message} />
      ))}
      {isLoadingExample && (
        <div className="text-center text-gray-500 my-4">
          <div className="animate-pulse">Loading example project...</div>
        </div>
      )}
      {isAgentTyping && <AgentTypingAnimation agentType={AgentType.MANAGER} />}
    </div>
  );
}
