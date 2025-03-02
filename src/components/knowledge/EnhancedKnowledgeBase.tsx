
import React, { useState, useEffect } from 'react';
import { useChat } from "@/contexts/ChatContext";
import { KnowledgeBaseResource } from "@/contexts/types";
import { EnhancedAddResourceDialog } from './EnhancedAddResourceDialog';
import { ResourceFilters } from './ResourceFilters';
import { CategoryTabs } from './CategoryTabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, BookOpen, Tag, BookmarkPlus, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

export const EnhancedKnowledgeBase: React.FC = () => {
  const { knowledgeBase, addKnowledgeResource, removeKnowledgeResource } = useChat();
  const [searchTerm, setSearchTerm] = useState("");
  const [sort, setSort] = useState<'newest' | 'oldest' | 'category'>('newest');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [relevantTags, setRelevantTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [view, setView] = useState<'list' | 'grid'>('list');
  
  // Get unique categories from knowledge base
  const categories = Array.from(
    new Set(knowledgeBase.map(resource => resource.category))
  );
  
  // Extract all unique tags from resources
  useEffect(() => {
    const allTags = knowledgeBase.flatMap(resource => resource.tags || []);
    const uniqueTags = Array.from(new Set(allTags));
    setRelevantTags(uniqueTags);
  }, [knowledgeBase]);
  
  // Toggle tag selection
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };
  
  // Filter and sort resources
  const filteredResources = knowledgeBase
    .filter(resource => {
      const matchesSearch = 
        searchTerm === "" || 
        resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (resource.tags && resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))) ||
        (resource.content && resource.content.toLowerCase().includes(searchTerm.toLowerCase()));
        
      const matchesCategory = 
        activeCategory === null || 
        resource.category === activeCategory;
        
      const matchesTags = 
        selectedTags.length === 0 || 
        (resource.tags && selectedTags.every(tag => resource.tags.includes(tag)));
        
      return matchesSearch && matchesCategory && matchesTags;
    })
    .sort((a, b) => {
      if (sort === 'newest') {
        return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
      } else if (sort === 'oldest') {
        return new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime();
      } else if (sort === 'relevance') {
        // Sort by relevance score if available
        return (b.relevanceScore || 0) - (a.relevanceScore || 0);
      } else {
        return a.category.localeCompare(b.category);
      }
    });
  
  // Open resource in new tab
  const openResource = (url: string) => {
    window.open(url, '_blank');
    toast.success('Opening resource in new tab');
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold flex items-center">
          <BookOpen className="h-5 w-5 mr-2" />
          Knowledge Base
          <Badge className="ml-2">{knowledgeBase.length}</Badge>
        </h2>
        <EnhancedAddResourceDialog onAddResource={addKnowledgeResource} />
      </div>
      
      <Tabs defaultValue="resources" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="resources" className="flex-1">All Resources</TabsTrigger>
          <TabsTrigger value="tags" className="flex-1">Browse by Tags</TabsTrigger>
        </TabsList>
        
        <TabsContent value="resources" className="mt-4 space-y-4">
          <div className="flex justify-between items-center">
            <ResourceFilters 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              sort={sort}
              setSort={setSort}
              // Add new relevance sort option
              sortOptions={[
                { value: 'newest', label: 'Newest' },
                { value: 'oldest', label: 'Oldest' },
                { value: 'category', label: 'Category' },
                { value: 'relevance', label: 'Relevance' }
              ]}
            />
            
            <div className="flex space-x-1">
              <Button
                variant={view === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setView('list')}
              >
                List
              </Button>
              <Button
                variant={view === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setView('grid')}
              >
                Grid
              </Button>
            </div>
          </div>
          
          {/* Selected tags display */}
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-1 items-center py-2">
              <span className="text-sm text-slate-500 mr-2">Filtered by:</span>
              {selectedTags.map(tag => (
                <Badge 
                  key={tag} 
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => toggleTag(tag)}
                >
                  {tag} ×
                </Badge>
              ))}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSelectedTags([])}
                className="text-xs ml-2"
              >
                Clear filters
              </Button>
            </div>
          )}
          
          <CategoryTabs 
            categories={categories}
            knowledgeBase={knowledgeBase}
            filteredResources={filteredResources}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            onDelete={removeKnowledgeResource}
            view={view}
            onTagClick={toggleTag}
            onOpenResource={openResource}
          />
        </TabsContent>
        
        <TabsContent value="tags" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center">
                <Tag className="h-4 w-4 mr-2" />
                Browse Resources by Tags
              </CardTitle>
            </CardHeader>
            <CardContent>
              {relevantTags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {relevantTags.map(tag => {
                    const resourceCount = knowledgeBase.filter(r => r.tags?.includes(tag)).length;
                    const isSelected = selectedTags.includes(tag);
                    
                    return (
                      <Badge 
                        key={tag}
                        variant={isSelected ? "default" : "outline"}
                        className="cursor-pointer hover:bg-slate-100 px-3 py-1"
                        onClick={() => {
                          toggleTag(tag);
                          setView('list');
                        }}
                      >
                        {tag} <span className="ml-1 text-xs">({resourceCount})</span>
                      </Badge>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-slate-500">No tags found in resources</p>
              )}
            </CardContent>
          </Card>
          
          {/* Show resources with selected tags */}
          {selectedTags.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Resources with selected tags:</h3>
              <div className="space-y-2">
                {filteredResources.map(resource => (
                  <Card key={resource.id} className="overflow-hidden">
                    <div className="flex">
                      <div className="p-4 flex-1">
                        <h4 className="font-medium">{resource.title}</h4>
                        <p className="text-sm text-slate-500 mt-1">{resource.description}</p>
                        <div className="flex items-center justify-between mt-2">
                          <Badge variant="outline">{resource.category}</Badge>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-xs flex items-center"
                            onClick={() => openResource(resource.url)}
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Open
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
