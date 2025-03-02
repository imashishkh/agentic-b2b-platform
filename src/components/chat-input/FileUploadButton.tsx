
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
  
  /**
   * Whether to only accept markdown files
   */
  markdownOnly?: boolean;
  
  /**
   * Current wizard step context - helps determine file validation
   */
  wizardContext?: string;
};

export const FileUploadButton = forwardRef<HTMLButtonElement, FileUploadButtonProps>(
  ({ onChange, disabled, markdownOnly = true, wizardContext }, ref) => {
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
        
        // For requirements upload, check for markdown files
        if (markdownOnly) {
          const markdownFile = selectedFiles.find(file => 
            file.name.endsWith('.md') || 
            file.type === 'text/markdown' || 
            file.type === 'text/plain'
          );
          
          if (markdownFile) {
            console.log("Markdown file selected:", markdownFile.name);
            toast.success(`Selected ${markdownFile.name} for processing`);
            onChange([markdownFile]); // Pass the markdown file to parent
          } else {
            toast.error("Please upload a markdown (.md) file for project requirements");
          }
        } 
        // For UI components or other files, accept any file type
        else {
          const file = selectedFiles[0];
          console.log(`File selected: ${file.name} (${file.type})`);
          toast.success(`Selected ${file.name} for processing`);
          onChange(selectedFiles);
        }
      }
      
      // Reset the input so the same file can be uploaded again
      if (e.target) {
        e.target.value = '';
      }
    };
    
    // Determine the accept attribute based on context
    const getAcceptTypes = () => {
      if (markdownOnly) {
        return ".md,.markdown,.txt";
      } else if (wizardContext === "ui-components") {
        return "image/*,.sketch,.fig,.xd,.pdf,.ai,.psd,.zip";
      } else {
        return "*"; // Accept all file types
      }
    };
    
    return (
      <>
        <button 
          type="button"
          onClick={handleButtonClick}
          ref={ref}
          className={cn(
            "p-2.5 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500",
            disabled && "cursor-not-allowed opacity-60 hover:bg-gray-100"
          )}
          disabled={disabled}
          aria-label={markdownOnly ? "Upload Requirements File" : "Upload File"}
          title={markdownOnly ? "Upload Requirements File (.md)" : "Upload File"}
        >
          <Upload className="h-5 w-5" />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept={getAcceptTypes()}
          disabled={disabled}
        />
      </>
    );
  }
);

FileUploadButton.displayName = "FileUploadButton";
