import React, { useEffect } from "react";
import { useChat } from "@/contexts/ChatContext";
import { SetupWizardStep } from "@/contexts/types";
import { useSetupWizard } from "@/hooks/useSetupWizard";
import { ParsingProgressIndicator } from "@/components/project/ParsingProgressIndicator";
import { AgentAssignmentPanel } from "@/components/project/AgentAssignmentPanel";
import { EnhancedGitHubSetup } from "@/components/github/EnhancedGitHubSetup";
import { ComponentVisualizer } from "@/components/project/ComponentVisualizer";
import { ApprovalWorkflow } from "@/components/project/ApprovalWorkflow";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, ChevronRight, FileUp, FileCode, GitBranch, Layout, List } from "lucide-react";

// Example project templates for GitHub setup
const EXAMPLE_PROJECT_TEMPLATES = [
  {
    id: "medusa-b2b",
    name: "Medusa B2B E-commerce Starter",
    description: "A starter template for B2B e-commerce using Medusa",
    technologies: ["React", "Node.js", "Medusa", "PostgreSQL", "Tailwind CSS"],
    structure: [
      {
        path: "backend",
        type: "directory",
        children: [
          { path: "src", type: "directory", children: [
            { path: "api", type: "directory" },
            { path: "services", type: "directory" },
            { path: "models", type: "directory" }
          ]},
          { path: "package.json", type: "file" },
          { path: "medusa-config.js", type: "file" }
        ]
      },
      {
        path: "frontend",
        type: "directory",
        children: [
          { path: "src", type: "directory", children: [
            { path: "components", type: "directory" },
            { path: "pages", type: "directory" },
            { path: "services", type: "directory" }
          ]},
          { path: "package.json", type: "file" },
          { path: "tsconfig.json", type: "file" }
        ]
      },
      { path: "README.md", type: "file" },
      { path: "docker-compose.yml", type: "file" }
    ]
  },
  {
    id: "saleor-headless",
    name: "Saleor Headless E-commerce",
    description: "A headless e-commerce setup with Saleor",
    technologies: ["React", "Next.js", "Saleor", "GraphQL", "Tailwind CSS"],
    structure: [
      {
        path: "frontend",
        type: "directory",
        children: [
          { path: "components", type: "directory" },
          { path: "pages", type: "directory" },
          { path: "graphql", type: "directory" },
          { path: "package.json", type: "file" },
          { path: "next.config.js", type: "file" }
        ]
      },
      { path: "saleor.config.js", type: "file" },
      { path: "README.md", type: "file" }
    ]
  },
  {
    id: "custom-ecommerce",
    name: "Custom E-commerce Solution",
    description: "A fully customizable e-commerce platform from scratch",
    technologies: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS"],
    structure: [
      {
        path: "api",
        type: "directory",
        children: [
          { path: "controllers", type: "directory" },
          { path: "models", type: "directory" },
          { path: "routes", type: "directory" },
          { path: "middleware", type: "directory" },
          { path: "package.json", type: "file" }
        ]
      },
      {
        path: "client",
        type: "directory",
        children: [
          { path: "src", type: "directory", children: [
            { path: "components", type: "directory" },
            { path: "pages", type: "directory" },
            { path: "hooks", type: "directory" },
            { path: "context", type: "directory" }
          ]},
          { path: "package.json", type: "file" }
        ]
      },
      { path: "README.md", type: "file" },
      { path: "docker-compose.yml", type: "file" }
    ]
  }
];

