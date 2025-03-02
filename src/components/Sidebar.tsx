
import React from "react";
import { useChat } from "@/contexts/ChatContext";
import { Code, BookOpen, LayoutDashboard, Settings, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AgentType } from "@/agents/AgentTypes";

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
      "w-64 h-screen border-r bg-background flex flex-col",
      className
    )}>
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-gray-800 text-white p-1 rounded-full">
            <Code size={18} />
          </div>
          <span className="font-semibold">DevManager</span>
        </div>
        <Button variant="ghost" size="icon">
          <X size={18} />
        </Button>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1">
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
        />
      </nav>
      
      {/* Footer */}
      <div className="p-4 border-t">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full flex items-center gap-2"
          onClick={onToggleSettings}
        >
          <Settings size={16} />
          <span>Settings</span>
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
}

function SidebarItem({ icon, label, isActive, onClick }: SidebarItemProps) {
  return (
    <button
      className={cn(
        "flex items-center gap-3 py-2 px-3 rounded-md w-full text-left transition-colors",
        isActive 
          ? "bg-blue-100 text-blue-600" 
          : "text-gray-700 hover:bg-gray-100"
      )}
      onClick={onClick}
    >
      <div className="flex-shrink-0">{icon}</div>
      <span>{label}</span>
    </button>
  );
}
