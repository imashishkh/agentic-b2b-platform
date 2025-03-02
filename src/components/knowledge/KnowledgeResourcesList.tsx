
import React from 'react';

// Define the KnowledgeResource interface
export interface KnowledgeResource {
  id: string;
  title: string;
  url?: string;
  type: string;
}

// Define the props interface for KnowledgeResourcesList component
export interface KnowledgeResourcesListProps {
  resources: KnowledgeResource[];
  onRemove: (id: string) => void;
}

// This component displays a list of knowledge resources
export const KnowledgeResourcesList: React.FC<KnowledgeResourcesListProps> = ({ 
  resources, 
  onRemove 
}) => {
  if (!resources || resources.length === 0) {
    return <div className="text-gray-500 text-sm">No resources added yet.</div>;
  }

  return (
    <div className="space-y-2">
      {resources.map((resource) => (
        <div 
          key={resource.id}
          className="flex items-center justify-between p-2 bg-white rounded border"
        >
          <div>
            <div className="font-medium text-sm">{resource.title}</div>
            {resource.url && (
              <a 
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:underline"
              >
                {resource.url}
              </a>
            )}
            <div className="text-xs text-gray-500">Type: {resource.type}</div>
          </div>
          <button
            onClick={() => onRemove(resource.id)}
            className="text-red-500 hover:text-red-700 text-xs"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
};
