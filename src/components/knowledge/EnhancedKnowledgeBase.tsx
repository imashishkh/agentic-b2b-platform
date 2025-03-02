
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useChat } from "@/contexts/ChatContext";
import { KnowledgeBaseResource } from "@/contexts/types";
import { ExternalLink, FilePlus, Search, Trash2, ArrowUpDown } from "lucide-react";
import { toast } from "sonner";

export const EnhancedKnowledgeBase: React.FC = () => {
  const { knowledgeBase, addKnowledgeResource, removeKnowledgeResource } = useChat();
  const [searchTerm, setSearchTerm] = useState("");
  const [sort, setSort] = useState<'newest' | 'oldest' | 'category'>('newest');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  // Form state for adding new resources
  const [formState, setFormState] = useState({
    title: "",
    url: "",
    category: "Technology Stack",
    description: "",
    tags: ""
  });
  
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
  
  const handleAddResource = () => {
    if (!formState.title || !formState.url) {
      toast.error("Title and URL are required");
      return;
    }
    
    // Try to validate URL
    try {
      new URL(formState.url);
    } catch (error) {
      toast.error("Please enter a valid URL");
      return;
    }
    
    const newResource: KnowledgeBaseResource = {
      id: Date.now().toString(),
      title: formState.title,
      url: formState.url,
      category: formState.category,
      description: formState.description || `Resource from ${new URL(formState.url).hostname}`,
      dateAdded: new Date(),
      tags: formState.tags ? formState.tags.split(',').map(tag => tag.trim()) : undefined,
      isIndexed: false
    };
    
    addKnowledgeResource(newResource);
    toast.success("Resource added to knowledge base");
    
    // Reset form
    setFormState({
      title: "",
      url: "",
      category: "Technology Stack",
      description: "",
      tags: ""
    });
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Knowledge Base</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm">
              <FilePlus className="h-4 w-4 mr-2" />
              Add Resource
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Knowledge Resource</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title" 
                  value={formState.title}
                  onChange={(e) => setFormState({...formState, title: e.target.value})}
                  placeholder="React Router Documentation"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="url">URL</Label>
                <Input 
                  id="url" 
                  value={formState.url}
                  onChange={(e) => setFormState({...formState, url: e.target.value})}
                  placeholder="https://reactrouter.com/docs"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={formState.category}
                  onValueChange={(value) => setFormState({...formState, category: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Technology Stack">Technology Stack</SelectItem>
                    <SelectItem value="Industry Standards">Industry Standards</SelectItem>
                    <SelectItem value="Competitor Analysis">Competitor Analysis</SelectItem>
                    <SelectItem value="Security Compliance">Security Compliance</SelectItem>
                    <SelectItem value="Design Principles">Design Principles</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Input 
                  id="description" 
                  value={formState.description}
                  onChange={(e) => setFormState({...formState, description: e.target.value})}
                  placeholder="Official documentation for React Router"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tags">Tags (Comma separated, Optional)</Label>
                <Input 
                  id="tags" 
                  value={formState.tags}
                  onChange={(e) => setFormState({...formState, tags: e.target.value})}
                  placeholder="react, routing, frontend"
                />
              </div>
              
              <Button className="w-full" onClick={handleAddResource}>
                Add Resource
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="flex space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search resources..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={sort} onValueChange={(value: 'newest' | 'oldest' | 'category') => setSort(value)}>
          <SelectTrigger className="w-[180px]">
            <div className="flex items-center">
              <ArrowUpDown className="mr-2 h-4 w-4" />
              <span>Sort By</span>
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="category">By Category</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
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
          <ResourceList resources={filteredResources} onDelete={removeKnowledgeResource} />
        </TabsContent>
        
        {categories.map(category => (
          <TabsContent key={category} value={category} className="max-h-[400px] overflow-y-auto">
            <ResourceList 
              resources={knowledgeBase.filter(r => r.category === category)}
              onDelete={removeKnowledgeResource}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

interface ResourceListProps {
  resources: KnowledgeBaseResource[];
  onDelete: (id: string) => void;
}

const ResourceList: React.FC<ResourceListProps> = ({ resources, onDelete }) => {
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
