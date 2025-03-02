
import React from 'react';
import { Button } from "@/components/ui/button";
import { ExternalLink, Trash2 } from "lucide-react";
import { KnowledgeBaseResource } from "@/contexts/types";

// Update interface to use the KnowledgeBaseResource type from contexts/types
export interface KnowledgeResource extends Omit<KnowledgeBaseResource, 'id' | 'dateAdded' | 'tags' | 'priority' | 'isIndexed'> {
  id: string;
}

export interface KnowledgeResourcesListProps {
  resources: KnowledgeResource[];
  onRemove: (id: string) => void;
}

export function KnowledgeResourcesList({ resources, onRemove }: KnowledgeResourcesListProps) {
  if (!resources || resources.length === 0) {
    return <div className="text-center text-gray-500 py-4">No resources added yet.</div>;
  }

  // Group resources by category
  const categorizedResources: Record<string, KnowledgeResource[]> = {};
  resources.forEach(resource => {
    if (!categorizedResources[resource.category]) {
      categorizedResources[resource.category] = [];
    }
    categorizedResources[resource.category].push(resource);
  });

  return (
    <div className="space-y-4">
      {Object.entries(categorizedResources).map(([category, categoryResources]) => (
        <div key={category} className="border rounded-lg p-3">
          <h3 className="font-semibold text-sm mb-2">{category}</h3>
          <ul className="space-y-2">
            {categoryResources.map(resource => (
              <li key={resource.id} className="text-sm border-b pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <a 
                      href={resource.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="font-medium hover:underline text-blue-600"
                    >
                      {resource.title}
                    </a>
                    <p className="text-gray-600 text-xs mt-1">{resource.description}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemove(resource.id)}
                    className="h-8 w-8 text-gray-500 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
