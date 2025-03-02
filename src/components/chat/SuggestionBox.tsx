
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Lightbulb } from "lucide-react";
import { SuggestionOption } from "@/contexts/types";

interface SuggestionBoxProps {
  title: string;
  description?: string;
  options: string[] | SuggestionOption[];
  onSelect: (option: string) => void;
}

export function SuggestionBox({ title, description, options, onSelect }: SuggestionBoxProps) {
  return (
    <Card className="w-full bg-white/90 backdrop-blur-sm shadow-md border border-blue-100 overflow-hidden animate-scale-in">
      <CardHeader className="py-3 px-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
        <div className="flex items-center gap-2">
          <div className="bg-blue-100 p-1.5 rounded-full text-blue-600">
            <Lightbulb className="h-4 w-4" />
          </div>
          <CardTitle className="text-sm font-medium text-blue-800">{title}</CardTitle>
        </div>
        {description && (
          <CardDescription className="text-xs text-gray-600">{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="pt-3 pb-2 px-4">
        <div className="flex flex-wrap gap-2">
          {options.map((option, index) => {
            // Handle both string options and SuggestionOption objects
            const optionText = typeof option === 'string' ? option : option.label;
            const optionMessage = typeof option === 'string' ? option : option.message;
            
            return (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="bg-white text-blue-700 border-blue-200 hover:bg-blue-50 hover:text-blue-800 hover:border-blue-300 transition-colors text-xs font-normal justify-start"
                onClick={() => onSelect(optionMessage)}
              >
                <span className="truncate">{optionText}</span>
                <ArrowRight className="h-3 w-3 ml-1.5 flex-shrink-0" />
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
