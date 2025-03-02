
import React, { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { FileUploadProgress } from "./FileUploadProgress";

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

export function FileUploadButton({ onChange, disabled }: FileUploadButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  
  const handleButtonClick = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setCurrentFile(file);
      setIsUploading(true);
      setUploadProgress(0);
      
      // Simulate file upload progress
      const simulateUpload = () => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += Math.floor(Math.random() * 20) + 5;
          if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            setTimeout(() => {
              setIsUploading(false);
              onChange(Array.from(files));
              toast.success(`${files.length} file(s) uploaded successfully`);
            }, 500);
          }
          setUploadProgress(progress);
        }, 300);
      };
      
      simulateUpload();
    }
    
    // Reset the input so the same file can be uploaded again
    e.target.value = '';
  };
  
  return (
    <>
      <button 
        type="button"
        onClick={handleButtonClick}
        className={cn(
          "p-2 text-gray-500 hover:text-gray-700 focus:outline-none",
          disabled && "cursor-not-allowed opacity-60 hover:text-gray-500"
        )}
        disabled={disabled || isUploading}
        aria-label="Upload Requirements File"
        title="Upload Requirements File (.md)"
      >
        <Upload className={cn("h-5 w-5", isUploading && "animate-pulse text-blue-500")} />
      </button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        multiple
        accept=".md,.markdown"
        disabled={disabled || isUploading}
      />
      
      {isUploading && currentFile && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-10 min-w-80">
          <FileUploadProgress 
            fileName={currentFile.name}
            progress={uploadProgress}
            isComplete={uploadProgress === 100}
          />
        </div>
      )}
    </>
  );
}
