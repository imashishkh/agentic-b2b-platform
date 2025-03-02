
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Settings, PanelLeft } from "lucide-react";
import { ApiSettings } from "@/components/ApiSettings";
import { ProjectFeaturesPanel } from "@/components/project/ProjectFeaturesPanel";

export function ChatHeader() {
  const [showApiSettings, setShowApiSettings] = useState(false);
  const [showProjectPanel, setShowProjectPanel] = useState(false);
  
  return (
    <header className="border-b p-4 flex items-center justify-between bg-background">
      <div className="flex items-center">
        <h1 className="text-xl font-semibold">DevManager AI</h1>
      </div>
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2"
          onClick={() => setShowApiSettings(true)}
        >
          <Settings className="h-5 w-5" />
          <span>API Settings</span>
        </Button>
        
        <Button 
          variant={showProjectPanel ? "default" : "outline"}
          size="sm"
          onClick={() => setShowProjectPanel(!showProjectPanel)}
          className="flex items-center gap-2"
        >
          <PanelLeft className="h-5 w-5" />
          <span>Show Project Panel</span>
        </Button>
      </div>
      
      {/* API Settings Modal */}
      {showApiSettings && (
        <ApiSettings onClose={() => setShowApiSettings(false)} />
      )}
      
      {/* Project Features Panel */}
      {showProjectPanel && (
        <div className="absolute top-16 left-0 right-0 bottom-0 z-50">
          <div className="bg-background border shadow-lg w-80 h-full overflow-auto">
            <ProjectFeaturesPanel />
          </div>
        </div>
      )}
    </header>
  );
}
