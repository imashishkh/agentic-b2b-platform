
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EnhancedKnowledgeBase } from "@/components/knowledge/EnhancedKnowledgeBase";
import { ArchitectureProposalCard } from "@/components/architecture/ArchitectureProposalCard";
import { TestingStrategyCard } from "@/components/testing/TestingStrategyCard";
import { GitHubIntegration } from "@/components/github/GitHubIntegration";
import { useChat } from "@/contexts/ChatContext";
import { ArchitectureProposal, TestingStrategy } from "@/contexts/ChatContext";
import { toast } from "sonner";

export const ProjectFeaturesPanel: React.FC = () => {
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
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Agentic Chat Project</h2>
      
      <Tabs defaultValue="knowledge">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
          <TabsTrigger value="architecture">Architecture</TabsTrigger>
          <TabsTrigger value="testing">Testing</TabsTrigger>
          <TabsTrigger value="github">GitHub</TabsTrigger>
        </TabsList>
        
        <TabsContent value="knowledge">
          <EnhancedKnowledgeBase />
        </TabsContent>
        
        <TabsContent value="architecture">
          {architectureProposals.length > 0 ? (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Architecture Proposals</h3>
              {architectureProposals.map(proposal => (
                <ArchitectureProposalCard 
                  key={proposal.id}
                  proposal={proposal}
                  onApprove={handleApproveProposal}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>No architecture proposals yet.</p>
              <p className="mt-2 text-sm">
                Ask DevManager to propose a system architecture for your project.
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="testing">
          {testingStrategies.length > 0 ? (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Testing Strategies</h3>
              {testingStrategies.map(strategy => (
                <TestingStrategyCard 
                  key={strategy.id}
                  strategy={strategy}
                  onApprove={handleApproveStrategy}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>No testing strategies yet.</p>
              <p className="mt-2 text-sm">
                Ask DevManager to propose a comprehensive testing strategy for your project.
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="github">
          <GitHubIntegration />
        </TabsContent>
      </Tabs>
    </div>
  );
};
