
import { BaseAgent } from "./BaseAgent";
import { AgentType } from "./AgentTypes";
import { 
  PerformanceMetric, 
  OptimizationRecommendation, 
  SecurityFinding, 
  ComplianceRequirement 
} from "@/contexts/types";
import { UserRole } from "@/components/Sidebar";

/**
 * ManagerAgent class - Main agent implementation that coordinates the project
 */
export class ManagerAgent extends BaseAgent {
  type = AgentType.MANAGER;
  name = "DevManager";
  title = "Development Manager";
  description = "Coordinates project phases and integrates work from all specialized agents";
  
  // Areas of expertise
  expertise = [
    "Project planning",
    "Task breakdown",
    "Sprint planning",
    "Resource allocation",
    "Technical requirements gathering",
    "Cross-functional team coordination",
    "Technical oversight and guidance",
    "Architectural decision-making",
    "Quality assurance",
    "Security review",
    "Security review checkpoints",
    "Vulnerability assessment",
    "Compliance checking",
    "Best practices enforcement",
    "Performance optimization strategy",
    "E-commerce domain expertise",
    "Knowledge base management",
    "Documentation management",
    "System architecture design",
    "Testing strategy development",
    "GitHub integration"
  ];

  /**
   * Process markdown file content and extract project requirements
   * With proper error handling
   * 
   * @param markdownContent - The content of the markdown file
   * @returns Promise with processing result
   */
  async processMarkdownFile(markdownContent: string): Promise<string> {
    console.log("Processing markdown file in ManagerAgent");
    
    try {
      // Sanitize input
      const sanitizedContent = this.sanitizeInput(markdownContent);
      
      // This would be an actual API call in production
      const response = await this.makeApiRequestWithRetry(
        "https://api.example.com/process-markdown",
        { content: sanitizedContent },
        {
          fallbackResponse: `# Project Analysis

I've analyzed your requirements document and identified the following components:

## Key Features
- User authentication system
- Product management
- Order processing
- Payment integration
- Reporting dashboard

## Technical Requirements
- React frontend with Tailwind CSS
- RESTful API design
- Database schema for users, products, and orders
- Security implementation

Would you like me to elaborate on any specific aspect of the requirements?`
        }
      );
      
      return response;
    } catch (error) {
      console.error("Error processing markdown file:", error);
      return "I encountered an error while processing your requirements document. Please try again or upload a different file.";
    }
  }
  
  /**
   * Check user authorization for specific actions
   * @param action - The action being performed
   * @param userRole - The user's role
   * @returns Whether the user is authorized
   */
  isAuthorizedForAction(action: string, userRole: UserRole): boolean {
    // Define role-based permissions
    const rolePermissions: Record<UserRole, string[]> = {
      [UserRole.GUEST]: [
        'view-public-content',
        'register',
        'login'
      ],
      [UserRole.USER]: [
        'view-public-content',
        'view-private-content',
        'create-content',
        'edit-own-content',
        'delete-own-content',
        'use-chat',
        'upload-files'
      ],
      [UserRole.ADMIN]: [
        'view-public-content',
        'view-private-content',
        'view-admin-content',
        'create-content',
        'edit-any-content',
        'delete-any-content',
        'manage-users',
        'manage-settings',
        'use-chat',
        'upload-files',
        'access-logs',
        'manage-knowledge-base'
      ]
    };
    
    // Check if the user's role has permission for the action
    return rolePermissions[userRole]?.includes(action) || false;
  }
  
  /**
   * Generate knowledge base prompt
   */
  generateKnowledgeBasePrompt(): string {
    return `# Knowledge Base Enhancement

To better support your project, I recommend gathering documentation and resources in the following categories:

## Technology Stack Documentation
- Frontend framework documentation
- Backend framework documentation
- Database documentation

## Industry Standards
- Security best practices
- Accessibility guidelines
- Performance benchmarks

## Example Projects
- Similar applications for reference
- Code samples

Please share any specific resources you'd like to add to the project knowledge base.`;
  }
  
