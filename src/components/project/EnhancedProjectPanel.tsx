
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TaskVisualization } from "./TaskVisualization";
import { KnowledgeResourcesList, KnowledgeResource } from "../knowledge/KnowledgeResourcesList";
import { ProjectFeaturesPanel } from "./ProjectFeaturesPanel";
import { Button } from "@/components/ui/button";
import { PlusCircle, Settings } from "lucide-react";
import { useChat } from "@/contexts/ChatContext";
import { toast } from "sonner";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function EnhancedProjectPanel() {
  const [activeTab, setActiveTab] = useState("features");
  const { addKnowledgeResource, setIsRequestingKnowledge, knowledgeBase } = useChat();
  const [showSettings, setShowSettings] = useState(false);
  
  const handleAddResource = () => {
    setIsRequestingKnowledge(true);
    toast.info("Please paste a documentation URL in the chat");
  };
  
  const handleRemoveResource = (id: string) => {
    // You can implement this based on your requirements
    toast.success("Resource removed");
  };
  
  const handleSettingsSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Settings saved successfully");
    setShowSettings(false);
  };
  
  // Convert knowledgeBase to the format expected by KnowledgeResourcesList
  const resources: KnowledgeResource[] = knowledgeBase.map(resource => ({
    id: resource.id,
    title: resource.title,
    url: resource.url,
    description: resource.description,
    category: resource.category
  }));
  
  return (
    <div className="h-full flex flex-col">
      <div className="border-b p-2 flex justify-between items-center">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="knowledge">Knowledge</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <Dialog open={showSettings} onOpenChange={setShowSettings}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="px-2 ml-2">
              <Settings className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Project Settings</DialogTitle>
              <DialogDescription>
                Configure your project preferences and settings
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSettingsSave}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="projectName" className="text-right">
                    Project Name
                  </Label>
                  <Input id="projectName" defaultValue="DevManager Project" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="repository" className="text-right">
                    GitHub Repository
                  </Label>
                  <Input id="repository" placeholder="username/repo" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="apiKey" className="text-right">
                    API Key
                  </Label>
                  <Input id="apiKey" type="password" placeholder="••••••••" className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
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
          <KnowledgeResourcesList 
            resources={resources}
            onRemove={handleRemoveResource}
          />
        </TabsContent>
      </div>
    </div>
  );
}
