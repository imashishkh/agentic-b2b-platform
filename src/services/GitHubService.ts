
import { toast } from "sonner";

// Types for GitHub operations
export interface GitHubAuth {
  token: string;
}

export interface GitHubRepo {
  id: string;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  default_branch: string;
  owner: {
    login: string;
  };
  created_at: string;
  updated_at: string;
  private: boolean;
}

export interface GitHubBranch {
  name: string;
  commit: {
    sha: string;
    url: string;
  };
  protected: boolean;
}

export interface GitHubCommit {
  sha: string;
  message: string;
  html_url: string;
  author: {
    name: string;
    date: string;
  };
}

export interface GitHubPR {
  id: number;
  number: number;
  title: string;
  html_url: string;
  state: string;
  created_at: string;
  updated_at: string;
  user: {
    login: string;
  };
}

export interface WorkflowFile {
  name: string;
  content: string;
}

export interface GitHubError {
  message: string;
  documentation_url?: string;
}

class GitHubService {
  private token: string | null = null;
  private baseUrl = 'https://api.github.com';
  
  setToken(token: string) {
    this.token = token;
    localStorage.setItem('github_token', token);
    return this.validateToken();
  }
  
  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('github_token');
    }
    return this.token;
  }
  
  clearToken() {
    this.token = null;
    localStorage.removeItem('github_token');
  }
  
  async validateToken(): Promise<boolean> {
    try {
      const response = await this.fetchAPI('/user');
      return response.status === 200;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  }
  
  private async fetchAPI(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const token = this.getToken();
    
    if (!token) {
      throw new Error('GitHub token not set');
    }
    
    const headers = {
      'Accept': 'application/vnd.github.v3+json',
      'Authorization': `token ${token}`,
      'Content-Type': 'application/json',
      ...options.headers
    };
    
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers
    });
    
    if (!response.ok) {
      const errorData = await response.json() as GitHubError;
      throw new Error(errorData.message || `GitHub API error: ${response.status}`);
    }
    
    return response;
  }
  
  async getCurrentUser() {
    const response = await this.fetchAPI('/user');
    return await response.json();
  }
  
  async listRepositories(page = 1, perPage = 10): Promise<GitHubRepo[]> {
    const response = await this.fetchAPI(`/user/repos?page=${page}&per_page=${perPage}&sort=updated`);
    return await response.json();
  }
  
  async getRepository(owner: string, repo: string): Promise<GitHubRepo> {
    const response = await this.fetchAPI(`/repos/${owner}/${repo}`);
    return await response.json();
  }
  
  async createRepository(name: string, description: string, isPrivate = false): Promise<GitHubRepo> {
    const response = await this.fetchAPI('/user/repos', {
      method: 'POST',
      body: JSON.stringify({
        name,
        description,
        private: isPrivate,
        auto_init: true
      })
    });
    
    return await response.json();
  }
  
  async listBranches(owner: string, repo: string): Promise<GitHubBranch[]> {
    const response = await this.fetchAPI(`/repos/${owner}/${repo}/branches`);
    return await response.json();
  }
  
  async createBranch(owner: string, repo: string, branchName: string, fromBranch: string): Promise<GitHubBranch> {
    // Get the SHA of the latest commit on the source branch
    const sourceBranchData = await this.fetchAPI(`/repos/${owner}/${repo}/branches/${fromBranch}`);
    const sourceBranch = await sourceBranchData.json();
    const sha = sourceBranch.commit.sha;
    
    // Create a new reference (branch)
    const response = await this.fetchAPI(`/repos/${owner}/${repo}/git/refs`, {
      method: 'POST',
      body: JSON.stringify({
        ref: `refs/heads/${branchName}`,
        sha
      })
    });
    
    // Return branch info
    return this.getBranch(owner, repo, branchName);
  }
  
  async getBranch(owner: string, repo: string, branch: string): Promise<GitHubBranch> {
    const response = await this.fetchAPI(`/repos/${owner}/${repo}/branches/${branch}`);
    return await response.json();
  }
  
  async listCommits(owner: string, repo: string, branch: string): Promise<GitHubCommit[]> {
    const response = await this.fetchAPI(`/repos/${owner}/${repo}/commits?sha=${branch}`);
    return await response.json();
  }
  
  async createPullRequest(owner: string, repo: string, title: string, head: string, base: string, body: string): Promise<GitHubPR> {
    const response = await this.fetchAPI(`/repos/${owner}/${repo}/pulls`, {
      method: 'POST',
      body: JSON.stringify({
        title,
        head,
        base,
        body
      })
    });
    
    return await response.json();
  }
  
  async listPullRequests(owner: string, repo: string, state = 'open'): Promise<GitHubPR[]> {
    const response = await this.fetchAPI(`/repos/${owner}/${repo}/pulls?state=${state}`);
    return await response.json();
  }
  
  async setupCiCdWorkflow(owner: string, repo: string, workflowFiles: WorkflowFile[]): Promise<boolean> {
    try {
      // Create .github/workflows directory if it doesn't exist
      for (const file of workflowFiles) {
        await this.createOrUpdateFile(
          owner,
          repo,
          `.github/workflows/${file.name}`,
          `Add CI/CD workflow: ${file.name}`,
          file.content
        );
      }
      return true;
    } catch (error) {
      console.error('Error setting up CI/CD workflow:', error);
      return false;
    }
  }
  
  async createOrUpdateFile(owner: string, repo: string, path: string, message: string, content: string): Promise<any> {
    // Check if file already exists
    let sha = '';
    try {
      const existingFile = await this.fetchAPI(`/repos/${owner}/${repo}/contents/${path}`);
      const fileData = await existingFile.json();
      sha = fileData.sha;
    } catch (error) {
      // File doesn't exist, that's fine
    }
    
    // Create or update the file
    const response = await this.fetchAPI(`/repos/${owner}/${repo}/contents/${path}`, {
      method: 'PUT',
      body: JSON.stringify({
        message,
        content: btoa(content), // Base64 encode the content
        sha: sha || undefined
      })
    });
    
    return await response.json();
  }
  
  // Helper to generate CI/CD workflow files for common use cases
  generateWorkflowFiles(type: 'react' | 'node' | 'static'): WorkflowFile[] {
    const files: WorkflowFile[] = [];
    
    if (type === 'react') {
      files.push({
        name: 'react-ci.yml',
        content: `
name: React CI/CD

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
        cache: 'npm'
    
    - name: Install Dependencies
      run: npm ci
    
    - name: Check Linting
      run: npm run lint || true
    
    - name: Build
      run: npm run build
    
    - name: Test
      run: npm test || true
    
    - name: Upload Build Artifact
      if: github.event_name == 'push' && github.ref == 'refs/heads/main'
      uses: actions/upload-artifact@v3
      with:
        name: build
        path: dist/
`.trim()
      });
    } else if (type === 'node') {
      files.push({
        name: 'node-ci.yml',
        content: `
name: Node.js CI/CD

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
        cache: 'npm'
    
    - name: Install Dependencies
      run: npm ci
    
    - name: Lint
      run: npm run lint || true
    
    - name: Test
      run: npm test || true
`.trim()
      });
    } else if (type === 'static') {
      files.push({
        name: 'static-deploy.yml',
        content: `
name: Deploy Static Website

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install Dependencies
      run: npm ci
    
    - name: Build
      run: npm run build
    
    - name: Deploy to GitHub Pages
      uses: JamesIves/github-pages-deploy-action@v4
      with:
        folder: dist
`.trim()
      });
    }
    
    return files;
  }
}

export const githubService = new GitHubService();

// Repository templates for quick start
export const repositoryTemplates = [
  {
    id: 'react-app',
    name: 'React Application',
    description: 'Basic React application with GitHub Actions CI/CD',
    workflowType: 'react',
    branchStrategy: [
      { name: 'main', description: 'Production branch' },
      { name: 'develop', description: 'Development branch' },
      { name: 'feature/*', description: 'Feature branches' }
    ]
  },
  {
    id: 'node-api',
    name: 'Node.js API',
    description: 'Node.js API with testing and deployment workflows',
    workflowType: 'node',
    branchStrategy: [
      { name: 'main', description: 'Production branch' },
      { name: 'develop', description: 'Development branch' },
      { name: 'feature/*', description: 'Feature branches' }
    ]
  },
  {
    id: 'static-site',
    name: 'Static Website',
    description: 'Static website with GitHub Pages deployment',
    workflowType: 'static',
    branchStrategy: [
      { name: 'main', description: 'Production branch' },
      { name: 'content', description: 'Content updates' }
    ]
  }
];
