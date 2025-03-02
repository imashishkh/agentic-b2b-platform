
import React from 'react';
import { KnowledgeResource } from '@/contexts/types';

// Sample knowledge resources for demonstration
const sampleResources: KnowledgeResource[] = [
  {
    id: "react-doc",
    title: "React Documentation",
    url: "https://reactjs.org/docs/getting-started.html",
    description: "Official React documentation for frontend development",
    category: "frontend",
    content: "Official React documentation reference"
  },
  {
    id: "tailwind-doc",
    title: "Tailwind CSS Documentation",
    url: "https://tailwindcss.com/docs",
    description: "Official Tailwind CSS documentation for styling",
    category: "frontend",
    content: "Official Tailwind CSS documentation reference"
  }
];

export function KnowledgeBasePanel() {
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Knowledge Base</h2>
      <ul className="space-y-2">
        {sampleResources.map((resource) => (
          <li key={resource.id} className="p-3 border rounded hover:bg-gray-50">
            <h3 className="font-medium">{resource.title}</h3>
            <p className="text-sm text-gray-600">{resource.description}</p>
            <a 
              href={resource.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:underline"
            >
              View Resource
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
