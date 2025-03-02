
import React, { useRef } from "react";
import { Link, FolderUp } from "lucide-react";

interface FileUploadButtonProps {
  onFileChange: (files: File[]) => void;
  icon: "file" | "folder";
}

/**
 * Button component for file or folder uploads
 * Handles the file input logic and triggers the onFileChange callback
 */
export const FileUploadButton: React.FC<FileUploadButtonProps> = ({ 
  onFileChange, 
  icon 
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileChange(Array.from(files));
      e.target.value = '';
    }
  };

  const IconComponent = icon === "file" ? Link : FolderUp;
  const title = icon === "file" ? "Upload file" : "Upload folder";
  
  // Additional attributes for folder upload
  const folderAttributes = icon === "folder" 
    ? {
        // @ts-ignore - These are non-standard attributes but they work in modern browsers
        webkitdirectory: "",
        directory: ""
      } as any
    : {};
  
  return (
    <button 
      className="p-3 text-gray-500 hover:text-sayhalo-dark hover:bg-gray-50 transition-colors"
      onClick={() => inputRef.current?.click()}
      title={title}
    >
      <IconComponent size={20} />
      <input 
        type="file" 
        className="hidden" 
        ref={inputRef}
        onChange={handleFileChange}
        accept={icon === "file" ? ".md,.markdown,text/markdown" : undefined}
        multiple
        {...folderAttributes}
      />
    </button>
  );
};
