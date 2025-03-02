
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EnhancedKnowledgeBase } from "@/components/knowledge/EnhancedKnowledgeBase";
import { ArchitectureProposalCard } from "@/components/architecture/ArchitectureProposalCard";
import { TestingStrategyCard } from "@/components/testing/TestingStrategyCard";
import { GitHubIntegration } from "@/components/github/GitHubIntegration";
import { useChat } from "@/contexts/ChatContext";
import { toast } from "sonner";
import { Book, Code, FileCode, Github } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Extending the types as needed for the UI to work properly
interface ExtendedArchitectureProposal {
  id: string;
  name: string;
  type: string;
  description: string;
  technologies: string[];
  approved?: boolean;
  diagram?: string;
  dependencies?: string[];
}

interface ExtendedTestingStrategy {
  id: string;
  name: string;
  description: string;
  type: string; // Added to fix type error
  approved?: boolean;
  approaches?: Array<{
    name: string;
    description: string;
    tools: string[];
  }>;
}

export const ProjectFeaturesPanel: React.FC = () => {
  // Cast to extended types
  const { 
    architectureProposals, 
    updateArchitectureProposal,
    testingStrategies,
    updateTestingStrategy
  } = useChat();
  
  const handleApproveProposal = (id: string) => {
    updateArchitectureProposal(id, { approved: true });
    toast.success("Architecture proposal approved");
  };
  
  const handleApproveStrategy = (id: string) => {
    updateTestingStrategy(id, { approved: true });
    toast.success("Testing strategy approved");
  };
  
  return (
    <div className="p-4 h-full flex flex-col">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Project Features</h2>
        <p className="text-sm text-gray-500 mt-1">Manage your project's knowledge, architecture, and testing strategies</p>
      </div>
      
      <Tabs defaultValue="knowledge" className="flex-1 flex flex-col">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="knowledge" className="flex items-center gap-1.5">
            <Book className="h-4 w-4" />
            <span className="hidden sm:inline">Knowledge</span>
          </TabsTrigger>
          <TabsTrigger value="architecture" className="flex items-center gap-1.5">
            <Code className="h-4 w-4" />
            <span className="hidden sm:inline">Architecture</span>
          </TabsTrigger>
          <TabsTrigger value="testing" className="flex items-center gap-1.5">
            <FileCode className="h-4 w-4" />
            <span className="hidden sm:inline">Testing</span>
          </TabsTrigger>
          <TabsTrigger value="github" className="flex items-center gap-1.5">
            <Github className="h-4 w-4" />
            <span className="hidden sm:inline">GitHub</span>
          </TabsTrigger>
        </TabsList>
        
        <div className="flex-1 overflow-hidden">
          <TabsContent value="knowledge" className="h-full">
            <EnhancedKnowledgeBase />
          </TabsContent>
          
          <TabsContent value="architecture" className="h-full overflow-auto">
            {architectureProposals.length > 0 ? (
              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Architecture Proposals</CardTitle>
                    <CardDescription>
                      Review and approve system architecture proposals
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {architectureProposals.map(proposal => (
                        <ArchitectureProposalCard 
                          key={proposal.id}
                          proposal={proposal as unknown as ExtendedArchitectureProposal}
                          onApprove={handleApproveProposal}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <EmptyState 
                title="No architecture proposals yet"
                description="Ask DevManager to propose a system architecture for your project."
                icon={<Code className="h-12 w-12 text-gray-300" />}
              />
            )}
          </TabsContent>
          
          <TabsContent value="testing" className="h-full overflow-auto">
            {testingStrategies.length > 0 ? (
              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Testing Strategies</CardTitle>
                    <CardDescription>
                      Review and approve testing strategies for your project
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {testingStrategies.map(strategy => (
                        <TestingStrategyCard 
                          key={strategy.id}
                          strategy={{...strategy, type: "Unit Testing"} as unknown as ExtendedTestingStrategy}
                          onApprove={handleApproveStrategy}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <EmptyState 
                title="No testing strategies yet"
                description="Ask DevManager to propose a comprehensive testing strategy for your project."
                icon={<FileCode className="h-12 w-12 text-gray-300" />}
              />
            )}
          </TabsContent>
          
          <TabsContent value="github" className="h-full overflow-auto">
            <GitHubIntegration />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

// Helper component for empty states
const EmptyState = ({ 
  title, 
  description, 
  icon 
}: { 
  title: string; 
  description: string; 
  icon: React.ReactNode 
}) => (
  <div className="flex flex-col items-center justify-center text-center p-8 h-full">
    <div className="mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-medium mb-2">{title}</h3>
    <p className="text-sm text-gray-500 max-w-xs">
      {description}
    </p>
  </div>
);