export function EnhancedSetupWizard() {
  const { currentWizardStep, setCurrentWizardStep } = useChat();
  const setupWizard = useSetupWizard();
  
  // Sync the current wizard step with the chat context
  useEffect(() => {
    if (currentWizardStep !== setupWizard.currentStep) {
      setCurrentWizardStep(setupWizard.currentStep);
    }
  }, [setupWizard.currentStep, currentWizardStep, setCurrentWizardStep]);
  
  // If a file is uploaded, start parsing it
  useEffect(() => {
    if (currentWizardStep === SetupWizardStep.UPLOAD_REQUIREMENTS && !setupWizard.isParsingFile) {
      // This would be triggered by the file upload component
      // For demo, we'll simulate with a mock file name
      setupWizard.startFileParsing("project-requirements.md");
    }
  }, [currentWizardStep, setupWizard]);
  
  // Render wizard step content based on current step
  const renderWizardStepContent = () => {
    switch (setupWizard.currentStep) {
      case SetupWizardStep.INITIAL:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileUp className="h-5 w-5" />
                Get Started
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Next Step</AlertTitle>
                <AlertDescription>
                  Upload your project requirements to get started with the setup wizard.
                </AlertDescription>
              </Alert>
              <div className="flex justify-center">
                <Button 
                  onClick={() => setupWizard.setCurrentStep(SetupWizardStep.UPLOAD_REQUIREMENTS)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <FileUp className="h-4 w-4 mr-2" />
                  Upload Requirements
                </Button>
              </div>
            </CardContent>
          </Card>
        );
        
      case SetupWizardStep.UPLOAD_REQUIREMENTS:
        return (
          <div className="space-y-6">
            {setupWizard.isParsingFile && (
              <ParsingProgressIndicator
                sections={setupWizard.parsedSections}
                overallProgress={setupWizard.overallProgress}
                fileName={setupWizard.fileName}
              />
            )}
            
            {!setupWizard.isParsingFile && (
              <Alert>
                <FileUp className="h-4 w-4" />
                <AlertTitle>Upload Requirements Document</AlertTitle>
                <AlertDescription>
                  Please upload your project requirements document in markdown format. 
                  This will be analyzed to extract features, tasks, and project structure.
                </AlertDescription>
              </Alert>
            )}
          </div>
        );
        
      case SetupWizardStep.REQUIREMENTS_UPLOADED:
        return (
          <div className="space-y-6">
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertTitle>Requirements Analyzed</AlertTitle>
              <AlertDescription>
                Your requirements have been successfully analyzed. Review and confirm the agent assignments below.
              </AlertDescription>
            </Alert>
            
            <AgentAssignmentPanel
              assignments={setupWizard.sectionAssignments}
              onAssignmentChange={setupWizard.updateSectionAssignment}
              onAssignmentsConfirm={setupWizard.confirmSectionAssignments}
            />
          </div>
        );
        
      case SetupWizardStep.GITHUB_SETUP:
        return (
          <EnhancedGitHubSetup
            onRepoCreated={setupWizard.handleRepoCreated}
            onConnect={setupWizard.connectToGitHub}
            isConnected={setupWizard.gitHubConnected}
            isLoading={false}
            availableTemplates={EXAMPLE_PROJECT_TEMPLATES}
          />
        );
        
      case SetupWizardStep.GITHUB_CONNECTED:
        return (
          <div className="space-y-6">
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertTitle>GitHub Repository Created</AlertTitle>
              <AlertDescription>
                Your GitHub repository has been created successfully. Now let's set up the UI components for your project.
              </AlertDescription>
            </Alert>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layout className="h-5 w-5" />
                  UI Component Setup
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Add and arrange the UI components for your e-commerce project. 
                  These will be used to generate the frontend codebase.
                </p>
                
                <div className="flex justify-center">
                  <Button 
                    onClick={() => setupWizard.setCurrentStep(SetupWizardStep.UI_COMPONENTS_SETUP)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Layout className="h-4 w-4 mr-2" />
                    Set Up UI Components
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );
        
      case SetupWizardStep.UI_COMPONENTS_SETUP:
        return (
          <ComponentVisualizer
            components={setupWizard.uiComponents}
            onComponentsReorder={setupWizard.reorderUiComponents}
            onComponentRemove={setupWizard.removeUiComponent}
            onComponentAdd={setupWizard.addUiComponent}
          />
        );
        
      case SetupWizardStep.UI_COMPONENTS_ADDED:
        return (
          <div className="flex justify-end">
            <Button 
              onClick={setupWizard.finishUiComponentSetup}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <List className="h-4 w-4 mr-2" />
              Review Project Plan
            </Button>
          </div>
        );
        
      case SetupWizardStep.PROJECT_REVIEW:
        return (
          <ApprovalWorkflow
            projectName="B2B E-commerce Platform"
            projectDescription="A comprehensive B2B e-commerce platform built with Medusa, React, and Node.js, designed for wholesale distributors."
            phases={setupWizard.projectPhases}
            onApprove={setupWizard.approvePhase}
            onReject={setupWizard.rejectPhase}
            onApproveAll={setupWizard.approveAllPhases}
          />
        );
        
      case SetupWizardStep.PROJECT_APPROVED:
        return (
          <div className="space-y-6">
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertTitle>Project Plan Approved</AlertTitle>
              <AlertDescription>
                Your project plan has been approved! We're ready to start implementing your e-commerce platform.
              </AlertDescription>
            </Alert>
            
            <div className="flex justify-center">
              <Button 
                onClick={setupWizard.startProject}
                className="bg-green-600 hover:bg-green-700"
              >
                <ChevronRight className="h-4 w-4 mr-2" />
                Start Project Implementation
              </Button>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="w-full max-w-3xl mx-auto py-6 px-4">
      {renderWizardStepContent()}
    </div>
  );
}