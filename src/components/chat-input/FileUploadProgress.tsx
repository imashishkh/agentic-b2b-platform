
import React from "react";
import { Loader, Percent } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface FileUploadProgressProps {
  fileName: string;
  progress: number;
  isComplete: boolean;
}

export function FileUploadProgress({ fileName, progress, isComplete }: FileUploadProgressProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-3 mb-3 max-w-md mx-auto">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {isComplete ? (
            <div className="text-green-500 bg-green-50 p-1.5 rounded-full">
              <Percent className="h-4 w-4" />
            </div>
          ) : (
            <div className="text-blue-500 bg-blue-50 p-1.5 rounded-full animate-spin">
              <Loader className="h-4 w-4" />
            </div>
          )}
          <span className="text-sm font-medium truncate max-w-[180px]">{fileName}</span>
        </div>
        <span className="text-xs font-medium text-gray-500">{progress}%</span>
      </div>
      <Progress value={progress} className="h-1.5" />
      <p className="text-xs text-gray-500 mt-1">
        {isComplete ? "Upload complete" : "Uploading..."}
      </p>
    </div>
  );
}
