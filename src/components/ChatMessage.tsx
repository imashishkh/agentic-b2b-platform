
import React from "react";
import { AgentType } from "@/agents/AgentTypes";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import { Code } from "lucide-react";

export interface ChatMessageProps {
  type: "user" | "agent";
  content: string;
  isLoading?: boolean;
  agentType?: AgentType;
}

export function ChatMessage({ type, content, isLoading = false, agentType = AgentType.MANAGER }: ChatMessageProps) {
  if (type === "user") {
    return (
      <div className="flex justify-end mb-4">
        <div className="bg-blue-600 text-white rounded-lg p-3 max-w-[80%]">
          <p className="text-sm">{content}</p>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex items-start gap-3 mb-4">
        <Avatar className="h-8 w-8 bg-gray-800">
          <Code className="h-4 w-4 text-white" />
        </Avatar>
        <div className="flex flex-col gap-1 max-w-[80%]">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">DevManager</span>
            <span className="text-xs text-gray-500">Development Manager</span>
          </div>
          <Card className="p-3 bg-white">
            {isLoading ? (
              <p className="text-sm text-gray-500">Thinking...</p>
            ) : (
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown>{content}</ReactMarkdown>
              </div>
            )}
          </Card>
        </div>
      </div>
    );
  }
}
