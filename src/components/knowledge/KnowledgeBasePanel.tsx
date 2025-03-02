
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useChat } from '@/contexts/ChatContext';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileUploadButton } from '@/components/chat-input/FileUploadButton';
import { PlusCircle, Link as LinkIcon, File, Folder, Image, Database } from 'lucide-react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { KnowledgeResource } from '@/contexts/types';
import { extractContentFromUrl } from '@/utils/resourceExtractor';

const resourceCategories = [
  { id: 'documentation', label: 'Documentation', icon: <File className="h-4 w-4" /> },
  { id: 'ui-components', label: 'UI Components', icon: <Image className="h-4 w-4" /> },
  { id: 'references', label: 'References', icon: <LinkIcon className="h-4 w-4" /> },
  { id: 'resources', label: 'Resources', icon: <Folder className="h-4 w-4" /> },
  { id: 'data-models', label: 'Data Models', icon: <Database className="h-4 w-4" /> }
];

const KnowledgeBasePanel = () => {
  const { 
    knowledgeBase, 
    addKnowledgeResource, 
    removeKnowledgeResource 
  } = useChat();
  
  const [url, setUrl] = useState<string>('');
  const [files, setFiles] = useState<File[]>([]);
  const [category, setCategory] = useState<string>('documentation');
  const [isAddingResource, setIsAddingResource] = useState<boolean>(false);
  
  // Handle adding a URL resource
  const handleAddUrl = async () => {
    if (!url || !url.trim()) {
      toast.error('Please enter a valid URL');
      return;
    }
    
    try {
      setIsAddingResource(true);
      
      const resourceInfo = await extractContentFromUrl(url);
      
      const newResource: KnowledgeResource = {
        id: uuidv4(),
        title: resourceInfo.title || url,
        description: resourceInfo.description || `Resource from ${url}`,
        content: resourceInfo.content || '',
        category,
        url,
        dateAdded: new Date().toISOString(),
        tags: resourceInfo.tags || [category.toLowerCase(), 'url'],
        source: 'url',
        type: 'link'
      };
      
      addKnowledgeResource(category, newResource);
      toast.success(`Added resource: ${newResource.title}`);
      setUrl('');
      setIsAddingResource(false);
    } catch (error) {
      console.error('Error adding URL resource:', error);
      toast.error('Failed to add resource. Please check the URL and try again.');
      setIsAddingResource(false);
    }
  };
  
  // Handle file uploads for knowledge base
  const handleFileChange = (selectedFiles: File[]) => {
    if (selectedFiles.length > 0) {
      setFiles(selectedFiles);
    }
  };
  
  // Add files to knowledge base
  const handleAddFiles = () => {
    if (files.length === 0) {
      toast.error('Please select files to add');
      return;
    }
    
    try {
      setIsAddingResource(true);
      
      files.forEach(file => {
        const newResource: KnowledgeResource = {
          id: uuidv4(),
          title: file.name,
          description: `${category} file: ${file.name}`,
          content: `Content of ${file.name}`, // Placeholder
          category,
          url: URL.createObjectURL(file),
          dateAdded: new Date().toISOString(),
          tags: [category.toLowerCase(), file.type.split('/')[0], 'file'],
          source: 'upload',
          type: file.type
        };
        
        addKnowledgeResource(category, newResource);
      });
      
      toast.success(`Added ${files.length} files to knowledge base`);
      setFiles([]);
      setIsAddingResource(false);
    } catch (error) {
      console.error('Error adding file resources:', error);
      toast.error('Failed to add files. Please try again.');
      setIsAddingResource(false);
    }
  };
  
  // Get resources for the current category
  const getCategoryResources = (categoryName: string) => {
    return knowledgeBase[categoryName] || [];
  };
  
  // Remove a resource
  const handleRemoveResource = (categoryName: string, resourceId: string) => {
    removeKnowledgeResource(categoryName, resourceId);
    toast.success('Resource removed');
  };
  
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Knowledge Base</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" className="flex items-center gap-1">
              <PlusCircle className="h-4 w-4" />
              Add Resource
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Knowledge Resource</DialogTitle>
              <DialogDescription>
                Add documentation, references, or resources to help the AI understand your project better.
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="url">
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="url">URL / Link</TabsTrigger>
                <TabsTrigger value="files">Upload Files</TabsTrigger>
              </TabsList>
              
              <TabsContent value="url" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="resource-url">Resource URL</Label>
                  <Input 
                    id="resource-url" 
                    placeholder="https://example.com/documentation" 
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="resource-category">Category</Label>
                  <select 
                    id="resource-category"
                    className="w-full p-2 border rounded"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {resourceCategories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.label}</option>
                    ))}
                  </select>
                </div>
              </TabsContent>
              
              <TabsContent value="files" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Upload Files</Label>
                  <div className="flex items-center gap-2">
                    <FileUploadButton 
                      onChange={handleFileChange}
                      markdownOnly={false}
                      wizardContext="knowledge-base"
                    />
                    <span className="text-sm text-gray-600">
                      {files.length === 0 ? 'No files selected' : `${files.length} files selected`}
                    </span>
                  </div>
                  {files.length > 0 && (
                    <ul className="text-sm text-gray-600 pl-6 list-disc">
                      {files.map((file, index) => (
                        <li key={index}>{file.name}</li>
                      ))}
                    </ul>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="file-category">Category</Label>
                  <select 
                    id="file-category"
                    className="w-full p-2 border rounded"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {resourceCategories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.label}</option>
                    ))}
                  </select>
                </div>
              </TabsContent>
            </Tabs>
            
            <DialogFooter>
              <Button 
                onClick={
                  url ? handleAddUrl : handleAddFiles
                }
                disabled={isAddingResource || (url === '' && files.length === 0)}
              >
                {isAddingResource ? 'Adding...' : 'Add to Knowledge Base'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Tabs defaultValue="all">
        <TabsList className="w-full flex overflow-x-auto">
          <TabsTrigger value="all">All</TabsTrigger>
          {resourceCategories.map(cat => (
            <TabsTrigger key={cat.id} value={cat.id} className="flex items-center gap-1">
              {cat.icon}
              {cat.label}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value="all" className="mt-4">
          {Object.keys(knowledgeBase).length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Database className="h-12 w-12 mx-auto mb-2 opacity-20" />
              <p>No resources added yet. Add documentation, UI components, or other resources to help the AI understand your project.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(knowledgeBase).map(([categoryName, resources]) => (
                <div key={categoryName}>
                  <h3 className="font-medium mb-2">{categoryName}</h3>
                  <ul className="space-y-2">
                    {resources.map((resource: KnowledgeResource) => (
                      <li key={resource.id} className="border rounded p-3 flex justify-between items-start">
                        <div>
                          <div className="font-medium">{resource.title}</div>
                          <div className="text-sm text-gray-600">{resource.description}</div>
                          <div className="flex gap-1 mt-1">
                            {resource.tags?.map((tag, i) => (
                              <span key={i} className="text-xs bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleRemoveResource(categoryName, resource.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          Remove
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
        
        {resourceCategories.map(cat => (
          <TabsContent key={cat.id} value={cat.id} className="mt-4">
            {getCategoryResources(cat.id).length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="mx-auto mb-2 opacity-20">{cat.icon}</div>
                <p>No {cat.label.toLowerCase()} added yet.</p>
              </div>
            ) : (
              <ul className="space-y-2">
                {getCategoryResources(cat.id).map((resource: KnowledgeResource) => (
                  <li key={resource.id} className="border rounded p-3 flex justify-between items-start">
                    <div>
                      <div className="font-medium">{resource.title}</div>
                      <div className="text-sm text-gray-600">{resource.description}</div>
                      <div className="flex gap-1 mt-1">
                        {resource.tags?.map((tag, i) => (
                          <span key={i} className="text-xs bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleRemoveResource(cat.id, resource.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      Remove
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default KnowledgeBasePanel;
