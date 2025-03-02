
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { useChat } from "@/contexts/ChatContext";
import { KnowledgeResourcesList, KnowledgeResourceProps } from "@/components/knowledge/KnowledgeResourcesList";

export function KnowledgeBasePanel() {
  const { toast } = useToast();
  const [resources, setResources] = useState<KnowledgeResourceProps[]>([
    {
      id: "1",
      title: "E-commerce Best Practices",
      url: "https://example.com/ecommerce-best-practices",
      description: "A guide to best practices for e-commerce development",
      category: "Industry Standards",
      dateAdded: new Date().toISOString()
    },
    {
      id: "2",
      title: "React Documentation",
      url: "https://reactjs.org/docs/getting-started.html",
      description: "Official React documentation",
      category: "Technology Documentation",
      dateAdded: new Date().toISOString()
    }
  ]);

  const handleAddResource = () => {
    toast({
      title: "Feature in development",
      description: "Adding custom knowledge resources will be available soon.",
    });
  };

  const handleRemoveResource = (id: string) => {
    setResources(resources.filter(resource => resource.id !== id));
    
    toast({
      title: "Resource removed",
      description: "The knowledge resource has been removed successfully.",
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold mb-1">Knowledge Base</h2>
        <p className="text-sm text-muted-foreground">
          Resources and documentation related to your project
        </p>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium">Project Resources</h3>
            <Button size="sm" variant="outline" onClick={handleAddResource}>
              Add Resource
            </Button>
          </div>
          
          {resources.length > 0 ? (
            <KnowledgeResourcesList 
              resources={resources}
              onRemove={handleRemoveResource}
            />
          ) : (
            <div className="text-center p-4 border rounded-md bg-muted/50">
              <p className="text-sm text-muted-foreground">
                No resources have been added yet.
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
