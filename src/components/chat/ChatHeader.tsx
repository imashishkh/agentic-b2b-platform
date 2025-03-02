
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Settings, PanelLeft } from "lucide-react";
import { ApiSettings } from "@/components/ApiSettings";

interface ChatHeaderProps {
  setShowApiSettings: React.Dispatch<React.SetStateAction<boolean>>;
  showProjectPanel: boolean;
  setShowProjectPanel: React.Dispatch<React.SetStateAction<boolean>>;
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
    </header>
  );
}
