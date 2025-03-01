
import React from "react";
import { AgentType, AgentMessageProps } from "@/agents/AgentTypes";
import { SayHaloLogo } from "./SayHaloLogo";
import { Code, Database, Layout, Server, Settings, User } from "lucide-react";

interface ExtendedAgentMessageProps extends AgentMessageProps {
  isTaskAssignment?: boolean;
}

export function AgentMessage({ message, agentType, isLoading = false, isTaskAssignment = false }: ExtendedAgentMessageProps) {
  // Define agent-specific styling and information
  const getAgentInfo = () => {
    switch (agentType) {
      case AgentType.FRONTEND:
        return {
          name: "FrontendDev",
          title: "Frontend Developer",
          icon: Layout,
          bgColor: "bg-blue-600",
          textColor: "text-blue-700"
        };
      case AgentType.BACKEND:
        return {
          name: "BackendDev",
          title: "Backend Developer",
          icon: Server,
          bgColor: "bg-green-600",
          textColor: "text-green-700"
        };
      case AgentType.DATABASE:
        return {
          name: "DataArchitect",
          title: "Database Architect",
          icon: Database,
          bgColor: "bg-purple-600",
          textColor: "text-purple-700"
        };
      case AgentType.DEVOPS:
        return {
          name: "DevOpsEng",
          title: "DevOps Engineer",
          icon: Settings,
          bgColor: "bg-orange-600",
          textColor: "text-orange-700"
        };
      case AgentType.UX:
        return {
          name: "UXDesigner",
          title: "UX Designer",
          icon: User,
          bgColor: "bg-pink-600",
          textColor: "text-pink-700"
        };
      case AgentType.MANAGER:
      default:
        return {
          name: "DevManager",
          title: "Development Manager",
          icon: Code,
          bgColor: "bg-sayhalo-dark",
          textColor: "text-sayhalo-dark"
        };
    }
  };

  const agentInfo = getAgentInfo();
  const IconComponent = agentInfo.icon;

  // Format markdown task assignments for display
  const formatTaskAssignments = (content: string) => {
    if (!isTaskAssignment) return <p className="text-sayhalo-dark text-sm md:text-base">{content}</p>;
    
    // Split content into sections
    const sections = content.split('###').filter(Boolean);
    const title = sections.shift() || '';
    
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-sayhalo-dark">{title.replace('## ', '').trim()}</h3>
        {sections.map((section, index) => {
          const [sectionTitle, ...tasks] = section.split('\n').filter(Boolean);
          const agentType = getAgentTypeFromTitle(sectionTitle.trim());
          const agent = getAgentInfo();
          
          return (
            <div key={index} className="border rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-6 h-6 ${agent.bgColor} rounded-full flex items-center justify-center`}>
                  <IconComponent size={14} className="text-white" />
                </div>
                <h4 className={`font-medium ${agent.textColor}`}>{sectionTitle.trim()}</h4>
              </div>
              <ul className="space-y-1 pl-2">
                {tasks.map((task, taskIndex) => (
                  <li key={taskIndex} className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-sayhalo-coral mt-1.5"></div>
                    <span className="text-sm">{task.replace('-', '').trim()}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    );
  };

  // Helper to determine agent type from section title
  const getAgentTypeFromTitle = (title: string): AgentType => {
    if (title.includes("Frontend")) return AgentType.FRONTEND;
    if (title.includes("Backend")) return AgentType.BACKEND;
    if (title.includes("Database")) return AgentType.DATABASE;
    if (title.includes("DevOps")) return AgentType.DEVOPS;
    if (title.includes("UX")) return AgentType.UX;
    return AgentType.MANAGER;
  };

  return (
    <div className="flex items-start gap-3 max-w-[80%] md:max-w-[70%] bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm animate-fade-in">
      <div className="flex-shrink-0 mt-1">
        <div className={`w-8 h-8 ${agentInfo.bgColor} rounded-full flex items-center justify-center`}>
          <IconComponent size={16} className="text-white" />
        </div>
      </div>
      <div className="flex-1">
        <div className="flex items-center mb-1">
          <span className={`text-sm font-semibold ${agentInfo.textColor}`}>{agentInfo.name}</span>
          <span className="text-xs text-gray-500 ml-2">{agentInfo.title}</span>
        </div>
        {isLoading ? (
          <p className="text-sayhalo-dark text-sm md:text-base">Thinking...</p>
        ) : isTaskAssignment ? (
          formatTaskAssignments(message)
        ) : (
          <p className="text-sayhalo-dark text-sm md:text-base">{message}</p>
        )}
      </div>
    </div>
  );
}
