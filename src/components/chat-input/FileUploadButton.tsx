
import React, { useRef, forwardRef } from "react";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export type FileUploadButtonProps = {
  /**
   * Callback function when files are selected
   */
  onChange: (files: File[]) => void;
  
  /**
   * Whether the button is disabled
   */
  disabled?: boolean;
};

export const FileUploadButton = forwardRef<HTMLButtonElement, FileUploadButtonProps>(
  ({ onChange, disabled }, ref) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const handleButtonClick = () => {
      if (disabled) return;
      fileInputRef.current?.click();
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return;
      
      const files = e.target.files;
      if (files && files.length > 0) {
        const selectedFiles = Array.from(files);
        
        // Check if there's a markdown file
        const markdownFile = selectedFiles.find(file => 
          file.name.endsWith('.md') || 
          file.type === 'text/markdown' || 
          file.type === 'text/plain'
        );
        
        if (markdownFile) {
          console.log("Markdown file selected:", markdownFile.name);
          toast.success(`Selected ${markdownFile.name} for processing`);
          onChange([markdownFile]); // Only pass the markdown file
        } else {
          toast.error("Please upload a markdown (.md) file for project requirements");
        }
      }
      
      // Reset the input so the same file can be uploaded again
      e.target.value = '';
    };
    
    return (
      <>
        <button 
          type="button"
          onClick={handleButtonClick}
          ref={ref}
          className={cn(
            "p-2.5 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 focus:outline-none",
            disabled && "cursor-not-allowed opacity-60 hover:bg-gray-100"
          )}
          disabled={disabled}
          aria-label="Upload Requirements File"
          title="Upload Requirements File (.md)"
        >
          <Upload className="h-5 w-5" />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".md,.markdown,.txt,.pdf"
          disabled={disabled}
        />
      </>
    );
  }
);

FileUploadButton.displayName = "FileUploadButton";
