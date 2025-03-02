
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
}

export function ChatInput({
  onSendMessage,
  files = [],
  onClearFiles,
  isUploading = false,
  uploadProgress = 0,
  handleFileUpload
}: ChatInputProps) {
  const [message, setMessage] = React.useState("");

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="p-4 border-t bg-background">
      {files.length > 0 && (
        <FilePreview files={files} onClearFiles={onClearFiles} />
      )}
      
      {isUploading && (
        <FileUploadProgress progress={uploadProgress} />
      )}
      
      <div className="flex gap-2 items-end">
        <MessageInput
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        
        <div className="flex gap-2">
          <FileUploadButton onClick={handleFileUpload} />
          <SendButton onClick={handleSendMessage} disabled={!message.trim()} />
        </div>
      </div>
    </div>
  );
}
