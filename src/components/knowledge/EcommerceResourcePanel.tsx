import React, { useState, useEffect } from "react";
import { useContext } from "react";
import { ChatContext } from "@/contexts";
import { KnowledgeResource } from "@/contexts/types";
import useEcommerceKnowledge from "@/hooks/useEcommerceKnowledge";
import { findEcommerceResources, groupByMarketSegment } from "@/utils/knowledgeRelevance";
import { StagedResourceRecommendations } from "./StagedResourceRecommendations";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

export function EcommerceResourcePanel() {
  const { knowledgeBase, addKnowledgeResource } = useContext(ChatContext);
  const { 
    getEcommerceCategories, 
    getProductRecommendations,
    getRelatedProducts,
    populateWithSamples 
  } = useEcommerceKnowledge();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedResource, setSelectedResource] = useState<KnowledgeResource | null>(null);
  const [relatedResources, setRelatedResources] = useState<KnowledgeResource[]>([]);
  const [activeTab, setActiveTab] = useState("categories");
  const [docTemplate, setDocTemplate] = useState<string | null>(null);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [hasPopulatedSamples, setHasPopulatedSamples] = useState(false);

  // Get all resources from knowledge base
  const allResources = Object.values(knowledgeBase).flat().filter(Boolean);
  
  // Filter e-commerce resources
  const ecommerceResources = findEcommerceResources(allResources);
  
  // Get e-commerce categories with resources
  const ecommerceCategories = getEcommerceCategories();
  
  // Group resources by market segment
  const resourcesBySegment = groupByMarketSegment(ecommerceResources);
  
  // Filter resources based on search term
  const filteredResources = searchTerm
    ? ecommerceResources.filter(resource => 
        resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (resource.description || "").toLowerCase().includes(searchTerm.toLowerCase())
      )
    : ecommerceResources;
  
  // Populate with sample resources if knowledge base is empty
  useEffect(() => {
    if (!hasPopulatedSamples && ecommerceResources.length === 0) {
      populateWithSamples();
      setHasPopulatedSamples(true);
    }
  }, [ecommerceResources.length, hasPopulatedSamples, populateWithSamples]);
  
  // Update related resources when a resource is selected
  useEffect(() => {
    if (selectedResource) {
      const related = getRelatedProducts(selectedResource.id);
      setRelatedResources(related);
    } else {
      setRelatedResources([]);
    }
  }, [selectedResource, getRelatedProducts]);

  // Handle resource selection
  const handleResourceSelect = (resource: KnowledgeResource) => {
    setSelectedResource(resource);
  };
  
  // Handle opening a resource URL
  const handleOpenResource = (url?: string) => {
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  };
  
  // Handle usage tracking for resources
  const handleResourceUsed = (resource: KnowledgeResource) => {
    // Update the resource in the knowledge base with new access stats
    addKnowledgeResource(resource.category || 'Other', {
      ...resource,
      accessCount: (resource.accessCount || 0) + 1,
      lastAccessed: new Date().toISOString()
    });
  };
  
  // Handle generating documentation templates
  const handleGenerateDoc = (template: string) => {
    setDocTemplate(template);
    setShowTemplateDialog(true);
  };

  // Resource card component
  const ResourceCard = ({ resource }: { resource: KnowledgeResource }) => (
    <Card 
      className={`mb-3 cursor-pointer ${selectedResource?.id === resource.id ? 'border-primary' : ''}`}
      onClick={() => handleResourceSelect(resource)}
    >
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base truncate">{resource.title}</CardTitle>
          {resource.productRelated && (
            <Badge variant="outline" className="ml-2">Product</Badge>
          )}
        </div>
        {resource.category && (
          <Badge variant="secondary" className="mt-1">{resource.category}</Badge>
        )}
      </CardHeader>
      <CardContent className="p-4 pt-2">
        {resource.description && (
          <CardDescription className="line-clamp-2 text-sm">
            {resource.description}
          </CardDescription>
        )}
        <div className="flex flex-wrap gap-1 mt-2">
          {resource.pricePoint && (
            <Badge variant="outline" className="text-xs">
              {resource.pricePoint}
            </Badge>
          )}
          {resource.marketSegment && (
            <Badge variant="outline" className="text-xs">
              {resource.marketSegment}
            </Badge>
          )}
          {resource.catalogType && (
            <Badge variant="outline" className="text-xs">
              {resource.catalogType}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <Tabs defaultValue="browse" className="w-full">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="browse" className="flex-1">
            Browse Resources
          </TabsTrigger>
          <TabsTrigger value="stages" className="flex-1">
            Development Stages
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="browse">
          <Card>
            <CardHeader>
              <CardTitle>E-commerce Knowledge Base</CardTitle>
              <CardDescription>
                Specialized resources for e-commerce development
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <div className="mb-4">
                <Label htmlFor="search">Search Resources</Label>
                <Input
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search e-commerce resources..."
                  className="mt-1"
                />
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full">
                  <TabsTrigger value="categories" className="flex-1">
                    Categories
                  </TabsTrigger>
                  <TabsTrigger value="market" className="flex-1">
                    Market Segments
                  </TabsTrigger>
                  <TabsTrigger value="all" className="flex-1">
                    All Resources
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="categories" className="mt-4">
                  <Accordion type="single" collapsible className="w-full">
                    {ecommerceCategories.map((category) => (
                      <AccordionItem key={category} value={category}>
                        <AccordionTrigger>{category}</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3">
                            {knowledgeBase[category]?.map((resource) => (
                              <ResourceCard key={resource.id} resource={resource} />
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </TabsContent>

                <TabsContent value="market" className="mt-4">
                  <Accordion type="single" collapsible className="w-full">
                    {Object.keys(resourcesBySegment).map((segment) => (
                      <AccordionItem key={segment} value={segment}>
                        <AccordionTrigger>{segment}</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3">
                            {resourcesBySegment[segment].map((resource) => (
                              <ResourceCard key={resource.id} resource={resource} />
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </TabsContent>

                <TabsContent value="all" className="mt-4">
                  <div className="grid grid-cols-1 gap-4">
                    {filteredResources.map((resource) => (
                      <ResourceCard key={resource.id} resource={resource} />
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="stages">
          <StagedResourceRecommendations 
            onOpenResource={handleOpenResource}
            onResourceUsed={handleResourceUsed}
            onGenerateDoc={handleGenerateDoc}
          />
        </TabsContent>
      </Tabs>
    
      {selectedResource && (
        <Card>
          <CardHeader>
            <div className="flex justify-between">
              <CardTitle>{selectedResource.title}</CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSelectedResource(null)}
              >
                Close
              </Button>
            </div>
            {selectedResource.category && (
              <Badge variant="secondary">{selectedResource.category}</Badge>
            )}
          </CardHeader>
          <CardContent>
            {/* Resource details */}
            {selectedResource.description && (
              <div className="mb-4">
                <h4 className="font-medium mb-1">Description</h4>
                <p className="text-sm">{selectedResource.description}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 mb-4">
              {selectedResource.pricePoint && (
                <div>
                  <h4 className="font-medium text-sm">Price Point</h4>
                  <p className="text-sm">{selectedResource.pricePoint}</p>
                </div>
              )}
              {selectedResource.marketSegment && (
                <div>
                  <h4 className="font-medium text-sm">Market Segment</h4>
                  <p className="text-sm">{selectedResource.marketSegment}</p>
                </div>
              )}
              {selectedResource.catalogType && (
                <div>
                  <h4 className="font-medium text-sm">Catalog Type</h4>
                  <p className="text-sm">{selectedResource.catalogType}</p>
                </div>
              )}
              {selectedResource.paymentGateway && (
                <div>
                  <h4 className="font-medium text-sm">Payment Gateway</h4>
                  <p className="text-sm">{selectedResource.paymentGateway}</p>
                </div>
              )}
            </div>

            {selectedResource.tags && selectedResource.tags.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium mb-1">Tags</h4>
                <div className="flex flex-wrap gap-1">
                  {selectedResource.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {selectedResource.url && (
              <div className="mb-4">
                <h4 className="font-medium mb-1">Reference</h4>
                <a
                  href={selectedResource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  {selectedResource.url}
                </a>
              </div>
            )}

            <Separator className="my-4" />

            {/* Related resources */}
            <div>
              <h4 className="font-medium mb-2">Related Resources</h4>
              {relatedResources.length > 0 ? (
                <div className="space-y-3">
                  {relatedResources.map((resource) => (
                    <ResourceCard key={resource.id} resource={resource} />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No related resources found.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Documentation Template Dialog */}
      <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Generated Documentation Template</DialogTitle>
            <DialogDescription>
              Use this template as a starting point for your component or API documentation
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[500px] w-full rounded-md border p-4 bg-slate-50">
            <pre className="whitespace-pre-wrap font-mono text-sm">{docTemplate}</pre>
          </ScrollArea>
          <CardFooter className="justify-between">
            <Button
              variant="outline"
              onClick={() => setShowTemplateDialog(false)}
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
          </CardFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default EcommerceResourcePanel;