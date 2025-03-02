
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
    <div className="flex flex-col h-full overflow-y-auto py-6 px-8 space-y-6">
      {/* Welcome message if no messages yet */}
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm max-w-lg">
            <h2 className="text-xl font-semibold text-sayhalo-dark mb-4">Welcome to DevManager AI</h2>
            <p className="text-sayhalo mb-6">
              I'm your AI development manager with expertise in e-commerce platforms. 
              Upload a markdown file with your project requirements or describe your project to get started.
            </p>
            <div className="flex flex-col gap-2">
              <div className="flex items-start">
                <div className="min-w-4 h-4 rounded-full bg-sayhalo-coral mt-1 mr-2"></div>
                <p className="text-left text-sayhalo">Parse project documentation and create task lists</p>
              </div>
              <div className="flex items-start">
                <div className="min-w-4 h-4 rounded-full bg-sayhalo-coral mt-1 mr-2"></div>
                <p className="text-left text-sayhalo">Break down complex e-commerce features</p>
              </div>
              <div className="flex items-start">
                <div className="min-w-4 h-4 rounded-full bg-sayhalo-coral mt-1 mr-2"></div>
                <p className="text-left text-sayhalo">Create implementation roadmaps</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Messages display */}
      {messages.map((message, index) => (
        <ChatMessage 
          key={index} 
          type={message.type} 
          content={message.content} 
          agentType={message.agentType}
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
