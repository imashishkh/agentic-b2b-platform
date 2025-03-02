
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
 * MessageInput component
 * 
 * A streamlined text input field for chat messages with:
 * - Responsive design that adapts to different screen sizes
 * - Visual feedback states (disabled, focus)
 * - Placeholder text that changes based on input state
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
        "flex-1 py-3 px-4 rounded-full",
        "bg-transparent border-none",
        "focus:outline-none focus:ring-0",
        "text-gray-700 min-w-0 transition-all",
        "placeholder:text-gray-400 placeholder:font-light text-sm",
        disabled ? "bg-gray-50" : "hover:bg-gray-50/50"
      )}
      aria-label="Message input"
    />
  );
}
