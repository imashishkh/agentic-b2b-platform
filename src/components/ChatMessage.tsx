
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
    return <AgentMessage message={content} agentType={agentType} isLoading={isLoading} />;
  }
}
