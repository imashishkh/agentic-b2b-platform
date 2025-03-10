
import React, { useState, useRef } from "react";
import { ChatInput } from "@/components/chat-input";
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
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClearFiles = () => {
    setFiles([]);
  };

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

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(selectedFiles);
      setIsUploading(true);
      
      // Simulate file upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        
        if (progress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            handleFileUpload(selectedFiles);
            setIsUploading(false);
            setUploadProgress(0);
          }, 500);
        }
      }, 200);
    }
  };

  const triggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  return (
    <div className="border-t bg-white py-2">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between mb-1.5 px-4">
          <div className="flex items-center gap-1">
            <Tooltip>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={handleClearChat}
                className="text-gray-500 hover:text-red-500 h-8 w-8 p-0"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </Tooltip>
            
            <Tooltip>
              <Button 
                size="sm" 
                variant="ghost"
                className="text-gray-500 hover:text-blue-500 h-8 w-8 p-0"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4" />
              </Button>
            </Tooltip>
            
            <Tooltip>
              <Button 
                size="sm" 
                variant="ghost"
                className="text-gray-500 hover:text-blue-500 h-8 w-8 p-0"
                onClick={handleHelp}
              >
                <HelpCircle className="h-4 w-4" />
              </Button>
            </Tooltip>
          </div>
        </div>
        
        <div className="flex items-center gap-2 px-4">
          <ChatInput 
            onSendMessage={async (message) => {
              await onSendMessage(message);
            }}
            files={files}
            onClearFiles={handleClearFiles}
            isUploading={isUploading}
            uploadProgress={uploadProgress}
            handleFileUpload={triggerFileUpload}
            isDisabled={isLoadingExample || isAgentTyping}
          />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            className="hidden"
            multiple
            accept=".md,.markdown,.txt,.pdf"
          />
          <Button
            size="sm"
            variant="outline"
            onClick={handleStartWithExample}
            disabled={isLoadingExample || isAgentTyping}
            className="whitespace-nowrap"
          >
            {isLoadingExample ? "Loading..." : "Example"}
          </Button>
        </div>
      </div>
    </div>
  );
}
