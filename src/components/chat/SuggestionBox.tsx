
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle, ChevronRight } from "lucide-react";
import { SuggestionOption } from "@/contexts/types";

/**
 * SuggestionBox Component
 * 
 * Displays guided wizard steps as actionable options that users can click
 * to proceed through the setup process. Styled to look more like wizard steps.
 * 
 * @param title - The title of the wizard step
 * @param description - Optional description text explaining the step
 * @param options - Array of string suggestions or SuggestionOption objects
 * @param onSelect - Callback function when an option is selected
 * @param isWizardStep - Whether to display in wizard step format
 */
interface SuggestionBoxProps {
  title: string;
  description?: string;
  options: string[] | SuggestionOption[];
  onSelect: (option: string) => void;
  isWizardStep?: boolean;
}

export function SuggestionBox({ 
  title, 
  description, 
  options, 
  onSelect, 
  isWizardStep = false 
}: SuggestionBoxProps) {
  return (
    <div className="space-y-2 w-full">
      {/* Step header - more prominent for wizard steps */}
      {(title || description) && (
        <div className={`flex items-center gap-2 px-1.5 mb-2 ${isWizardStep ? 'border-l-4 border-blue-500 pl-3' : ''}`}>
          <div className={`${isWizardStep ? 'bg-blue-500' : 'bg-blue-100'} p-1.5 rounded-full ${isWizardStep ? 'text-white' : 'text-blue-600'}`}>
            {isWizardStep ? <ChevronRight className="h-4 w-4" /> : <MessageCircle className="h-3.5 w-3.5" />}
          </div>
          <div>
            {title && (
              <h4 className={`${isWizardStep ? 'text-sm font-semibold' : 'text-xs font-medium'} ${isWizardStep ? 'text-blue-700' : 'text-blue-800'}`}>
                {title}
              </h4>
            )}
            {description && (
              <p className={`${isWizardStep ? 'text-sm' : 'text-xs'} text-gray-600`}>
                {description}
              </p>
            )}
          </div>
        </div>
      )}
      
      {/* Wizard options - styled more prominently for wizard steps */}
      <div className={`flex ${isWizardStep ? 'flex-col' : 'flex-wrap'} gap-2`}>
        {options.map((option, index) => {
          // Handle both string options and SuggestionOption objects
          const optionText = typeof option === 'string' ? option : option.label;
          const optionMessage = typeof option === 'string' ? option : option.message;
          const optionDescription = typeof option === 'string' ? '' : option.description;
          
          return (
            <Button
              key={index}
              variant={isWizardStep ? "default" : "outline"}
              size={isWizardStep ? "lg" : "sm"}
              className={`
                ${isWizardStep 
                  ? 'bg-blue-600 text-white hover:bg-blue-700 justify-between text-left px-5 py-3 h-auto' 
                  : 'bg-white text-blue-700 border border-blue-200 hover:bg-blue-50 hover:text-blue-800 hover:border-blue-300 justify-start rounded-2xl rounded-bl-sm px-4 py-2 h-auto'
                } transition-colors text-sm font-normal shadow-sm hover:shadow-md w-full
              `}
              onClick={() => onSelect(optionMessage)}
            >
              <div className="flex flex-col items-start">
                <span>{optionText}</span>
                {isWizardStep && optionDescription && (
                  <span className="text-xs text-blue-100 mt-1">{optionDescription}</span>
                )}
              </div>
              {isWizardStep ? (
                <ArrowRight className="h-5 w-5 flex-shrink-0" />
              ) : (
                <ArrowRight className="h-3 w-3 flex-shrink-0 ml-1.5" />
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
