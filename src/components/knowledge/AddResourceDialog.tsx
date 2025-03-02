
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FilePlus } from "lucide-react";
import { toast } from "sonner";
import { KnowledgeBaseResource } from "@/contexts/types";

interface AddResourceDialogProps {
  onAddResource: (resource: KnowledgeBaseResource) => void;
}

export const AddResourceDialog: React.FC<AddResourceDialogProps> = ({ onAddResource }) => {
  const [formState, setFormState] = useState({
    title: "",
    url: "",
    category: "Technology Stack",
    description: "",
    tags: ""
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
    
    onAddResource(newResource);
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
  );
};
