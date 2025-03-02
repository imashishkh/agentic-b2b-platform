
import React from "react";

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

/**
 * Text input component for chat messages
 * Handles user typing and keyboard events
 */
export const MessageInput: React.FC<MessageInputProps> = ({ 
  value, 
  onChange, 
  onKeyDown 
}) => {
  return (
    <input 
      type="text" 
      placeholder="Ask DevManager anything..." 
      className="flex-1 py-3 px-4 bg-transparent border-none outline-none text-sayhalo-dark placeholder:text-gray-400"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
    />
  );
};
