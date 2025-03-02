
import React, { useState } from "react";
import { MessageInput } from "./MessageInput";
import { SendButton } from "./SendButton";
import { FileUploadButton } from "./FileUploadButton";
import { FilePreview } from "./FilePreview";
import { FileUploadProgress } from "./FileUploadProgress";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

/**
 * ChatInput Component
 * 
 * A unified interface for user interactions including:
 * - Text message input
 * - File uploads with progress indication
 * - Message sending functionality
 * - Example content generation
 * 
 * The component maintains its own state for the message content
 * while delegating file handling and message sending to parent components.
 */
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

  // Handle sending messages with validation
  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  // Support for keyboard shortcuts (Enter to send)
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  // File removal handler
  const handleRemoveFile = (index: number) => {
    if (onClearFiles && files.length > 0) {
      // We'll create a new array without the file at the given index
      const newFiles = [...files];
      newFiles.splice(index, 1);
      
      // For now we're just clearing all files as the onClearFiles function doesn't accept an index
      onClearFiles();
    }
  };

  // Handle file selection
  const handleFileSelection = (selectedFiles: File[]) => {
    if (handleFileUpload && selectedFiles.length > 0) {
      handleFileUpload(selectedFiles);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-2 py-2">
      {/* File preview area - only shown when files are present */}
      {files.length > 0 && (
        <div className="mb-2">
          <FilePreview files={files} onRemove={handleRemoveFile} disabled={isDisabled || isUploading} />
        </div>
      )}
      
      {/* Upload progress indicator - only shown when uploading */}
      {isUploading && (
        <div className="mb-2">
          <FileUploadProgress 
            fileName={files[0]?.name || "File"} 
            progress={uploadProgress} 
            isComplete={uploadProgress >= 100} 
          />
        </div>
      )}
      
      {/* Main input area with streamlined design */}
      <div className="flex items-center gap-1 bg-white rounded-full shadow-sm border border-gray-200">
        {/* Message input field */}
        <MessageInput
          value={message}
          onChange={setMessage}
          onKeyDown={handleKeyDown}
          disabled={isDisabled || isUploading}
        />
        
        {/* Action buttons */}
        <div className="flex items-center mr-1">
          <FileUploadButton 
            onChange={handleFileSelection} 
            disabled={isDisabled || isUploading} 
          />
          <SendButton onClick={handleSendMessage} disabled={!message.trim() || isDisabled || isUploading} />
        </div>
      </div>
      
      {/* Example button with more subtle styling */}
      <div className="flex justify-end mt-2">
        <Button
          size="sm"
          variant="outline"
          onClick={onExampleClick}
          disabled={isDisabled || isUploading}
          className="text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 bg-white/80 shadow-sm gap-1.5"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Example</span>
        </Button>
      </div>
    </div>
  );
}
