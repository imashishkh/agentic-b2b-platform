
import { BaseAgent } from "./BaseAgent";
import { AgentType } from "./AgentTypes";

/**
 * DevOps Agent - Specializes in deployment, CI/CD, and infrastructure
 * 
 * This agent handles all aspects of operational architecture, including:
 * - Deployment strategies and automation
 * - CI/CD pipeline configuration
 * - Infrastructure setup and scaling
 * - Monitoring and performance optimization
 * - Security hardening for production environments
 * - Repository management and GitHub integration
 */
export class DevOpsAgent extends BaseAgent {
  type = AgentType.DEVOPS;
  name = "DevOpsEng";
  title = "DevOps Engineer";
  description = "Expert in deployment, CI/CD, and infrastructure management";
  
  /**
   * Areas of expertise for the DevOps Engineer
   * These inform the agent's response generation capabilities
   */
  expertise = [
    "Deployment strategies",
    "CI/CD pipelines",
    "Infrastructure as code",
    "Containerization (Docker)",
    "Cloud services (AWS, Azure, GCP)",
    "Monitoring and logging",
    "Performance optimization",
    "Security practices",
    "GitHub repository management",
    "Branch and PR strategies",
    "Workflow automation"
  ];
  
  /**
   * Determines if this agent can handle the given message
   * 
   * @param message - The user message to evaluate
   * @returns boolean indicating whether this agent can handle the message
   */
  canHandle(message: string): boolean {
    return message.match(/deployment|CI\/CD|Docker|Kubernetes|AWS|Azure|GCP|scaling|monitoring|logging|performance|infrastructure|container|cloud|pipeline|automation|DevOps|GitHub|repository|branch|workflow|pull request|PR|git/i) !== null;
  }
  
  /**
   * Creates a specialized prompt for the AI model focused on DevOps
   * 
   * @param userMessage - The original user message
   * @param projectPhases - Current project phases and tasks
   * @returns A structured prompt that guides the AI response
   */
  protected createPrompt(userMessage: string, projectPhases: any[]): string {
    return `
      As an AI DevOps Engineer specializing in e-commerce platforms, please respond to the following:
      
      User: "${userMessage}"
      
      ${projectPhases.length > 0 
        ? `Consider the current project phases when designing infrastructure: ${JSON.stringify(projectPhases)}` 
        : "No project structure has been defined yet. Focus on general DevOps best practices for e-commerce."}
      
      Your expertise is in:
      - Deployment strategies for e-commerce applications
      - Setting up CI/CD pipelines for reliable delivery
      - Infrastructure as code using tools like Terraform or CloudFormation
      - Containerization with Docker and orchestration with Kubernetes
      - Cloud service configuration for scalability and high availability
      - Monitoring, logging, and alerting for e-commerce platforms
      - GitHub repository management and branch strategies
      - Pull request workflows and code review processes
      - Workflow automation with GitHub Actions
      
      Provide concrete configuration examples and architecture recommendations when applicable, focusing on reliability, scalability, and security.
    `;
  }
  
  /**
   * Creates a DevOps-focused search query
   * 
   * @param message - The user message to create a search from
   * @param projectPhases - Current project phases for context
   * @returns A search query string focused on DevOps practices
   */
  protected createSearchQuery(message: string, projectPhases: any[]): string {
    return `e-commerce ${message} DevOps deployment CI/CD cloud infrastructure GitHub best practices`;
  }
  
  /**
   * Generates a CI/CD workflow configuration based on the project type
   * 
   * @param projectType - The type of project (e.g., 'react', 'node', 'static')
   * @returns A GitHub Actions workflow configuration as a string
   */
  generateWorkflowConfig(projectType: 'react' | 'node' | 'static'): string {
    switch (projectType) {
      case 'react':
        return `
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
        `;
        
      case 'node':
        return `
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
        `;
        
      case 'static':
        return `
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
        `;
        
      default:
        return '';
    }
  }
  
  /**
   * Generates a recommended branch strategy for a project
   * 
   * @returns A description of the branch strategy
   */
  recommendBranchStrategy(): string {
    return `
# Recommended Branch Strategy

For your project, I recommend the following Git branch strategy:

## Main Branches
- **main** - Production-ready code. Deployments to production come from this branch.
- **develop** - Integration branch for features. This is where feature branches are merged before going to production.

## Supporting Branches
- **feature/*** - Feature branches for developing new features (e.g., feature/user-authentication)
- **bugfix/*** - For fixing bugs (e.g., bugfix/login-error)
- **release/*** - Preparation for a new production release (e.g., release/v1.2.0)
- **hotfix/*** - For urgent fixes to production issues (e.g., hotfix/critical-security-fix)

## Workflow
1. Create feature branches from develop
2. When feature is complete, create a pull request to develop
3. After code review and testing, merge to develop
4. When ready for release, create a release branch from develop
5. After final testing, merge release branch to main and develop
6. For production issues, create hotfix branches from main
7. Merge hotfix branches to both main and develop
    `;
  }
  
  /**
   * Recommends a CI/CD pipeline strategy for a project
   * 
   * @returns A description of the CI/CD pipeline strategy
   */
  recommendCiCdStrategy(): string {
    return `
# CI/CD Pipeline Strategy

I recommend the following CI/CD pipeline for your project:

## Continuous Integration
- **Automated Testing**: Run unit and integration tests on every push
- **Code Quality**: Perform static code analysis and linting
- **Build Verification**: Ensure the application builds successfully

## Continuous Delivery
- **Staging Deployment**: Automatically deploy to staging environment from the develop branch
- **Smoke Tests**: Run basic functionality tests on the staging environment
- **Manual Approval**: Require approval before production deployment

## Continuous Deployment
- **Production Deployment**: Deploy to production from the main branch after approval
- **Blue/Green Deployment**: Use blue/green deployment strategy to minimize downtime
- **Rollback Plan**: Implement automated rollback if monitoring detects issues

## Monitoring
- **Health Checks**: Monitor application health post-deployment
- **Performance Metrics**: Track key performance indicators
- **Error Tracking**: Monitor for exceptions and errors

## Tools
- **GitHub Actions**: For CI/CD workflow automation
- **Docker**: For consistent environments
- **Jest/Cypress**: For testing
- **Prometheus/Grafana**: For monitoring
    `;
  }
}
