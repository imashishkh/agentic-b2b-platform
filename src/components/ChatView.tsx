
import React, { useRef, useEffect } from "react";
import { ChatMessage } from "@/components/ChatMessage";
import { useChat } from "@/contexts/ChatContext";

export function ChatView() {
  const { messages, isAgentTyping } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-full overflow-y-auto py-4 px-6 space-y-6">
      {/* Messages display */}
      {messages.map((message, index) => (
        <ChatMessage 
          key={index} 
          type={message.type} 
          content={message.content} 
        />
      ))}
      
      {/* Typing indicator */}
      {isAgentTyping && (
        <ChatMessage 
          type="agent" 
          content="" 
          isLoading={true} 
        />
      )}
      
      {/* Empty div for auto-scrolling */}
      <div ref={messagesEndRef} />
    </div>
  );
}
