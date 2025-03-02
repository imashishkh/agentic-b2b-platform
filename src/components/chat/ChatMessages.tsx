
import React from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatMessageProps } from "./ChatMessage";
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
  
  return (
    <div className="flex-1 overflow-y-auto p-4">
      {messages.map((message, index) => {
        // Check if the message is a documentation message
        const isDoc = typeof message.content === 'string' && isDocumentation(message.content);
        
        return (
          <ChatMessage
            key={index}
            type={message.type}
            content={message.content}
            agentType={message.agentType || AgentType.MANAGER}
            isSecurityReview={message.isSecurityReview}
            complianceStatus={message.complianceStatus}
            collaborators={message.collaborators}
            projectContext={message.projectContext}
            // Add a CSS class for documentation messages
            className={isDoc ? "documentation-message border-l-4 border-blue-500 pl-2" : ""}
          />
        );
      })}
      {isLoadingExample && (
        <>
          <ChatMessage
            type="agent"
            content={<Skeleton className="h-[75px] w-full" />}
            agentType={AgentType.MANAGER}
          />
          <ChatMessage
            type="user"
            content={<Skeleton className="h-[75px] w-full" />}
            agentType={AgentType.MANAGER}
          />
        </>
      )}
      {isAgentTyping && (
        <ChatMessage
          type="agent"
          content="Thinking..."
          agentType={AgentType.MANAGER}
        />
      )}
      {securityReviewActive && (
        <ChatMessage
          type="agent"
          content="Performing security assessment..."
          agentType={AgentType.DEVOPS}
          isSecurityReview={true}
        />
      )}
      {collaborationActive && (
        <ChatMessage
          type="agent"
          content="Consulting with specialized agents..."
          agentType={AgentType.MANAGER}
          collaborators={[AgentType.FRONTEND, AgentType.BACKEND, AgentType.DATABASE]}
        />
      )}
    </div>
  );
}
