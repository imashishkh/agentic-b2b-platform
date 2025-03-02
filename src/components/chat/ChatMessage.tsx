
import React from "react";
import { AgentType } from "@/agents/AgentTypes";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, ShieldAlert, ShieldX } from "lucide-react";

export interface ChatMessageProps {
  type: "user" | "agent" | "system";
  content: React.ReactNode | string;
  agentType?: AgentType;
  isSecurityReview?: boolean;
  complianceStatus?: "passed" | "warning" | "failed" | null;
}

export function ChatMessage({ 
  type, 
  content, 
  agentType = AgentType.MANAGER, 
  isSecurityReview = false,
  complianceStatus = null
}: ChatMessageProps) {
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

  // Render compliance badge if applicable
  const renderComplianceBadge = () => {
    if (!complianceStatus) return null;
    
    switch(complianceStatus) {
      case "passed":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 ml-2">
            <ShieldCheck className="h-3 w-3 mr-1" />
            Compliant
          </Badge>
        );
      case "warning":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100 ml-2">
            <ShieldAlert className="h-3 w-3 mr-1" />
            Review Needed
          </Badge>
        );
      case "failed":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100 ml-2">
            <ShieldX className="h-3 w-3 mr-1" />
            Non-Compliant
          </Badge>
        );
      default:
        return null;
    }
  };
  
  return (
    <div
      className={cn(
        "flex w-full items-start gap-4 p-4",
        isUser ? "justify-end" : "justify-start",
        isUser ? "bg-background" : (isSecurityReview ? "bg-amber-50 dark:bg-amber-950/20" : "bg-muted/30")
      )}
    >
      {!isUser && (
        <Avatar className={cn("h-8 w-8 rounded text-primary-foreground", 
          isSecurityReview ? "bg-amber-500" : "bg-primary")}>
          <div className="text-xs font-semibold">{agentInfo.avatar}</div>
        </Avatar>
      )}
      
      <div
        className={cn(
          "flex max-w-[80%] flex-col gap-2",
          isUser ? "items-end" : "items-start"
        )}
      >
        <div className="text-sm font-medium flex items-center">
          {isUser ? "You" : agentInfo.name}
          {!isUser && isSecurityReview && (
            <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100 ml-2">
              Security Review
            </Badge>
          )}
          {!isUser && renderComplianceBadge()}
        </div>
        
        <div
          className={cn(
            "rounded-lg px-4 py-2.5",
            isUser
              ? "bg-primary text-primary-foreground"
              : (isSecurityReview 
                ? "bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-100" 
                : "bg-muted text-muted-foreground")
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
