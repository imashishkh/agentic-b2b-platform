
import React from "react";
import { ManagerAgentMessage, UserMessage } from "./ManagerAgent";

export type MessageType = "agent" | "user";

export interface ChatMessageProps {
  type: MessageType;
  content: string;
  isLoading?: boolean;
}

export function ChatMessage({ type, content, isLoading = false }: ChatMessageProps) {
  if (type === "agent") {
    return <ManagerAgentMessage message={content} isLoading={isLoading} />;
  } else {
    return <UserMessage message={content} />;
  }
}
