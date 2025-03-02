
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KnowledgeBaseResource } from "@/contexts/types";
import { ResourceList } from "./ResourceList";
import { ResourceGrid } from "./ResourceGrid";

interface CategoryTabsProps {
  categories: string[];
  knowledgeBase: KnowledgeBaseResource[];
  filteredResources: KnowledgeBaseResource[];
  activeCategory: string | null;
  setActiveCategory: (category: string | null) => void;
  onDelete: (id: string) => void;
  view?: 'list' | 'grid';
  onTagClick?: (tag: string) => void;
  onOpenResource?: (url: string) => void;
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  categories,
  knowledgeBase,
  filteredResources,
  activeCategory,
  setActiveCategory,
  onDelete,
  view = 'list',
  onTagClick,
  onOpenResource
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
        {view === 'list' ? (
          <ResourceList 
            resources={filteredResources} 
            onDelete={onDelete} 
            onTagClick={onTagClick}
            onOpenResource={onOpenResource}
          />
        ) : (
          <ResourceGrid 
            resources={filteredResources} 
            onDelete={onDelete}
            onTagClick={onTagClick}
            onOpenResource={onOpenResource}
          />
        )}
      </TabsContent>
      
      {categories.map(category => (
        <TabsContent key={category} value={category} className="max-h-[400px] overflow-y-auto">
          {view === 'list' ? (
            <ResourceList 
              resources={knowledgeBase.filter(r => r.category === category)} 
              onDelete={onDelete}
              onTagClick={onTagClick}
              onOpenResource={onOpenResource}
            />
          ) : (
            <ResourceGrid 
              resources={knowledgeBase.filter(r => r.category === category)} 
              onDelete={onDelete}
              onTagClick={onTagClick}
              onOpenResource={onOpenResource}
            />
          )}
        </TabsContent>
      ))}
    </Tabs>
  );
};
