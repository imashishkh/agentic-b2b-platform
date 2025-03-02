
import React from "react";
import { ArrowUpCircle } from "lucide-react";
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
        "p-2 m-1 rounded-full transition-all duration-200",
        disabled
          ? "text-gray-400 bg-gray-100 cursor-not-allowed"
          : "text-white bg-sayhalo-coral hover:bg-sayhalo-coral/90"
      )}
      onClick={onClick}
      disabled={disabled}
    >
      <ArrowUpCircle size={24} />
    </button>
  );
};
