
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KnowledgeBaseResource } from "@/contexts/types";
import { ResourceList } from "./ResourceList";

interface CategoryTabsProps {
  categories: string[];
  knowledgeBase: KnowledgeBaseResource[];
  filteredResources: KnowledgeBaseResource[];
  activeCategory: string | null;
  setActiveCategory: (category: string | null) => void;
  onDelete: (id: string) => void;
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  categories,
  knowledgeBase,
  filteredResources,
  activeCategory,
  setActiveCategory,
  onDelete
}) => {
  return (
    <Tabs defaultValue="all">
      <TabsList className="w-full">
        <TabsTrigger 
          value="all" 
          className="flex-1"
          onClick={() => setActiveCategory(null)}
        >
          All
        </TabsTrigger>
        {categories.map(category => (
          <TabsTrigger 
            key={category} 
            value={category}
            className="flex-1"
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </TabsTrigger>
        ))}
      </TabsList>
      
      <TabsContent value="all" className="max-h-[400px] overflow-y-auto">
        <ResourceList resources={filteredResources} onDelete={onDelete} />
      </TabsContent>
      
      {categories.map(category => (
        <TabsContent key={category} value={category} className="max-h-[400px] overflow-y-auto">
          <ResourceList 
            resources={knowledgeBase.filter(r => r.category === category)}
            onDelete={onDelete}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
};
