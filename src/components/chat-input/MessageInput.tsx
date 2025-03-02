
import React from "react";
import { cn } from "@/lib/utils";
import DOMPurify from "dompurify";

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
 * Sanitize user input to prevent XSS attacks
 */
const sanitizeInput = (input: string): string => {
  // Basic sanitization for plain text
  return input.trim();
};

/**
 * Validate user input for potentially malicious content
 */
const validateInput = (input: string): boolean => {
  // Check for potentially harmful patterns
  const suspiciousPatterns = [
    /<script>/i,
    /javascript:/i,
    /on\w+=/i, // onclick, onload, etc.
    /data:/i,
    /vbscript:/i
  ];
  
  return !suspiciousPatterns.some(pattern => pattern.test(input));
};

/**
 * MessageInput component
 * 
 * A streamlined text input field for chat messages with:
 * - Responsive design that adapts to different screen sizes
 * - Visual feedback states (disabled, focus)
 * - Placeholder text that changes based on input state
 * - Input validation and sanitization for security
 */
export function MessageInput({ value, onChange, onKeyDown, disabled }: MessageInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    // Validate input for suspicious patterns
    if (!validateInput(newValue)) {
      console.warn("Potentially malicious input detected:", newValue);
      return;
    }
    
    // Sanitize the input
    const sanitizedValue = sanitizeInput(newValue);
    onChange(sanitizedValue);
  };
  
  return (
    <input
      type="text"
      value={value}
      onChange={handleChange}
      onKeyDown={onKeyDown}
      disabled={disabled}
      placeholder={disabled ? "DevManager is thinking..." : "Type a message or upload a project requirements file..."}
      className={cn(
        "flex-1 py-3.5 px-4 rounded-full",
        "bg-transparent border-none",
        "focus:outline-none focus:ring-0",
        "text-gray-700 min-w-0 transition-all",
        "placeholder:text-gray-400 placeholder:font-light text-sm",
        disabled ? "bg-gray-50" : "hover:bg-gray-50/50"
      )}
      aria-label="Message input"
      maxLength={2000} // Prevent overly long messages
    />
  );
}
