
import React from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink, Trash2 } from "lucide-react";

// Define the props interface for the resources
export interface KnowledgeResourceProps {
  id: string;
  title: string;
  url: string;
  description: string;
  category: string;
  dateAdded: string;
}

// Define the component props
export interface KnowledgeResourcesListProps {
  resources: KnowledgeResourceProps[];
  onRemove: (id: string) => void;
}

export const KnowledgeResourcesList: React.FC<KnowledgeResourcesListProps> = ({
  resources,
  onRemove
}) => {
  if (resources.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-sm text-muted-foreground">No resources available</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {resources.map((resource) => (
        <div
          key={resource.id}
          className="p-3 border rounded-md flex justify-between items-start hover:bg-muted/20"
        >
          <div>
            <div className="flex items-center gap-1">
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary hover:underline flex items-center"
              >
                {resource.title}
                <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {resource.description}
            </p>
            <div className="mt-1 flex items-center">
              <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">
                {resource.category}
              </span>
            </div>
          </div>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onRemove(resource.id)}
            className="h-8 w-8"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};
