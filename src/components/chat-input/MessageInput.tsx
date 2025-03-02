
import React from "react";
import { cn } from "@/lib/utils";

/**
 * Props for the MessageInput component
 */
type MessageInputProps = {
  /**
   * Current value of the input
   */
  value: string;
  
  /**
   * Callback when the value changes
   */
  onChange: (value: string) => void;
  
  /**
   * Optional key down handler
   */
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  
  /**
   * Whether the input is disabled
   */
  disabled?: boolean;
};

/**
 * MessageInput component renders the text input field for the chat
 */
export function MessageInput({ value, onChange, onKeyDown, disabled }: MessageInputProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      disabled={disabled}
      placeholder={disabled ? "DevManager is thinking..." : "Type a message or upload a project requirements file..."}
      className={cn(
        "flex-1 border border-gray-200 bg-white rounded-full py-3.5 px-5",
        "focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent",
        "text-gray-700 min-w-0 transition-all shadow-sm",
        "placeholder:text-gray-400 placeholder:font-light",
        disabled ? "bg-gray-50" : "hover:border-gray-300"
      )}
      aria-label="Message input"
    />
  );
}
