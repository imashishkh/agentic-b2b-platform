
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
        "p-2 rounded-full transition-all duration-200 flex items-center justify-center",
        disabled
          ? "text-gray-400 bg-gray-200 cursor-not-allowed"
          : "text-white bg-sayhalo-coral hover:bg-sayhalo-coral/90 shadow-sm"
      )}
      onClick={onClick}
      disabled={disabled}
      aria-label="Send message"
    >
      <Send size={20} className={disabled ? "" : "transform -rotate-45"} />
    </button>
  );
};
