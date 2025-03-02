
import React from "react";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface SendButtonProps {
  disabled: boolean;
  onClick: () => void;
}

/**
 * SendButton component
 * 
 * A visually distinctive button for sending messages with:
 * - Dynamic styling based on disabled state
 * - Animated icon rotation for visual interest
 * - Accessible labeling for screen readers
 */
export const SendButton: React.FC<SendButtonProps> = ({ disabled, onClick }) => {
  return (
    <button 
      className={cn(
        "p-2 rounded-full flex items-center justify-center transition-all duration-200",
        disabled
          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
          : "bg-blue-500 text-white hover:bg-blue-600"
      )}
      onClick={onClick}
      disabled={disabled}
      aria-label="Send message"
    >
      <Send size={16} className={cn(
        "transition-transform", 
        disabled ? "" : "transform rotate-45"
      )} />
    </button>
  );
};
