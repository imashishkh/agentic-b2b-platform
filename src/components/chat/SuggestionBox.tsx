
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle } from "lucide-react";
import { SuggestionOption } from "@/contexts/types";

/**
 * SuggestionBox Component
 * 
 * Displays quick action suggestions as chat bubbles above the chat input
 * that users can click to quickly send common queries or commands.
 * 
 * @param title - The title of the suggestion group
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
    <div className="space-y-2 w-full">
      {/* Optional header - only shown if needed */}
      {(title || description) && (
        <div className="flex items-center gap-2 px-1.5 mb-1.5">
          <div className="bg-blue-100 p-1 rounded-full text-blue-600">
            <MessageCircle className="h-3.5 w-3.5" />
          </div>
          <div>
            {title && <h4 className="text-xs font-medium text-blue-800">{title}</h4>}
            {description && <p className="text-xs text-gray-600">{description}</p>}
          </div>
        </div>
      )}
      
      {/* Chat bubble suggestion options */}
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
              className="bg-white text-blue-700 border border-blue-200 hover:bg-blue-50 hover:text-blue-800 
                        hover:border-blue-300 transition-colors text-sm font-normal justify-start 
                        rounded-2xl rounded-bl-sm px-4 py-2 h-auto shadow-sm hover:shadow-md"
              onClick={() => onSelect(optionMessage)}
            >
              <span className="mr-1.5">{optionText}</span>
              <ArrowRight className="h-3 w-3 flex-shrink-0" />
            </Button>
          );
        })}
      </div>
    </div>
  );
}
