import React, { useState } from "react";
import { useChat } from "@/contexts/ChatContext";
import { SetupWizardStep } from "@/contexts/types";
import { AgentType } from "@/agents/AgentTypes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, FileUp, GitBranch, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function SimplifiedEcommerceSetup() {
  const { setCurrentWizardStep, addMessage } = useChat();
  
  // Local state for file upload and parsing
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState<string>("");
  const [isParsing, setIsParsing] = useState(false);
  const [parseProgress, setParseProgress] = useState(0);
  
  // GitHub connection state
  const [isConnectingGitHub, setIsConnectingGitHub] = useState(false);
  const [gitHubConnected, setGitHubConnected] = useState(false);
  
  // Project execution state
  const [isProjectStarted, setIsProjectStarted] = useState(false);
  const [projectProgress, setProjectProgress] = useState(0);
  
  // Handle file upload button click
  const handleFileUpload = () => {
    setIsUploading(true);
    // Simulate file upload process
    setTimeout(() => {
      setFileName("ecommerce-requirements.md");
      setIsUploading(false);
      // Display message about the file upload
      addMessage({
        type: "agent",
        content: "I've received your e-commerce requirements file. Would you like me to analyze it?",
        agentType: AgentType.MANAGER
      });
    }, 1500);
  };
  
  // Handle GitHub connection button click
  const handleGitHubConnect = () => {
    setIsConnectingGitHub(true);
    // Simulate GitHub connection process
    setTimeout(() => {
      setGitHubConnected(true);
      setIsConnectingGitHub(false);
      // Display message about GitHub connection
      addMessage({
        type: "agent",
        content: "Successfully connected to GitHub. I can create a repository for your e-commerce project when you're ready.",
        agentType: AgentType.DEVOPS
      });
    }, 2000);
  };
  
  // Handle file parsing (next button)
  const handleParse = () => {
    setIsParsing(true);
    setParseProgress(0);
    
    // Simulate parsing progress
    const interval = setInterval(() => {
      setParseProgress(prev => {
        const newProgress = prev + 5;
        
        // When parsing is complete
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            // Display message after parsing is complete
            addMessage({
              type: "agent",
              content: "I've analyzed your requirements. Your e-commerce platform needs include product catalog, shopping cart, payment processing, and user accounts. Would you like to start building this project?",
              agentType: AgentType.MANAGER
            });
            setIsParsing(false);
          }, 500);
        }
        
        return newProgress > 100 ? 100 : newProgress;
      });
    }, 200);
  };
  
  // Handle project start
  const handleStartProject = () => {
    setIsProjectStarted(true);
    setProjectProgress(0);
    
    // Display initial message about project start
    addMessage({
      type: "agent",
      content: "Starting your e-commerce project now. I'll break this down into tasks and begin implementing core features.",
      agentType: AgentType.MANAGER
    });
    
    // Simulate progress updates
    const interval = setInterval(() => {
      setProjectProgress(prev => {
        const newProgress = prev + 1;
        
        // At 25% progress
        if (prev < 25 && newProgress >= 25) {
          addMessage({
            type: "agent",
            content: "Setting up project structure and dependencies. Created basic file architecture for your e-commerce platform.",
            agentType: AgentType.DEVOPS
          });
        }
        
        // At 50% progress
        if (prev < 50 && newProgress >= 50) {
          addMessage({
            type: "agent",
            content: "Implementing product catalog and basic frontend components. Added routing and basic UI elements.",
            agentType: AgentType.FRONTEND
          });
        }
        
        // At 75% progress
        if (prev < 75 && newProgress >= 75) {
          addMessage({
            type: "agent",
            content: "Setting up database models and API endpoints for products, users, and orders.",
            agentType: AgentType.BACKEND
          });
        }
        
        if (newProgress >= 100) {
          clearInterval(interval);
          addMessage({
            type: "agent",
            content: "Initial implementation complete! Your e-commerce platform foundation is ready. You can now continue developing specific features or request changes.",
            agentType: AgentType.MANAGER
          });
        }
        
        return newProgress > 100 ? 100 : newProgress;
      });
    }, 500);
  };
  
  // Handle project stop
  const handleStopProject = () => {
    setIsProjectStarted(false);
    addMessage({
      type: "agent",
      content: "Project development has been paused. You can resume at any time.",
      agentType: AgentType.MANAGER
    });
  };
  
  // Determine what to render based on current state
  const renderContent = () => {
    // Show parsing progress
    if (isParsing) {
      return (
        <div className="space-y-4">
          <Alert>
            <Loader2 className="h-4 w-4 animate-spin" />
            <AlertTitle>Analyzing requirements...</AlertTitle>
            <AlertDescription>
              Parsing file: {fileName}
            </AlertDescription>
          </Alert>
          <Progress value={parseProgress} className="h-2 w-full" />
        </div>
      );
    }
    
    // Show project execution progress
    if (isProjectStarted) {
      return (
        <div className="space-y-4">
          <Alert className="bg-blue-50 border-blue-200">
            <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
            <AlertTitle>Building E-commerce Platform</AlertTitle>
            <AlertDescription>
              Project implementation in progress: {projectProgress}% complete
            </AlertDescription>
          </Alert>
          <Progress value={projectProgress} className="h-2 w-full" />
          <div className="flex justify-center">
            <Button 
              onClick={handleStopProject}
              variant="destructive"
            >
              Stop Project
            </Button>
          </div>
        </div>
      );
    }
    
    // Show ready to parse message when file is uploaded
    if (fileName && !isParsing) {
      return (
        <div className="space-y-4">
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertTitle>File Ready</AlertTitle>
            <AlertDescription>
              {fileName} has been uploaded. Click Next to analyze requirements.
            </AlertDescription>
          </Alert>
          <div className="flex justify-center">
            <Button 
              onClick={handleParse}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Next
            </Button>
          </div>
        </div>
      );
    }
    
    // Show start project button after parsing
    if (parseProgress === 100 && !isParsing && !isProjectStarted) {
      return (
        <div className="space-y-4">
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertTitle>Analysis Complete</AlertTitle>
            <AlertDescription>
              Requirements have been analyzed. Ready to start building your e-commerce platform.
            </AlertDescription>
          </Alert>
          <div className="flex justify-center">
            <Button 
              onClick={handleStartProject}
              className="bg-green-600 hover:bg-green-700"
            >
              Start Project
            </Button>
          </div>
        </div>
      );
    }
    
    // Default view with upload and GitHub buttons
    return (
      <div className="space-y-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Welcome to E-commerce Setup</AlertTitle>
          <AlertDescription>
            To begin building your e-commerce platform, please upload your requirements or connect to GitHub.
          </AlertDescription>
        </Alert>
        
        <div className="flex justify-center space-x-4">
          <Button 
            onClick={handleFileUpload}
            className="bg-blue-600 hover:bg-blue-700"
            disabled={isUploading}
          >
            {isUploading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <FileUp className="h-4 w-4 mr-2" />
            )}
            Upload Requirements
          </Button>
          
          <Button 
            onClick={handleGitHubConnect}
            className="bg-gray-800 hover:bg-gray-900"
            disabled={isConnectingGitHub}
          >
            {isConnectingGitHub ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <GitBranch className="h-4 w-4 mr-2" />
            )}
            Connect GitHub
          </Button>
        </div>
        
        {gitHubConnected && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertTitle>GitHub Connected</AlertTitle>
            <AlertDescription>
              Your GitHub account is connected successfully.
            </AlertDescription>
          </Alert>
        )}
      </div>
    );
  };
  
  return (
    <div className="w-full max-w-3xl mx-auto py-6 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            E-commerce Platform Setup
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderContent()}
        </CardContent>
      </Card>
    </div>
  );
}