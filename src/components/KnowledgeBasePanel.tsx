
import React, { useState } from 'react';
import { useChat, KnowledgeBaseResource } from '@/contexts/ChatContext';
import { PlusCircle, X, ExternalLink, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

/**
 * Categories for knowledge base resources
 */
const RESOURCE_CATEGORIES = [
  "Technology Stack",
  "Industry Standards",
  "Competitor Analysis",
  "Security Compliance",
  "Design Principles",
  "Other"
];

/**
 * Panel for displaying and managing knowledge base resources
 * Allows users to add, view, and remove resources
 */
export function KnowledgeBasePanel() {
  const { knowledgeBase, addKnowledgeResource, removeKnowledgeResource } = useChat();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  /**
   * Filtered resources based on the active category
   */
  const filteredResources = activeCategory 
    ? knowledgeBase.filter(resource => resource.category === activeCategory) 
    : knowledgeBase;
  
  /**
   * Group resources by category
   */
  const resourcesByCategory = knowledgeBase.reduce((acc, resource) => {
    if (!acc[resource.category]) {
      acc[resource.category] = [];
    }
    acc[resource.category].push(resource);
    return acc;
  }, {} as Record<string, KnowledgeBaseResource[]>);

  /**
   * Handle adding a new resource
   */
  const handleAddResource = (newResource: KnowledgeBaseResource) => {
    addKnowledgeResource(newResource);
    toast.success('Resource added to knowledge base');
    setIsAddDialogOpen(false);
  };

  /**
   * Handle removing a resource
   */
  const handleRemoveResource = (id: string) => {
    removeKnowledgeResource(id);
    toast.info('Resource removed from knowledge base');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-sayhalo-dark flex items-center gap-2">
            <BookOpen size={20} />
            Knowledge Base
          </h2>
          <AddResourceDialog 
            isOpen={isAddDialogOpen} 
            setIsOpen={setIsAddDialogOpen} 
            onAddResource={handleAddResource}
          />
        </div>
        
        <p className="text-sm text-gray-500 mb-3">
          Resources to inform development decisions
        </p>
        
        {/* Category filter chips */}
        <div className="flex flex-wrap gap-2 mb-2">
          <button
            className={cn(
              "px-3 py-1 text-xs rounded-full transition-colors",
              activeCategory === null 
                ? "bg-sayhalo-coral text-white" 
                : "bg-gray-100 hover:bg-gray-200 text-gray-800"
            )}
            onClick={() => setActiveCategory(null)}
          >
            All
          </button>
          
          {Object.keys(resourcesByCategory).map(category => (
            <button
              key={category}
              className={cn(
                "px-3 py-1 text-xs rounded-full transition-colors",
                activeCategory === category 
                  ? "bg-sayhalo-coral text-white" 
                  : "bg-gray-100 hover:bg-gray-200 text-gray-800"
              )}
              onClick={() => setActiveCategory(category)}
            >
              {category} ({resourcesByCategory[category].length})
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3">
        {filteredResources.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-4 text-gray-500">
            <BookOpen size={40} className="mb-2 opacity-30" />
            <p className="mb-2">
              {activeCategory 
                ? `No resources in "${activeCategory}" category yet` 
                : "No knowledge base resources yet"}
            </p>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-sayhalo-coral hover:text-sayhalo-coral/90"
              onClick={() => setIsAddDialogOpen(true)}
            >
              Add your first resource
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredResources.map((resource) => (
              <ResourceCard 
                key={resource.id} 
                resource={resource} 
                onRemove={handleRemoveResource} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Props for the Resource Card component
 */
interface ResourceCardProps {
  resource: KnowledgeBaseResource;
  onRemove: (id: string) => void;
}

/**
 * Card component for displaying a single knowledge base resource
 */
function ResourceCard({ resource, onRemove }: ResourceCardProps) {
  return (
    <div className="bg-white border rounded-lg p-3 shadow-sm hover:shadow transition-shadow">
      <div className="flex justify-between items-start mb-1">
        <h3 className="font-medium text-sayhalo-dark">{resource.title}</h3>
        <button 
          className="text-gray-400 hover:text-gray-600 transition-colors"
          onClick={() => onRemove(resource.id)}
          aria-label="Remove resource"
        >
          <X size={14} />
        </button>
      </div>
      
      <p className="text-xs text-gray-500 mb-2">{resource.description}</p>
      
      <div className="flex justify-between items-center">
        <span className="bg-gray-100 text-xs rounded-full px-2 py-0.5 text-gray-700">
          {resource.category}
        </span>
        
        <a 
          href={resource.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-sayhalo-coral hover:underline"
        >
          Visit <ExternalLink size={12} />
        </a>
      </div>
    </div>
  );
}

/**
 * Props for the Add Resource Dialog component
 */
interface AddResourceDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onAddResource: (resource: KnowledgeBaseResource) => void;
}

/**
 * Dialog component for adding a new knowledge base resource
 */
function AddResourceDialog({ isOpen, setIsOpen, onAddResource }: AddResourceDialogProps) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState(RESOURCE_CATEGORIES[0]);
  const [description, setDescription] = useState('');
  
  /**
   * Reset form fields
   */
  const resetForm = () => {
    setTitle('');
    setUrl('');
    setCategory(RESOURCE_CATEGORIES[0]);
    setDescription('');
  };
  
  /**
   * Handle form submission
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!title.trim() || !url.trim() || !description.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    
    // Validate URL format
    try {
      new URL(url);
    } catch (error) {
      toast.error('Please enter a valid URL');
      return;
    }
    
    // Create new resource
    const newResource: KnowledgeBaseResource = {
      id: Date.now().toString(),
      title: title.trim(),
      url: url.trim(),
      category,
      description: description.trim(),
      dateAdded: new Date()
    };
    
    // Add resource and reset form
    onAddResource(newResource);
    resetForm();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-1 text-sayhalo-coral hover:text-sayhalo-coral/90"
        >
          <PlusCircle size={16} />
          <span>Add Resource</span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Knowledge Base Resource</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="React Documentation"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">URL</label>
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://reactjs.org/docs"
              type="url"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            >
              {RESOURCE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Official React documentation"
              required
            />
          </div>
          
          <div className="flex justify-end gap-2 mt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            
            <Button type="submit" className="bg-sayhalo-coral hover:bg-sayhalo-coral/90">
              Add Resource
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
