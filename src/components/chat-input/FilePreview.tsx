
import React from "react";

interface FilePreviewProps {
  files: File[];
  onRemoveFile: (index: number) => void;
}

/**
 * Component to display a preview of selected files
 * Allows users to remove files from the selection
 */
export const FilePreview: React.FC<FilePreviewProps> = ({ files, onRemoveFile }) => {
  if (files.length <= 0) return null;
  
  // If only one file, show a simple pill
  if (files.length === 1) {
    return (
      <div className="flex items-center bg-gray-100 px-3 py-1 mr-2 rounded-full">
        <span className="text-xs text-gray-700 truncate max-w-[100px]">
          {files[0].name}
        </span>
        <button 
          className="ml-1 text-gray-500 hover:text-gray-700"
          onClick={() => onRemoveFile(0)}
        >
          ×
        </button>
      </div>
    );
  }

  // If multiple files, show a detailed list
  return (
    <div className="mt-2 p-2 bg-white/80 backdrop-blur-sm rounded-md max-h-32 overflow-y-auto">
      <p className="text-xs font-medium mb-1">Selected files ({files.length}):</p>
      <ul className="space-y-1">
        {files.map((file, index) => (
          <li key={index} className="flex items-center justify-between text-xs">
            <span className="truncate max-w-[250px]">{file.name}</span>
            <button 
              onClick={() => onRemoveFile(index)}
              className="text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
