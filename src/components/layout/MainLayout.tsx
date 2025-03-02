
import React from "react";
import { ApiSettings } from "@/components/ApiSettings";
import { Sidebar } from "@/components/Sidebar";
import { AgentType } from "@/agents/AgentTypes";

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
        {children}
      </div>
      
      {/* API Settings Modal */}
      {showApiSettings && (
        <ApiSettings onClose={() => setShowApiSettings(false)} />
      )}
    </div>
  );
}
