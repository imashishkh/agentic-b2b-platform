import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  CheckCircle, 
  Github, 
  GitBranch, 
  FolderTree, 
  FileCode,
  GitFork,
  Lock,
  Unlock,
  ArrowRightCircle,
  AlertTriangle,
  Loader2,
  Copy,
  Check
} from "lucide-react";

import { useToast } from "@/components/ui/use-toast";

export interface ProjectStructureFile {
  path: string;
  type: "file" | "directory";
  children?: ProjectStructureFile[];
}

export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  structure: ProjectStructureFile[];
}

interface EnhancedGitHubSetupProps {
  onRepoCreated: (repoUrl: string) => void;
  onConnect: (token: string) => Promise<boolean>;
  isConnected: boolean;
  isLoading: boolean;
  availableTemplates: ProjectTemplate[];
}

export function EnhancedGitHubSetup({
  onRepoCreated,
  onConnect,
  isConnected,
  isLoading,
  availableTemplates = []
}: EnhancedGitHubSetupProps) {
  const [step, setStep] = useState(isConnected ? 1 : 0);
  const [token, setToken] = useState("");
  const [repoName, setRepoName] = useState("");
  const [repoDesc, setRepoDesc] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [selectedBranch, setSelectedBranch] = useState<string>("main");
  const [connectionProgress, setConnectionProgress] = useState(0);
  const [setupProgress, setSetupProgress] = useState(0);
  const [setupStage, setSetupStage] = useState("");
  const [generatedRepoUrl, setGeneratedRepoUrl] = useState("");
  const { toast } = useToast();

  const branches = [
    { name: "main", description: "Main production branch" },
    { name: "develop", description: "Development integration branch" },
    { name: "feature/initial-setup", description: "Feature branch for initial setup" }
  ];

  const handleConnect = async () => {
    if (!token.trim()) {
      toast({
        title: "Error",
        description: "Please enter a GitHub token",
        variant: "destructive"
      });
      return;
    }

    setConnectionProgress(20);
    setSetupStage("Validating GitHub token...");
    
    try {
      const success = await onConnect(token);
      
      if (success) {
        setConnectionProgress(100);
        setStep(1);
        toast({
          title: "Connected",
          description: "Successfully connected to GitHub",
        });
      } else {
        setConnectionProgress(0);
        toast({
          title: "Connection Failed",
          description: "Invalid GitHub token or connection error",
          variant: "destructive"
        });
      }
    } catch (error) {
      setConnectionProgress(0);
      toast({
        title: "Connection Error",
        description: "Failed to connect to GitHub",
        variant: "destructive"
      });
    }
  };

  const handleCreateRepo = () => {
    if (!repoName.trim()) {
      toast({
        title: "Error",
        description: "Repository name is required",
        variant: "destructive"
      });
      return;
    }

    // Simulate repository creation with a progress indicator
    setSetupProgress(0);
    setSetupStage("Creating repository...");
    
    const simulateSetup = () => {
      setTimeout(() => {
        setSetupProgress(20);
        setSetupStage("Setting up repository structure...");
        
        setTimeout(() => {
          setSetupProgress(40);
          setSetupStage("Configuring branch protection...");
          
          setTimeout(() => {
            setSetupProgress(60);
            setSetupStage("Setting up project files...");
            
            setTimeout(() => {
              setSetupProgress(80);
              setSetupStage("Setting up CI/CD workflows...");
              
              setTimeout(() => {
                setSetupProgress(100);
                setSetupStage("Repository created successfully!");
                
                // Generate a mock repository URL
                const url = `https://github.com/user/${repoName}`;
                setGeneratedRepoUrl(url);
                onRepoCreated(url);
                
                setStep(2);
              }, 1500);
            }, 1500);
          }, 1500);
        }, 1500);
      }, 1500);
    };
    
    simulateSetup();
  };

  const renderFileTree = (files: ProjectStructureFile[], level = 0) => {
    return (
      <ul className={`pl-${level > 0 ? 4 : 0}`}>
        {files.map((file, index) => (
          <li key={index} className="py-1">
            <div className="flex items-center">
              {file.type === "directory" ? (
                <FolderTree className="h-4 w-4 text-blue-500 mr-2" />
              ) : (
                <FileCode className="h-4 w-4 text-gray-500 mr-2" />
              )}
              <span className="text-sm">{file.path}</span>
            </div>
            {file.children && file.children.length > 0 && (
              <div className="ml-4 mt-1 border-l-2 border-gray-200 pl-2">
                {renderFileTree(file.children, level + 1)}
              </div>
            )}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <Card className="w-full shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Github className="h-5 w-5" />
          GitHub Project Setup
        </CardTitle>
        <CardDescription>
          Set up your project with GitHub repository integration
        </CardDescription>
      </CardHeader>
      <CardContent>
        {step === 0 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="github-token">GitHub Personal Access Token</Label>
              <div className="flex items-center gap-2">
                <Input 
                  id="github-token" 
                  type="password" 
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxx" 
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                />
                <Button 
                  onClick={handleConnect}
                  disabled={isLoading || !token.trim() || connectionProgress > 0}
                >
                  {connectionProgress > 0 ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Github className="h-4 w-4 mr-2" />
                  )}
                  Connect
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Create a token with <code>repo</code> and <code>workflow</code> scopes at 
                GitHub Settings → Developer settings → Personal access tokens
              </p>
            </div>
            
            {connectionProgress > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span>{setupStage}</span>
                  <span>{connectionProgress}%</span>
                </div>
                <Progress value={connectionProgress} className="h-2" />
              </div>
            )}

            <div className="rounded-lg bg-amber-50 border border-amber-100 p-4">
              <div className="flex gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0" />
                <div className="text-sm text-amber-800">
                  <p className="font-medium mb-1">GitHub Repository Required</p>
                  <p>A GitHub repository is required to store your project code and enable collaboration. Your repository will be set up with best practices for your project type.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6">
            <div className="rounded-lg bg-green-50 border border-green-100 p-4 flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
              <div className="text-sm text-green-800">
                <p className="font-medium">GitHub Connected</p>
                <p>Your GitHub account is connected. Now let's set up your project repository.</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="repo-name">Repository Name</Label>
                <Input 
                  id="repo-name" 
                  placeholder="my-ecommerce-project" 
                  value={repoName}
                  onChange={(e) => setRepoName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="repo-desc">Description (optional)</Label>
                <Textarea 
                  id="repo-desc" 
                  placeholder="An e-commerce project built with React and Node.js" 
                  value={repoDesc}
                  onChange={(e) => setRepoDesc(e.target.value)}
                  rows={2}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="private-repo"
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="private-repo" className="text-sm font-normal">
                  Private repository {isPrivate ? <Lock className="h-3 w-3 inline ml-1" /> : <Unlock className="h-3 w-3 inline ml-1" />}
                </Label>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="template">Project Template</Label>
                <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                  <SelectTrigger id="template">
                    <SelectValue placeholder="Select a project template" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTemplates.map(template => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedTemplate && (
                <div className="rounded-lg border p-4 space-y-3">
                  <h3 className="text-sm font-medium">Template Preview</h3>
                  
                  {availableTemplates.find(t => t.id === selectedTemplate) && (
                    <>
                      <div>
                        <h4 className="text-xs font-medium text-gray-500">Technologies</h4>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {availableTemplates.find(t => t.id === selectedTemplate)?.technologies.map((tech, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-xs font-medium text-gray-500">Project Structure</h4>
                        <div className="mt-1 max-h-40 overflow-y-auto border rounded p-2">
                          {renderFileTree(availableTemplates.find(t => t.id === selectedTemplate)?.structure || [])}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="branch-strategy">Branch Strategy</Label>
                <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                  <SelectTrigger id="branch-strategy">
                    <SelectValue placeholder="Select primary branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map(branch => (
                      <SelectItem key={branch.name} value={branch.name}>
                        {branch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <div className="text-xs text-gray-500 mt-2">
                  Selected: <Badge variant="outline" className="ml-1 bg-purple-50">
                    <GitBranch className="h-3 w-3 mr-1" />
                    {selectedBranch}
                  </Badge> - {branches.find(b => b.name === selectedBranch)?.description}
                </div>
              </div>
              
              {setupProgress > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span>{setupStage}</span>
                    <span>{setupProgress}%</span>
                  </div>
                  <Progress value={setupProgress} className="h-2" />
                </div>
              )}
              
              <Button 
                onClick={handleCreateRepo} 
                className="w-full bg-purple-600 hover:bg-purple-700"
                disabled={!repoName.trim() || !selectedTemplate || setupProgress > 0}
              >
                {setupProgress > 0 ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <GitFork className="h-4 w-4 mr-2" />
                )}
                Create Repository
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="rounded-lg bg-green-50 border border-green-100 p-4">
              <div className="flex gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                <div className="text-sm text-green-800">
                  <p className="font-medium mb-1">Repository Created Successfully!</p>
                  <p>Your GitHub repository has been set up with all necessary files and configurations.</p>
                </div>
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="text-sm font-medium mb-2">Repository Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Repository Name:</span>
                  <span className="font-medium">{repoName}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Visibility:</span>
                  <span className="font-medium flex items-center">
                    {isPrivate ? (
                      <>Private <Lock className="h-3 w-3 ml-1" /></>
                    ) : (
                      <>Public <Unlock className="h-3 w-3 ml-1" /></>
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Default Branch:</span>
                  <span className="font-medium flex items-center">
                    <GitBranch className="h-3 w-3 mr-1" /> {selectedBranch}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">URL:</span>
                  <div className="flex items-center gap-1">
                    <a 
                      href={generatedRepoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="font-medium text-purple-600 hover:underline"
                    >
                      {generatedRepoUrl}
                    </a>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-6 w-6" 
                      onClick={() => {
                        navigator.clipboard.writeText(generatedRepoUrl);
                        toast({
                          title: "Copied!",
                          description: "Repository URL copied to clipboard",
                        });
                      }}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Next Steps</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Repository created and configured</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Project structure initialized</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>CI/CD workflows configured</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <ArrowRightCircle className="h-4 w-4 text-purple-500" />
                  <span>Continue to set up UI components</span>
                </li>
              </ul>
            </div>
            
            <Button 
              className="w-full bg-purple-600 hover:bg-purple-700"
              onClick={() => window.open(generatedRepoUrl, '_blank')}
            >
              <Github className="h-4 w-4 mr-2" />
              Open Repository
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}