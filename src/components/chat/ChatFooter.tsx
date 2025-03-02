
import React from "react";
import { ChatInput } from "@/components/chat-input";
import { FileUploadButton } from "@/components/chat-input/FileUploadButton";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { Trash2, Download, HelpCircle, Upload } from "lucide-react";
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
  const handleDownload = () => {
    // Implementation would go here
    toast.info("Downloading chat history");
    
    // Create a text file with current conversation
    const text = "Chat Export\n\n" + new Date().toLocaleString();
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `chat-export-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const handleHelp = () => {
    toast.info("Opening help dialog", {
      description: "This feature is still in development."
    });
  };
  
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
                onClick={handleDownload}
              >
                <Download className="h-4 w-4" />
              </Button>
            </Tooltip>
            <Tooltip tooltip="Help">
              <Button 
                size="sm" 
                variant="ghost"
                className="text-gray-500 hover:text-blue-500"
                onClick={handleHelp}
              >
                <HelpCircle className="h-4 w-4" />
              </Button>
            </Tooltip>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Tooltip tooltip="Upload files">
            <FileUploadButton onChange={handleFileUpload} />
          </Tooltip>
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
