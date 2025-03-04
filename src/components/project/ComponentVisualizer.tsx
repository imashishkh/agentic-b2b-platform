import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DragDropContext, 
  Droppable, 
  Draggable, 
  DropResult 
} from "@hello-pangea/dnd";
import { 
  Layout, 
  Layers, 
  Move, 
  Trash, 
  Plus, 
  Eye, 
  Code, 
  Maximize2,
  Minimize2
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";

export interface UIComponent {
  id: string;
  name: string;
  type: 
    | "header" 
    | "hero" 
    | "features" 
    | "testimonials" 
    | "pricing" 
    | "footer" 
    | "navigation" 
    | "product-card" 
    | "cart" 
    | "checkout" 
    | "auth" 
    | "custom";
  mockupUrl?: string;
  codePreview?: string;
  order: number;
  isRequired?: boolean;
  description?: string;
}

interface ComponentVisualizerProps {
  components: UIComponent[];
  onComponentsReorder: (newComponents: UIComponent[]) => void;
  onComponentRemove: (componentId: string) => void;
  onComponentAdd: (component: Partial<UIComponent>) => void;
}

export function ComponentVisualizer({
  components,
  onComponentsReorder,
  onComponentRemove,
  onComponentAdd
}: ComponentVisualizerProps) {
  const [expandedComponent, setExpandedComponent] = useState<UIComponent | null>(null);
  const [previewView, setPreviewView] = useState<"mockup" | "code">("mockup");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newComponentType, setNewComponentType] = useState<UIComponent["type"]>("header");
  const [newComponentName, setNewComponentName] = useState("");
  
  const availableComponentTypes: Array<{
    type: UIComponent["type"],
    label: string,
    description: string
  }> = [
    { type: "header", label: "Header", description: "Site header with logo and navigation" },
    { type: "hero", label: "Hero", description: "Hero section with main headline and CTA" },
    { type: "features", label: "Features", description: "Product features showcase" },
    { type: "testimonials", label: "Testimonials", description: "Customer testimonials" },
    { type: "pricing", label: "Pricing", description: "Pricing plans" },
    { type: "footer", label: "Footer", description: "Site footer with links and info" },
    { type: "navigation", label: "Navigation", description: "Navigation menu component" },
    { type: "product-card", label: "Product Card", description: "Individual product display card" },
    { type: "cart", label: "Shopping Cart", description: "Shopping cart component" },
    { type: "checkout", label: "Checkout", description: "Checkout process" },
    { type: "auth", label: "Authentication", description: "Login/signup forms" },
    { type: "custom", label: "Custom Component", description: "Custom component" }
  ];

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const items = Array.from(components);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    // Update order property
    const reorderedComponents = items.map((item, index) => ({
      ...item,
      order: index
    }));
    
    onComponentsReorder(reorderedComponents);
  };
  
  const handleAddComponent = () => {
    if (!newComponentName.trim()) return;
    
    const newComponent: Partial<UIComponent> = {
      name: newComponentName,
      type: newComponentType,
      order: components.length,
      // Mock mockup URL based on component type
      mockupUrl: `/mockups/${newComponentType}.png`,
      // Mock code preview
      codePreview: `export function ${newComponentName.replace(/\s+/g, '')}() {\n  return (\n    <div className="py-8">\n      <h2>New ${newComponentName} Component</h2>\n      {/* Component content */}\n    </div>\n  );\n}`
    };
    
    onComponentAdd(newComponent);
    setNewComponentName("");
    setNewComponentType("header");
    setIsAddDialogOpen(false);
  };
  
  const getComponentTypeColor = (type: UIComponent["type"]) => {
    switch (type) {
      case "header":
      case "footer":
      case "navigation":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "hero":
      case "features":
      case "testimonials":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "pricing":
      case "product-card":
        return "bg-green-100 text-green-800 border-green-200";
      case "cart":
      case "checkout":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "auth":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex justify-between items-center text-lg">
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5" />
              UI Components
            </div>
            <Button 
              size="sm" 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => setIsAddDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Component
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">
              Drag and drop to reorder components for your UI layout.
            </p>
            
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="components">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-2"
                  >
                    {components.length === 0 ? (
                      <div className="text-center p-8 border border-dashed rounded-lg">
                        <p className="text-gray-500">No components added yet. Add your first component to get started.</p>
                      </div>
                    ) : (
                      components
                        .sort((a, b) => a.order - b.order)
                        .map((component, index) => (
                          <Draggable 
                            key={component.id} 
                            draggableId={component.id} 
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className="border rounded-lg overflow-hidden bg-white"
                              >
                                <div className="flex items-center p-3 border-b bg-gray-50">
                                  <div 
                                    {...provided.dragHandleProps}
                                    className="mr-3 p-1 rounded hover:bg-gray-200 cursor-move"
                                  >
                                    <Move className="h-4 w-4 text-gray-500" />
                                  </div>
                                  
                                  <div className="flex-1">
                                    <h3 className="font-medium text-sm">{component.name}</h3>
                                    {component.description && (
                                      <p className="text-xs text-gray-500">{component.description}</p>
                                    )}
                                  </div>
                                  
                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline" className={getComponentTypeColor(component.type)}>
                                      {component.type}
                                    </Badge>
                                    
                                    <Button 
                                      size="icon" 
                                      variant="ghost" 
                                      className="h-8 w-8 text-gray-500 hover:text-gray-700"
                                      onClick={() => setExpandedComponent(component)}
                                    >
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                    
                                    {!component.isRequired && (
                                      <Button 
                                        size="icon" 
                                        variant="ghost" 
                                        className="h-8 w-8 text-red-500 hover:text-red-700"
                                        onClick={() => onComponentRemove(component.id)}
                                      >
                                        <Trash className="h-4 w-4" />
                                      </Button>
                                    )}
                                  </div>
                                </div>
                                
                                {component.mockupUrl && (
                                  <div className="h-20 bg-gray-100 border-b relative overflow-hidden">
                                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                      <Layout className="h-6 w-6 opacity-30" />
                                    </div>
                                    <div 
                                      className="absolute inset-0 bg-center bg-cover opacity-70"
                                      style={{ backgroundImage: `url(${component.mockupUrl})` }}
                                    />
                                  </div>
                                )}
                              </div>
                            )}
                          </Draggable>
                        ))
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </CardContent>
      </Card>
      
      {/* Component Preview Dialog */}
      {expandedComponent && (
        <Dialog open={!!expandedComponent} onOpenChange={() => setExpandedComponent(null)}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>{expandedComponent.name}</span>
                <Badge variant="outline" className={getComponentTypeColor(expandedComponent.type)}>
                  {expandedComponent.type}
                </Badge>
              </DialogTitle>
              <DialogDescription>
                {expandedComponent.description || `${expandedComponent.type} component for your e-commerce site`}
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="mockup" value={previewView} onValueChange={(value) => setPreviewView(value as "mockup" | "code")}>
              <TabsList className="w-full mb-4">
                <TabsTrigger value="mockup" className="flex-1">
                  <Eye className="h-4 w-4 mr-2" />
                  Mockup
                </TabsTrigger>
                <TabsTrigger value="code" className="flex-1">
                  <Code className="h-4 w-4 mr-2" />
                  Code
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="mockup" className="space-y-4">
                {expandedComponent.mockupUrl ? (
                  <div className="border rounded-lg overflow-hidden">
                    <div className="aspect-video bg-gray-100 flex items-center justify-center relative">
                      <img 
                        src={expandedComponent.mockupUrl} 
                        alt={expandedComponent.name} 
                        className="max-w-full max-h-full object-contain"
                        onError={(e) => {
                          e.currentTarget.src = "https://via.placeholder.com/800x400?text=Component+Preview";
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="aspect-video bg-gray-100 flex items-center justify-center border rounded-lg">
                    <p className="text-gray-500">No mockup available for this component</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="code" className="space-y-4">
                {expandedComponent.codePreview ? (
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-800 text-gray-100 p-4 text-sm font-mono">
                      <pre className="whitespace-pre-wrap">
                        {expandedComponent.codePreview}
                      </pre>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-video bg-gray-100 flex items-center justify-center border rounded-lg">
                    <p className="text-gray-500">No code preview available for this component</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setExpandedComponent(null)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Add Component Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add UI Component</DialogTitle>
            <DialogDescription>
              Select a component type and provide a name for your new UI component.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label htmlFor="component-name" className="text-sm font-medium">
                Component Name
              </label>
              <input
                id="component-name"
                type="text"
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Main Header"
                value={newComponentName}
                onChange={(e) => setNewComponentName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Component Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {availableComponentTypes.map((componentType) => (
                  <div
                    key={componentType.type}
                    onClick={() => setNewComponentType(componentType.type)}
                    className={`
                      border rounded-md p-2 cursor-pointer transition-colors
                      ${newComponentType === componentType.type 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'hover:bg-gray-50'
                      }
                    `}
                  >
                    <div className="flex items-center">
                      <Badge variant="outline" className={getComponentTypeColor(componentType.type)}>
                        {componentType.label}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {componentType.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddComponent}
              disabled={!newComponentName.trim()}
            >
              Add Component
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}