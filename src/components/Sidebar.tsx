
import React from "react";
import { useChat } from "@/contexts/ChatContext";
import { Code, BookOpen, LayoutDashboard, Settings, X, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AgentType } from "@/agents/AgentTypes";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SidebarProps {
  className?: string;
  currentAgentType?: AgentType;
  setCurrentAgentType?: (agentType: AgentType) => void;
  onToggleSettings?: () => void;
}

export function Sidebar({ 
  className, 
  currentAgentType, 
  setCurrentAgentType, 
  onToggleSettings 
}: SidebarProps) {
  return (
    <div className={cn(
      "w-64 h-screen border-r bg-background flex flex-col shadow-md",
      className
    )}>
      {/* Header with improved styling */}
      <div className="p-4 border-b flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 text-white p-1.5 rounded-lg shadow-sm">
            <Code size={18} />
          </div>
          <span className="font-semibold text-blue-800 dark:text-blue-300">DevManager</span>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100">
          <X size={18} />
        </Button>
      </div>
      
      {/* Navigation with improved visual hierarchy */}
      <ScrollArea className="flex-1">
        <nav className="p-3 space-y-1.5">
          <SidebarItem 
            icon={<Code size={18} />} 
            label="Chat" 
            isActive={true} 
          />
          <SidebarItem 
            icon={<BookOpen size={18} />} 
            label="Knowledge Base" 
            isActive={false} 
          />
          <SidebarItem 
            icon={<LayoutDashboard size={18} />} 
            label="Project" 
            isActive={false} 
            hasBadge={true}
          />
        </nav>
      </ScrollArea>
      
      {/* Footer with improved button styling */}
      <div className="p-4 border-t bg-gray-50 dark:bg-gray-900">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onToggleSettings}
          className="w-full flex items-center justify-between text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Settings size={16} className="text-gray-500" />
            <span>Settings</span>
          </div>
          <ChevronRight size={14} className="opacity-60" />
        </Button>
      </div>
    </div>
  );
}

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick?: () => void;
  hasBadge?: boolean;
}

function SidebarItem({ icon, label, isActive, onClick, hasBadge }: SidebarItemProps) {
  return (
    <button
      className={cn(
        "flex items-center gap-3 py-2.5 px-3 rounded-lg w-full text-left transition-all",
        isActive 
          ? "bg-blue-50 text-blue-600 font-medium shadow-sm border border-blue-100" 
          : "text-gray-700 hover:bg-gray-100 border border-transparent"
      )}
      onClick={onClick}
    >
      <div className={cn(
        "flex-shrink-0 p-1 rounded", 
        isActive ? "text-blue-600" : "text-gray-500"
      )}>
        {icon}
      </div>
      <span className="truncate">{label}</span>
      {hasBadge && (
        <span className="ml-auto bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">New</span>
      )}
    </button>
  );
}
