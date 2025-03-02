
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FilePlus, Link, Loader2, Clipboard, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { KnowledgeBaseResource } from "@/contexts/types";
import { extractContentFromUrl, generateAISummary } from "@/utils/resourceExtractor";
import { Badge } from "@/components/ui/badge";

interface EnhancedAddResourceDialogProps {
  onAddResource: (resource: KnowledgeBaseResource) => void;
}

export const EnhancedAddResourceDialog: React.FC<EnhancedAddResourceDialogProps> = ({ onAddResource }) => {
  const [formState, setFormState] = useState({
    title: "",
    url: "",
    category: "Technology Stack",
    description: "",
    tags: "",
    content: "",
    relevanceScore: 1.0
  });
  
  const [isExtracting, setIsExtracting] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [extractedTags, setExtractedTags] = useState<string[]>([]);
  const [formTags, setFormTags] = useState<string[]>([]);

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
      dateAdded: new Date().toISOString(),
      tags: [...new Set([...formTags, ...extractedTags])],
      content: formState.content,
      relevanceScore: formState.relevanceScore
    };
    
    onAddResource(newResource);
    toast.success("Resource added to knowledge base");
    setIsOpen(false);
    
    // Reset form
    resetForm();
  };
  
  const resetForm = () => {
    setFormState({
      title: "",
      url: "",
      category: "Technology Stack",
      description: "",
      tags: "",
      content: "",
      relevanceScore: 1.0
    });
    setExtractedTags([]);
    setFormTags([]);
  };
  
  const handleExtractContent = async () => {
    if (!formState.url) {
      toast.error("Please enter a URL to extract content from");
      return;
    }
    
    try {
      new URL(formState.url);
    } catch (error) {
      toast.error("Please enter a valid URL");
      return;
    }
    
    setIsExtracting(true);
    
    try {
      const extracted = await extractContentFromUrl(formState.url);
      
      setFormState({
        ...formState,
        title: formState.title || extracted.title,
        description: formState.description || extracted.description,
        content: extracted.content
      });
      
      setExtractedTags(extracted.tags);
      
      toast.success("Content extracted successfully");
    } catch (error) {
      toast.error("Failed to extract content from URL");
      console.error(error);
    } finally {
      setIsExtracting(false);
    }
  };
  
  const handleGenerateSummary = async () => {
    if (!formState.content) {
      toast.error("Please extract content or enter content to summarize");
      return;
    }
    
    setIsGeneratingSummary(true);
    
    try {
      const summary = await generateAISummary(formState.content);
      
      setFormState({
        ...formState,
        description: summary
      });
      
      toast.success("Summary generated successfully");
    } catch (error) {
      toast.error("Failed to generate summary");
      console.error(error);
    } finally {
      setIsGeneratingSummary(false);
    }
  };
  
  const handleTagInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({
      ...formState,
      tags: e.target.value
    });
    
    // Convert comma-separated string to array
    const newTags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    setFormTags(newTags);
  };
  
  const removeTag = (tag: string, type: 'form' | 'extracted') => {
    if (type === 'form') {
      const newTags = formTags.filter(t => t !== tag);
      setFormTags(newTags);
      setFormState({
        ...formState,
        tags: newTags.join(', ')
      });
    } else {
      setExtractedTags(extractedTags.filter(t => t !== tag));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" onClick={() => setIsOpen(true)}>
          <FilePlus className="h-4 w-4 mr-2" />
          Add Resource
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Knowledge Resource</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="basic" className="flex-1">Basic Info</TabsTrigger>
            <TabsTrigger value="content" className="flex-1">Content & Summary</TabsTrigger>
            <TabsTrigger value="tags" className="flex-1">Tags & Categorization</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <div className="flex gap-2">
                <Input 
                  id="url" 
                  value={formState.url}
                  onChange={(e) => setFormState({...formState, url: e.target.value})}
                  placeholder="https://reactrouter.com/docs"
                  className="flex-1"
                />
                <Button 
                  variant="outline" 
                  onClick={handleExtractContent}
                  disabled={isExtracting}
                >
                  {isExtracting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Link className="h-4 w-4" />}
                  {isExtracting ? "Extracting..." : "Extract"}
                </Button>
              </div>
              <p className="text-xs text-slate-500">Enter a URL to automatically extract content and metadata</p>
            </div>
            
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
              <div className="flex justify-between items-center">
                <Label htmlFor="description">Description</Label>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleGenerateSummary}
                  disabled={isGeneratingSummary || !formState.content}
                  className="h-6 text-xs"
                >
                  {isGeneratingSummary ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <BookOpen className="h-3 w-3 mr-1" />}
                  {isGeneratingSummary ? "Generating..." : "Generate Summary"}
                </Button>
              </div>
              <Textarea 
                id="description" 
                value={formState.description}
                onChange={(e) => setFormState({...formState, description: e.target.value})}
                placeholder="Official documentation for React Router"
                rows={3}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="content" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="content">Extracted Content</Label>
              <Textarea 
                id="content" 
                value={formState.content}
                onChange={(e) => setFormState({...formState, content: e.target.value})}
                placeholder="Content will be extracted automatically from the URL"
                rows={10}
              />
              <p className="text-xs text-slate-500">This content is stored for reference and improved search relevance</p>
            </div>
            
            <div className="flex justify-end">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleGenerateSummary}
                disabled={isGeneratingSummary || !formState.content}
              >
                {isGeneratingSummary ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <BookOpen className="h-4 w-4 mr-2" />}
                {isGeneratingSummary ? "Generating..." : "Generate Summary from Content"}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="tags" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="tags">Manual Tags (Comma separated)</Label>
              <Input 
                id="tags" 
                value={formState.tags}
                onChange={handleTagInput}
                placeholder="react, routing, frontend"
              />
            </div>
            
            {formTags.length > 0 && (
              <div className="space-y-2">
                <Label>Manual Tags</Label>
                <div className="flex flex-wrap gap-1">
                  {formTags.map(tag => (
                    <Badge 
                      key={`form-${tag}`} 
                      variant="outline"
                      className="cursor-pointer"
                      onClick={() => removeTag(tag, 'form')}
                    >
                      {tag} ×
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {extractedTags.length > 0 && (
              <div className="space-y-2">
                <Label>Extracted Tags</Label>
                <div className="flex flex-wrap gap-1">
                  {extractedTags.map(tag => (
                    <Badge 
                      key={`extracted-${tag}`} 
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => removeTag(tag, 'extracted')}
                    >
                      {tag} ×
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-slate-500">These tags were automatically extracted from the URL</p>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="relevanceScore">Relevance Score</Label>
              <div className="flex items-center gap-2">
                <Input 
                  id="relevanceScore" 
                  type="number"
                  min="0"
                  max="1"
                  step="0.1"
                  value={formState.relevanceScore}
                  onChange={(e) => setFormState({...formState, relevanceScore: parseFloat(e.target.value)})}
                  className="w-20"
                />
                <span className="text-sm text-slate-500">
                  {formState.relevanceScore <= 0.3 ? "Low" : 
                   formState.relevanceScore <= 0.7 ? "Medium" : "High"} relevance
                </span>
              </div>
              <p className="text-xs text-slate-500">Manually set the relevance of this resource (0.0-1.0)</p>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddResource}>
            Add Resource
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
