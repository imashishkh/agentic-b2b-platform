
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
