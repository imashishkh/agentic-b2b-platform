import React from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatMessageProps } from "./ChatMessage";
import { AgentType } from "@/agents/AgentTypes";
import { Skeleton } from "@/components/ui/skeleton";

interface ChatMessagesProps {
  messages: any[]; // Use any[] to be more permissive with message types
  isLoadingExample: boolean;  
  isAgentTyping: boolean;
}

export function ChatMessages({ messages, isLoadingExample, isAgentTyping }: ChatMessagesProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4">
      {messages.map((message, index) => (
        <ChatMessage
          key={index}
          type={message.type}
          content={message.content}
          agentType={message.agentType || AgentType.MANAGER}
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
    </div>
  );
}
