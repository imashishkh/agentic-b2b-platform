
import React from "react";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface SendButtonProps {
  disabled: boolean;
  onClick: () => void;
}

/**
 * Button component for sending messages
 * Changes appearance based on disabled state
 */
export const SendButton: React.FC<SendButtonProps> = ({ disabled, onClick }) => {
  return (
    <button 
      className={cn(
        "p-2.5 rounded-full flex items-center justify-center transition-all duration-200",
        disabled
          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
          : "bg-blue-100 text-blue-600 hover:bg-blue-200"
      )}
      onClick={onClick}
      disabled={disabled}
      aria-label="Send message"
    >
      <Send size={18} className={disabled ? "" : "transform rotate-45"} />
    </button>
  );
};
