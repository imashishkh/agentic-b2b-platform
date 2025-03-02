
import React from "react";
import { AgentType } from "@/agents/AgentTypes";

interface AgentTypingAnimationProps {
  agentType?: AgentType;
}

export function AgentTypingAnimation({ agentType = AgentType.MANAGER }: AgentTypingAnimationProps) {
  return (
    <div className="flex items-start gap-3 mb-4">
      <div className="h-10 w-10 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center text-blue-800">
        {agentType.charAt(0).toUpperCase()}
      </div>
      <div className="flex flex-col gap-1 max-w-[80%]">
        <div className="text-sm font-medium text-gray-700">
          {agentType === AgentType.MANAGER ? "DevManager" : agentType}
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
