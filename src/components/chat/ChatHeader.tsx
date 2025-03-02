
import React from "react";
import { Button } from "@/components/ui/button";
import { Settings, PanelLeft } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";

interface ChatHeaderProps {
  setShowApiSettings: (show: boolean) => void;
  showProjectPanel: boolean;
  setShowProjectPanel: (show: boolean) => void;
}

export function ChatHeader({ 
  setShowApiSettings, 
  showProjectPanel, 
  setShowProjectPanel 
}: ChatHeaderProps) {
  return (
    <header className="border-b p-4 flex items-center justify-between bg-background">
      <div className="flex items-center">
        <h1 className="text-xl font-semibold">DevManager AI</h1>
      </div>
      <div className="flex items-center gap-2">
        <Tooltip tooltip="API Settings">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={() => setShowApiSettings(true)}
          >
            <Settings className="h-4 w-4" />
            <span>API Settings</span>
          </Button>
        </Tooltip>
        <Tooltip tooltip="Toggle Project Panel">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowProjectPanel(!showProjectPanel)}
            className={showProjectPanel ? "bg-blue-100" : ""}
          >
            <PanelLeft className="h-4 w-4 mr-1" />
            <span>Show Project Panel</span>
          </Button>
        </Tooltip>
      </div>
    </header>
  );
}
