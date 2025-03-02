
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { 
  Github, 
  RefreshCw, 
  Link2, 
  Check, 
  AlertCircle, 
  GitBranch, 
  GitPullRequest,
  GitFork,
  Lock,
  Unlock,
  Copy
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useChat } from '@/contexts/ChatContext';
import { toast } from 'sonner';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Textarea } from '@/components/ui/textarea';
import { 
  githubService, 
  GitHubRepo, 
  GitHubBranch, 
  GitHubPR, 
  repositoryTemplates 
} from '@/services/GitHubService';

// Extended GitHub Repository type
interface ExtendedGitHubRepository extends GitHubRepo {
  status?: string;
  lastCommit?: string;
  connected?: boolean;
  lastSynced?: string | Date;
  branches?: GitHubBranch[];
  pullRequests?: GitHubPR[];
}

export const GitHubIntegration = () => {
  const [repoUrl, setRepoUrl] = useState('');
  const [githubToken, setGithubToken] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [repositories, setRepositories] = useState<ExtendedGitHubRepository[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [selectedRepo, setSelectedRepo] = useState<ExtendedGitHubRepository | null>(null);
  const [newRepoName, setNewRepoName] = useState('');
  const [newRepoDescription, setNewRepoDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('react-app');
  const [newBranchName, setNewBranchName] = useState('');
  const [sourceBranch, setSourceBranch] = useState('');
  const [prTitle, setPrTitle] = useState('');
  const [prDescription, setPrDescription] = useState('');
  const [targetBranch, setTargetBranch] = useState('');
  const [isTokenDialogOpen, setIsTokenDialogOpen] = useState(false);
  
  useEffect(() => {
    const token = githubService.getToken();
    if (token) {
      checkAuth(token);
    }
  }, []);
  
  const checkAuth = async (token: string) => {
    try {
      const valid = await githubService.validateToken();
      setIsConnected(valid);
      
      if (valid) {
        loadUserData();
        fetchRepositories();
      }
    } catch (error) {
      console.error("Authentication error:", error);
      setIsConnected(false);
    }
  };
  
  const loadUserData = async () => {
    try {
      const userData = await githubService.getCurrentUser();
      setCurrentUser(userData);
    } catch (error) {
      console.error("Error loading user data:", error);
      toast.error("Failed to load GitHub user data");
    }
  };
  
  const fetchRepositories = async () => {
    setIsLoading(true);
    try {
      const repos = await githubService.listRepositories();
      setRepositories(repos.map(repo => ({
        ...repo,
        status: 'synced',
        connected: true,
        lastSynced: new Date()
      })));
    } catch (error) {
      console.error("Error fetching repositories:", error);
      toast.error("Failed to fetch repositories");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleConnectWithToken = async () => {
    if (!githubToken) {
      toast.error("Please enter a GitHub token");
      return;
    }
    
    setIsConnecting(true);
    
    try {
      const isValid = await githubService.setToken(githubToken);
      
      if (isValid) {
        setIsConnected(true);
        setGithubToken('');
        setIsTokenDialogOpen(false);
        toast.success("Successfully connected to GitHub");
        loadUserData();
        fetchRepositories();
      } else {
        toast.error("Invalid GitHub token");
      }
    } catch (error) {
      console.error("Error connecting to GitHub:", error);
      toast.error("Failed to connect to GitHub");
    } finally {
      setIsConnecting(false);
    }
  };
  
  const handleCreateRepo = async () => {
    if (!newRepoName) {
      toast.error("Repository name is required");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const repo = await githubService.createRepository(
        newRepoName,
        newRepoDescription,
        isPrivate
      );
      
      toast.success(`Repository ${repo.name} created successfully`);
      
      // Set up CI/CD workflows
      const template = repositoryTemplates.find(t => t.id === selectedTemplate);
      if (template) {
        const workflowFiles = githubService.generateWorkflowFiles(template.workflowType as any);
        await githubService.setupCiCdWorkflow(repo.owner.login, repo.name, workflowFiles);
        
        // Create branches according to the template
        const defaultBranch = repo.default_branch;
        for (const branch of template.branchStrategy) {
          if (branch.name !== defaultBranch && !branch.name.includes('*')) {
            await githubService.createBranch(
              repo.owner.login,
              repo.name,
              branch.name,
              defaultBranch
            );
          }
        }
        
        toast.success("CI/CD workflows and branch strategy set up successfully");
      }
      
      // Refresh repositories list
      fetchRepositories();
      
      // Reset form
      setNewRepoName('');
      setNewRepoDescription('');
      setIsPrivate(false);
      setSelectedTemplate('react-app');
      
    } catch (error) {
      console.error("Error creating repository:", error);
      toast.error("Failed to create repository");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleViewRepository = async (repo: ExtendedGitHubRepository) => {
    setIsLoading(true);
    setSelectedRepo(repo);
    
    try {
      // Fetch branches
      const branches = await githubService.listBranches(repo.owner.login, repo.name);
      
      // Fetch pull requests
      const pullRequests = await githubService.listPullRequests(repo.owner.login, repo.name);
      
      // Update the selected repository with fetched data
      setSelectedRepo({
        ...repo,
        branches,
        pullRequests
      });
      
      // Set default source branch and target branch for new PRs
      if (branches.length > 0) {
        setSourceBranch(branches[0].name);
        setTargetBranch(repo.default_branch);
      }
      
    } catch (error) {
      console.error("Error loading repository details:", error);
      toast.error("Failed to load repository details");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCreateBranch = async () => {
    if (!selectedRepo || !newBranchName || !sourceBranch) {
      toast.error("Repository, branch name and source branch are required");
      return;
    }
    
    setIsLoading(true);
    
    try {
      await githubService.createBranch(
        selectedRepo.owner.login,
        selectedRepo.name,
        newBranchName,
        sourceBranch
      );
      
      toast.success(`Branch ${newBranchName} created successfully`);
      
      // Refresh the selected repository
      handleViewRepository(selectedRepo);
      
      // Reset form
      setNewBranchName('');
      
    } catch (error) {
      console.error("Error creating branch:", error);
      toast.error("Failed to create branch");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCreatePR = async () => {
    if (!selectedRepo || !prTitle || !sourceBranch || !targetBranch) {
      toast.error("All fields are required to create a pull request");
      return;
    }
    
    setIsLoading(true);
    
    try {
      await githubService.createPullRequest(
        selectedRepo.owner.login,
        selectedRepo.name,
        prTitle,
        sourceBranch,
        targetBranch,
        prDescription
      );
      
      toast.success("Pull request created successfully");
      
      // Refresh the selected repository
      handleViewRepository(selectedRepo);
      
      // Reset form
      setPrTitle('');
      setPrDescription('');
      
    } catch (error) {
      console.error("Error creating pull request:", error);
      toast.error("Failed to create pull request");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDisconnect = () => {
    githubService.clearToken();
    setIsConnected(false);
    setCurrentUser(null);
    setRepositories([]);
    setSelectedRepo(null);
    toast.success("Disconnected from GitHub");
  };
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy HH:mm');
    } catch (error) {
      return dateString;
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Github className="h-5 w-5" />
            GitHub Integration
          </CardTitle>
          <CardDescription>
            Connect your GitHub account to manage repositories, branches, and CI/CD
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isConnected ? (
            <div className="space-y-4">
              <Dialog open={isTokenDialogOpen} onOpenChange={setIsTokenDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    <Github className="h-4 w-4 mr-2" />
                    Connect to GitHub
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Connect with GitHub Token</DialogTitle>
                    <DialogDescription>
                      Enter a personal access token with repo and workflow scopes.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="github-token">GitHub Personal Access Token</Label>
                      <Input
                        id="github-token"
                        type="password"
                        placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                        value={githubToken}
                        onChange={(e) => setGithubToken(e.target.value)}
                      />
                      <p className="text-xs text-gray-500">
                        Tokens can be created in GitHub under Settings {'->'} Developer settings {'->'} Personal access tokens
                      </p>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsTokenDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleConnectWithToken} 
                      disabled={!githubToken || isConnecting}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      {isConnecting ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Connecting...
                        </>
                      ) : (
                        <>
                          <Link2 className="h-4 w-4 mr-2" />
                          Connect
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 flex items-center text-amber-800">
                <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mr-3" />
                <div className="text-sm">
                  <p>Connect to GitHub to manage repositories, branches, and set up CI/CD workflows for your project.</p>
                </div>
              </div>
            </div>
          ) : (
            <Tabs defaultValue="repositories">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                    <Check className="h-3 w-3 mr-1" /> Connected
                  </Badge>
                  {currentUser && (
                    <span className="text-sm text-gray-600">
                      Logged in as <strong>{currentUser.login}</strong>
                    </span>
                  )}
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleDisconnect}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  Disconnect
                </Button>
              </div>
              
              <TabsList className="mb-4">
                <TabsTrigger value="repositories">Repositories</TabsTrigger>
                <TabsTrigger value="create">Create Repo</TabsTrigger>
                {selectedRepo && (
                  <TabsTrigger value="manage">Manage Repo</TabsTrigger>
                )}
              </TabsList>
              
              <TabsContent value="repositories">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium">Your Repositories</h3>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={fetchRepositories}
                      disabled={isLoading}
                      className="text-purple-600 border-purple-200"
                    >
                      <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                      Refresh
                    </Button>
                  </div>
                  
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <RefreshCw className="h-8 w-8 animate-spin text-purple-600" />
                    </div>
                  ) : repositories.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <p>No repositories found.</p>
                      <p className="text-sm mt-2">Create a new repository or refresh the list.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {repositories.map((repo) => (
                        <Card key={repo.id} className="bg-gray-50">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium flex items-center">
                                  {repo.name}
                                  {repo.private && (
                                    <Badge 
                                      variant="outline" 
                                      className="ml-2 bg-gray-100 text-gray-800 border-gray-200"
                                    >
                                      <Lock className="h-3 w-3 mr-1" /> Private
                                    </Badge>
                                  )}
                                </h4>
                                <p className="text-sm text-gray-500 mt-1">{repo.full_name}</p>
                                {repo.description && (
                                  <p className="text-sm mt-2">{repo.description}</p>
                                )}
                                <div className="flex items-center mt-2 gap-3">
                                  <span className="text-xs text-gray-500">
                                    Default branch: {repo.default_branch}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    Updated: {formatDate(repo.updated_at)}
                                  </span>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="text-purple-600 border-purple-200"
                                  onClick={() => window.open(repo.html_url, '_blank')}
                                >
                                  <Github className="h-4 w-4 mr-2" />
                                  View
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="text-purple-600 border-purple-200"
                                  onClick={() => handleViewRepository(repo)}
                                >
                                  <GitBranch className="h-4 w-4 mr-2" />
                                  Manage
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="create">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="repo-name">Repository Name</Label>
                    <Input
                      id="repo-name"
                      placeholder="my-awesome-project"
                      value={newRepoName}
                      onChange={(e) => setNewRepoName(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="repo-desc">Description (optional)</Label>
                    <Input
                      id="repo-desc"
                      placeholder="Description of your project"
                      value={newRepoDescription}
                      onChange={(e) => setNewRepoDescription(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="private-repo"
                      checked={isPrivate}
                      onChange={(e) => setIsPrivate(e.target.checked)}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <Label htmlFor="private-repo" className="text-sm font-normal">
                      Private repository
                    </Label>
                  </div>
                  
                  <div className="space-y-2 mt-4">
                    <Label htmlFor="template">Repository Template</Label>
                    <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                      <SelectTrigger id="template">
                        <SelectValue placeholder="Select a template" />
                      </SelectTrigger>
                      <SelectContent>
                        {repositoryTemplates.map((template) => (
                          <SelectItem key={template.id} value={template.id}>{template.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    {selectedTemplate && (
                      <div className="mt-2">
                        {repositoryTemplates.find(t => t.id === selectedTemplate)?.description && (
                          <p className="text-sm text-gray-500 mb-2">
                            {repositoryTemplates.find(t => t.id === selectedTemplate)?.description}
                          </p>
                        )}
                        
                        <Accordion type="single" collapsible>
                          <AccordionItem value="branch-strategy">
                            <AccordionTrigger className="text-sm">
                              Branch Strategy
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="space-y-2">
                                {repositoryTemplates
                                  .find(t => t.id === selectedTemplate)
                                  ?.branchStrategy.map((branch, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                      <GitBranch className="h-4 w-4 text-gray-500" />
                                      <span className="text-sm font-medium">{branch.name}</span>
                                      <span className="text-xs text-gray-500">- {branch.description}</span>
                                    </div>
                                  ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                          
                          <AccordionItem value="cicd">
                            <AccordionTrigger className="text-sm">
                              CI/CD Configuration
                            </AccordionTrigger>
                            <AccordionContent>
                              <p className="text-sm text-gray-500 mb-2">
                                This template will set up GitHub Actions with these workflows:
                              </p>
                              <div className="space-y-2">
                                {githubService
                                  .generateWorkflowFiles(repositoryTemplates.find(t => t.id === selectedTemplate)?.workflowType as any)
                                  .map((file, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                      <div className="h-2 w-2 rounded-full bg-purple-500" />
                                      <span className="text-sm">{file.name}</span>
                                    </div>
                                  ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    className="w-full mt-4 bg-purple-600 hover:bg-purple-700"
                    onClick={handleCreateRepo}
                    disabled={!newRepoName || isLoading}
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Creating Repository...
                      </>
                    ) : (
                      <>
                        <GitFork className="h-4 w-4 mr-2" />
                        Create Repository
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>
              
              {selectedRepo && (
                <TabsContent value="manage">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium">{selectedRepo.name}</h3>
                        <p className="text-sm text-gray-500">{selectedRepo.full_name}</p>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="text-purple-600 border-purple-200"
                        onClick={() => window.open(selectedRepo.html_url, '_blank')}
                      >
                        <Github className="h-4 w-4 mr-2" />
                        Open in GitHub
                      </Button>
                    </div>
                    
                    <Tabs defaultValue="branches">
                      <TabsList>
                        <TabsTrigger value="branches">Branches</TabsTrigger>
                        <TabsTrigger value="pulls">Pull Requests</TabsTrigger>
                        <TabsTrigger value="ci-cd">CI/CD</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="branches" className="space-y-4 pt-4">
                        <div className="space-y-4">
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-base">Create Branch</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <Label htmlFor="branch-name">Branch Name</Label>
                                  <Input
                                    id="branch-name"
                                    placeholder="feature/new-feature"
                                    value={newBranchName}
                                    onChange={(e) => setNewBranchName(e.target.value)}
                                  />
                                </div>
                                
                                <div className="space-y-2">
                                  <Label htmlFor="source-branch">Source Branch</Label>
                                  <Select value={sourceBranch} onValueChange={setSourceBranch}>
                                    <SelectTrigger id="source-branch">
                                      <SelectValue placeholder="Select source branch" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {selectedRepo.branches?.map((branch) => (
                                        <SelectItem key={branch.name} value={branch.name}>
                                          {branch.name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                
                                <Button 
                                  onClick={handleCreateBranch}
                                  disabled={!newBranchName || !sourceBranch || isLoading}
                                  className="bg-purple-600 hover:bg-purple-700"
                                >
                                  {isLoading ? (
                                    <>
                                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                      Creating...
                                    </>
                                  ) : (
                                    <>
                                      <GitBranch className="h-4 w-4 mr-2" />
                                      Create Branch
                                    </>
                                  )}
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                          
                          <h3 className="text-sm font-medium">Existing Branches</h3>
                          
                          {isLoading ? (
                            <div className="flex justify-center py-8">
                              <RefreshCw className="h-8 w-8 animate-spin text-purple-600" />
                            </div>
                          ) : selectedRepo.branches?.length ? (
                            <div className="space-y-2">
                              {selectedRepo.branches.map((branch) => (
                                <Card key={branch.name} className="bg-gray-50">
                                  <CardContent className="p-4">
                                    <div className="flex justify-between items-center">
                                      <div className="flex items-center">
                                        <GitBranch className="h-4 w-4 mr-2 text-gray-500" />
                                        <span className="font-medium">{branch.name}</span>
                                        {branch.name === selectedRepo.default_branch && (
                                          <Badge className="ml-2 bg-green-100 text-green-800 border-green-200">
                                            Default
                                          </Badge>
                                        )}
                                        {branch.protected && (
                                          <Badge className="ml-2 bg-amber-100 text-amber-800 border-amber-200">
                                            <Lock className="h-3 w-3 mr-1" /> Protected
                                          </Badge>
                                        )}
                                      </div>
                                      <div className="flex gap-2">
                                        <Button 
                                          size="sm" 
                                          variant="outline"
                                          className="text-purple-600 border-purple-200"
                                          onClick={() => {
                                            setSourceBranch(branch.name);
                                            setTargetBranch(selectedRepo.default_branch);
                                            setPrTitle(`Merge ${branch.name} into ${selectedRepo.default_branch}`);
                                          }}
                                        >
                                          <GitPullRequest className="h-4 w-4 mr-2" />
                                          Create PR
                                        </Button>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-8 text-gray-500">
                              <p>No branches found.</p>
                            </div>
                          )}
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="pulls" className="space-y-4 pt-4">
                        <div className="space-y-4">
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-base">Create Pull Request</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <Label htmlFor="pr-title">Title</Label>
                                  <Input
                                    id="pr-title"
                                    placeholder="Add new feature"
                                    value={prTitle}
                                    onChange={(e) => setPrTitle(e.target.value)}
                                  />
                                </div>
                                
                                <div className="space-y-2">
                                  <Label htmlFor="pr-description">Description (optional)</Label>
                                  <Textarea
                                    id="pr-description"
                                    placeholder="Description of the changes"
                                    value={prDescription}
                                    onChange={(e) => setPrDescription(e.target.value)}
                                    rows={3}
                                  />
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="source-branch-pr">Source Branch</Label>
                                    <Select value={sourceBranch} onValueChange={setSourceBranch}>
                                      <SelectTrigger id="source-branch-pr">
                                        <SelectValue placeholder="Select source branch" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {selectedRepo.branches?.map((branch) => (
                                          <SelectItem key={branch.name} value={branch.name}>
                                            {branch.name}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <Label htmlFor="target-branch">Target Branch</Label>
                                    <Select value={targetBranch} onValueChange={setTargetBranch}>
                                      <SelectTrigger id="target-branch">
                                        <SelectValue placeholder="Select target branch" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {selectedRepo.branches?.map((branch) => (
                                          <SelectItem key={branch.name} value={branch.name}>
                                            {branch.name}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                                
                                <Button 
                                  onClick={handleCreatePR}
                                  disabled={!prTitle || !sourceBranch || !targetBranch || sourceBranch === targetBranch || isLoading}
                                  className="bg-purple-600 hover:bg-purple-700"
                                >
                                  {isLoading ? (
                                    <>
                                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                      Creating...
                                    </>
                                  ) : (
                                    <>
                                      <GitPullRequest className="h-4 w-4 mr-2" />
                                      Create Pull Request
                                    </>
                                  )}
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                          
                          <h3 className="text-sm font-medium">Open Pull Requests</h3>
                          
                          {isLoading ? (
                            <div className="flex justify-center py-8">
                              <RefreshCw className="h-8 w-8 animate-spin text-purple-600" />
                            </div>
                          ) : selectedRepo.pullRequests?.length ? (
                            <div className="space-y-2">
                              {selectedRepo.pullRequests.map((pr) => (
                                <Card key={pr.id} className="bg-gray-50">
                                  <CardContent className="p-4">
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <h4 className="font-medium flex items-center">
                                          <GitPullRequest className="h-4 w-4 mr-2 text-purple-600" />
                                          {pr.title}
                                          <Badge 
                                            className={`ml-2 ${
                                              pr.state === 'open' 
                                                ? 'bg-green-100 text-green-800 border-green-200' 
                                                : 'bg-purple-100 text-purple-800 border-purple-200'
                                            }`}
                                          >
                                            {pr.state}
                                          </Badge>
                                        </h4>
                                        <p className="text-sm text-gray-500 mt-1">
                                          #{pr.number} opened by {pr.user.login} on {formatDate(pr.created_at)}
                                        </p>
                                      </div>
                                      <Button 
                                        size="sm" 
                                        variant="outline"
                                        className="text-purple-600 border-purple-200"
                                        onClick={() => window.open(pr.html_url, '_blank')}
                                      >
                                        <Github className="h-4 w-4 mr-2" />
                                        View
                                      </Button>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-8 text-gray-500">
                              <p>No pull requests found.</p>
                            </div>
                          )}
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="ci-cd" className="pt-4">
                        <div className="space-y-6">
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-base">CI/CD Configuration</CardTitle>
                              <CardDescription>
                                Set up GitHub Actions workflows for your repository
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                <Select 
                                  defaultValue="react" 
                                  onValueChange={(value) => {
                                    // This would be hooked up to actual workflow setup
                                    toast.success(`Selected ${value} workflow template`);
                                  }}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select workflow template" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="react">React App Workflow</SelectItem>
                                    <SelectItem value="node">Node.js API Workflow</SelectItem>
                                    <SelectItem value="static">Static Site Deployment</SelectItem>
                                  </SelectContent>
                                </Select>
                                
                                <div className="rounded-lg bg-purple-50 border border-purple-200 p-4">
                                  <h4 className="font-medium text-purple-800 mb-2">Workflow Preview</h4>
                                  <pre className="text-xs overflow-auto p-2 bg-gray-800 text-gray-200 rounded">
                                    {`name: React CI/CD

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    - name: Install Dependencies
      run: npm ci
    - name: Build
      run: npm run build
    - name: Test
      run: npm test || true`}
                                  </pre>
                                </div>
                                
                                <Button 
                                  className="w-full bg-purple-600 hover:bg-purple-700"
                                  onClick={() => {
                                    toast.success("CI/CD workflow configured successfully");
                                  }}
                                >
                                  <RefreshCw className="h-4 w-4 mr-2" />
                                  Set Up CI/CD Workflow
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                          
                          <div className="space-y-2">
                            <h3 className="text-sm font-medium">CI/CD Best Practices</h3>
                            <ul className="space-y-2 text-sm">
                              <li className="flex gap-2">
                                <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                                <span>
                                  <strong>Branch Protection Rules:</strong> Require pull request reviews before merging code to main branches
                                </span>
                              </li>
                              <li className="flex gap-2">
                                <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                                <span>
                                  <strong>Status Checks:</strong> Ensure all CI checks pass before allowing merges
                                </span>
                              </li>
                              <li className="flex gap-2">
                                <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                                <span>
                                  <strong>Automated Testing:</strong> Run unit, integration, and end-to-end tests automatically
                                </span>
                              </li>
                              <li className="flex gap-2">
                                <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                                <span>
                                  <strong>Deployment Environments:</strong> Configure separate workflows for staging and production
                                </span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </TabsContent>
              )}
            </Tabs>
          )}
        </CardContent>
      </Card>
      
      {isConnected && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Repository Best Practices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex gap-2">
                <div className="h-5 w-5 flex items-center justify-center rounded-full bg-purple-100 text-purple-800">1</div>
                <p className="flex-1"><strong>Branch Strategy:</strong> Use main for production, develop for development, and feature/* for new features</p>
              </div>
              <div className="flex gap-2">
                <div className="h-5 w-5 flex items-center justify-center rounded-full bg-purple-100 text-purple-800">2</div>
                <p className="flex-1"><strong>Pull Requests:</strong> Always use pull requests with at least one reviewer before merging</p>
              </div>
              <div className="flex gap-2">
                <div className="h-5 w-5 flex items-center justify-center rounded-full bg-purple-100 text-purple-800">3</div>
                <p className="flex-1"><strong>CI/CD:</strong> Implement automated testing and deployment workflows</p>
              </div>
              <div className="flex gap-2">
                <div className="h-5 w-5 flex items-center justify-center rounded-full bg-purple-100 text-purple-800">4</div>
                <p className="flex-1"><strong>Documentation:</strong> Maintain a comprehensive README.md and CONTRIBUTING.md</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
