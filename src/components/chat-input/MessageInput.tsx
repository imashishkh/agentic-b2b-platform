
import React from "react";

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
      placeholder={disabled ? "Agent is thinking..." : "Type a message..."}
      className="flex-1 border-0 bg-transparent py-2.5 pl-2 focus:ring-0 focus:outline-none text-gray-900"
      aria-label="Message input"
    />
  );
}
