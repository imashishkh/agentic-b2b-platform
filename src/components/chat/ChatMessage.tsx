
import React from "react";
import { AgentType } from "@/agents/AgentTypes";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, ShieldAlert, ShieldX, Users, Lightbulb, Cpu } from "lucide-react";

export interface ChatMessageProps {
  type: "user" | "agent" | "system";
  content: React.ReactNode | string;
  agentType?: AgentType;
  isSecurityReview?: boolean;
  complianceStatus?: "passed" | "warning" | "failed" | null;
  collaborators?: AgentType[];
  projectContext?: string;
}

export function ChatMessage({ 
  type, 
  content, 
  agentType = AgentType.MANAGER, 
  isSecurityReview = false,
  complianceStatus = null,
  collaborators = [],
  projectContext
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
  
  // Render collaboration badge if applicable
  const renderCollaborationBadge = () => {
    if (!collaborators || collaborators.length === 0) return null;
    
    return (
      <Badge variant="outline" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100 ml-2">
        <Users className="h-3 w-3 mr-1" />
        Collaborated ({collaborators.length})
      </Badge>
    );
  };
  
  // Render context-aware badge if applicable
  const renderContextAwareBadge = () => {
    if (!projectContext) return null;
    
    return (
      <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 ml-2">
        <Lightbulb className="h-3 w-3 mr-1" />
        Context-Aware
      </Badge>
    );
  };
  
  // Render Claude API badge if applicable
  const renderAPIBadge = () => {
    if (isUser) return null;
    
    return (
      <Badge variant="outline" className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100 ml-2">
        <Cpu className="h-3 w-3 mr-1" />
        Claude 3.7
      </Badge>
    );
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
        <div className="text-sm font-medium flex items-center flex-wrap gap-1">
          {isUser ? "You" : agentInfo.name}
          {!isUser && isSecurityReview && (
            <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100 ml-2">
              Security Review
            </Badge>
          )}
          {!isUser && renderComplianceBadge()}
          {!isUser && renderCollaborationBadge()}
          {!isUser && renderContextAwareBadge()}
          {!isUser && renderAPIBadge()}
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
        
        {collaborators && collaborators.length > 0 && !isUser && (
          <div className="text-xs text-muted-foreground mt-1">
            <span className="font-medium">Contributors:</span>{" "}
            {collaborators.map(type => {
              const info = (() => {
                switch (type) {
                  case AgentType.FRONTEND: return "Frontend";
                  case AgentType.BACKEND: return "Backend";
                  case AgentType.DATABASE: return "Database";
                  case AgentType.DEVOPS: return "DevOps";
                  case AgentType.UX: return "UX";
                  default: return "";
                }
              })();
              return info ? info + " " : "";
            }).join("• ")}
          </div>
        )}
      </div>
      
      {isUser && (
        <Avatar className="h-8 w-8 rounded bg-primary text-primary-foreground">
          <div className="text-xs font-semibold">You</div>
        </Avatar>
      )}
    </div>
  );
}
