import React, { useState } from "react";
import { RepositoryManager } from "./RepositoryManager";
import { CodeGenerator } from "./CodeGenerator";
import { AgentIntegration } from "./AgentIntegration";
import { TemplateLibrary } from "./TemplateLibrary";
import { AgentSwarmChat } from "@/components/swarm";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GitHubRepo } from "@/services/GitHubService";
import { BrainCircuit } from "lucide-react";

export function EcommerceWorkspace() {
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepo | null>(null);
  
  const handleSelectRepo = (repo: GitHubRepo) => {
    setSelectedRepo(repo);
  };
  
  return (
    <div className="container mx-auto py-8 max-w-6xl">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>E-commerce Workspace</CardTitle>
          <CardDescription>
            Generate and manage code for your e-commerce project
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">
            This workspace provides tools to create e-commerce components, database schemas,
            and APIs. Connect to your GitHub repositories to store and manage generated code.
          </p>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="repositories" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="repositories">Repositories</TabsTrigger>
          <TabsTrigger value="code-generator">Code Generator</TabsTrigger>
          <TabsTrigger value="ai-agent">AI Agent</TabsTrigger>
          <TabsTrigger value="agent-swarm" className="flex items-center">
            <BrainCircuit className="mr-1 h-4 w-4" />
            Agent Swarm
          </TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>
        
        <TabsContent value="repositories">
          <RepositoryManager onSelectRepo={handleSelectRepo} />
        </TabsContent>
        
        <TabsContent value="code-generator">
          <div className="grid gap-6">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Currently Working With:</h3>
              {selectedRepo ? (
                <div>
                  <p className="text-sm">
                    Repository: <span className="font-medium">{selectedRepo.full_name}</span>
                  </p>
                  <p className="text-sm">
                    Branch: <span className="font-medium">{selectedRepo.default_branch}</span>
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  No repository selected. Go to the Repositories tab to select or create a repository.
                </p>
              )}
            </div>
            
            <CodeGenerator 
              repoOwner={selectedRepo?.owner.login}
              repoName={selectedRepo?.name}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="ai-agent">
          <AgentIntegration />
        </TabsContent>
        
        <TabsContent value="agent-swarm">
          <div className="grid gap-6">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h3 className="font-medium mb-2 flex items-center">
                <BrainCircuit className="mr-2 h-5 w-5" />
                B2B E-commerce Agent Swarm
              </h3>
              <p className="text-sm text-gray-500">
                Our new Agent Swarm technology uses LangGraph to coordinate multiple specialized AI agents 
                that work together on complex B2B e-commerce development tasks. This collaborative approach 
                enables more sophisticated solutions than single-agent systems.
              </p>
            </div>
            
            <AgentSwarmChat />
          </div>
        </TabsContent>
        
        <TabsContent value="templates">
          <TemplateLibrary 
            repoOwner={selectedRepo?.owner.login}
            repoName={selectedRepo?.name}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}