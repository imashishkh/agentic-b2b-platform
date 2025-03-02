
import React from "react";
import { Avatar } from "@/components/ui/avatar";
import { AgentType } from "@/agents/AgentTypes";
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  User, 
  Code, 
  Database, 
  Cpu,
  Layout,
  Users
} from "lucide-react";
import ReactMarkdown from "react-markdown";

export interface ChatMessageProps {
  type: string;
  content: React.ReactNode;
  agentType?: AgentType;
  isSecurityReview?: boolean;
  complianceStatus?: "passed" | "warning" | "failed";
  collaborators?: AgentType[];
  projectContext?: string;
  className?: string;
}

export function ChatMessage({ 
  type, 
  content, 
  agentType = AgentType.MANAGER,
  isSecurityReview,
  complianceStatus,
  collaborators,
  projectContext,
  className = ""
}: ChatMessageProps) {
  const isUser = type === "user";
  const messageContainerClasses = isUser
    ? "flex flex-row-reverse space-x-2 space-x-reverse items-start mb-4"
    : "flex space-x-2 items-start mb-4";

  const messageClasses = isUser
    ? `bg-primary text-primary-foreground p-3 rounded-lg max-w-[80%] ${className}`
    : `bg-muted p-3 rounded-lg max-w-[80%] ${className}`;

  const getIconForAgentType = (type: AgentType) => {
    switch (type) {
      case AgentType.FRONTEND:
        return <Layout className="h-4 w-4" />;
      case AgentType.BACKEND:
        return <Code className="h-4 w-4" />;
      case AgentType.DATABASE:
        return <Database className="h-4 w-4" />;
      case AgentType.DEVOPS:
        return <Cpu className="h-4 w-4" />;
      case AgentType.UX:
        return <Users className="h-4 w-4" />;
      case AgentType.MANAGER:
      default:
        return null;
    }
  };

  return (
    <div className={messageContainerClasses}>
      <Avatar className={isUser ? "bg-primary" : "bg-muted-foreground"}>
        {isUser ? (
          <User className="text-primary-foreground h-5 w-5" />
        ) : (
          <div className="text-background font-semibold">{agentType?.charAt(0)}</div>
        )}
      </Avatar>
      <div className="space-y-1">
        {!isUser && (
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">
              {agentType}
              {isSecurityReview && (
                <span className="ml-2 text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                  Security Review
                </span>
              )}
              {complianceStatus && (
                <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                  complianceStatus === "passed" 
                    ? "bg-green-100 text-green-800" 
                    : complianceStatus === "warning"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                }`}>
                  {complianceStatus === "passed" && <CheckCircle className="inline h-3 w-3 mr-1" />}
                  {complianceStatus === "warning" && <AlertTriangle className="inline h-3 w-3 mr-1" />}
                  {complianceStatus === "failed" && <Shield className="inline h-3 w-3 mr-1" />}
                  {complianceStatus.charAt(0).toUpperCase() + complianceStatus.slice(1)}
                </span>
              )}
            </span>
            {getIconForAgentType(agentType)}
          </div>
        )}
        <div className={messageClasses}>
          {typeof content === "string" ? (
            <ReactMarkdown>{content}</ReactMarkdown>
          ) : (
            content
          )}
        </div>
        
        {collaborators && collaborators.length > 0 && (
          <div className="flex flex-wrap mt-1 gap-1">
            <span className="text-xs text-gray-500">Collaborating with:</span>
            {collaborators.map((agent, index) => (
              <span key={index} className="text-xs bg-slate-100 px-2 py-0.5 rounded-full flex items-center">
                {getIconForAgentType(agent)}
                <span className="ml-1">{agent}</span>
              </span>
            ))}
          </div>
        )}
        
        {projectContext && (
          <div className="text-xs text-gray-500 mt-1">
            Context: {projectContext}
          </div>
        )}
      </div>
    </div>
  );
}
