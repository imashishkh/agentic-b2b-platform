
import React, { useState, useEffect, useContext } from 'react';
import { ChatContext } from '@/contexts';
import { EcommerceResourcePanel } from '@/components/knowledge/EcommerceResourcePanel';
import { EnhancedKnowledgeBase } from '@/components/knowledge/EnhancedKnowledgeBase';
import { StagedResourceRecommendations } from '@/components/knowledge/StagedResourceRecommendations';
import { ResourceRecommendations } from '@/components/knowledge/ResourceRecommendations';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { findEcommerceResources } from '@/utils/knowledgeRelevance';
import useEcommerceKnowledge from '@/hooks/useEcommerceKnowledge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Book, BookOpen, ExternalLink, Lightbulb } from 'lucide-react';

export function KnowledgeBasePanel() {
  const { knowledgeBase } = useContext(ChatContext);
  const { 
    addEcommerceResource, 
    populateWithSamples,
    generateComponentDoc,
    generateApiDoc
  } = useEcommerceKnowledge();
  
  const [activeTab, setActiveTab] = useState("general");
  const [activeSubTab, setActiveSubTab] = useState("browse");
  const [showDocDialog, setShowDocDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [docType, setDocType] = useState<'component' | 'api'>('component');
  const [docTemplate, setDocTemplate] = useState<string | null>(null);
  const [contextQuery, setContextQuery] = useState<string>("");
  
  // Form state for adding a new resource
  const [newResource, setNewResource] = useState({
    title: '',
    description: '',
    url: '',
    category: 'Product Catalog',
    tags: ''
  });
  
  // All resources from knowledge base
  const allResources = Object.values(knowledgeBase).flat().filter(Boolean);
  
  // Populate sample resources
  const handlePopulateSamples = () => {
    populateWithSamples();
  };
  
  // Generate a documentation template
  const handleGenerateDoc = (type: 'component' | 'api', name: string) => {
    let template = '';
    
    if (type === 'component') {
      template = generateComponentDoc(
        name, 
        'product', 
        `A reusable e-commerce component for ${name}.`
      );
    } else {
      template = generateApiDoc(`${name} API`);
    }
    
    setDocTemplate(template);
    setDocType(type);
    setShowDocDialog(true);
  };
  
  // Handle form submission for new resource
  const handleAddResource = () => {
    // Basic validation
    if (!newResource.title || !newResource.category) {
      return;
    }
    
    // Create resource object
    const resource = {
      title: newResource.title,
      description: newResource.description,
      url: newResource.url,
      category: newResource.category,
      tags: newResource.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      content: newResource.description
    };
    
    // Add to knowledge base
    addEcommerceResource(resource);
    
    // Reset form
    setNewResource({
      title: '',
      description: '',
      url: '',
      category: 'Product Catalog',
      tags: ''
    });
    
    // Close dialog
    setShowAddDialog(false);
  };
  
  // Handle opening a resource URL
  const handleOpenResource = (url?: string) => {
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  };
  
  // Update context query for recommendations
  useEffect(() => {
    const updateContextInterval = setInterval(() => {
      // Simulate a changing context based on what user might be working on
      const contexts = [
        "product catalog implementation",
        "payment gateway integration",
        "shopping cart optimization",
        "checkout flow design",
        "order fulfillment process",
        "customer experience enhancement"
      ];
      
      setContextQuery(contexts[Math.floor(Math.random() * contexts.length)]);
    }, 30000); // Update every 30 seconds
    
    return () => clearInterval(updateContextInterval);
  }, []);

  return (
    <div className="p-4">
      <Card className="mb-4">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Knowledge Hub</CardTitle>
              <CardDescription>
                Access and manage resources for your e-commerce project
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowAddDialog(true)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Resource
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handlePopulateSamples}
              >
                <Book className="h-4 w-4 mr-1" />
                Add Samples
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4 w-full">
              <TabsTrigger value="general" className="flex-1">
                General Resources
              </TabsTrigger>
              <TabsTrigger value="ecommerce" className="flex-1">
                E-commerce Resources
              </TabsTrigger>
              <TabsTrigger value="templates" className="flex-1">
                Templates & Docs
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="general">
              <EnhancedKnowledgeBase />
            </TabsContent>
            
            <TabsContent value="ecommerce">
              <EcommerceResourcePanel />
            </TabsContent>
            
            <TabsContent value="templates">
              <Card>
                <CardHeader>
                  <CardTitle>Documentation Templates</CardTitle>
                  <CardDescription>
                    Generate documentation templates for components and APIs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeSubTab} onValueChange={setActiveSubTab}>
                    <TabsList className="mb-4 w-full">
                      <TabsTrigger value="browse" className="flex-1">
                        Component Templates
                      </TabsTrigger>
                      <TabsTrigger value="api" className="flex-1">
                        API Templates
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="browse">
                      <div className="grid grid-cols-2 gap-4">
                        {['ProductCard', 'ShoppingCart', 'CheckoutForm', 'PaymentProcessor'].map(component => (
                          <Card key={component} className="cursor-pointer hover:bg-slate-50">
                            <CardHeader className="p-4">
                              <CardTitle className="text-base">{component}</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                              <p className="text-sm text-slate-500">
                                Documentation template for {component} component
                              </p>
                            </CardContent>
                            <CardFooter className="p-4 pt-0">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleGenerateDoc('component', component)}
                              >
                                <BookOpen className="h-4 w-4 mr-1" />
                                Generate Docs
                              </Button>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="api">
                      <div className="grid grid-cols-2 gap-4">
                        {['Product', 'Cart', 'Checkout', 'Payment', 'Shipping'].map(api => (
                          <Card key={api} className="cursor-pointer hover:bg-slate-50">
                            <CardHeader className="p-4">
                              <CardTitle className="text-base">{api} API</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                              <p className="text-sm text-slate-500">
                                Documentation template for {api} API endpoints
                              </p>
                            </CardContent>
                            <CardFooter className="p-4 pt-0">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleGenerateDoc('api', api)}
                              >
                                <BookOpen className="h-4 w-4 mr-1" />
                                Generate API Docs
                              </Button>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Context-aware recommendations */}
      {contextQuery && (
        <div className="mb-4">
          <ResourceRecommendations 
            knowledgeBase={allResources}
            contextQuery={contextQuery}
            onOpenResource={handleOpenResource}
          />
        </div>
      )}
      
      {/* Documentation Template Dialog */}
      <Dialog open={showDocDialog} onOpenChange={setShowDocDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {docType === 'component' ? 'Component Documentation Template' : 'API Documentation Template'}
            </DialogTitle>
            <DialogDescription>
              Use this template as a starting point for your documentation
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[500px] w-full rounded-md border p-4 bg-slate-50">
            <pre className="whitespace-pre-wrap font-mono text-sm">{docTemplate}</pre>
          </ScrollArea>
          <DialogFooter className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={() => setShowDocDialog(false)}
            >
              Close
            </Button>
            <Button
              onClick={() => {
                if (docTemplate) {
                  navigator.clipboard.writeText(docTemplate);
                }
              }}
            >
              Copy to Clipboard
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add Resource Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Resource</DialogTitle>
            <DialogDescription>
              Add a new resource to the knowledge base
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={newResource.title}
                onChange={(e) => setNewResource({...newResource, title: e.target.value})}
                placeholder="Resource title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newResource.description}
                onChange={(e) => setNewResource({...newResource, description: e.target.value})}
                placeholder="Brief description"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                value={newResource.url}
                onChange={(e) => setNewResource({...newResource, url: e.target.value})}
                placeholder="https://example.com/resource"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                value={newResource.category}
                onChange={(e) => setNewResource({...newResource, category: e.target.value})}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              >
                <option value="Product Catalog">Product Catalog</option>
                <option value="Payment Solutions">Payment Solutions</option>
                <option value="Order Management">Order Management</option>
                <option value="Customer Experience">Customer Experience</option>
                <option value="Logistics & Fulfillment">Logistics & Fulfillment</option>
                <option value="Security & Compliance">Security & Compliance</option>
                <option value="Design Patterns">Design Patterns</option>
                <option value="Analytics & Reporting">Analytics & Reporting</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input
                id="tags"
                value={newResource.tags}
                onChange={(e) => setNewResource({...newResource, tags: e.target.value})}
                placeholder="tag1, tag2, tag3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddResource}>
              Add Resource
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
