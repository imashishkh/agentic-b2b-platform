
import React, { useState } from "react";
import { MessageInput } from "./MessageInput";
import { SendButton } from "./SendButton";
import { FileUploadButton } from "./FileUploadButton";
import { FilePreview } from "./FilePreview";
import { FileUploadProgress } from "./FileUploadProgress";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export interface ChatInputProps {
  onSendMessage: (message: string) => void;
  files?: File[];
  onClearFiles?: () => void;
  isUploading?: boolean;
  uploadProgress?: number;
  handleFileUpload?: (files: File[]) => void;
  isDisabled?: boolean;
  onExampleClick?: () => void;
}

export function ChatInput({
  onSendMessage,
  files = [],
  onClearFiles,
  isUploading = false,
  uploadProgress = 0,
  handleFileUpload,
  isDisabled = false,
  onExampleClick
}: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleRemoveFile = (index: number) => {
    if (onClearFiles && files.length > 0) {
      // We'll create a new array without the file at the given index
      const newFiles = [...files];
      newFiles.splice(index, 1);
      
      // For now we're just clearing all files as the onClearFiles function doesn't accept an index
      onClearFiles();
    }
  };

  const handleFileSelection = (selectedFiles: File[]) => {
    if (handleFileUpload && selectedFiles.length > 0) {
      handleFileUpload(selectedFiles);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-3">
      {files.length > 0 && (
        <div className="mb-3">
          <FilePreview files={files} onRemove={handleRemoveFile} disabled={isDisabled || isUploading} />
        </div>
      )}
      
      {isUploading && (
        <div className="mb-3">
          <FileUploadProgress 
            fileName={files[0]?.name || "File"} 
            progress={uploadProgress} 
            isComplete={uploadProgress >= 100} 
          />
        </div>
      )}
      
      <div className="flex gap-2 items-center p-1.5 bg-white/50 backdrop-blur-sm rounded-full shadow-sm border border-gray-200">
        <MessageInput
          value={message}
          onChange={setMessage}
          onKeyDown={handleKeyDown}
          disabled={isDisabled || isUploading}
        />
        
        <div className="flex items-center gap-2 mr-1">
          <FileUploadButton 
            onChange={handleFileSelection} 
            disabled={isDisabled || isUploading} 
          />
          <SendButton onClick={handleSendMessage} disabled={!message.trim() || isDisabled || isUploading} />
        </div>
      </div>
      
      <div className="flex justify-end mt-2">
        <Button
          size="sm"
          variant="outline"
          onClick={onExampleClick}
          disabled={isDisabled || isUploading}
          className="text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 bg-white shadow-sm gap-1.5"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Example</span>
        </Button>
      </div>
    </div>
  );
}
