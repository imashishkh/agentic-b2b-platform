
import React, { useState } from "react";
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
  const [feedback, setFeedback] = useState<"helpful" | "not-helpful" | null>(null);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [comment, setComment] = useState("");

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    toast.success("Copied to clipboard");
  };

  const handleFeedback = (type: "helpful" | "not-helpful") => {
    setFeedback(type);
    toast.success(type === "helpful" ? "Marked as helpful" : "Marked as not helpful");
    // Here you would typically send feedback to your backend
  };

  const handleComment = () => {
    if (showCommentBox) {
      if (comment.trim()) {
        toast.success("Comment submitted");
        // Here you would typically send the comment to your backend
        setComment("");
      }
      setShowCommentBox(false);
    } else {
      setShowCommentBox(true);
    }
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
          {showCommentBox && (
            <div className="mt-2 mb-2">
              <textarea 
                className="w-full p-2 text-sm border border-gray-300 rounded-md" 
                placeholder="Add your comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
              />
              <div className="flex justify-end mt-1">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="mr-2"
                  onClick={() => setShowCommentBox(false)}
                >
                  Cancel
                </Button>
                <Button 
                  size="sm"
                  onClick={handleComment}
                  disabled={!comment.trim()}
                >
                  Submit
                </Button>
              </div>
            </div>
          )}
          <div className="flex items-center gap-1 mt-1">
            <Tooltip tooltip="Copy message">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0" 
                onClick={copyToClipboard}
              >
                <Copy className="h-3 w-3 text-gray-400 hover:text-gray-600" />
              </Button>
            </Tooltip>
            <Tooltip tooltip="Helpful">
              <Button 
                variant="ghost" 
                size="sm" 
                className={cn(
                  "h-6 w-6 p-0",
                  feedback === "helpful" && "text-green-600"
                )}
                onClick={() => handleFeedback("helpful")}
              >
                <ThumbsUp className={cn(
                  "h-3 w-3",
                  feedback === "helpful" ? "text-green-600" : "text-gray-400 hover:text-green-600"
                )} />
              </Button>
            </Tooltip>
            <Tooltip tooltip="Not helpful">
              <Button 
                variant="ghost" 
                size="sm" 
                className={cn(
                  "h-6 w-6 p-0",
                  feedback === "not-helpful" && "text-red-600"
                )}
                onClick={() => handleFeedback("not-helpful")}
              >
                <ThumbsDown className={cn(
                  "h-3 w-3",
                  feedback === "not-helpful" ? "text-red-600" : "text-gray-400 hover:text-red-600"
                )} />
              </Button>
            </Tooltip>
            <Tooltip tooltip="Comment">
              <Button 
                variant="ghost" 
                size="sm" 
                className={cn(
                  "h-6 w-6 p-0",
                  showCommentBox && "text-blue-600"
                )}
                onClick={handleComment}
              >
                <MessageCircle className={cn(
                  "h-3 w-3",
                  showCommentBox ? "text-blue-600" : "text-gray-400 hover:text-blue-600"
                )} />
              </Button>
            </Tooltip>
          </div>
        </div>
      </div>
    );
  }
}
