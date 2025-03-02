
import React, { useState, useEffect } from 'react';
import { ArchitectureProposal } from '@/contexts/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Database, Check, ArrowRight, Server, Layout, Code, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Enhanced component to visualize architecture relationships with diagram
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
  
  // Calculate positions for components in a layered layout
  const calculatePositions = () => {
    const layerMap: Record<string, number> = {};
    const typeToLayer: Record<string, number> = {
      'frontend': 0,
      'ui': 0,
      'backend': 1,
      'api': 1,
      'server': 1,
      'service': 1,
      'database': 2,
      'storage': 2,
      'infrastructure': 3,
      'devops': 3,
    };
    
    // Assign layers to components based on their type
    components.forEach((component: any) => {
      const type = component.type?.toLowerCase() || '';
      const layer = typeToLayer[type] !== undefined ? typeToLayer[type] : 1;
      layerMap[component.id] = layer;
    });
    
    // Adjust layers based on relationships (dependent components should be in higher layers)
    relationships.forEach((rel: any) => {
      if (rel.source && rel.target) {
        const sourceLayer = layerMap[rel.source];
        const targetLayer = layerMap[rel.target];
        
        if (sourceLayer >= targetLayer) {
          layerMap[rel.target] = sourceLayer + 1;
        }
      }
    });
    
    return layerMap;
  };
  
  const layerMap = calculatePositions();
  
  // Group components by layer
  const layeredComponents: Record<number, any[]> = {};
  components.forEach((component: any) => {
    const layer = layerMap[component.id] || 0;
    if (!layeredComponents[layer]) {
      layeredComponents[layer] = [];
    }
    layeredComponents[layer].push(component);
  });
  
  // Determine component type icon
  const getComponentIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'database':
      case 'storage':
        return <Database className="h-4 w-4" />;
      case 'server':
      case 'backend':
      case 'api':
      case 'service':
        return <Server className="h-4 w-4" />;
      case 'frontend':
      case 'ui':
        return <Layout className="h-4 w-4" />;
      case 'infrastructure':
      case 'devops':
        return <Layers className="h-4 w-4" />;
      default:
        return <Code className="h-4 w-4" />;
    }
  };
  
  // Calculate relationship lines for visual diagram
  const relationshipLines = relationships.map((rel: any) => {
    const sourceComponent = components.find((c: any) => c.id === rel.source);
    const targetComponent = components.find((c: any) => c.id === rel.target);
    
    if (!sourceComponent || !targetComponent) return null;
    
    const sourceLayer = layerMap[sourceComponent.id];
    const targetLayer = layerMap[targetComponent.id];
    const sourceIndex = layeredComponents[sourceLayer].indexOf(sourceComponent);
    const targetIndex = layeredComponents[targetLayer].indexOf(targetComponent);
    
    // Calculate source and target positions in percentage
    const sourcePos = (sourceIndex + 0.5) / layeredComponents[sourceLayer].length * 100;
    const targetPos = (targetIndex + 0.5) / layeredComponents[targetLayer].length * 100;
    
    return {
      id: `${rel.source}-${rel.target}`,
      sourceLayer,
      targetLayer,
      sourcePos,
      targetPos,
      label: rel.type || 'connects to',
      style: rel.style || {}
    };
  }).filter(Boolean);
  
  return (
    <div className="p-4 border rounded-md bg-slate-50">
      {/* Visual component diagram */}
      <div className="relative h-[400px] w-full">
        {/* Render layers */}
        {Object.keys(layeredComponents).map((layerKey) => {
          const layer = Number(layerKey);
          const layerComponents = layeredComponents[layer];
          
          return (
            <div 
              key={`layer-${layer}`}
              className="absolute w-full border-t border-dashed border-slate-300"
              style={{ 
                top: `${(layer / (Object.keys(layeredComponents).length - 1 || 1)) * 350 + 20}px`,
                height: '1px'
              }}
            >
              <div className="absolute -top-3 -left-1 bg-slate-100 px-2 text-xs text-slate-500">
                {layer === 0 ? 'Frontend' : 
                 layer === 1 ? 'Backend' : 
                 layer === 2 ? 'Database' : 'Infrastructure'}
              </div>
              
              {/* Render components in this layer */}
              {layerComponents.map((component: any, index: number) => (
                <div 
                  key={component.id}
                  className="absolute bg-white p-2 rounded-md shadow-sm border transform -translate-x-1/2 -translate-y-1/2"
                  style={{ 
                    left: `${(index + 0.5) / layerComponents.length * 100}%`, 
                    top: '0',
                    width: '100px',
                    zIndex: 2
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center">
                      {getComponentIcon(component.type)}
                      <span className="ml-1 text-xs font-medium truncate">{component.name}</span>
                    </div>
                    <Badge variant="outline" className="text-[10px] h-4">{component.type}</Badge>
                  </div>
                  <p className="text-[10px] text-slate-600 truncate">{component.description}</p>
                </div>
              ))}
            </div>
          );
        })}
        
        {/* Render relationships as SVG lines */}
        <svg className="absolute top-0 left-0 w-full h-full" style={{ zIndex: 1 }}>
          <defs>
            <marker
              id="arrowhead"
              markerWidth="6"
              markerHeight="4"
              refX="6"
              refY="2"
              orient="auto"
            >
              <polygon points="0 0, 6 2, 0 4" fill="#94a3b8" />
            </marker>
          </defs>
          
          {relationshipLines.map((line: any) => {
            const startY = (line.sourceLayer / (Object.keys(layeredComponents).length - 1 || 1)) * 350 + 20;
            const endY = (line.targetLayer / (Object.keys(layeredComponents).length - 1 || 1)) * 350 + 20;
            const startX = line.sourcePos / 100 * 100 + '%';
            const endX = line.targetPos / 100 * 100 + '%';
            
            // Create a curved path between components
            const path = `M ${startX} ${startY} C ${startX} ${(startY + endY) / 2}, ${endX} ${(startY + endY) / 2}, ${endX} ${endY}`;
            
            return (
              <g key={line.id}>
                <path
                  d={path}
                  fill="none"
                  stroke="#94a3b8"
                  strokeWidth="1"
                  strokeDasharray={line.style.dashed ? "4 2" : "none"}
                  markerEnd="url(#arrowhead)"
                />
                
                {/* Relationship label - positioned in the middle of the curve */}
                <text
                  x="50%"
                  y={(startY + endY) / 2 - 5}
                  textAnchor="middle"
                  fontSize="10"
                  fill="#64748b"
                  className="pointer-events-none"
                >
                  {line.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      
      {/* Traditional component list */}
      <div className="mt-6 flex flex-col gap-4">
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
            
            {/* Show technologies */}
            {component.technologies && component.technologies.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {component.technologies.map((tech: string, idx: number) => (
                  <Badge key={idx} variant="secondary" className="text-xs">{tech}</Badge>
                ))}
              </div>
            )}
            
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

// Main architecture visualizer component
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
            {/* Architecture pattern badge */}
            {currentProposal.pattern && (
              <div className="flex items-center">
                <Badge className="bg-blue-100 text-blue-800 border-blue-300">
                  {currentProposal.pattern}
                </Badge>
                <span className="ml-2 text-sm text-slate-500">Architectural Pattern</span>
              </div>
            )}
            
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
                <TabsTrigger value="patterns" className="flex-1">Patterns</TabsTrigger>
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
              
              <TabsContent value="patterns" className="mt-4">
                <div className="space-y-4">
                  <div className="p-4 border rounded-md">
                    <h3 className="font-medium mb-2">Selected Pattern: {currentProposal.pattern || "No pattern selected"}</h3>
                    <p className="text-sm text-slate-600">{currentProposal.patternDescription || "No pattern description available."}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Recommended Architectural Patterns</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {ARCHITECTURE_PATTERNS.map((pattern, index) => (
                        <div key={index} className="p-3 border rounded-md hover:bg-slate-50">
                          <h5 className="font-medium">{pattern.name}</h5>
                          <p className="text-xs text-slate-600 mt-1">{pattern.description}</p>
                          <div className="mt-2">
                            <Badge variant="outline" className="text-xs">Suitable for: {pattern.suitableFor}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Architectural patterns for recommendations
export const ARCHITECTURE_PATTERNS = [
  {
    name: "Microservices",
    description: "Decompose application into small, loosely coupled services that can be developed, deployed, and scaled independently.",
    suitableFor: "Complex scalable applications",
    benefits: [
      "Independent deployment",
      "Technology diversity",
      "Fault isolation",
      "Scalability"
    ]
  },
  {
    name: "Monolithic",
    description: "Build application as a single, unified unit with all functionality in a single codebase.",
    suitableFor: "Smaller applications, MVPs",
    benefits: [
      "Simpler development",
      "Easier debugging",
      "Faster initial development",
      "Simpler deployment"
    ]
  },
  {
    name: "Serverless",
    description: "Build applications that don't require server management, using cloud functions that scale automatically.",
    suitableFor: "Event-driven applications",
    benefits: [
      "No server management",
      "Pay-per-use pricing",
      "Auto-scaling",
      "Reduced operational costs"
    ]
  },
  {
    name: "Event-Driven",
    description: "Build systems that communicate through events rather than direct calls, enabling loose coupling.",
    suitableFor: "Real-time systems, complex workflows",
    benefits: [
      "Decoupling",
      "Scalability",
      "Flexibility",
      "Responsiveness"
    ]
  },
  {
    name: "Layered Architecture",
    description: "Organize code into layers (presentation, business logic, data access) with strict dependencies between them.",
    suitableFor: "Enterprise applications",
    benefits: [
      "Separation of concerns",
      "Maintainability",
      "Testability",
      "Reusability"
    ]
  },
  {
    name: "JAMstack",
    description: "JavaScript, APIs, and pre-rendered Markup delivered without web servers. Focus on static site generation.",
    suitableFor: "Content-focused websites",
    benefits: [
      "Performance",
      "Security",
      "Scalability",
      "Developer experience"
    ]
  }
];

// Tech stack recommendations based on application type
export const TECH_STACK_RECOMMENDATIONS = {
  "e-commerce": {
    frontend: ["React", "Next.js", "Tailwind CSS", "Redux"],
    backend: ["Node.js", "Express", "NestJS"],
    database: ["PostgreSQL", "MongoDB", "Redis"],
    devops: ["Docker", "Kubernetes", "AWS", "Vercel"]
  },
  "content-management": {
    frontend: ["React", "Gatsby", "Next.js", "Tailwind CSS"],
    backend: ["Node.js", "Strapi", "GraphQL"],
    database: ["MongoDB", "PostgreSQL"],
    devops: ["Netlify", "Vercel", "GitHub Actions"]
  },
  "business-saas": {
    frontend: ["React", "Angular", "Tailwind CSS", "Material UI"],
    backend: ["Node.js", "NestJS", "Django", "ASP.NET Core"],
    database: ["PostgreSQL", "SQL Server", "MongoDB"],
    devops: ["Docker", "Kubernetes", "Azure", "AWS"]
  },
  "social-platform": {
    frontend: ["React", "Next.js", "Redux", "Tailwind CSS"],
    backend: ["Node.js", "Express", "Socket.IO", "GraphQL"],
    database: ["MongoDB", "PostgreSQL", "Redis", "Neo4j"],
    devops: ["AWS", "Docker", "Kubernetes", "Cloudflare"]
  }
};
