
import React from "react";
import { SayHaloLogo } from "./SayHaloLogo";

interface ManagerAgentMessageProps {
  message: string;
  isLoading?: boolean;
}

export function ManagerAgentMessage({ message, isLoading = false }: ManagerAgentMessageProps) {
  return (
    <div className="flex items-start gap-3 max-w-[80%] md:max-w-[70%] bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm animate-fade-in">
      <div className="flex-shrink-0 mt-1">
        <div className="w-8 h-8 bg-sayhalo-dark rounded-full flex items-center justify-center">
          <SayHaloLogo size={20} />
        </div>
      </div>
      <div className="flex-1">
        <p className="text-sayhalo-dark text-sm md:text-base">
          {isLoading ? "Thinking..." : message}
        </p>
      </div>
    </div>
  );
}

interface UserMessageProps {
  message: string;
}

export function UserMessage({ message }: UserMessageProps) {
  return (
    <div className="flex items-start justify-end w-full">
      <div className="max-w-[80%] md:max-w-[70%] bg-sayhalo-coral/90 text-white rounded-xl p-4 shadow-sm animate-fade-in">
        <p className="text-sm md:text-base">{message}</p>
      </div>
    </div>
  );
}
