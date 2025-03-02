
import React from 'react';
import { Button } from "@/components/ui/button";
import { ExternalLink, Trash2 } from "lucide-react";
import { KnowledgeBaseResource } from "@/contexts/types";

interface ResourceListProps {
  resources: KnowledgeBaseResource[];
  onDelete: (id: string) => void;
}

export const ResourceList: React.FC<ResourceListProps> = ({ resources, onDelete }) => {
  if (resources.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No resources found
      </div>
    );
  }
  
  return (
    <div className="space-y-2">
      {resources.map(resource => (
        <div 
          key={resource.id}
          className="p-3 border rounded-md hover:bg-gray-50 flex justify-between items-center"
        >
          <div className="flex-1">
            <div className="flex items-center">
              <a 
                href={resource.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-medium text-blue-600 hover:underline flex items-center"
              >
                {resource.title}
                <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </div>
            <p className="text-sm text-gray-600 mt-1">{resource.description}</p>
            {resource.tags && resource.tags.length > 0 && (
              <div className="flex mt-1 flex-wrap">
                {resource.tags.map(tag => (
                  <span 
                    key={tag} 
                    className="text-xs bg-gray-100 rounded-full px-2 py-0.5 mr-1 mb-1"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <div className="flex items-center mt-1 text-xs text-gray-500">
              <span className="bg-blue-100 text-blue-800 rounded-full px-2 py-0.5 mr-2">
                {resource.category}
              </span>
              <span>Added {new Date(resource.dateAdded).toLocaleDateString()}</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(resource.id)}
            className="h-8 w-8 text-gray-500 hover:text-red-500"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};
