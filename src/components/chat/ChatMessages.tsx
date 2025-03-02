
import React from "react";
import { ChatMessage } from "./ChatMessage";
import { AgentType } from "@/agents/AgentTypes";
import { Skeleton } from "@/components/ui/skeleton";

interface ChatMessagesProps {
  messages: any[]; // Use any[] to be more permissive with message types
  isLoadingExample: boolean;  
  isAgentTyping: boolean;
  securityReviewActive?: boolean;
  collaborationActive?: boolean;
}

export function ChatMessages({ 
  messages, 
  isLoadingExample, 
  isAgentTyping,
  securityReviewActive,
  collaborationActive
}: ChatMessagesProps) {
  // Helper function to determine if a message is a documentation message
  const isDocumentation = (content: string): boolean => {
    if (typeof content !== 'string') return false;
    
    // Check if the message starts with a markdown header containing documentation keywords
    const docHeaders = ['# API Documentation', '# User Guide', '# Technical Documentation', '# Maintenance Documentation'];
    for (const header of docHeaders) {
      if (content.startsWith(header)) return true;
    }
    
    return false;
  };
  
  // Function to filter out consecutive duplicate messages
  const filteredMessages = React.useMemo(() => {
    return messages.filter((message, index, self) => {
      // Keep the first message
      if (index === 0) return true;
      
      // For subsequent messages, compare content with previous message
      const prevMessage = self[index - 1];
      
      // If the content is string, compare directly
      if (typeof message.content === 'string' && typeof prevMessage.content === 'string') {
        // Skip if identical to previous message
        if (message.content === prevMessage.content && message.type === prevMessage.type) {
          return false;
        }
      }
      
      return true;
    });
  }, [messages]);
  
  return (
    <div className="flex-1 overflow-y-auto py-8 px-4 md:px-6 space-y-5 mb-16">
      {filteredMessages.map((message, index) => {
        // Check if the message is a documentation message
        const isDoc = typeof message.content === 'string' && isDocumentation(message.content);
        
        // Spread all message properties and add className if documentation
        return (
          <ChatMessage
            key={index}
            {...message}
            className={isDoc ? "documentation-message border-l-4 border-blue-500 pl-4 bg-blue-50/50" : ""}
          />
        );
      })}
      
      {isLoadingExample && (
        <div className="space-y-6 animate-pulse">
          <ChatMessage
            type="agent"
            content={<Skeleton className="h-[75px] w-full rounded-lg" />}
            agentType={AgentType.MANAGER}
          />
          <ChatMessage
            type="user"
            content={<Skeleton className="h-[75px] w-full rounded-lg" />}
            agentType={AgentType.MANAGER}
          />
        </div>
      )}
      
      {isAgentTyping && (
        <ChatMessage
          type="agent"
          content={
            <div className="flex items-center gap-2">
              <span className="text-blue-600 font-medium">Thinking</span>
              <span className="flex space-x-1">
                <span className="h-2 w-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                <span className="h-2 w-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "200ms" }}></span>
                <span className="h-2 w-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "400ms" }}></span>
              </span>
            </div>
          }
          agentType={AgentType.MANAGER}
        />
      )}
      
      {securityReviewActive && (
        <ChatMessage
          type="agent"
          content={
            <div className="flex items-center gap-2 text-amber-700">
              <span className="font-medium">Performing security assessment</span>
              <span className="flex space-x-1">
                <span className="h-2 w-2 bg-amber-400 rounded-full animate-pulse"></span>
                <span className="h-2 w-2 bg-amber-400 rounded-full animate-pulse" style={{ animationDelay: "300ms" }}></span>
                <span className="h-2 w-2 bg-amber-400 rounded-full animate-pulse" style={{ animationDelay: "600ms" }}></span>
              </span>
            </div>
          }
          agentType={AgentType.DEVOPS}
          isSecurityReview={true}
        />
      )}
      
      {collaborationActive && (
        <ChatMessage
          type="agent"
          content={
            <div className="flex items-center gap-2 text-purple-700">
              <span className="font-medium">Consulting specialized agents</span>
              <span className="flex space-x-1">
                <span className="h-2 w-2 bg-purple-400 rounded-full animate-pulse"></span>
                <span className="h-2 w-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: "300ms" }}></span>
                <span className="h-2 w-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: "600ms" }}></span>
              </span>
            </div>
          }
          agentType={AgentType.MANAGER}
          collaborators={[AgentType.FRONTEND, AgentType.BACKEND, AgentType.DATABASE]}
        />
      )}
    </div>
  );
}
