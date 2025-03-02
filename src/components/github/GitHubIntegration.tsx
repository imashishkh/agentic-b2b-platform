
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Github, RefreshCw, Link2, Check, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useChat } from '@/contexts/ChatContext';

// Extended GitHub Repository type
interface ExtendedGitHubRepository {
  id: string;
  name: string;
  url: string;
  branch?: string;
  status?: string;
  lastCommit?: string;
  connected?: boolean;
  lastSynced?: string | Date;
}

export const GitHubIntegration = () => {
  const [repoUrl, setRepoUrl] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [repositories, setRepositories] = useState<ExtendedGitHubRepository[]>([
    {
      id: '1',
      name: 'devmanager-project',
      url: 'https://github.com/user/devmanager-project',
      branch: 'main',
      status: 'synced',
      lastCommit: '13 minutes ago',
      connected: true,
      lastSynced: new Date()
    }
  ]);

  const handleConnect = () => {
    if (!repoUrl) return;
    
    setIsConnecting(true);
    
    // Simulate API call
    setTimeout(() => {
      // Add the new repository
      const newRepo: ExtendedGitHubRepository = {
        id: `repo-${Date.now()}`,
        name: repoUrl.split('/').pop() || 'new-repo',
        url: repoUrl,
        branch: 'main',
        status: 'connected',
        lastCommit: 'Just now',
        connected: true,
        lastSynced: new Date()
      };
      
      setRepositories([...repositories, newRepo]);
      setRepoUrl('');
      setIsConnecting(false);
      setIsConnected(true);
    }, 1500);
  };
  
  const handleSync = (repoId: string) => {
    // Simulate syncing
    setRepositories(prev => prev.map(repo => 
      repo.id === repoId 
        ? { ...repo, status: 'syncing' } 
        : repo
    ));
    
    setTimeout(() => {
      setRepositories(prev => prev.map(repo => 
        repo.id === repoId 
          ? { 
              ...repo, 
              status: 'synced', 
              lastCommit: 'Just now',
              lastSynced: new Date()
            } 
          : repo
      ));
    }, 2000);
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
            Connect your GitHub repository to sync your project
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="repo-url">Repository URL</Label>
              <div className="flex gap-2">
                <Input
                  id="repo-url"
                  placeholder="https://github.com/username/repo"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  onClick={handleConnect} 
                  disabled={!repoUrl || isConnecting}
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
              </div>
            </div>
            
            {repositories.length > 0 && (
              <div className="space-y-3 mt-6">
                <h3 className="text-sm font-medium">Connected Repositories</h3>
                {repositories.map((repo) => (
                  <Card key={repo.id} className="bg-gray-50">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium flex items-center">
                            {repo.name}
                            <Badge 
                              variant="outline" 
                              className={`ml-2 ${
                                repo.status === 'synced' 
                                  ? 'bg-green-100 text-green-800 border-green-200' 
                                  : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                              }`}
                            >
                              {repo.status === 'synced' ? (
                                <><Check className="h-3 w-3 mr-1" /> Synced</>
                              ) : (
                                <><RefreshCw className="h-3 w-3 mr-1 animate-spin" /> Syncing</>
                              )}
                            </Badge>
                          </h4>
                          <p className="text-sm text-gray-500 mt-1">{repo.url}</p>
                          <div className="flex items-center mt-2 gap-3">
                            <span className="text-xs text-gray-500">Branch: {repo.branch}</span>
                            <span className="text-xs text-gray-500">Last commit: {repo.lastCommit}</span>
                            {repo.lastSynced && (
                              <span className="text-xs text-gray-500">
                                Last synced: {
                                  typeof repo.lastSynced === 'string' 
                                    ? repo.lastSynced 
                                    : format(new Date(repo.lastSynced), 'MMM d, yyyy HH:mm')
                                }
                              </span>
                            )}
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleSync(repo.id)}
                          disabled={repo.status === 'syncing'}
                          className="text-purple-600 border-purple-200"
                        >
                          <RefreshCw className={`h-4 w-4 mr-2 ${repo.status === 'syncing' ? 'animate-spin' : ''}`} />
                          Sync
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {isConnected && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4 flex items-center">
            <Check className="h-5 w-5 text-green-600 mr-2" />
            <p className="text-green-800">Repository successfully connected! You can now sync your project with GitHub.</p>
          </CardContent>
        </Card>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle className="text-base">About GitHub Integration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <p>Connecting your GitHub repository enables:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Automatic code synchronization</li>
              <li>Version control for your project</li>
              <li>Collaborative development</li>
              <li>Deployment workflows integration</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="text-purple-600 border-purple-200 w-full" onClick={() => alert("Documentation opens")}>
            View Documentation
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
