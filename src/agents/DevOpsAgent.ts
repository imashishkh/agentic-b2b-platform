
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
 * - Security assessments and vulnerability scanning
 * - Compliance verification for DevOps processes
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
    "Workflow automation",
    "Security scanning",
    "Vulnerability assessment",
    "Compliance verification",
    "Security hardening"
  ];
  
  /**
   * Determines if this agent can handle the given message
   * 
   * @param message - The user message to evaluate
   * @returns boolean indicating whether this agent can handle the message
   */
  canHandle(message: string): boolean {
    return message.match(/deployment|CI\/CD|Docker|Kubernetes|AWS|Azure|GCP|scaling|monitoring|logging|performance|infrastructure|container|cloud|pipeline|automation|DevOps|GitHub|repository|branch|workflow|pull request|PR|git|security|vulnerability|compliance|scanning|assessment|hardening/i) !== null;
  }
  
  /**
   * Creates a specialized prompt for the AI model focused on DevOps
   * 
   * @param userMessage - The original user message
   * @param projectPhases - Current project phases and tasks
   * @returns A structured prompt that guides the AI response
   */
  protected createPrompt(userMessage: string, projectPhases: any[]): string {
    // Check if this is a security assessment request
    if (userMessage.match(/security|vulnerability|compliance|scan|assessment|hardening|penetration test|pen test|security review/i)) {
      return `
        As an AI DevOps Engineer specializing in security for e-commerce platforms, please respond to the following:
        
        User: "${userMessage}"
        
        Your expertise is in:
        - Security scanning and vulnerability assessment
        - Compliance checking for DevOps practices
        - Security hardening for infrastructure and deployments
        - Implementing security in CI/CD pipelines
        - DevSecOps best practices
        - Container and cloud security
        - Network security configurations
        
        Provide concrete recommendations for improving security in the e-commerce application's DevOps processes.
        Focus on practical steps that can be implemented immediately, as well as longer-term security improvements.
      `;
    }
    
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
      - Security scanning and vulnerability assessment
      - Compliance checking for DevOps practices
      
      Provide concrete configuration examples and architecture recommendations when applicable, focusing on reliability, scalability, and security.
    `;
  }
  
  /**
   * Generates a security hardening checklist for infrastructure
   * 
   * @returns A security hardening checklist as a string
   */
  generateSecurityHardeningChecklist(): string {
    return `
# Security Hardening Checklist for E-commerce Infrastructure

## Network Security
- [ ] Implement Web Application Firewall (WAF)
- [ ] Configure proper network segmentation
- [ ] Set up DDoS protection
- [ ] Use HTTPS for all communications
- [ ] Implement proper TLS configuration (TLS 1.2+)
- [ ] Disable unused ports and protocols
- [ ] Implement network monitoring and logging

## Server Hardening
- [ ] Keep systems and packages updated
- [ ] Remove unnecessary services and software
- [ ] Implement proper user access controls
- [ ] Use strong authentication mechanisms
- [ ] Configure secure SSH access (key-based auth, non-standard port)
- [ ] Implement proper file permissions
- [ ] Configure host-based firewall
- [ ] Enable SELinux or AppArmor

## Container Security
- [ ] Use minimal base images
- [ ] Scan container images for vulnerabilities
- [ ] Run containers with non-root users
- [ ] Implement proper resource limits
- [ ] Use read-only file systems where possible
- [ ] Secure container registries
- [ ] Implement container network policies

## Cloud Security
- [ ] Follow cloud provider security best practices
- [ ] Implement least privilege IAM policies
- [ ] Enable multi-factor authentication for all accounts
- [ ] Encrypt data at rest and in transit
- [ ] Configure proper VPC and security groups
- [ ] Enable logging and monitoring
- [ ] Implement automated compliance checking

## CI/CD Security
- [ ] Secure secrets management
- [ ] Implement vulnerability scanning in pipeline
- [ ] Perform static code analysis
- [ ] Deploy through immutable infrastructure
- [ ] Implement automatic security testing
- [ ] Verify artifact integrity before deployment
- [ ] Implement approval gates for production deployments

## Database Security
- [ ] Implement proper access controls
- [ ] Encrypt sensitive data
- [ ] Use parameterized queries to prevent injection
- [ ] Keep database updated with security patches
- [ ] Use network isolation for database servers
- [ ] Implement proper backup and recovery procedures

## Monitoring and Incident Response
- [ ] Set up centralized logging
- [ ] Implement intrusion detection
- [ ] Configure alerting for suspicious activities
- [ ] Prepare incident response plan
- [ ] Conduct regular security testing
- [ ] Implement automated security scanning
- [ ] Plan for disaster recovery
    `;
  }
  
  /**
   * Generates a compliance self-assessment for DevOps practices
   * 
   * @returns A compliance self-assessment checklist
   */
  generateComplianceAssessment(): string {
    return `
# DevOps Compliance Self-Assessment

## PCI DSS Compliance (For E-commerce Payment Processing)
- [ ] Network segmentation implemented
- [ ] Encryption for cardholder data in transit and at rest
- [ ] Regular vulnerability scanning
- [ ] Strong access controls implemented
- [ ] Security testing integrated into CI/CD
- [ ] Regular logging and monitoring
- [ ] Clearly defined security policies

## GDPR Compliance (For European Customer Data)
- [ ] Data minimization implemented
- [ ] Clear data retention policies
- [ ] Security measures appropriate to risk
- [ ] Ability to fulfill data subject rights (access, erasure, etc.)
- [ ] Data breach notification procedures
- [ ] Privacy by design implemented in CI/CD
- [ ] Regular privacy impact assessments

## SOC 2 Compliance (For Service Organization Controls)
- [ ] Access controls properly implemented
- [ ] Change management procedures defined
- [ ] Monitoring and incident response established
- [ ] Risk management processes in place
- [ ] Vendor management procedures
- [ ] Business continuity planning
- [ ] Regular security assessments

## HIPAA Compliance (If Handling Health Information)
- [ ] PHI identified and classified
- [ ] Encryption implemented for PHI
- [ ] Access controls and audit trails
- [ ] Business associate agreements in place
- [ ] Incident response procedures
- [ ] Regular risk assessments
- [ ] Training for team members

## General Security Compliance
- [ ] Regular security training for team
- [ ] Clearly defined security responsibilities
- [ ] Automated security testing in CI/CD
- [ ] Vulnerability management program
- [ ] Patch management procedures
- [ ] Regular penetration testing
- [ ] Third-party security assessments
    `;
  }
  
  /**
   * Generates a vulnerability assessment report
   * 
   * @param environment - The target environment (e.g., 'production', 'staging', 'development')
   * @returns A vulnerability assessment report
   */
  generateVulnerabilityAssessment(environment: string = 'production'): string {
    return `
# Vulnerability Assessment for ${environment.charAt(0).toUpperCase() + environment.slice(1)} Environment

## Executive Summary
This vulnerability assessment identifies potential security issues in the ${environment} environment of the e-commerce application infrastructure. The assessment covers network configuration, server hardening, application security, and DevOps practices.

## Assessment Methodology
- Automated vulnerability scanning
- Configuration review
- DevOps practices review
- Manual penetration testing
- Code security review

## Key Findings

### High Priority
- Ensure all production servers are patched with the latest security updates
- Review IAM permissions to enforce principle of least privilege
- Implement WAF protection for public-facing applications
- Encrypt sensitive data at rest and in transit
- Review secrets management in CI/CD pipelines

### Medium Priority
- Implement network segmentation
- Configure proper logging and monitoring
- Review container security configurations
- Implement regular vulnerability scanning
- Tighten security group configurations

### Low Priority
- Document security incident response procedures
- Implement additional security headers
- Review password policies
- Consider additional authentication factors
- Enhance security training for development team

## Recommendations

### Immediate Actions
1. Patch all systems to latest security updates
2. Review and restrict IAM permissions
3. Implement encryption for sensitive data
4. Configure Web Application Firewall
5. Implement secrets management solution

### Short-term Actions (1-3 months)
1. Implement network segmentation
2. Enhance logging and monitoring
3. Implement container security
4. Configure additional security headers
5. Develop security incident response plan

### Long-term Actions (3-6 months)
1. Implement regular security assessments
2. Enhance security training program
3. Implement continuous security monitoring
4. Consider advanced threat protection
5. Implement automated compliance checking

## Next Steps
1. Prioritize and address high-priority findings
2. Schedule follow-up assessment to verify remediation
3. Integrate security testing into CI/CD pipeline
4. Develop continuous vulnerability management program
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
    if (message.match(/security|vulnerability|compliance|scan|assessment|hardening/i)) {
      return `e-commerce ${message} security DevOps vulnerability assessment hardening compliance best practices`;
    }
    
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
