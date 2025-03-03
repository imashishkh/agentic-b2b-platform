import React, { useState, useEffect } from 'react';
import { KnowledgeResource } from "@/contexts/types";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bookmark, ExternalLink, Code, FileCode, LayoutTemplate, CheckCircle, CircleDot, Zap, Download } from "lucide-react";
import { trackResourceUsage } from "@/utils/knowledgeRelevance";
import useEcommerceKnowledge from "@/hooks/useEcommerceKnowledge";

interface StagedResourceRecommendationsProps {
  onOpenResource: (url: string) => void;
  onResourceUsed?: (resource: KnowledgeResource) => void;
  onGenerateDoc?: (template: string) => void;
}

const developmentStages = [
  { id: "planning", name: "Planning", icon: <LayoutTemplate className="h-4 w-4" /> },
  { id: "design", name: "Design", icon: <FileCode className="h-4 w-4" /> },
  { id: "development", name: "Development", icon: <Code className="h-4 w-4" /> },
  { id: "testing", name: "Testing", icon: <CheckCircle className="h-4 w-4" /> },
  { id: "deployment", name: "Deployment", icon: <CircleDot className="h-4 w-4" /> },
  { id: "maintenance", name: "Maintenance", icon: <Zap className="h-4 w-4" /> }
];

