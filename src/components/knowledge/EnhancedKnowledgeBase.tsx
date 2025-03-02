
import React, { useState } from 'react';
import { useChat } from "@/contexts/ChatContext";
import { KnowledgeBaseResource } from "@/contexts/types";
import { AddResourceDialog } from './AddResourceDialog';
import { ResourceFilters } from './ResourceFilters';
import { CategoryTabs } from './CategoryTabs';

export const EnhancedKnowledgeBase: React.FC = () => {
  const { knowledgeBase, addKnowledgeResource, removeKnowledgeResource } = useChat();
  const [searchTerm, setSearchTerm] = useState("");
  const [sort, setSort] = useState<'newest' | 'oldest' | 'category'>('newest');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  // Get unique categories from knowledge base
  const categories = Array.from(
    new Set(knowledgeBase.map(resource => resource.category))
  );
  
  // Filter and sort resources
  const filteredResources = knowledgeBase
    .filter(resource => {
      const matchesSearch = 
        searchTerm === "" || 
        resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (resource.tags && resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
        
      const matchesCategory = 
        activeCategory === null || 
        resource.category === activeCategory;
        
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sort === 'newest') {
        return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
      } else if (sort === 'oldest') {
        return new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime();
      } else {
        return a.category.localeCompare(b.category);
      }
    });
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Knowledge Base</h2>
        <AddResourceDialog onAddResource={addKnowledgeResource} />
      </div>
      
      <ResourceFilters 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sort={sort}
        setSort={setSort}
      />
      
      <CategoryTabs 
        categories={categories}
        knowledgeBase={knowledgeBase}
        filteredResources={filteredResources}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        onDelete={removeKnowledgeResource}
      />
    </div>
  );
};
