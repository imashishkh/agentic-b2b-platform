
import React from "react";
import { AgentType } from "@/agents/AgentTypes";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import { Code, User, ThumbsUp, ThumbsDown, Copy, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export interface ChatMessageProps {
  type: "user" | "agent";
  content: string;
  isLoading?: boolean;
  agentType?: AgentType;
}

export function ChatMessage({ type, content, isLoading = false, agentType = AgentType.MANAGER }: ChatMessageProps) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    toast.success("Copied to clipboard");
  };

  if (type === "user") {
    return (
      <div className="flex justify-end mb-4 animate-fade-in">
        <div className="flex items-start gap-3 max-w-[80%]">
          <div className="bg-blue-600 text-white rounded-lg p-3">
            <p className="text-sm whitespace-pre-wrap">{content}</p>
          </div>
          <Avatar className="h-8 w-8 bg-blue-700">
            <User className="h-4 w-4 text-white" />
          </Avatar>
        </div>
      </div>
    );
  } else {
    return (
      <div className={cn(
        "flex items-start gap-3 mb-4",
        isLoading ? "opacity-70" : "animate-fade-in"
      )}>
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
          <div className="flex items-center gap-1 mt-1">
            <Tooltip content="Copy message">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0" 
                onClick={copyToClipboard}
              >
                <Copy className="h-3 w-3 text-gray-400 hover:text-gray-600" />
              </Button>
            </Tooltip>
            <Tooltip content="Helpful">
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <ThumbsUp className="h-3 w-3 text-gray-400 hover:text-green-600" />
              </Button>
            </Tooltip>
            <Tooltip content="Not helpful">
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <ThumbsDown className="h-3 w-3 text-gray-400 hover:text-red-600" />
              </Button>
            </Tooltip>
            <Tooltip content="Comment">
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <MessageCircle className="h-3 w-3 text-gray-400 hover:text-blue-600" />
              </Button>
            </Tooltip>
          </div>
        </div>
      </div>
    );
  }
}
