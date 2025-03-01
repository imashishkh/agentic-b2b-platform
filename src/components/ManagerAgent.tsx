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

export function ManagerAgent() {
  return (
    <div className="bg-white dark:bg-gray-950 border rounded-xl p-4 h-[calc(100vh-7rem)] overflow-auto">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-sayhalo-dark rounded-full flex items-center justify-center">
          <SayHaloLogo size={24} />
        </div>
        <div>
          <h3 className="font-semibold text-sayhalo-dark">DevManager AI</h3>
          <p className="text-sm text-gray-500">E-commerce Development Expert</p>
        </div>
      </div>
      
      <div className="space-y-3">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          I'm your AI development manager with expertise in e-commerce platforms. I can help you:
        </p>
        <ul className="text-sm space-y-1 list-disc pl-5 text-gray-600 dark:text-gray-400">
          <li>Parse project documentation and create task lists</li>
          <li>Break down complex e-commerce features</li>
          <li>Suggest technical solutions and best practices</li>
          <li>Create implementation roadmaps</li>
          <li>Search for relevant information online</li>
        </ul>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
          Start by uploading a markdown file with your project requirements, or just describe what you're building.
        </p>
      </div>
    </div>
  );
}
