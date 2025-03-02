
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

/**
 * ChatMessage Props
 * Defines the properties for the ChatMessage component
 */
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

/**
 * ChatMessage Component
 * 
 * Displays a single message in the chat interface with different styling based on:
 * - Whether it's from a user or an agent (different styling and positioning)
 * - Which type of agent sent the message (different icons)
 * - Special message states like security reviews or compliance checks
 * 
 * The component supports Markdown content formatting and displays
 * additional metadata like collaborators when provided.
 */
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
  
  // Define positioning and layout for user vs agent messages
  const messageContainerClasses = isUser
    ? "flex flex-row-reverse space-x-2 space-x-reverse items-start mb-5"
    : "flex space-x-2 items-start mb-5";

  // Define message bubble styling based on sender
  const messageClasses = isUser
    ? `bg-primary text-primary-foreground p-3 rounded-lg max-w-[85%] md:max-w-[70%] shadow-sm ${className}`
    : `bg-white p-3 rounded-lg max-w-[85%] md:max-w-[70%] shadow-sm border border-slate-100 ${className}`;

  /**
   * Get the appropriate icon for an agent type
   * @param type - The agent type
   * @returns - A React element with the appropriate icon
   */
  const getIconForAgentType = (type: AgentType) => {
    switch (type) {
      case AgentType.FRONTEND:
        return <Layout className="h-3.5 w-3.5" />;
      case AgentType.BACKEND:
        return <Code className="h-3.5 w-3.5" />;
      case AgentType.DATABASE:
        return <Database className="h-3.5 w-3.5" />;
      case AgentType.DEVOPS:
        return <Cpu className="h-3.5 w-3.5" />;
      case AgentType.UX:
        return <Users className="h-3.5 w-3.5" />;
      case AgentType.MANAGER:
      default:
        return null;
    }
  };

  return (
    <div className={messageContainerClasses}>
      {/* Avatar representing the message sender */}
      <Avatar className={`${isUser ? "bg-primary" : "bg-slate-200"} flex-shrink-0 h-8 w-8`}>
        {isUser ? (
          <User className="text-primary-foreground h-4 w-4" />
        ) : (
          <div className="text-slate-700 font-medium text-xs">{agentType?.charAt(0)}</div>
        )}
      </Avatar>
      
      <div className="space-y-1 overflow-hidden">
        {/* Display sender information for agent messages */}
        {!isUser && (
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-xs font-medium text-slate-700 truncate">
              {agentType}
              {/* Security review badge */}
              {isSecurityReview && (
                <span className="ml-2 text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full">
                  Security Review
                </span>
              )}
              {/* Compliance status badge */}
              {complianceStatus && (
                <span className={`ml-2 text-[10px] px-1.5 py-0.5 rounded-full ${
                  complianceStatus === "passed" 
                    ? "bg-green-100 text-green-800" 
                    : complianceStatus === "warning"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                }`}>
                  {complianceStatus === "passed" && <CheckCircle className="inline h-2.5 w-2.5 mr-0.5" />}
                  {complianceStatus === "warning" && <AlertTriangle className="inline h-2.5 w-2.5 mr-0.5" />}
                  {complianceStatus === "failed" && <Shield className="inline h-2.5 w-2.5 mr-0.5" />}
                  {complianceStatus.charAt(0).toUpperCase() + complianceStatus.slice(1)}
                </span>
              )}
            </span>
            {getIconForAgentType(agentType)}
          </div>
        )}
        
        {/* Message content */}
        <div className={messageClasses}>
          <div className="prose prose-sm max-w-none dark:prose-invert">
            {typeof content === "string" ? (
              <ReactMarkdown>{content}</ReactMarkdown>
            ) : (
              content
            )}
          </div>
        </div>
        
        {/* Collaborator tags */}
        {collaborators && collaborators.length > 0 && (
          <div className="flex flex-wrap mt-1 gap-1">
            <span className="text-[10px] text-gray-500">Collaborating with:</span>
            {collaborators.map((agent, index) => (
              <span key={index} className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded-full flex items-center">
                {getIconForAgentType(agent)}
                <span className="ml-0.5">{agent}</span>
              </span>
            ))}
          </div>
        )}
        
        {/* Project context */}
        {projectContext && (
          <div className="text-[10px] text-gray-500 mt-1">
            Context: {projectContext}
          </div>
        )}
      </div>
    </div>
  );
}
