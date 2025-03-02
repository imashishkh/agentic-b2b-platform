
import React, { useState } from "react";
import { MessageInput } from "./MessageInput";
import { SendButton } from "./SendButton";
import { FileUploadButton } from "./FileUploadButton";
import { FilePreview } from "./FilePreview";
import { ApiSettingsDialog } from "../ApiSettingsDialog";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export type ChatInputProps = {
  onSendMessage: (message: string, files?: File[]) => void;
  isDisabled?: boolean;
};

export function ChatInput({ onSendMessage, isDisabled = false }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (message.trim() || files.length > 0) {
      onSendMessage(message, files.length > 0 ? files : undefined);
      setMessage("");
      setFiles([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFileChange = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-gray-200 bg-white p-4 flex flex-col gap-2 shadow-lg"
    >
      {files.length > 0 && (
        <FilePreview files={files} onRemove={removeFile} disabled={isDisabled} />
      )}
      <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 shadow-inner">
        <div className="flex items-center">
          <ApiSettingsDialog />
          <FileUploadButton onChange={handleFileChange} disabled={isDisabled} />
        </div>
        
        <MessageInput
          value={message}
          onChange={setMessage}
          onKeyDown={handleKeyDown}
          disabled={isDisabled}
        />
        
        <SendButton 
          onClick={() => handleSubmit()} 
          disabled={isDisabled || (!message.trim() && files.length === 0)} 
        />
      </div>
    </form>
  );
}
