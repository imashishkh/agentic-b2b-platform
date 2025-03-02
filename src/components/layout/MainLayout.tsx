
import React, { useState } from "react";
import { ApiSettings } from "@/components/ApiSettings";
import { Sidebar } from "@/components/Sidebar";
import { AgentType } from "@/agents/AgentTypes";
import { ProjectFeaturesPanel } from "@/components/project/ProjectFeaturesPanel";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Layout, Settings } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface MainLayoutProps {
  children: React.ReactNode;
  currentAgentType: AgentType;
  setCurrentAgentType: (agentType: AgentType) => void;
  showApiSettings: boolean;
  setShowApiSettings: (show: boolean) => void;
}

export function MainLayout({
  children,
  currentAgentType,
  setCurrentAgentType,
  showApiSettings,
  setShowApiSettings
}: MainLayoutProps) {
  const [showProjectPanel, setShowProjectPanel] = useState(false);
  
  return (
    <div className="flex w-full h-screen bg-lavender-light overflow-hidden">
      {/* Sidebar */}
      <Sidebar 
        currentAgentType={currentAgentType}
        setCurrentAgentType={setCurrentAgentType}
        onToggleSettings={() => setShowApiSettings(true)}
      />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full">
        {/* Top Bar */}
        <div className="flex justify-between items-center px-4 py-3 bg-white shadow-sm border-b">
          <h1 className="text-xl font-semibold text-sayhalo-dark">DevManager AI</h1>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowApiSettings(true)}
              className="flex items-center gap-1"
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">API Settings</span>
            </Button>
            
            <Separator orientation="vertical" className="h-6" />
            
            <Button
              variant={showProjectPanel ? "secondary" : "outline"}
              size="sm"
              onClick={() => setShowProjectPanel(!showProjectPanel)}
              className="flex items-center gap-1"
            >
              <Layout className="h-4 w-4" />
              <span className="hidden sm:inline">
                {showProjectPanel ? "Hide" : "Show"} Project Panel
              </span>
              {showProjectPanel ? (
                <ChevronRight className="h-4 w-4 sm:ml-1" />
              ) : (
                <ChevronLeft className="h-4 w-4 sm:ml-1" />
              )}
            </Button>
          </div>
        </div>
        
        {/* Content with Project Panel */}
        <div className="flex flex-1 overflow-hidden">
          {/* Main Chat Area */}
          <div className={`flex flex-col ${showProjectPanel ? 'w-2/3' : 'w-full'} h-full transition-all duration-300`}>
            {children}
          </div>
          
          {/* Project Features Panel */}
          {showProjectPanel && (
            <div className="w-1/3 border-l bg-white overflow-y-auto animate-slide-in-right">
              <ProjectFeaturesPanel />
            </div>
          )}
        </div>
      </div>
      
      {/* API Settings Modal */}
      {showApiSettings && (
        <ApiSettings onClose={() => setShowApiSettings(false)} />
      )}
    </div>
  );
}
