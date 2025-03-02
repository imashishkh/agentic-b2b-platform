import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { CodeEditor } from "@/components/CodeEditor";
import { getAllTemplates, getTemplatesByCategory, ComponentTemplate } from "./EcommerceTemplates";
import { githubService } from "@/services/GitHubService";
import { toast } from "sonner";

interface TemplateLibraryProps {
  repoOwner?: string;
  repoName?: string;
}

export function TemplateLibrary({ repoOwner, repoName }: TemplateLibraryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedTemplate, setSelectedTemplate] = useState<ComponentTemplate | null>(null);
  const [detailsOpen, setDetailsOpen] = useState<boolean>(false);
  const [customFileName, setCustomFileName] = useState<string>("");
  
  const templates = selectedCategory === "all" 
    ? getAllTemplates() 
    : getTemplatesByCategory(selectedCategory);
  
  const handleViewTemplate = (template: ComponentTemplate) => {
    setSelectedTemplate(template);
    setDetailsOpen(true);
    
    // Generate default file name based on template
    const fileExtension = template.language.includes('typescript') ? '.tsx' : '.jsx';
    setCustomFileName(`src/components/${template.category}/${template.name.replace(/\s+/g, '')}.tsx`);
  };
  
  const handleSaveToGitHub = async () => {
    if (!selectedTemplate) return;
    
    if (!repoOwner || !repoName) {
      toast.error("No repository selected. Please select a repository first.");
      return;
    }
    
    try {
      const filePath = customFileName;
      const commitMessage = `Add ${selectedTemplate.name} component`;
      
      await githubService.addGeneratedCode(
        repoOwner,
        repoName,
        filePath,
        selectedTemplate.code,
        commitMessage
      );
      
      toast.success(`Template saved to ${repoOwner}/${repoName}/${filePath}`);
      setDetailsOpen(false);
    } catch (error) {
      console.error("Failed to save template to GitHub:", error);
      toast.error("Failed to save template to GitHub");
    }
  };
  
  const handleCloseDetails = () => {
    setDetailsOpen(false);
    setSelectedTemplate(null);
  };
  
  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };
  
  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>E-commerce Component Templates</CardTitle>
          <CardDescription>
            Ready-to-use components for building e-commerce applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="mb-6">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="product">Product</TabsTrigger>
              <TabsTrigger value="cart">Cart</TabsTrigger>
              <TabsTrigger value="checkout">Checkout</TabsTrigger>
            </TabsList>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {templates.map((template) => (
                <Card key={template.id} className="overflow-hidden">
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {template.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">{template.language}</Badge>
                      <Badge className={getComplexityColor(template.complexity)}>
                        {template.complexity} complexity
                      </Badge>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end p-4 pt-0">
                    <Button variant="outline" onClick={() => handleViewTemplate(template)}>
                      View Template
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Template Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedTemplate?.name}</DialogTitle>
            <DialogDescription>
              {selectedTemplate?.description}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">File Path</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={customFileName}
                  onChange={(e) => setCustomFileName(e.target.value)}
                  placeholder="e.g., src/components/ProductCard.tsx"
                />
              </div>
            </div>
            
            {selectedTemplate && (
              <CodeEditor
                code={selectedTemplate.code}
                language={selectedTemplate.language}
                fileName={customFileName}
              />
            )}
          </div>
          
          <DialogFooter className="sm:justify-between">
            <Button variant="outline" onClick={handleCloseDetails}>
              Cancel
            </Button>
            {repoOwner && repoName ? (
              <Button onClick={handleSaveToGitHub}>
                Save to GitHub
              </Button>
            ) : (
              <Button disabled>
                Select Repository First
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}