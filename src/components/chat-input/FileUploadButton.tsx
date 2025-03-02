
import React, { useRef, forwardRef } from "react";
import { Upload, Folder } from "lucide-react";
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
  
  /**
   * Custom class name for styling
   */
  className?: string;
  
  /**
   * Custom button text (optional)
   */
  buttonText?: string;
  
  /**
   * Whether to allow directory uploads
   */
  allowDirectory?: boolean;
};

export const FileUploadButton = forwardRef<HTMLButtonElement, FileUploadButtonProps>(
  ({ onChange, disabled, markdownOnly = true, wizardContext, className, buttonText, allowDirectory = false }, ref) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const directoryInputRef = useRef<HTMLInputElement>(null);
    
    const handleButtonClick = () => {
      if (disabled) return;
      fileInputRef.current?.click();
    };
    
    const handleFolderButtonClick = () => {
      if (disabled) return;
      directoryInputRef.current?.click();
    };
    
    const processSelectedFiles = (selectedFiles: File[]) => {
      if (selectedFiles.length === 0) return;
      
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
      // For UI components or other files, accept specified file types
      else if (wizardContext === "ui-components") {
        // Accept design files and images for UI components
        const validFiles = selectedFiles.filter(file => 
          file.type.startsWith('image/') || 
          file.name.endsWith('.sketch') || 
          file.name.endsWith('.fig') || 
          file.name.endsWith('.xd') || 
          file.name.endsWith('.pdf') || 
          file.name.endsWith('.ai') || 
          file.name.endsWith('.psd') || 
          file.name.endsWith('.zip')
        );
        
        if (validFiles.length > 0) {
          console.log(`${validFiles.length} UI component files selected`);
          toast.success(`Selected ${validFiles.length} files for processing`);
          onChange(validFiles);
        } else {
          toast.error("Please upload valid UI design files or images");
        }
      }
      // For documentation or knowledge base resources
      else if (wizardContext === "documentation" || wizardContext === "knowledge-base") {
        // Accept any file type for knowledge base
        console.log(`${selectedFiles.length} files selected for knowledge base`);
        toast.success(`Added ${selectedFiles.length} files to knowledge base`);
        onChange(selectedFiles);
      }
      // For tech-stack resources
      else if (wizardContext === "tech-stack") {
        // Accept tech stack related files
        const validFiles = selectedFiles.filter(file => 
          file.name.endsWith('.json') || 
          file.name.endsWith('.md') || 
          file.name.endsWith('.txt') || 
          file.name.endsWith('.yml') || 
          file.name.endsWith('.yaml') || 
          file.type.includes('text/')
        );
        
        if (validFiles.length > 0) {
          console.log(`${validFiles.length} tech stack files selected`);
          toast.success(`Selected ${validFiles.length} tech stack files`);
          onChange(validFiles);
        } else {
          toast.error("Please upload valid tech stack documentation files");
        }
      }
      // For any other context, accept any file type
      else {
        const file = selectedFiles[0];
        console.log(`File selected: ${file.name} (${file.type})`);
        toast.success(`Selected ${file.name} for processing`);
        onChange(selectedFiles);
      }
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return;
      
      const files = e.target.files;
      if (files && files.length > 0) {
        const selectedFiles = Array.from(files);
        processSelectedFiles(selectedFiles);
      }
      
      // Reset the input so the same file can be uploaded again
      if (e.target) {
        e.target.value = '';
      }
    };
    
    const handleDirectoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return;
      
      const files = e.target.files;
      if (files && files.length > 0) {
        const selectedFiles = Array.from(files);
        console.log(`Folder upload: ${selectedFiles.length} files`);
        
        // Group files by directory structure for better organization
        const filesByFolder: Record<string, File[]> = {};
        selectedFiles.forEach(file => {
          // Extract directory path from webkitRelativePath
          const path = file.webkitRelativePath.split('/');
          const rootFolder = path[0];
          
          if (!filesByFolder[rootFolder]) {
            filesByFolder[rootFolder] = [];
          }
          filesByFolder[rootFolder].push(file);
        });
        
        // Log folder structure for debugging
        console.log('Files by folder:', Object.keys(filesByFolder));
        
        processSelectedFiles(selectedFiles);
      }
      
      // Reset the input so the same directory can be uploaded again
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
      } else if (wizardContext === "tech-stack") {
        return ".json,.md,.txt,.yml,.yaml,text/*";
      } else if (wizardContext === "documentation" || wizardContext === "knowledge-base") {
        return "*";
      } else {
        return "*"; // Accept all file types
      }
    };
    
    // Determine if multiple files should be allowed
    const allowMultiple = wizardContext === "ui-components" || 
                         wizardContext === "documentation" || 
                         wizardContext === "knowledge-base" ||
                         wizardContext === "tech-stack";
    
    return (
      <div className="space-y-2">
        {buttonText ? (
          <div className="flex flex-col gap-2">
            <button 
              type="button"
              onClick={handleButtonClick}
              ref={ref}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500",
                disabled && "cursor-not-allowed opacity-60 hover:bg-blue-50",
                className
              )}
              disabled={disabled}
              aria-label={markdownOnly ? "Upload Requirements File" : "Upload File"}
              title={markdownOnly ? "Upload Requirements File (.md)" : "Upload File"}
            >
              <Upload className="h-4 w-4" />
              <span>{buttonText}</span>
            </button>
            
            {allowDirectory && (
              <button 
                type="button"
                onClick={handleFolderButtonClick}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500",
                  disabled && "cursor-not-allowed opacity-60 hover:bg-blue-50",
                  className
                )}
                disabled={disabled}
                aria-label="Upload Folder"
                title="Upload Folder"
              >
                <Folder className="h-4 w-4" />
                <span>Upload Folder</span>
              </button>
            )}
          </div>
        ) : (
          <div className="flex gap-2">
            <button 
              type="button"
              onClick={handleButtonClick}
              ref={ref}
              className={cn(
                "p-2.5 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500",
                disabled && "cursor-not-allowed opacity-60 hover:bg-gray-100",
                className
              )}
              disabled={disabled}
              aria-label={markdownOnly ? "Upload Requirements File" : "Upload File"}
              title={markdownOnly ? "Upload Requirements File (.md)" : "Upload File"}
            >
              <Upload className="h-5 w-5" />
            </button>
            
            {allowDirectory && (
              <button 
                type="button"
                onClick={handleFolderButtonClick}
                className={cn(
                  "p-2.5 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500",
                  disabled && "cursor-not-allowed opacity-60 hover:bg-gray-100",
                  className
                )}
                disabled={disabled}
                aria-label="Upload Folder"
                title="Upload Folder"
              >
                <Folder className="h-5 w-5" />
              </button>
            )}
          </div>
        )}
        
        {/* Hidden file input for individual files */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept={getAcceptTypes()}
          disabled={disabled}
          multiple={allowMultiple}
        />
        
        {/* Hidden file input for directory upload */}
        <input
          type="file"
          ref={directoryInputRef}
          onChange={handleDirectoryChange}
          className="hidden"
          webkitdirectory=""
          directory=""
          disabled={disabled}
          multiple
        />
      </div>
    );
  }
);

FileUploadButton.displayName = "FileUploadButton";
