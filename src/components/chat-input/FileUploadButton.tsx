
import React, { useRef } from "react";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";

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
  
  const handleButtonClick = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    
    const files = e.target.files;
    if (files && files.length > 0) {
      onChange(Array.from(files));
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
        multiple
        accept=".md,.markdown"
        disabled={disabled}
      />
    </>
  );
}
