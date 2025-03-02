
import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { KnowledgeResourcesList } from "./knowledge/KnowledgeResourcesList";
import { Card } from "./ui/card";
import { ExternalLink, Plus } from "lucide-react";
import { useChat } from "@/contexts/ChatContext";
import { KnowledgeBaseResource } from "@/contexts/types";
import { toast } from "sonner";

export default function KnowledgeBasePanel() {
  const { addKnowledgeResource } = useChat();
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  
  const handleAddResource = () => {
    if (!url.trim() || !title.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    
    if (!url.startsWith("http")) {
      toast.error("Please enter a valid URL");
      return;
    }
    
    const newResource: KnowledgeBaseResource = {
      id: Date.now().toString(),
      url,
      title,
      category: "Technology",
      description: "Added by user",
      isIndexed: true,
      dateAdded: new Date().toISOString(),
    };
    
    addKnowledgeResource(newResource);
    toast.success("Resource added to knowledge base");
    
    // Reset form
    setUrl("");
    setTitle("");
  };
  
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Knowledge Base</h2>
        <p className="text-sm text-gray-500">Add documentation links to enhance your project</p>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <KnowledgeResourcesList />
      </div>
      
      <Card className="m-3 p-3">
        <h3 className="text-sm font-medium mb-2">Add Resource</h3>
        <div className="space-y-2">
          <Input
            placeholder="Documentation URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <Input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div className="flex justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open("https://docs.lovable.dev", "_blank")}
              className="text-xs"
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Docs
            </Button>
            <Button size="sm" onClick={handleAddResource}>
              <Plus className="h-3 w-3 mr-1" />
              Add
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
