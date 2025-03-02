
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
  return (
    <div className="flex-1 overflow-y-auto p-4">
      {messages.map((message, index) => (
        <ChatMessage
          key={index}
          type={message.type}
          content={message.content}
          agentType={message.agentType || AgentType.MANAGER}
          isSecurityReview={message.isSecurityReview}
          complianceStatus={message.complianceStatus}
          collaborators={message.collaborators}
          projectContext={message.projectContext}
        />
      ))}
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
