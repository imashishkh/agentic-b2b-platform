
import React from "react";
import { MessageInput } from "./MessageInput";
import { SendButton } from "./SendButton";
import { FileUploadButton } from "./FileUploadButton";
import { FilePreview } from "./FilePreview";
import { FileUploadProgress } from "./FileUploadProgress";

export interface ChatInputProps {
  onSendMessage: (message: string) => void;
  files?: File[];
  onClearFiles?: () => void;
  isUploading?: boolean;
  uploadProgress?: number;
  handleFileUpload?: () => void;
  isDisabled?: boolean;
}

export function ChatInput({
  onSendMessage,
  files = [],
  onClearFiles,
  isUploading = false,
  uploadProgress = 0,
  handleFileUpload,
  isDisabled = false
}: ChatInputProps) {
  const [message, setMessage] = React.useState("");

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

  return (
    <div className="w-full">
      {files.length > 0 && (
        <div className="mb-2">
          <FilePreview files={files} onRemove={handleRemoveFile} disabled={isDisabled || isUploading} />
        </div>
      )}
      
      {isUploading && (
        <div className="mb-2">
          <FileUploadProgress 
            fileName={files[0]?.name || "File"} 
            progress={uploadProgress} 
            isComplete={uploadProgress >= 100} 
          />
        </div>
      )}
      
      <div className="flex gap-2 items-center">
        <MessageInput
          value={message}
          onChange={setMessage}
          onKeyDown={handleKeyDown}
          disabled={isDisabled || isUploading}
        />
        
        <div className="flex gap-2">
          <FileUploadButton onChange={(files) => {
            if (handleFileUpload) {
              handleFileUpload();
            }
          }} disabled={isDisabled || isUploading} />
          <SendButton onClick={handleSendMessage} disabled={!message.trim() || isDisabled || isUploading} />
        </div>
      </div>
    </div>
  );
}
