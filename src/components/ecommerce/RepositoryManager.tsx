import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { githubService, repositoryTemplates, GitHubRepo } from "@/services/GitHubService";

interface RepositoryManagerProps {
  onSelectRepo?: (repo: GitHubRepo) => void;
}

export function RepositoryManager({ onSelectRepo }: RepositoryManagerProps) {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [createDialogOpen, setCreateDialogOpen] = useState<boolean>(false);
  const [tokenDialogOpen, setTokenDialogOpen] = useState<boolean>(false);
  const [githubToken, setGithubToken] = useState<string>("");
  const [newRepoName, setNewRepoName] = useState<string>("");
  const [newRepoDescription, setNewRepoDescription] = useState<string>("");
  const [newRepoType, setNewRepoType] = useState<string>("ecommerce-react");
  const [isPrivate, setIsPrivate] = useState<boolean>(true);
  
  // Check if token exists on component mount
  useEffect(() => {
    const checkToken = async () => {
      const token = githubService.getToken();
      if (token) {
        const isValid = await githubService.validateToken();
        if (isValid) {
          loadRepositories();
        } else {
          setTokenDialogOpen(true);
        }
      } else {
        setTokenDialogOpen(true);
      }
    };
    
    checkToken();
  }, []);
  
  const loadRepositories = async () => {
    setIsLoading(true);
    try {
      const repos = await githubService.listRepositories(1, 100);
      setRepos(repos);
    } catch (error) {
      console.error("Error loading repositories:", error);
      toast.error("Failed to load repositories");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSaveToken = async () => {
    if (!githubToken.trim()) {
      toast.error("Please enter a GitHub token");
      return;
    }
    
    try {
      const isValid = await githubService.setToken(githubToken);
      if (isValid) {
        toast.success("GitHub token saved successfully");
        setTokenDialogOpen(false);
        loadRepositories();
      } else {
        toast.error("Invalid GitHub token");
      }
    } catch (error) {
      console.error("Error validating token:", error);
      toast.error("Failed to validate GitHub token");
    }
  };
  
  const handleCreateRepository = async () => {
    if (!newRepoName.trim()) {
      toast.error("Please enter a repository name");
      return;
    }
    
    setIsLoading(true);
    try {
      const repo = await githubService.createEcommerceRepository(
        newRepoName,
        newRepoDescription,
        newRepoType as 'ecommerce-react' | 'ecommerce-api',
        isPrivate
      );
      
      setRepos(prevRepos => [repo, ...prevRepos]);
      setSelectedRepo(repo);
      if (onSelectRepo) {
        onSelectRepo(repo);
      }
      setCreateDialogOpen(false);
      
      toast.success(`Repository ${repo.name} created successfully`);
    } catch (error) {
      console.error("Error creating repository:", error);
      toast.error(error instanceof Error ? error.message : "Failed to create repository");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>GitHub Repositories</CardTitle>
          <CardDescription>
            Manage your e-commerce repositories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={loadRepositories}
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Refresh Repositories"}
              </Button>
              
              <Button
                onClick={() => setCreateDialogOpen(true)}
                disabled={isLoading}
              >
                Create E-commerce Repository
              </Button>
            </div>
            
            {repos.length > 0 ? (
              <div className="grid gap-4">
                <Select 
                  value={selectedRepo?.full_name || ""} 
                  onValueChange={(value) => {
                    const repo = repos.find(r => r.full_name === value);
                    setSelectedRepo(repo || null);
                    if (repo && onSelectRepo) {
                      onSelectRepo(repo);
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a repository" />
                  </SelectTrigger>
                  <SelectContent>
                    {repos.map((repo) => (
                      <SelectItem key={repo.id} value={repo.full_name}>
                        {repo.full_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {selectedRepo && (
                  <div className="border rounded-md p-4">
                    <h3 className="text-lg font-medium">{selectedRepo.name}</h3>
                    <p className="text-sm text-gray-500">
                      {selectedRepo.description || "No description"}
                    </p>
                    <div className="mt-2 text-sm">
                      <p>Default branch: {selectedRepo.default_branch}</p>
                      <p>Visibility: {selectedRepo.private ? "Private" : "Public"}</p>
                    </div>
                    <div className="mt-4">
                      <Button
                        variant="outline"
                        onClick={() => window.open(selectedRepo.html_url, "_blank")}
                      >
                        View on GitHub
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No repositories found</p>
                <Button
                  variant="outline"
                  onClick={() => setCreateDialogOpen(true)}
                  className="mt-4"
                >
                  Create Your First Repository
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Create Repository Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create E-commerce Repository</DialogTitle>
            <DialogDescription>
              Create a new GitHub repository with e-commerce templates
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Repository Name</label>
              <Input
                placeholder="e.g., my-ecommerce-store"
                value={newRepoName}
                onChange={(e) => setNewRepoName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                placeholder="E-commerce application built with React and Node.js"
                value={newRepoDescription}
                onChange={(e) => setNewRepoDescription(e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Repository Type</label>
              <Select 
                value={newRepoType} 
                onValueChange={setNewRepoType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select repository type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ecommerce-react">E-commerce Frontend (React)</SelectItem>
                  <SelectItem value="ecommerce-api">E-commerce Backend API</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is-private"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="is-private" className="text-sm font-medium">
                Private Repository
              </label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateRepository} disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Repository"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* GitHub Token Dialog */}
      <Dialog open={tokenDialogOpen} onOpenChange={setTokenDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>GitHub Access Token</DialogTitle>
            <DialogDescription>
              Enter your GitHub personal access token with repo scope
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">GitHub Token</label>
              <Input
                type="password"
                placeholder="ghp_xxxxxxxxxxxxxxxx"
                value={githubToken}
                onChange={(e) => setGithubToken(e.target.value)}
              />
              <p className="text-xs text-gray-500">
                Your token needs the 'repo' scope to create and manage repositories
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button onClick={handleSaveToken} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Token"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}