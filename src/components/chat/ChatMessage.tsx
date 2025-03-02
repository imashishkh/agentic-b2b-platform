
import React from "react";
import { AgentType } from "@/agents/AgentTypes";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

export interface ChatMessageProps {
  type: "user" | "agent" | "system";
  content: React.ReactNode | string;
  agentType?: AgentType;
}

export function ChatMessage({ type, content, agentType = AgentType.MANAGER }: ChatMessageProps) {
  const isUser = type === "user";
  
  // Get agent name and avatar based on agentType
  const getAgentInfo = () => {
    switch (agentType) {
      case AgentType.FRONTEND:
        return { name: "Frontend", avatar: "FE" };
      case AgentType.BACKEND:
        return { name: "Backend", avatar: "BE" };
      case AgentType.DATABASE:
        return { name: "Database", avatar: "DB" };
      case AgentType.DEVOPS:
        return { name: "DevOps", avatar: "DO" };
      case AgentType.UX:
        return { name: "UX", avatar: "UX" };
      case AgentType.MANAGER:
      default:
        return { name: "DevManager", avatar: "DM" };
    }
  };
  
  const agentInfo = getAgentInfo();
  
  return (
    <div
      className={cn(
        "flex w-full items-start gap-4 p-4",
        isUser ? "justify-end" : "justify-start",
        isUser ? "bg-background" : "bg-muted/30"
      )}
    >
      {!isUser && (
        <Avatar className="h-8 w-8 rounded bg-primary text-primary-foreground">
          <div className="text-xs font-semibold">{agentInfo.avatar}</div>
        </Avatar>
      )}
      
      <div
        className={cn(
          "flex max-w-[80%] flex-col gap-2",
          isUser ? "items-end" : "items-start"
        )}
      >
        <div className="text-sm font-medium">
          {isUser ? "You" : agentInfo.name}
        </div>
        
        <div
          className={cn(
            "rounded-lg px-4 py-2.5",
            isUser
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground"
          )}
        >
          {typeof content === "string" ? (
            <ReactMarkdown className="prose prose-sm dark:prose-invert break-words">
              {content}
            </ReactMarkdown>
          ) : (
            content
          )}
        </div>
      </div>
      
      {isUser && (
        <Avatar className="h-8 w-8 rounded bg-primary text-primary-foreground">
          <div className="text-xs font-semibold">You</div>
        </Avatar>
      )}
    </div>
  );
}
