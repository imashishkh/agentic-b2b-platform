import React from "react";
import { useChat } from "@/contexts/ChatContext";
import { KnowledgeBaseResource } from "@/contexts/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";

export function KnowledgeBasePanel() {
  const { knowledgeBase } = useChat();

  if (knowledgeBase.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        <p>No knowledge resources added yet.</p>
        <p className="text-sm mt-2">Add documentation links to enhance your project.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 p-2">
      {knowledgeBase.map((resource) => (
        <Card key={resource.id} className="p-3">
          <div className="flex justify-between">
            <div>
              <h4 className="font-medium">{resource.title}</h4>
              <p className="text-sm text-gray-600">{resource.description}</p>
              <div className="flex items-center gap-1 mt-1">
                <Badge>{resource.category}</Badge>
                {resource.isIndexed && (
                  <Badge variant="outline">Indexed</Badge>
                )}
                {resource.priority && (
                  <Badge>{resource.priority}</Badge>
                )}
              </div>
            </div>
            <ExternalLink href={resource.url} target="_blank" rel="noopener noreferrer" />
          </div>
        </Card>
      ))}
    </div>
  );
}
