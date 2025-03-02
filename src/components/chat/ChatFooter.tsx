
import React from "react";
import { ChatInput } from "@/components/chat-input";
import { FileUploadButton } from "@/components/chat-input/FileUploadButton";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { Trash2, Download, HelpCircle } from "lucide-react";
import { toast } from "sonner";

interface ChatFooterProps {
  onSendMessage: (message: string) => Promise<void>;
  handleFileUpload: (files: File[]) => void;
  handleStartWithExample: () => void;
  handleClearChat: () => void;
  isLoadingExample: boolean;
  isAgentTyping: boolean;
}

export function ChatFooter({
  onSendMessage,
  handleFileUpload,
  handleStartWithExample,
  handleClearChat,
  isLoadingExample,
  isAgentTyping
}: ChatFooterProps) {
  return (
    <div className="p-4 bg-background border-t">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between mb-2">
          <div className="flex items-center gap-1">
            <Tooltip tooltip="Clear all messages">
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={handleClearChat}
                className="text-gray-500 hover:text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </Tooltip>
            <Tooltip tooltip="Download chat history">
              <Button 
                size="sm" 
                variant="ghost"
                className="text-gray-500 hover:text-blue-500"
                onClick={() => toast.info("Download functionality not implemented yet")}
              >
                <Download className="h-4 w-4" />
              </Button>
            </Tooltip>
            <Tooltip tooltip="Help">
              <Button 
                size="sm" 
                variant="ghost"
                className="text-gray-500 hover:text-blue-500"
                onClick={() => toast.info("Help functionality not implemented yet")}
              >
                <HelpCircle className="h-4 w-4" />
              </Button>
            </Tooltip>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <FileUploadButton onChange={handleFileUpload} />
          <ChatInput 
            onSendMessage={onSendMessage} 
            isLoading={isLoadingExample || isAgentTyping}
            isDisabled={isLoadingExample || isAgentTyping}
          />
          <Button
            size="sm"
            variant="outline"
            onClick={handleStartWithExample}
            disabled={isLoadingExample || isAgentTyping}
          >
            {isLoadingExample ? "Loading..." : "Example"}
          </Button>
        </div>
      </div>
    </div>
  );
}
