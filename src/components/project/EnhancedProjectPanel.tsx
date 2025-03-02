
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TaskVisualization } from "./TaskVisualization";
import { KnowledgeResourcesList } from "../knowledge/KnowledgeResourcesList";
import { ProjectFeaturesPanel } from "./ProjectFeaturesPanel";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useChat } from "@/contexts/ChatContext";
import { toast } from "sonner";

export function EnhancedProjectPanel() {
  const [activeTab, setActiveTab] = useState("features");
  const { addKnowledgeResource, setIsRequestingKnowledge } = useChat();
  
  const handleAddResource = () => {
    setIsRequestingKnowledge(true);
    toast.info("Please paste a documentation URL in the chat");
  };
  
  return (
    <div className="h-full flex flex-col">
      <div className="border-b p-2">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="knowledge">Knowledge</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <TabsContent value="features" className="h-full">
          <ProjectFeaturesPanel />
        </TabsContent>
        
        <TabsContent value="tasks" className="h-full">
          <TaskVisualization />
        </TabsContent>
        
        <TabsContent value="knowledge" className="h-full p-2">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium">Knowledge Resources</h3>
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-7 px-2"
              onClick={handleAddResource}
            >
              <PlusCircle className="h-4 w-4 mr-1" />
              <span>Add</span>
            </Button>
          </div>
          <KnowledgeResourcesList />
        </TabsContent>
      </div>
    </div>
  );
}
