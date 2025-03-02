
import React from "react";
import { X } from "lucide-react";

export type FilePreviewProps = {
  /**
   * Array of files to preview
   */
  files: File[];
  
  /**
   * Callback to remove a file by its index
   */
  onRemove: (index: number) => void;
  
  /**
   * Whether the preview is disabled (can't remove files)
   */
  disabled?: boolean;
};

/**
 * Displays a preview of selected files with the ability to remove them
 */
export function FilePreview({ files, onRemove, disabled }: FilePreviewProps) {
  if (files.length === 0) return null;
  
  return (
    <div className="flex flex-wrap gap-2 p-2 mb-2">
      {files.length === 1 ? (
        // Single file inline display
        <div className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm">
          <span className="truncate max-w-[150px]">{files[0].name}</span>
          <button
            type="button"
            onClick={() => onRemove(0)}
            disabled={disabled}
            className={`ml-2 text-gray-500 hover:text-gray-700 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            aria-label="Remove file"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        // Multiple files display
        <div className="w-full space-y-2">
          <div className="text-sm font-medium">Selected files:</div>
          <div className="space-y-1">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-100 rounded px-3 py-1 text-sm">
                <span className="truncate max-w-[300px]">{file.name}</span>
                <button
                  type="button"
                  onClick={() => onRemove(index)}
                  disabled={disabled}
                  className={`ml-2 text-gray-500 hover:text-gray-700 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  aria-label={`Remove ${file.name}`}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
