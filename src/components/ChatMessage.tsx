
import React from "react";
import { AgentMessage } from "./AgentMessage";
import { UserMessage } from "./ManagerAgent";
import { AgentType } from "@/agents/AgentTypes";

export interface ChatMessageProps {
  type: "user" | "agent";
  content: string;
  isLoading?: boolean;
  agentType?: AgentType;
}

export function ChatMessage({ type, content, isLoading = false, agentType = AgentType.MANAGER }: ChatMessageProps) {
  // Format markdown content for task assignments
  const formatContent = (content: string) => {
    if (content.includes("## Task Assignments by Specialist")) {
      return content
        .replace(/### (.*)/g, '<div class="text-lg font-bold mt-4 mb-2">$1</div>')
        .replace(/- (.*)/g, '<div class="flex items-start mb-1"><div class="w-2 h-2 rounded-full bg-sayhalo-coral mt-1.5 mr-2"></div><div>$1</div></div>')
        .replace(/## (.*)/g, '<div class="text-xl font-bold mb-3">$1</div>');
    }
    return content;
  };

  if (type === "user") {
    return <UserMessage message={content} />;
  } else {
    // Check if this is a task assignment message
    if (content.includes("## Task Assignments by Specialist")) {
      return (
        <AgentMessage 
          message={content} 
          agentType={agentType} 
          isLoading={isLoading}
          isTaskAssignment={true}
        />
      );
    }
    return <AgentMessage message={content} agentType={agentType} isLoading={isLoading} />;
  }
}
