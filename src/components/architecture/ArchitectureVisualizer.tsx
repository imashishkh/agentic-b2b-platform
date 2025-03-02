
import React, { useState } from 'react';
import { ArchitectureProposal } from '@/contexts/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Database, Check, ArrowRight, Server, Layout, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Simple component to visualize architecture relationships
const ArchitectureDiagram = ({ proposal }: { proposal: ArchitectureProposal }) => {
  // Extract components and relationships
  const components = proposal.components || [];
  const relationships = proposal.relationships || [];
  
  if (components.length === 0) {
    return (
      <div className="p-4 border rounded-md bg-slate-50 text-center">
        <p className="text-slate-500">No diagram components available</p>
      </div>
    );
  }
  
  // Determine component type icon
  const getComponentIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'database':
        return <Database className="h-4 w-4" />;
      case 'server':
      case 'backend':
      case 'api':
        return <Server className="h-4 w-4" />;
      case 'frontend':
      case 'ui':
        return <Layout className="h-4 w-4" />;
      default:
        return <Code className="h-4 w-4" />;
    }
  };
  
  return (
    <div className="p-4 border rounded-md bg-slate-50">
      <div className="flex flex-col gap-6">
        {/* Component list with relationships */}
        {components.map((component: any) => (
          <div key={component.id} className="bg-white p-3 rounded-md shadow-sm border">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {getComponentIcon(component.type)}
                <span className="ml-2 font-medium">{component.name}</span>
              </div>
              <Badge variant="outline">{component.type}</Badge>
            </div>
            
            <p className="text-sm mt-2 text-slate-600">{component.description}</p>
            
            {/* Show relationships */}
            {relationships
              .filter((rel: any) => rel.source === component.id)
              .map((rel: any) => {
                const targetComponent = components.find((c: any) => c.id === rel.target);
                return targetComponent ? (
                  <div key={`${rel.source}-${rel.target}`} className="mt-2 flex items-center text-xs text-slate-500">
                    <ArrowRight className="h-3 w-3 mx-1" />
                    <span>{rel.type || 'connects to'}</span>
                    <Badge variant="outline" className="ml-1 text-xs">{targetComponent.name}</Badge>
                  </div>
                ) : null;
              })}
          </div>
        ))}
      </div>
    </div>
  );
};

interface ArchitectureVisualizerProps {
  proposals: ArchitectureProposal[];
}

export const ArchitectureVisualizer: React.FC<ArchitectureVisualizerProps> = ({ proposals }) => {
  const [selectedProposal, setSelectedProposal] = useState<string>(
    proposals.length > 0 ? proposals[0].id : ''
  );
  
  // Get the selected proposal
  const currentProposal = proposals.find(p => p.id === selectedProposal) || proposals[0];
  
  return (
    <div className="space-y-4">
      {/* Proposal selection tabs */}
      <Tabs 
        value={selectedProposal} 
        onValueChange={setSelectedProposal}
        className="w-full"
      >
        <TabsList className="w-full">
          {proposals.map(proposal => (
            <TabsTrigger 
              key={proposal.id} 
              value={proposal.id}
              className="flex-1"
            >
              {proposal.title || proposal.name}
              {proposal.approved && <Check className="h-3 w-3 ml-1 text-green-500" />}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      
      {/* Selected proposal details */}
      {currentProposal && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{currentProposal.title || currentProposal.name}</CardTitle>
                <CardDescription className="mt-1">
                  {currentProposal.description}
                </CardDescription>
              </div>
              {currentProposal.approved ? (
                <Badge className="bg-green-100 text-green-800 border-green-300">Approved</Badge>
              ) : (
                <Badge variant="outline">Proposed</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Technologies used */}
            {currentProposal.technologies && currentProposal.technologies.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Technologies</h4>
                <div className="flex flex-wrap gap-1">
                  {currentProposal.technologies.map((tech, index) => (
                    <Badge key={index} variant="secondary">{tech}</Badge>
                  ))}
                </div>
              </div>
            )}
            
            {/* Diagram tab system */}
            <Tabs defaultValue="diagram" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="diagram" className="flex-1">Visual Diagram</TabsTrigger>
                <TabsTrigger value="components" className="flex-1">Components</TabsTrigger>
                <TabsTrigger value="dependencies" className="flex-1">Dependencies</TabsTrigger>
              </TabsList>
              
              <TabsContent value="diagram" className="mt-4">
                <ArchitectureDiagram proposal={currentProposal} />
              </TabsContent>
              
              <TabsContent value="components" className="mt-4">
                {currentProposal.components && currentProposal.components.length > 0 ? (
                  <div className="space-y-2">
                    {currentProposal.components.map((component: any, index: number) => (
                      <div key={index} className="p-3 border rounded-md">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{component.name}</h4>
                          <Badge variant="outline">{component.type}</Badge>
                        </div>
                        <p className="text-sm mt-1 text-slate-600">{component.description}</p>
                        
                        {component.technologies && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {component.technologies.map((tech: string, idx: number) => (
                              <Badge key={idx} variant="secondary" className="text-xs">{tech}</Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-slate-500 py-4">No components defined yet</p>
                )}
              </TabsContent>
              
              <TabsContent value="dependencies" className="mt-4">
                {currentProposal.dependencies && currentProposal.dependencies.length > 0 ? (
                  <div className="space-y-2">
                    {currentProposal.dependencies.map((dep, index) => (
                      <div key={index} className="p-3 border rounded-md">
                        <p className="text-sm">{dep}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-slate-500 py-4">No dependencies defined yet</p>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
