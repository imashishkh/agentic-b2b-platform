
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Lightbulb } from "lucide-react";
import { SuggestionOption } from "@/contexts/types";

/**
 * SuggestionBox Component
 * 
 * Displays a card with suggestion options that users can click to quickly
 * insert common queries or commands without typing them manually.
 * 
 * @param title - The title of the suggestion box
 * @param description - Optional description text
 * @param options - Array of string suggestions or SuggestionOption objects
 * @param onSelect - Callback function when an option is selected
 */
interface SuggestionBoxProps {
  title: string;
  description?: string;
  options: string[] | SuggestionOption[];
  onSelect: (option: string) => void;
}

export function SuggestionBox({ title, description, options, onSelect }: SuggestionBoxProps) {
  return (
    <Card className="w-full bg-white/90 backdrop-blur-sm shadow-sm border border-blue-100 overflow-hidden animate-scale-in">
      <CardHeader className="py-2 px-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
        <div className="flex items-center gap-2">
          <div className="bg-blue-100 p-1 rounded-full text-blue-600">
            <Lightbulb className="h-3.5 w-3.5" />
          </div>
          <CardTitle className="text-xs font-medium text-blue-800">{title}</CardTitle>
        </div>
        {description && (
          <CardDescription className="text-xs text-gray-600 mt-0.5">{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="pt-2 pb-1.5 px-3">
        <div className="flex flex-wrap gap-1.5">
          {options.map((option, index) => {
            // Handle both string options and SuggestionOption objects
            const optionText = typeof option === 'string' ? option : option.label;
            const optionMessage = typeof option === 'string' ? option : option.message;
            
            return (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="bg-white text-blue-700 border-blue-200 hover:bg-blue-50 hover:text-blue-800 hover:border-blue-300 transition-colors text-xs font-normal justify-start h-7 px-2.5"
                onClick={() => onSelect(optionMessage)}
              >
                <span className="truncate">{optionText}</span>
                <ArrowRight className="h-2.5 w-2.5 ml-1.5 flex-shrink-0" />
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
