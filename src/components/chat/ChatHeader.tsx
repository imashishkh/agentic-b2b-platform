
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Settings, PanelLeft, X } from "lucide-react";
import { ApiSettings } from "@/components/ApiSettings";
import { ProjectFeaturesPanel } from "@/components/project/ProjectFeaturesPanel";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export function ChatHeader() {
  const [showApiSettings, setShowApiSettings] = useState(false);
  const [showProjectPanel, setShowProjectPanel] = useState(false);
  
  return (
    <header className="border-b p-4 flex items-center justify-between bg-background sticky top-0 z-10 shadow-sm">
      <div className="flex items-center">
        <h1 className="text-xl font-semibold">DevManager AI</h1>
      </div>
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2 text-purple-600 hover:bg-purple-50 hover:text-purple-700 border-purple-200"
          onClick={() => setShowApiSettings(true)}
        >
          <Settings className="h-5 w-5" />
          <span className="hidden sm:inline">API Settings</span>
        </Button>
        
        <Button 
          variant={showProjectPanel ? "default" : "outline"}
          size="sm"
          onClick={() => setShowProjectPanel(!showProjectPanel)}
          className={`flex items-center gap-2 ${showProjectPanel ? 
            "bg-purple-600 hover:bg-purple-700 text-white" : 
            "text-purple-600 hover:bg-purple-50 hover:text-purple-700 border-purple-200"}`}
        >
          <PanelLeft className="h-5 w-5" />
          <span className="hidden sm:inline">Project Panel</span>
        </Button>
      </div>
      
      {/* API Settings Dialog */}
      {showApiSettings && (
        <Dialog open={showApiSettings} onOpenChange={setShowApiSettings}>
          <DialogContent className="sm:max-w-[550px] p-0">
            <ApiSettings onClose={() => setShowApiSettings(false)} />
          </DialogContent>
        </Dialog>
      )}
      
      {/* Project Features Panel */}
      {showProjectPanel && (
        <div className="fixed top-16 right-0 bottom-0 z-40 w-80 border-l shadow-lg bg-background">
          <div className="flex justify-between items-center p-3 border-b">
            <h2 className="font-semibold">Project Panel</h2>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={() => setShowProjectPanel(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="h-[calc(100%-48px)] overflow-auto">
            <ProjectFeaturesPanel />
          </div>
        </div>
      )}
    </header>
  );
}
