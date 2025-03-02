
import React from "react";
import { useChat, KnowledgeBaseResource } from "@/contexts/ChatContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, X, Link as LinkIcon, BookOpen } from "lucide-react";
import { toast } from "sonner";

export function KnowledgeResourcesList() {
  const { knowledgeBase, removeKnowledgeResource, isRequestingKnowledge } = useChat();
  
  const handleRemoveResource = (id: string) => {
    removeKnowledgeResource(id);
    toast.success("Resource removed successfully");
  };
  
  const getCategoryIcon = (category: string) => {
    switch(category.toLowerCase()) {
      case "technology":
        return <BookOpen className="h-4 w-4" />;
      case "industry standards":
        return <BookOpen className="h-4 w-4" />;
      case "security":
        return <BookOpen className="h-4 w-4" />;
      default:
        return <LinkIcon className="h-4 w-4" />;
    }
  };
  
  if (knowledgeBase.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        <p>No knowledge resources added yet.</p>
        <p className="text-sm mt-2">Add documentation links to enhance your project.</p>
        {isRequestingKnowledge && (
          <div className="mt-3">
            <div className="animate-pulse text-blue-500">Waiting for resources...</div>
          </div>
        )}
      </div>
    );
  }
  
  return (
    <div className="space-y-3 p-2">
      {knowledgeBase.map((resource) => (
        <Card key={resource.id} className="p-3">
          <div className="flex justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-1">
                {getCategoryIcon(resource.category)}
                <h4 className="font-medium text-sm">{resource.title}</h4>
              </div>
              <p className="text-xs text-gray-600 mt-1">{resource.description}</p>
              <div className="flex items-center gap-1 mt-1">
                <Badge className="text-xs">{resource.category}</Badge>
                {resource.isIndexed && (
                  <Badge variant="outline" className="text-xs bg-green-50 text-green-700">Indexed</Badge>
                )}
                {resource.priority && (
                  <Badge 
                    className={`text-xs ${
                      resource.priority === 'high' ? 'bg-red-100 text-red-800' :
                      resource.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-green-100 text-green-800'
                    }`}
                  >
                    {resource.priority}
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex flex-col space-y-1">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 w-7 p-0" 
                onClick={() => window.open(resource.url, '_blank')}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className="h-7 w-7 p-0 text-red-500 hover:text-red-700" 
                onClick={() => handleRemoveResource(resource.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
