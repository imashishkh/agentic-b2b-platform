import React from "react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { FileText, CheckCircle2, Loader2 } from "lucide-react";
import { AgentType } from "@/agents/AgentTypes";

export interface ParsedSection {
  title: string;
  agentType: AgentType;
  progress: number;
  status: "pending" | "parsing" | "completed";
}

interface ParsingProgressIndicatorProps {
  sections: ParsedSection[];
  overallProgress: number;
  fileName: string;
  onSectionClick?: (section: ParsedSection) => void;
}

export function ParsingProgressIndicator({
  sections,
  overallProgress,
  fileName,
  onSectionClick
}: ParsingProgressIndicatorProps) {
  return (
    <div className="w-full max-w-lg mx-auto bg-white rounded-lg shadow-md p-4 mb-6">
      {/* File info and overall progress */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-purple-600" />
          <div>
            <h3 className="font-medium text-sm">{fileName}</h3>
            <p className="text-xs text-gray-500">Processing requirements document</p>
          </div>
        </div>
        <Badge 
          variant="outline" 
          className={`
            ${overallProgress < 100 ? 'bg-blue-100 text-blue-800 border-blue-200' : 'bg-green-100 text-green-800 border-green-200'}
          `}
        >
          {overallProgress < 100 ? `${Math.round(overallProgress)}%` : 'Complete'}
        </Badge>
      </div>

      {/* Overall progress bar */}
      <Progress value={overallProgress} className="h-2 mb-6" />

      {/* Section parsing progress */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-700">Section Analysis</h4>
        
        <div className="space-y-3">
          {sections.map((section) => (
            <div 
              key={section.title}
              className="flex items-center justify-between p-2 rounded-md border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => onSectionClick?.(section)}
            >
              <div className="flex items-center gap-2">
                {section.status === "completed" ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : section.status === "parsing" ? (
                  <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
                ) : (
                  <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
                )}
                <span className="text-sm font-medium">{section.title}</span>
              </div>
              
              <div className="flex items-center gap-3">
                <Badge 
                  variant="outline"
                  className="bg-purple-50 text-purple-700 border-purple-100 text-xs"
                >
                  {section.agentType}
                </Badge>
                
                <span className="text-xs font-medium text-gray-500 min-w-[40px] text-right">
                  {section.progress}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}