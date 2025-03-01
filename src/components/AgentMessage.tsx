
import React from "react";
import { AgentType, AgentMessageProps } from "@/agents/AgentTypes";
import { SayHaloLogo } from "./SayHaloLogo";
import { Code, Database, Layout, Server, Settings, User } from "lucide-react";

export function AgentMessage({ message, agentType, isLoading = false }: AgentMessageProps) {
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
        <p className="text-sayhalo-dark text-sm md:text-base">
          {isLoading ? "Thinking..." : message}
        </p>
      </div>
    </div>
  );
}