  /**
   * Get performance metrics with error handling
   */
  getPerformanceMetrics(): PerformanceMetric[] {
    try {
      // This would be an API call in production
      // Mock performance metrics - fixing 'value' to 'currentValue' to match type definition
      return [
        {
          id: "1",
          name: "First Contentful Paint",
          currentValue: 1.2,
          unit: "s",
          category: "frontend",
          description: "Time until the first content is painted on screen",
          threshold: { warning: 1.8, critical: 3.0 }
        },
        {
          id: "2",
          name: "API Response Time",
          currentValue: 250,
          unit: "ms",
          category: "backend",
          description: "Average API endpoint response time",
          threshold: { warning: 500, critical: 1000 }
        }
      ];
    } catch (error) {
      console.error("Error getting performance metrics:", error);
      // Return empty array rather than failing
      return [];
    }
  }
  
  /**
   * Generate optimization recommendations with error handling
   */
  generateOptimizations(): string {
    try {
      // This would be an API call in production
      return `# Performance Optimization Recommendations

Based on analysis of your application, here are key recommendations:

## Frontend Optimizations
- Implement code splitting with React.lazy
- Optimize images with WebP format and lazy loading
- Minimize JavaScript bundle size
- Use memoization for expensive calculations

## Backend Optimizations
- Implement API response caching
- Optimize database queries
- Use connection pooling
- Consider serverless functions for scalability

## Network Optimizations
- Enable HTTP/2
- Implement content compression
- Use CDN for static assets
- Optimize API payload size

Would you like me to provide specific code examples for any of these optimizations?`;
    } catch (error) {
      console.error("Error generating optimizations:", error);
      return "I encountered an error while generating optimization recommendations. Please try again later.";
    }
  }
  
  /**
   * Generate technical documentation with error handling
   */
  async generateTechnicalDocumentation(): Promise<string> {
    try {
      // This would be an API call in production
      const response = await this.makeApiRequestWithRetry(
        "https://api.example.com/generate-documentation",
        {},
        {
          fallbackResponse: `# Technical Documentation

## System Architecture
This application follows a modern web architecture with the following components:

### Frontend
- React with functional components and hooks
- Tailwind CSS for styling
- State management with Context API and React Query

### Backend
- RESTful API design principles
- Authentication with JWT
- Data validation and sanitization

### Database
- Relational database schema
- Indexed queries for performance
- Data integrity constraints

## Deployment Architecture
- CI/CD pipeline with GitHub Actions
- Containerized with Docker
- Cloud hosting with automatic scaling

## Security Considerations
- HTTPS enforcement
- Input sanitization
- CSRF protection
- Rate limiting

Would you like me to expand on any specific section of this documentation?`
        }
      );
      
      return response;
    } catch (error) {
      console.error("Error generating technical documentation:", error);
      return "I encountered an error while generating technical documentation. Please try again later.";
    }
  }
  
  /**
   * Generate a monitoring tool setup document with error handling
   */
  generateMonitoringToolDoc(toolKey: string): string {
    try {
      const monitoringTools: Record<string, { name: string; description: string; setupInstructions: string }> = {
        'lighthouse': {
          name: "Google Lighthouse",
          description: "An open-source, automated tool for improving the quality of web pages. It has audits for performance, accessibility, progressive web apps, SEO and more.",
          setupInstructions: `## Setup Instructions

1. **Installation**
   \`\`\`bash
   npm install -g lighthouse
   \`\`\`

2. **Basic Usage**
   \`\`\`bash
   lighthouse https://your-site.com --view
   \`\`\`

3. **CI Integration**
   \`\`\`bash
   lighthouse https://your-site.com --output json --output-path ./lighthouse-results.json
   \`\`\`

4. **Key Metrics to Monitor**
   - Performance Score
   - First Contentful Paint
   - Time to Interactive
   - Speed Index
   - Total Blocking Time`
        }
      };
      
      if (!monitoringTools[toolKey]) {
        return "# Error\n\nMonitoring tool not found.";
      }
      
      const tool = monitoringTools[toolKey];
      return `# ${tool.name} Integration Guide\n\n${tool.description}\n\n${tool.setupInstructions}`;
    } catch (error) {
      console.error("Error generating monitoring tool documentation:", error);
      return "I encountered an error while generating monitoring tool documentation. Please try again later.";
    }
  }
}
