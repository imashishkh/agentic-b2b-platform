
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { FileUploadButton } from "./FileUploadButton";
import { MessageInput } from "./MessageInput";
import { SendButton } from "./SendButton";
import { FilePreview } from "./FilePreview";

/**
 * Props interface for the ChatInput component
 * @property {string} [className] - Optional CSS class name for styling
 * @property {function} [onSendMessage] - Callback function when a message is sent
 * @property {boolean} [isDisabled] - Whether the input is disabled
 */
interface ChatInputProps {
  className?: string;
  onSendMessage?: (message: string, files?: File[]) => void;
  isDisabled?: boolean;
}

/**
 * ChatInput Component
 * 
 * Coordinates the various input subcomponents and manages the state for
 * messages and file uploads.
 * 
 * @param {ChatInputProps} props - Component properties
 * @returns {JSX.Element} - Rendered chat input component
 */
export function ChatInput({ className, onSendMessage, isDisabled }: ChatInputProps) {
  // State for the message input
  const [message, setMessage] = useState("");
  
  // State for tracking the selected files
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  /**
   * Handles the sending of messages and files
   * Shows a toast notification on successful send
   */
  const handleSendMessage = () => {
    // Only send if there's a message or file and not disabled
    if (isDisabled || (!message.trim() && selectedFiles.length === 0)) return;
    
    // Call the onSendMessage callback if provided
    if (onSendMessage) {
      onSendMessage(message, selectedFiles.length > 0 ? selectedFiles : undefined);
    } else {
      // Default behavior if no callback is provided
      toast.success("Message sent successfully");
    }
    
    // Reset the form after sending
    setMessage("");
    setSelectedFiles([]);
  };

  /**
   * Handles file selection from the file inputs
   * @param {File[]} files - Array of selected files
   */
  const handleFileChange = (files: File[]) => {
    // Don't add files if disabled
    if (isDisabled) return;
    
    // Add new files to the current selection
    setSelectedFiles(prev => [...prev, ...files]);
    
    // Show success toast with file count
    if (files.length === 1) {
      toast.success(`File selected: ${files[0].name}`);
    } else {
      toast.success(`${files.length} files selected`);
    }
  };

  /**
   * Handles keyboard events on the input field
   * Sends the message when Enter is pressed without Shift
   * @param {React.KeyboardEvent<HTMLInputElement>} e - Keyboard event
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isDisabled) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  /**
   * Removes a file from the selected files list
   * @param {number} index - Index of the file to remove
   */
  const removeFile = (index: number) => {
    if (isDisabled) return;
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Determine if the send button should be disabled
  const isSendDisabled = isDisabled || (!message.trim() && selectedFiles.length === 0);

  return (
    <div className={cn(
      "w-full max-w-4xl mx-auto",
      className
    )}>
      <div className="relative">
        <div className={cn(
          "flex items-center bg-white rounded-full border border-gray-200 shadow-sm overflow-hidden",
          isDisabled && "opacity-70"
        )}>
          {/* File upload buttons */}
          <FileUploadButton icon="file" onFileChange={handleFileChange} disabled={isDisabled} />
          <FileUploadButton icon="folder" onFileChange={handleFileChange} disabled={isDisabled} />
          
          {/* Message input field */}
          <MessageInput 
            value={message}
            onChange={setMessage}
            onKeyDown={handleKeyDown}
            disabled={isDisabled}
          />
          
          {/* Selected files preview (for single file) */}
          {selectedFiles.length === 1 && (
            <FilePreview 
              files={selectedFiles} 
              onRemoveFile={removeFile} 
              disabled={isDisabled}
            />
          )}
          
          {/* Send button */}
          <SendButton 
            disabled={isSendDisabled}
            onClick={handleSendMessage}
          />
        </div>
      </div>

      {/* Selected files preview (for multiple files) */}
      {selectedFiles.length > 1 && (
        <FilePreview 
          files={selectedFiles} 
          onRemoveFile={removeFile} 
          disabled={isDisabled}
        />
      )}
    </div>
  );
}
