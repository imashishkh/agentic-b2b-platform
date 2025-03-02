
import React, { useRef } from "react";
import { Upload, FolderUp } from "lucide-react";
import { cn } from "@/lib/utils";

type FileUploadButtonProps = {
  /**
   * Icon to display: "file" for single file upload or "folder" for multiple files
   */
  icon: "file" | "folder";
  
  /**
   * Callback function when files are selected
   */
  onFileChange: (files: File[]) => void;
  
  /**
   * Whether the button is disabled
   */
  disabled?: boolean;
};

export function FileUploadButton({ icon, onFileChange, disabled }: FileUploadButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Determine accept and multiple attributes based on icon type
  const isFolder = icon === "folder";
  
  const handleButtonClick = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileChange(Array.from(files));
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
        aria-label={isFolder ? "Upload Folder" : "Upload File"}
      >
        {isFolder ? (
          <FolderUp className="h-5 w-5" />
        ) : (
          <Upload className="h-5 w-5" />
        )}
      </button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        multiple={isFolder}
        accept={isFolder ? undefined : "*/*"}
        disabled={disabled}
      />
    </>
  );
}
