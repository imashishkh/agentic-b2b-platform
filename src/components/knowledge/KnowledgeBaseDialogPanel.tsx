
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileUploadButton } from "@/components/chat-input/FileUploadButton";
import { useChat } from "@/contexts/ChatContext";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { extractContentFromUrl } from "@/utils/resourceExtractor";
import { Icons } from "@/components/ui/icons";
import { Link } from "lucide-react";

interface KnowledgeBaseDialogPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function KnowledgeBaseDialogPanel({ open, onOpenChange }: KnowledgeBaseDialogPanelProps) {
  const [activeTab, setActiveTab] = useState("ui-components");
  const [isProcessing, setIsProcessing] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const { addKnowledgeResource } = useChat();

  const handleFileUpload = (files: File[], category: string) => {
    if (files.length === 0) return;
    
    setIsProcessing(true);
    
    try {
      // Process and add each file to knowledge base
      files.forEach(file => {
        const resource = {
          id: uuidv4(),
          title: file.name,
          description: `${category} resource: ${file.name}`,
          category: category,
          type: file.type,
          dateAdded: new Date().toISOString(),
          url: URL.createObjectURL(file),
          tags: [category.toLowerCase(), file.type.split('/')[0], 'resource'],
          source: 'upload',
          content: `Content of ${file.name}` // Placeholder for file content
        };
        
        addKnowledgeResource(category, resource);
      });
      
      toast.success(`Added ${files.length} ${category} resource(s) to knowledge base`);
    } catch (error) {
      console.error("Error adding files to knowledge base:", error);
      toast.error("Failed to add files to knowledge base");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddUrl = async (category: string) => {
    if (!urlInput.trim()) {
      toast.error("Please enter a valid URL");
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const url = urlInput.trim();
      // Add URL validation if needed
      if (!url.startsWith('http')) {
        toast.error("Please enter a valid URL starting with http:// or https://");
        setIsProcessing(false);
        return;
      }
      
      const resourceInfo = await extractContentFromUrl(url);
      
      const resource = {
        id: uuidv4(),
        title: resourceInfo.title || url,
        description: resourceInfo.description || `${category} resource from ${url}`,
        category: category,
        type: 'url',
        dateAdded: new Date().toISOString(),
        url: url,
        tags: resourceInfo.tags || [category.toLowerCase(), 'url'],
        source: 'url',
        content: resourceInfo.content || url
      };
      
      addKnowledgeResource(category, resource);
      toast.success(`Added ${category} resource from ${url}`);
      setUrlInput("");
    } catch (error) {
      console.error("Error adding URL to knowledge base:", error);
      toast.error("Failed to add URL to knowledge base");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Knowledge Base</DialogTitle>
          <DialogDescription>
            Add resources to help the AI understand your project better.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="ui-components" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="ui-components">UI Components</TabsTrigger>
            <TabsTrigger value="tech-stack">Tech Stack</TabsTrigger>
            <TabsTrigger value="documentation">Documentation</TabsTrigger>
            <TabsTrigger value="links">External Links</TabsTrigger>
          </TabsList>
          
          {/* UI Components Tab */}
          <TabsContent value="ui-components" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>UI Components</CardTitle>
                <CardDescription>Add UI design files, mockups, and images</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Upload files</h4>
                  <FileUploadButton
                    onChange={(files) => handleFileUpload(files, "UI Components")}
                    markdownOnly={false}
                    wizardContext="ui-components"
                    disabled={isProcessing}
                    buttonText="Upload UI Files"
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500">
                    Supported formats: Images, Sketch, Figma, XD, PDF, PSD, AI, ZIP
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Add URL to UI resources</h4>
                  <div className="flex gap-2">
                    <Input
                      placeholder="https://example.com/ui-designs"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      disabled={isProcessing}
                    />
                    <Button 
                      size="sm" 
                      onClick={() => handleAddUrl("UI Components")}
                      disabled={isProcessing || !urlInput.trim()}
                    >
                      {isProcessing ? 
                        <Icons.spinner className="h-4 w-4 animate-spin" /> : 
                        <Link className="h-4 w-4 mr-2" />}
                      Add
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Tech Stack Tab */}
          <TabsContent value="tech-stack" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Tech Stack</CardTitle>
                <CardDescription>Add technology documentation and resources</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Upload tech documentation</h4>
                  <FileUploadButton
                    onChange={(files) => handleFileUpload(files, "Tech Stack")}
                    markdownOnly={false}
                    wizardContext="tech-stack"
                    disabled={isProcessing}
                    buttonText="Upload Tech Docs"
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500">
                    Supported formats: JSON, Markdown, TXT, YAML, Text files
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Add URL to tech documentation</h4>
                  <div className="flex gap-2">
                    <Input
                      placeholder="https://reactjs.org/docs"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      disabled={isProcessing}
                    />
                    <Button 
                      size="sm" 
                      onClick={() => handleAddUrl("Tech Stack")}
                      disabled={isProcessing || !urlInput.trim()}
                    >
                      {isProcessing ? 
                        <Icons.spinner className="h-4 w-4 animate-spin" /> : 
                        <Link className="h-4 w-4 mr-2" />}
                      Add
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Documentation Tab */}
          <TabsContent value="documentation" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Documentation</CardTitle>
                <CardDescription>Add project documentation and specifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Upload documentation</h4>
                  <FileUploadButton
                    onChange={(files) => handleFileUpload(files, "Documentation")}
                    markdownOnly={false}
                    wizardContext="documentation"
                    disabled={isProcessing}
                    buttonText="Upload Documentation"
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500">
                    Supported formats: Any file type
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Add URL to documentation</h4>
                  <div className="flex gap-2">
                    <Input
                      placeholder="https://example.com/docs"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      disabled={isProcessing}
                    />
                    <Button 
                      size="sm" 
                      onClick={() => handleAddUrl("Documentation")}
                      disabled={isProcessing || !urlInput.trim()}
                    >
                      {isProcessing ? 
                        <Icons.spinner className="h-4 w-4 animate-spin" /> : 
                        <Link className="h-4 w-4 mr-2" />}
                      Add
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* External Links Tab */}
          <TabsContent value="links" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>External Links</CardTitle>
                <CardDescription>Add links to relevant external resources</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Add URL to external resource</h4>
                  <div className="flex gap-2">
                    <Input
                      placeholder="https://example.com/resource"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      disabled={isProcessing}
                    />
                    <Button 
                      size="sm" 
                      onClick={() => handleAddUrl("External Links")}
                      disabled={isProcessing || !urlInput.trim()}
                    >
                      {isProcessing ? 
                        <Icons.spinner className="h-4 w-4 animate-spin" /> : 
                        <Link className="h-4 w-4 mr-2" />}
                      Add
                    </Button>
                  </div>
                </div>
                
                <div className="text-sm space-y-2 mt-4">
                  <h4 className="font-medium">Quick links:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="justify-start"
                      onClick={() => {
                        setUrlInput("https://react.dev/reference/react");
                      }}
                    >
                      React Documentation
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="justify-start" 
                      onClick={() => {
                        setUrlInput("https://tailwindcss.com/docs");
                      }}
                    >
                      Tailwind CSS Docs
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="justify-start" 
                      onClick={() => {
                        setUrlInput("https://ui.shadcn.com/docs");
                      }}
                    >
                      Shadcn UI Components
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="justify-start" 
                      onClick={() => {
                        setUrlInput("https://www.typescriptlang.org/docs/");
                      }}
                    >
                      TypeScript Docs
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
