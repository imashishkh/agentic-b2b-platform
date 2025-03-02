
import React, { useState } from "react";
import { useChat } from "@/contexts/ChatContext";
import { 
  Code, 
  BookOpen, 
  LayoutDashboard, 
  Settings, 
  X, 
  ChevronRight, 
  BarChart, 
  FileText,
  Gauge,
  LineChart,
  Zap,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AgentType } from "@/agents/AgentTypes";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

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
  const { addMessage } = useChat();
  const [openedSection, setOpenedSection] = useState<string | null>(null);

  /**
   * Handle document generation requests
   * @param docType - The type of documentation to generate
   */
  const handleDocumentRequest = (docType: string) => {
    const message = `Generate ${docType} documentation for our project`;
    addMessage({
      content: message,
      type: "user",
    });
  };
  
  /**
   * Handle performance-related requests
   * @param requestType - The type of performance request
   */
  const handlePerformanceRequest = (requestType: string) => {
    let message = "";
    
    switch (requestType) {
      case "metrics":
        message = "Define performance metrics for our project";
        break;
      case "monitoring":
        message = "Recommend monitoring tools for our project";
        break;
      case "benchmarks":
        message = "Create performance benchmarks for our project";
        break;
      case "optimizations":
        message = "Generate performance optimization recommendations";
        break;
      default:
        message = "Help me with performance monitoring";
    }
    
    addMessage({
      content: message,
      type: "user",
    });
  };

  /**
   * Toggle open/closed state for a collapsible section
   * @param sectionName - Name of the section to toggle
   */
  const toggleSection = (sectionName: string) => {
    setOpenedSection(openedSection === sectionName ? null : sectionName);
  };

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
          
          {/* Performance Section with collapsible menu */}
          <Collapsible 
            open={openedSection === 'performance'} 
            onOpenChange={() => toggleSection('performance')}
            className="w-full"
          >
            <CollapsibleTrigger asChild>
              <button
                className={cn(
                  "flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-left transition-all",
                  openedSection === 'performance' 
                    ? "bg-blue-50 text-blue-600 font-medium shadow-sm border border-blue-100" 
                    : "text-gray-700 hover:bg-gray-100 border border-transparent"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "flex-shrink-0 p-1 rounded", 
                    openedSection === 'performance' ? "text-blue-600" : "text-gray-500"
                  )}>
                    <BarChart size={18} />
                  </div>
                  <span className="truncate">Performance</span>
                </div>
                <ChevronDown 
                  size={16} 
                  className={cn(
                    "transition-transform duration-200",
                    openedSection === 'performance' ? "transform rotate-180" : ""
                  )}
                />
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pl-9 pr-3 py-1 space-y-1">
              <SidebarSubItem 
                icon={<Gauge size={16} />}
                label="Define Metrics"
                onClick={() => handlePerformanceRequest("metrics")}
              />
              <SidebarSubItem 
                icon={<LineChart size={16} />}
                label="Monitoring Tools"
                onClick={() => handlePerformanceRequest("monitoring")}
              />
              <SidebarSubItem 
                icon={<BarChart size={16} />}
                label="Create Benchmarks"
                onClick={() => handlePerformanceRequest("benchmarks")}
              />
              <SidebarSubItem 
                icon={<Zap size={16} />}
                label="Optimization Tips"
                onClick={() => handlePerformanceRequest("optimizations")}
              />
            </CollapsibleContent>
          </Collapsible>
          
          {/* Documentation Section with collapsible menu */}
          <Collapsible 
            open={openedSection === 'documentation'} 
            onOpenChange={() => toggleSection('documentation')}
            className="w-full"
          >
            <CollapsibleTrigger asChild>
              <button
                className={cn(
                  "flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-left transition-all",
                  openedSection === 'documentation' 
                    ? "bg-blue-50 text-blue-600 font-medium shadow-sm border border-blue-100" 
                    : "text-gray-700 hover:bg-gray-100 border border-transparent"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "flex-shrink-0 p-1 rounded", 
                    openedSection === 'documentation' ? "text-blue-600" : "text-gray-500"
                  )}>
                    <FileText size={18} />
                  </div>
                  <span className="truncate">Documentation</span>
                </div>
                <ChevronDown 
                  size={16} 
                  className={cn(
                    "transition-transform duration-200",
                    openedSection === 'documentation' ? "transform rotate-180" : ""
                  )}
                />
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pl-9 pr-3 py-1 space-y-1">
              <SidebarSubItem 
                icon={<Code size={16} />}
                label="API Documentation"
                onClick={() => handleDocumentRequest("API")}
              />
              <SidebarSubItem 
                icon={<BookOpen size={16} />}
                label="User Guide"
                onClick={() => handleDocumentRequest("user")}
              />
              <SidebarSubItem 
                icon={<Code size={16} />}
                label="Technical Docs"
                onClick={() => handleDocumentRequest("technical")}
              />
              <SidebarSubItem 
                icon={<Settings size={16} />}
                label="Maintenance Guide"
                onClick={() => handleDocumentRequest("maintenance")}
              />
            </CollapsibleContent>
          </Collapsible>
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

/**
 * SidebarSubItem Component
 * 
 * Used for rendering sub-items within collapsible sidebar sections
 */
function SidebarSubItem({ icon, label, onClick }: { 
  icon: React.ReactNode; 
  label: string; 
  onClick?: () => void 
}) {
  return (
    <button
      className="flex items-center gap-2 py-2 px-3 rounded-md w-full text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
      onClick={onClick}
    >
      <span className="text-gray-500">{icon}</span>
      <span className="truncate">{label}</span>
    </button>
  );
}
