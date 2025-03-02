
import React from "react";
import { AgentType } from "@/agents/AgentTypes";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, ShieldAlert, ShieldX, Users, Lightbulb, Cpu, MessageSquare, Bot } from "lucide-react";

export interface ChatMessageProps {
  type: "user" | "agent" | "system";
  content: React.ReactNode | string;
  agentType?: AgentType;
  isSecurityReview?: boolean;
  complianceStatus?: "passed" | "warning" | "failed" | null;
  collaborators?: AgentType[];
  projectContext?: string;
  className?: string;
}

export function ChatMessage({ 
  type, 
  content, 
  agentType = AgentType.MANAGER, 
  isSecurityReview = false,
  complianceStatus = null,
  collaborators = [],
  projectContext,
  className = ""
}: ChatMessageProps) {
  const isUser = type === "user";
  
  // Get agent name and avatar based on agentType
  const getAgentInfo = () => {
    switch (agentType) {
      case AgentType.FRONTEND:
        return { name: "Frontend", avatar: "FE", icon: <MessageSquare size={14} /> };
      case AgentType.BACKEND:
        return { name: "Backend", avatar: "BE", icon: <MessageSquare size={14} /> };
      case AgentType.DATABASE:
        return { name: "Database", avatar: "DB", icon: <MessageSquare size={14} /> };
      case AgentType.DEVOPS:
        return { name: "DevOps", avatar: "DO", icon: <MessageSquare size={14} /> };
      case AgentType.UX:
        return { name: "UX", avatar: "UX", icon: <MessageSquare size={14} /> };
      case AgentType.MANAGER:
      default:
        return { name: "DevManager", avatar: "DM", icon: <Bot size={14} /> };
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
  
  return (
    <div
      className={cn(
        "group w-full flex items-start gap-3 transition-opacity animate-fade-in",
        isUser ? "justify-end" : "justify-start",
        isSecurityReview ? "bg-amber-50/40 p-3 rounded-lg border border-amber-100" : "",
        className
      )}
    >
      {!isUser && (
        <Avatar className={cn(
          "h-8 w-8 rounded-md shadow-sm text-primary-foreground flex-shrink-0", 
          isSecurityReview ? "bg-amber-500" : "bg-blue-600"
        )}>
          <div className="text-xs font-semibold">{agentInfo.avatar}</div>
        </Avatar>
      )}
      
      <div className={cn(
        "flex max-w-[85%] md:max-w-[75%] flex-col gap-1",
        isUser ? "items-end" : "items-start"
      )}>
        <div className="flex items-center flex-wrap gap-1">
          <div className="text-sm font-medium flex items-center">
            {isUser ? "You" : (
              <span className="flex items-center gap-1">
                {agentInfo.icon} {agentInfo.name}
              </span>
            )}
          </div>
          
          {!isUser && isSecurityReview && (
            <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100 ml-1 text-xs">
              Security Review
            </Badge>
          )}
          {!isUser && renderComplianceBadge()}
          {!isUser && renderCollaborationBadge()}
          {!isUser && renderContextAwareBadge()}
        </div>
        
        <div className={cn(
          "rounded-2xl px-4 py-3 text-sm",
          isUser
            ? "bg-blue-600 text-white shadow-sm" 
            : (isSecurityReview 
              ? "bg-amber-100 text-amber-900 shadow-sm border border-amber-200" 
              : "bg-gray-100 text-gray-800 shadow-sm dark:bg-gray-800 dark:text-gray-100")
        )}>
          {typeof content === "string" ? (
            <ReactMarkdown className="prose prose-sm dark:prose-invert break-words prose-p:leading-relaxed prose-pre:bg-gray-800/80 prose-pre:text-gray-100 prose-pre:shadow-inner prose-pre:rounded-md">
              {content}
            </ReactMarkdown>
          ) : (
            content
          )}
        </div>
        
        {collaborators && collaborators.length > 0 && !isUser && (
          <div className="text-xs text-gray-500 mt-1 flex flex-wrap gap-1 items-center">
            <span className="font-medium">Contributors:</span>
            {collaborators.map((type, idx) => {
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
              
              return info ? (
                <Badge variant="outline" key={idx} className="bg-gray-100 text-gray-600 text-xs font-normal">
                  {info}
                </Badge>
              ) : null;
            })}
          </div>
        )}
      </div>
      
      {isUser && (
        <Avatar className="h-8 w-8 rounded-md bg-gray-700 text-white shadow-sm flex-shrink-0">
          <div className="text-xs font-semibold">You</div>
        </Avatar>
      )}
    </div>
  );
}
