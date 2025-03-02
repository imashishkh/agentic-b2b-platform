
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { GitHubRepository } from "@/contexts/types";
import { AlertCircle, Check, Github, GitBranch, RefreshCw } from "lucide-react";
import { useChat } from "@/contexts/ChatContext";
import { toast } from "sonner";

export const GitHubIntegration: React.FC = () => {
  const { gitHubRepository, setGitHubRepository } = useChat();
  const [repoUrl, setRepoUrl] = useState("");
  const [branch, setBranch] = useState("main");
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  
  const handleConnect = () => {
    setIsConnecting(true);
    setConnectionError(null);
    
    // Validate the GitHub URL
    if (!repoUrl.match(/github\.com\/[\w-]+\/[\w-]+/)) {
      setConnectionError("Please enter a valid GitHub repository URL");
      setIsConnecting(false);
      return;
    }
    
    // Simulate connecting to GitHub
    setTimeout(() => {
      try {
        // Extract repo name from URL
        const urlParts = repoUrl.split('/');
        const repoName = urlParts[urlParts.length - 1].replace('.git', '');
        
        setGitHubRepository({
          name: repoName,
          url: repoUrl,
          branch: branch,
          connected: true,
          lastSynced: new Date()
        });
        
        toast.success("Successfully connected to GitHub repository");
        setIsConnecting(false);
      } catch (error) {
        setConnectionError("Failed to connect to GitHub repository");
        setIsConnecting(false);
      }
    }, 1500);
  };
  
  const handleDisconnect = () => {
    setGitHubRepository(null);
    toast.success("Disconnected from GitHub repository");
  };
  
  const handleSync = () => {
    // Simulate syncing with GitHub
    toast.success("Syncing with GitHub repository...");
    
    setTimeout(() => {
      if (gitHubRepository) {
        setGitHubRepository({
          ...gitHubRepository,
          lastSynced: new Date()
        });
        toast.success("Successfully synced with GitHub repository");
      }
    }, 1500);
  };
  
  return (
    <div>
      {gitHubRepository ? (
        <ConnectedRepository 
          repository={gitHubRepository} 
          onDisconnect={handleDisconnect}
          onSync={handleSync}
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Github className="mr-2 h-5 w-5" />
              GitHub Integration
            </CardTitle>
            <CardDescription>
              Connect your project to a GitHub repository for version control and collaboration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog>
              <DialogTrigger asChild>
                <Button>Connect Repository</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Connect to GitHub Repository</DialogTitle>
                </DialogHeader>
                <div className="py-4 space-y-4">
                  {connectionError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{connectionError}</AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="repo-url">Repository URL</Label>
                    <Input 
                      id="repo-url" 
                      placeholder="https://github.com/username/repo" 
                      value={repoUrl}
                      onChange={(e) => setRepoUrl(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="branch">Branch</Label>
                    <Input 
                      id="branch" 
                      placeholder="main" 
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                    />
                  </div>
                  
                  <Button 
                    onClick={handleConnect} 
                    disabled={isConnecting || !repoUrl} 
                    className="w-full"
                  >
                    {isConnecting ? "Connecting..." : "Connect"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

interface ConnectedRepositoryProps {
  repository: GitHubRepository;
  onDisconnect: () => void;
  onSync: () => void;
}

const ConnectedRepository: React.FC<ConnectedRepositoryProps> = ({ 
  repository, 
  onDisconnect,
  onSync
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="flex items-center">
            <Github className="mr-2 h-5 w-5" />
            GitHub Integration
          </CardTitle>
          <span className="flex items-center text-sm text-green-600">
            <Check className="h-4 w-4 mr-1" />
            Connected
          </span>
        </div>
        <CardDescription>
          {repository.name}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="flex items-center">
            <span className="text-gray-500 w-20">Repository:</span>
            <a href={repository.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              {repository.url}
            </a>
          </div>
          <div className="flex items-center">
            <span className="text-gray-500 w-20">Branch:</span>
            <span className="flex items-center">
              <GitBranch className="h-3 w-3 mr-1" />
              {repository.branch}
            </span>
          </div>
          <div className="flex items-center">
            <span className="text-gray-500 w-20">Last Synced:</span>
            <span>{repository.lastSynced?.toLocaleString() || 'Never'}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" onClick={onSync}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Sync Now
        </Button>
        <Button variant="destructive" size="sm" onClick={onDisconnect}>
          Disconnect
        </Button>
      </CardFooter>
    </Card>
  );
};
