
import React from 'react';

export interface KnowledgeResource {
  id: string;
  title: string;
  url: string;
  description: string;
  category: string;
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
                  <button 
                    onClick={() => onRemove(resource.id)}
                    className="text-red-500 hover:text-red-700 text-xs"
                    aria-label="Remove resource"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
