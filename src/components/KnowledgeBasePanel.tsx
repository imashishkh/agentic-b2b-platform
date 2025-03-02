
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { KnowledgeResourcesList } from "@/components/knowledge/KnowledgeResourcesList";
import { useChat } from "@/contexts/ChatContext";
import { KnowledgeBaseResource } from "@/contexts/types";

export function KnowledgeBasePanel() {
  const { knowledgeBase, addKnowledgeResource, removeKnowledgeResource } = useChat();
  const [newResource, setNewResource] = useState({
    title: "",
    url: "",
  });
  const [isAdding, setIsAdding] = useState(false);

  const handleAddResource = () => {
    if (newResource.title && newResource.url) {
      addKnowledgeResource({
        id: Date.now().toString(),
        title: newResource.title,
        url: newResource.url,
        type: "url",
        dateAdded: new Date().toISOString(),
      });
      
      setNewResource({
        title: "",
        url: "",
      });
      
      setIsAdding(false);
    }
  };

  const handleRemoveResource = (id: string) => {
    removeKnowledgeResource(id);
  };

  return (
    <div className="h-full flex flex-col bg-background p-4 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Knowledge Base</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsAdding(!isAdding)}
        >
          {isAdding ? "Cancel" : "Add Resource"}
        </Button>
      </div>
      
      {isAdding && (
        <div className="bg-muted/30 p-3 rounded-md mb-4 space-y-3">
          <Input
            placeholder="Resource Title"
            value={newResource.title}
            onChange={(e) => setNewResource(prev => ({ ...prev, title: e.target.value }))}
          />
          <Input
            placeholder="URL or Reference"
            value={newResource.url}
            onChange={(e) => setNewResource(prev => ({ ...prev, url: e.target.value }))}
          />
          <div className="flex justify-end">
            <Button size="sm" onClick={handleAddResource} disabled={!newResource.title || !newResource.url}>
              Add
            </Button>
          </div>
        </div>
      )}
      
      {knowledgeBase.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p className="mb-2">No resources added yet</p>
          <p className="text-sm">Add documentation links or reference materials to enhance the AI's knowledge</p>
        </div>
      ) : (
        <KnowledgeResourcesList resources={knowledgeBase} onRemove={handleRemoveResource} />
      )}
    </div>
  );
}
