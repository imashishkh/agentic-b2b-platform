
import React from "react";
import { AgentType } from "@/agents/AgentTypes";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface AgentTypingAnimationProps {
  agentType?: AgentType;
}

export function AgentTypingAnimation({ agentType = AgentType.MANAGER }: AgentTypingAnimationProps) {
  // Get agent name based on type
  const getAgentName = (type: AgentType) => {
    switch (type) {
      case AgentType.MANAGER:
        return "DevManager";
      case AgentType.FRONTEND:
        return "Frontend Developer";
      case AgentType.BACKEND:
        return "Backend Developer";
      case AgentType.DATABASE:
        return "Database Engineer";
      case AgentType.DEVOPS:
        return "DevOps Engineer";
      case AgentType.UX:
        return "UX Designer";
      default:
        return type;
    }
  };

  return (
    <div className="flex items-start gap-3 mb-4 animate-fade-in">
      <Avatar>
        <AvatarFallback agentType={agentType} />
      </Avatar>
      <div className="flex flex-col gap-1 max-w-[80%]">
        <div className="text-sm font-medium text-gray-700">
          {getAgentName(agentType)}
        </div>
        <div className="bg-white p-3 rounded-lg shadow-sm">
          <div className="flex space-x-1.5">
            <div className="w-2 h-2 bg-gray-300 rounded-full animate-[bounce_1s_ease-in-out_0s_infinite]"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full animate-[bounce_1s_ease-in-out_0.2s_infinite]"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full animate-[bounce_1s_ease-in-out_0.4s_infinite]"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