export const StagedResourceRecommendations: React.FC<StagedResourceRecommendationsProps> = ({
  onOpenResource,
  onResourceUsed,
  onGenerateDoc
}) => {
  const [selectedArea, setSelectedArea] = useState<string>("product");
  const [showDocOptions, setShowDocOptions] = useState<boolean>(false);
  
  const {
    currentStage,
    setCurrentStage,
    getResourcesForStage,
    stageRecommendations,
    getBestPractices,
    bestPractices,
    generateComponentDoc,
    generateApiDoc
  } = useEcommerceKnowledge();
  
  // Load initial resources for the current stage
  useEffect(() => {
    getResourcesForStage(currentStage);
    getBestPractices(selectedArea);
  }, []);
  
  // Get the icon for the resource category
  const getCategoryIcon = (category: string | undefined) => {
    if (!category) return <Bookmark className="h-4 w-4" />;
    
    switch (category) {
      case 'Product Catalog':
        return <Bookmark className="h-4 w-4" />;
      case 'Payment Solutions':
        return <Zap className="h-4 w-4" />;
      case 'Order Management':
      case 'Logistics & Fulfillment':
        return <Download className="h-4 w-4" />;
      case 'Security & Compliance':
        return <CheckCircle className="h-4 w-4" />;
      case 'Design Patterns':
        return <LayoutTemplate className="h-4 w-4" />;
      case 'Analytics & Reporting':
        return <CircleDot className="h-4 w-4" />;
      default:
        return <Bookmark className="h-4 w-4" />;
    }
  };
  
  const handleResourceUsed = (resource: KnowledgeResource) => {
    const updatedResource = trackResourceUsage(resource);
    if (onResourceUsed) {
      onResourceUsed(updatedResource);
    }
  };
  
  const handleGenerateDoc = (type: string) => {
    let template = '';
    
    if (type === 'component') {
      const componentTypes = {
        product: "ProductCard",
        cart: "ShoppingCart", 
        checkout: "CheckoutForm",
        payment: "PaymentProcessor"
      };
      
      const componentName = `E${componentTypes[selectedArea as keyof typeof componentTypes] || 'CommerceComponent'}`;
      template = generateComponentDoc(componentName, selectedArea, `A reusable ${selectedArea} component for e-commerce applications.`);
    } else if (type === 'api') {
      template = generateApiDoc(`${selectedArea.charAt(0).toUpperCase() + selectedArea.slice(1)} API`);
    }
    
    if (onGenerateDoc && template) {
      onGenerateDoc(template);
    }
  };
  
  const handleStageChange = (stage: string) => {
    setCurrentStage(stage);
    getResourcesForStage(stage);
  };
  
  const handleAreaChange = (area: string) => {
    setSelectedArea(area);
    getBestPractices(area);
  };
  
  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center">
          <Zap className="h-4 w-4 mr-2" />
          Development Stage Recommendations
        </CardTitle>
        <CardDescription className="text-xs">
          Resources and documentation tailored to your development stage
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-2">
        <Tabs defaultValue={currentStage} onValueChange={handleStageChange}>
          <TabsList className="grid grid-cols-6 mb-4">
            {developmentStages.map(stage => (
              <TabsTrigger 
                key={stage.id} 
                value={stage.id}
                className="flex items-center gap-1 py-1 h-8"
              >
                {stage.icon}
                <span className="hidden sm:inline">{stage.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          
          {developmentStages.map(stage => (
            <TabsContent key={stage.id} value={stage.id} className="mt-0">
              <div className="mb-4">
                <h4 className="font-medium text-sm mb-2">Stage-Relevant Resources</h4>
                {stageRecommendations.length > 0 ? (
                  <div className="space-y-2">
                    {stageRecommendations.map(resource => (
                      <div key={resource.id} className="p-2 border rounded-md bg-slate-50">
                        <div className="flex justify-between items-start">
                          <div className="flex">
                            <div className="mt-0.5 mr-2">
                              {getCategoryIcon(resource.category)}
                            </div>
                            <div>
                              <h4 className="font-medium text-sm">{resource.title}</h4>
                              <p className="text-xs text-slate-500 line-clamp-2">{resource.description}</p>
                            </div>
                          </div>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-7"
                            onClick={() => {
                              if (resource.url) {
                                onOpenResource(resource.url);
                                handleResourceUsed(resource);
                              }
                            }}
                            disabled={!resource.url}
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1 ml-6">
                          {resource.category && (
                            <Badge variant="outline" className="text-xs px-1 h-5">
                              {resource.category}
                            </Badge>
                          )}
                          {resource.tags?.slice(0, 2).map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs px-1 h-5">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">No specific resources available for this stage.</p>
                )}
              </div>
              
              <div className="mb-4">
                <h4 className="font-medium text-sm mb-2">Best Practices</h4>
                <div className="grid grid-cols-4 gap-2 mb-3">
                  <Button 
                    size="sm" 
                    variant={selectedArea === 'product' ? 'default' : 'outline'} 
                    className="h-7"
                    onClick={() => handleAreaChange('product')}
                  >
                    Product
                  </Button>
                  <Button 
                    size="sm" 
                    variant={selectedArea === 'cart' ? 'default' : 'outline'} 
                    className="h-7"
                    onClick={() => handleAreaChange('cart')}
                  >
                    Cart
                  </Button>
                  <Button 
                    size="sm" 
                    variant={selectedArea === 'checkout' ? 'default' : 'outline'} 
                    className="h-7"
                    onClick={() => handleAreaChange('checkout')}
                  >
                    Checkout
                  </Button>
                  <Button 
                    size="sm" 
                    variant={selectedArea === 'payment' ? 'default' : 'outline'} 
                    className="h-7"
                    onClick={() => handleAreaChange('payment')}
                  >
                    Payment
                  </Button>
                </div>
                
                {bestPractices.length > 0 ? (
                  <div className="space-y-2">
                    {bestPractices.map(resource => (
                      <div key={resource.id} className="p-2 border rounded-md bg-blue-50 border-blue-100">
                        <div className="flex justify-between items-start">
                          <div className="flex">
                            <div>
                              <h4 className="font-medium text-sm">{resource.title}</h4>
                              <p className="text-xs text-slate-600 line-clamp-2">{resource.description}</p>
                            </div>
                          </div>
                          {resource.url && (
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-7"
                              onClick={() => {
                                onOpenResource(resource.url as string);
                                handleResourceUsed(resource);
                              }}
                            >
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">No best practices available for this area.</p>
                )}
              </div>
              
              {stage.id === 'development' && (
                <div>
                  <h4 className="font-medium text-sm mb-2">Documentation Templates</h4>
                  {showDocOptions ? (
                    <div className="space-y-2">
                      <div className="p-2 border rounded-md">
                        <h4 className="font-medium text-sm">Component Documentation</h4>
                        <p className="text-xs text-slate-500 mb-2">
                          Generate documentation for {selectedArea} components
                        </p>
                        <Button 
                          size="sm" 
                          onClick={() => handleGenerateDoc('component')}
                        >
                          Generate Component Docs
                        </Button>
                      </div>
                      <div className="p-2 border rounded-md">
                        <h4 className="font-medium text-sm">API Documentation</h4>
                        <p className="text-xs text-slate-500 mb-2">
                          Generate documentation for {selectedArea} API endpoints
                        </p>
                        <Button 
                          size="sm" 
                          onClick={() => handleGenerateDoc('api')}
                        >
                          Generate API Docs
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => setShowDocOptions(true)}
                    >
                      Show Documentation Options
                    </Button>
                  )}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
      <CardFooter className="pt-0">
        <p className="text-xs text-slate-500">Resources tailored to your current development stage</p>
      </CardFooter>
    </Card>
  );
};