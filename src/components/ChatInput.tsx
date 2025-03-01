
import { useState, useRef } from "react";
import { ArrowRight, Link, Settings, FolderUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";

/**
 * Props interface for the ChatInput component
 * @property {string} [className] - Optional CSS class name for styling
 */
interface ChatInputProps {
  className?: string;
}

/**
 * ChatInput Component
 * 
 * Provides a pill-shaped input field for users to type messages,
 * attach files, and access chat settings. Implements a glass effect design.
 * 
 * @param {ChatInputProps} props - Component properties
 * @returns {JSX.Element} - Rendered chat input component
 */
export function ChatInput({ className }: ChatInputProps) {
  // State for the message input
  const [message, setMessage] = useState("");
  
  // Reference to the hidden file input elements
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  
  // State for tracking the selected files
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  /**
   * Handles the sending of messages and files
   * Shows a toast notification on successful send
   */
  const handleSendMessage = () => {
    // Only send if there's a message or file
    if (!message.trim() && selectedFiles.length === 0) return;
    
    // In a real app, this would send the message to a backend
    toast.success("Message sent successfully");
    
    // Reset the form after sending
    setMessage("");
    setSelectedFiles([]);
  };

  /**
   * Handles file selection from the file input
   * @param {React.ChangeEvent<HTMLInputElement>} e - Change event
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // Convert FileList to array and append to selectedFiles
      const newFiles = Array.from(files);
      setSelectedFiles(prev => [...prev, ...newFiles]);
      
      // Show success toast with file count
      if (newFiles.length === 1) {
        toast.success(`File selected: ${newFiles[0].name}`);
      } else {
        toast.success(`${newFiles.length} files selected`);
      }
      
      // Reset the file input
      e.target.value = '';
    }
  };

  /**
   * Handles keyboard events on the input field
   * Sends the message when Enter is pressed
   * @param {React.KeyboardEvent<HTMLInputElement>} e - Keyboard event
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  /**
   * Removes a file from the selected files list
   * @param {number} index - Index of the file to remove
   */
  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className={cn(
      "w-full max-w-[80%] mx-auto relative",
      className
    )}>
      <div className="glass rounded-[15px] flex items-center w-full shadow-lg shadow-black/5 border border-white/15 px-4">
        {/* Settings popover button */}
        <Popover>
          <PopoverTrigger asChild>
            <button className="p-2 text-sayhalo-dark opacity-70 hover:opacity-100 transition-opacity">
              <Settings size={20} />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-64">
            <div className="space-y-3">
              <h3 className="font-medium text-sm">Chat Settings</h3>
              {/* Response length setting */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-sayhalo-dark/80 block">Response Length</label>
                <select className="w-full text-xs rounded-md border border-sayhalo-dark/20 p-1.5">
                  <option value="short">Short</option>
                  <option value="medium" selected>Medium</option>
                  <option value="long">Long</option>
                </select>
              </div>
              {/* Tone setting */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-sayhalo-dark/80 block">Tone</label>
                <select className="w-full text-xs rounded-md border border-sayhalo-dark/20 p-1.5">
                  <option value="casual">Casual</option>
                  <option value="professional" selected>Professional</option>
                  <option value="friendly">Friendly</option>
                </select>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        
        {/* Single file upload button */}
        <button 
          className="p-2 text-sayhalo-dark opacity-70 hover:opacity-100 transition-opacity"
          onClick={() => fileInputRef.current?.click()}
          title="Upload file"
        >
          <Link size={20} />
          <input 
            type="file" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*,.pdf,.doc,.docx,.txt"
            multiple
          />
        </button>

        {/* Folder upload button */}
        <button 
          className="p-2 text-sayhalo-dark opacity-70 hover:opacity-100 transition-opacity"
          onClick={() => folderInputRef.current?.click()}
          title="Upload folder"
        >
          <FolderUp size={20} />
          <input 
            type="file" 
            className="hidden" 
            ref={folderInputRef}
            onChange={handleFileChange}
            directory=""
            webkitdirectory=""
            multiple
          />
        </button>
        
        {/* Message input field */}
        <input 
          type="text" 
          placeholder="Ask SayHalo anything..." 
          className="flex-1 py-3 px-2 bg-transparent border-none outline-none text-sayhalo-dark placeholder:text-sayhalo-light/70"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        
        {/* Selected files display */}
        {selectedFiles.length > 0 && (
          <div className="flex items-center gap-1 bg-sayhalo-dark/10 px-2 py-1 rounded-md mr-2">
            <span className="text-xs truncate max-w-[100px]">
              {selectedFiles.length === 1 
                ? selectedFiles[0].name 
                : `${selectedFiles.length} files selected`}
            </span>
            <button 
              className="text-sayhalo-dark/70 hover:text-sayhalo-dark"
              onClick={() => setSelectedFiles([])}
            >
              ×
            </button>
          </div>
        )}
        
        {/* Send button */}
        <button 
          className="flex items-center justify-center gap-1 bg-sayhalo-coral text-white px-4 py-2 rounded-[10px] font-medium hover:shadow-md transition-all duration-300"
          onClick={handleSendMessage}
        >
          Send
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Selected files preview - only show if multiple files are selected */}
      {selectedFiles.length > 1 && (
        <div className="mt-2 p-2 bg-white/80 backdrop-blur-sm rounded-md max-h-32 overflow-y-auto">
          <p className="text-xs font-medium mb-1">Selected files ({selectedFiles.length}):</p>
          <ul className="space-y-1">
            {selectedFiles.map((file, index) => (
              <li key={index} className="flex items-center justify-between text-xs">
                <span className="truncate max-w-[250px]">{file.name}</span>
                <button 
                  onClick={() => removeFile(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
