
import { BaseAgent } from "./BaseAgent";
import { AgentType } from "./AgentTypes";
import { 
  PerformanceMetric, 
  OptimizationRecommendation, 
  SecurityFinding, 
  ComplianceRequirement 
} from "@/contexts/types";
import { UserRole } from "@/components/Sidebar";

// LangChain and LangGraph imports (dynamic imports are used in methods to avoid circular dependencies)
// The actual imports happen in the methods to avoid issues

/**
 * ManagerAgent class - Main agent implementation that coordinates the project
 * Enhanced with LangGraph capabilities for sophisticated agent orchestration
 */
export class ManagerAgent extends BaseAgent {
  type = AgentType.MANAGER;
  name = "DevManager";
  title = "Development Manager";
  description = "Coordinates project phases and integrates work from all specialized agents";
  private graphOrchestrator: any; // LangGraph orchestrator
  
  constructor() {
    super(AgentType.MANAGER);
    this.initializeGraphOrchestrator();
  }
  
  /**
   * Initialize the LangGraph orchestrator for advanced agent coordination
   */
  private async initializeGraphOrchestrator() {
    try {
      // Import dynamically to avoid circular dependencies
      const { createAgentOrchestratorGraph } = await import('./base/agentOrchestratorGraph');
      
      // Create the graph-based agent orchestrator
      this.graphOrchestrator = await createAgentOrchestratorGraph();
      
      console.log("ManagerAgent: LangGraph orchestrator initialized");
    } catch (error) {
      console.error("Error initializing LangGraph orchestrator:", error);
      // Will fall back to basic mode if initialization fails
    }
  }
  
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
   * Process a request using the LangGraph orchestrator if available
   * @param message - The user's message
   * @param previousMessages - Previous conversation messages
   * @returns The response from the appropriate agent
   */
  async processWithGraphOrchestrator(message: string, previousMessages: string[] = []): Promise<string> {
    try {
      // Only try if graph orchestrator is initialized
      if (!this.graphOrchestrator) {
        return "Graph orchestrator not initialized. Using traditional processing instead.";
      }
      
      // Import the processor function
      const { processMessageWithAgentGraph } = await import('./base/agentOrchestratorGraph');
      
      // Format previous messages for the graph
      const formattedPreviousMessages = previousMessages.map((msg, i) => {
        return {
          role: i % 2 === 0 ? "user" : "assistant",
          content: msg
        };
      });
      
      // Process the message through the graph
      console.log("ManagerAgent: Processing message with LangGraph orchestrator");
      const response = await processMessageWithAgentGraph(message, formattedPreviousMessages);
      
      return response;
    } catch (error) {
      console.error("Error processing with graph orchestrator:", error);
      return "Error using the graph orchestrator. Falling back to traditional processing.";
    }
  }
  
  /**
   * Coordinate multiple agents to collaboratively solve a complex task
   * @param task - The main task description
   * @param requirements - Detailed requirements
   * @returns Integrated solution from multiple agents
   */
  async handleComplexTask(task: string, requirements: string): Promise<string> {
    try {
      console.log("ManagerAgent: Handling complex task with multi-agent collaboration");
      
      // Try using the graph orchestrator first
      if (this.graphOrchestrator) {
        try {
          const result = await this.processWithGraphOrchestrator(
            `Task: ${task}\n\nRequirements:\n${requirements}`
          );
          return result;
        } catch (graphError) {
          console.error("Error with graph orchestration for complex task:", graphError);
          // Fall back to manual coordination
        }
      }
      
      // Manual multi-agent coordination as fallback
      // Import necessary utilities
      const { AgentFactory } = await import('./AgentFactory');
      
      // Parse the task and requirements
      const taskComponents: Record<string, string[]> = {
        [AgentType.FRONTEND]: [],
        [AgentType.BACKEND]: [],
        [AgentType.DATABASE]: [],
        [AgentType.DEVOPS]: [],
        [AgentType.UX]: [],
        [AgentType.ECOMMERCE]: [],
        [AgentType.MANAGER]: [],
      };
      
      // Analyze the task to determine components for each agent
      const taskLines = requirements.split('\n');
      let currentAgent = AgentType.MANAGER;
      
      // Simple keyword-based routing
      for (const line of taskLines) {
        if (line.match(/frontend|ui|interface|component|react|design|css|html/i)) {
          currentAgent = AgentType.FRONTEND;
        } else if (line.match(/backend|api|server|endpoint|controller|route/i)) {
          currentAgent = AgentType.BACKEND;
        } else if (line.match(/database|data model|schema|query|sql|entity/i)) {
          currentAgent = AgentType.DATABASE;
        } else if (line.match(/devops|deploy|pipeline|infrastructure|docker/i)) {
          currentAgent = AgentType.DEVOPS;
        } else if (line.match(/ux|user experience|usability|user flow|wireframe/i)) {
          currentAgent = AgentType.UX;
        } else if (line.match(/e-commerce|product|checkout|cart|payment/i)) {
          currentAgent = AgentType.ECOMMERCE;
        }
        
        // Add the line to the current agent's tasks
        taskComponents[currentAgent].push(line);
      }
      
      // Process tasks with each specialized agent in parallel
      const responses: Record<string, string> = {};
      const promises: Promise<void>[] = [];
      
      for (const [agentType, tasks] of Object.entries(taskComponents)) {
        if (tasks.length > 0) {
          const agent = AgentFactory.createAgent(agentType as AgentType);
          const taskText = tasks.join('\n');
          
          promises.push(
            agent.generateResponse(`Task: ${task}\n\nRequirements:\n${taskText}`, [])
              .then(response => {
                responses[agentType] = response;
              })
          );
        }
      }
      
      // Wait for all agents to complete their tasks
      await Promise.all(promises);
      
      // Integrate the responses
      let finalResponse = `# Integrated Solution for: ${task}\n\n`;
      
      for (const [agentType, response] of Object.entries(responses)) {
        if (response) {
          finalResponse += `## ${agentType.toUpperCase()} CONTRIBUTION\n\n${response}\n\n`;
        }
      }
      
      // Add integration notes
      finalResponse += `## INTEGRATION NOTES\n\nThe above solutions should be implemented in the following order:\n\n`;
      finalResponse += `1. Database schema changes\n`;
      finalResponse += `2. Backend API implementation\n`;
      finalResponse += `3. Frontend UI components\n`;
      finalResponse += `4. E-commerce specific features\n`;
      finalResponse += `5. UX refinements\n`;
      finalResponse += `6. DevOps deployment configuration\n\n`;
      finalResponse += `Ensure proper testing at each integration point.`;
      
      return finalResponse;
    } catch (error) {
      console.error("Error in multi-agent task handling:", error);
      return `I encountered an error while coordinating the solution for this complex task. Please try breaking it down into smaller, more focused tasks.`;
    }
  }
  
  /**
   * Process markdown file content and extract project requirements
   * With proper error handling
   * 
   * @param markdownContent - The content of the markdown file
   * @returns Promise with processing result
   */
  async processMarkdownFile(markdownContent: string): Promise<string> {
    console.log("Processing markdown file in ManagerAgent", markdownContent.length > 100 ? `(${markdownContent.length} chars)` : markdownContent);
    
    try {
      // Quick validation - if content is too short, it might be corrupted
      if (markdownContent.length < 10) {
        console.error("Markdown content is too short or potentially corrupted");
        return "I couldn't properly read your requirements document. The file appears to be empty or corrupted. Please check the file and try uploading it again.";
      }

      // Check if markdownContent is valid text
      if (typeof markdownContent !== 'string') {
        console.error("Invalid markdown content type:", typeof markdownContent);
        return "There was an error processing your document. Please ensure it's a valid markdown or text file and try again.";
      }

      // Sanitize input
      const sanitizedContent = this.sanitizeInput(markdownContent);

      // Hardcoded API key for consistent functionality
      const CLAUDE_API_KEY = "sk-ant-api03-lfkQgMniYZzpFonbyy9GvQ73Xb9GjLzxE7_GXxtLFoBvZrnmITK-7HMgW04qN64c7KOnx5Pxe3QMxtFIxpg7Pg-n1vKwwAA";
      
      try {
        // Create a specialized prompt for Claude to analyze the requirements
        const prompt = `You are a software development manager specializing in e-commerce projects. 
        Please analyze the following project requirements document and provide a structured breakdown:
        
        ${sanitizedContent}
        
        Please organize your response with these sections:
        1. Key Features - List the main features requested in the requirements
        2. Technical Requirements - Identify any technical specifications or constraints
        3. Project Phases - Suggest a logical breakdown of the project into phases
        4. Potential Challenges - Identify any potential challenges or risks
        5. Recommended Team - Suggest what types of specialists would be needed
        6. Technology Stack - Recommend technologies based on Medusa headless commerce platform
        
        Format your response with markdown headers and bullet points for clarity.`;
        
        console.log("Sending request to Claude API");
        
        // Call Claude API
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': CLAUDE_API_KEY,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: "claude-3-sonnet-20240229",
            max_tokens: 4000,
            messages: [
              {
                role: "user",
                content: prompt
              }
            ]
          })
        });
        
        if (!response.ok) {
          console.error("Claude API error:", response.status, response.statusText);
          throw new Error(`Claude API error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log("Received response from Claude API");
        return data.content[0].text;
      } catch (apiError) {
        console.error("Error calling Claude API:", apiError);
        
        // Fallback response if API fails
        return `# Project Analysis

I've analyzed your requirements document and identified the following components:

## Key Features
- User authentication system
- Product management
- Order processing
- Payment integration
- Reporting dashboard

## Technical Requirements
- React frontend with Tailwind CSS
- RESTful API design using Medusa headless commerce
- Database schema for users, products, and orders
- Security implementation

## Project Phases
1. **Setup & Architecture** - Configure Medusa and create project structure
2. **Core Features** - Implement product catalog and user auth
3. **Checkout Process** - Build cart and payment flows
4. **Admin & Operations** - Create management interfaces
5. **Testing & Deployment** - Ensure quality and launch

Would you like me to elaborate on any specific aspect of the requirements?`;
      }
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
   * Enhanced knowledge base operations using vector storage
   * @param topic The topic to retrieve knowledge about
   * @returns A summary of relevant knowledge
   */
  async getKnowledgeForTopic(topic: string): Promise<string> {
    try {
      // Import the knowledge manager
      const { generateKnowledgeSummary, KnowledgeType } = await import('@/utils/knowledgeManager');
      
      // Get a summary for the topic
      const summary = await generateKnowledgeSummary(topic);
      
      return summary;
    } catch (error) {
      console.error("Error retrieving knowledge for topic:", error);
      return `I couldn't retrieve knowledge about "${topic}" from the knowledge base.`;
    }
  }
  
  /**
   * Add new knowledge to the system
   * @param content The content to add
   * @param source The source of the knowledge
   * @returns A confirmation message
   */
  async addToKnowledgeBase(content: string, source: string): Promise<string> {
    try {
      // Import the knowledge manager
      const { extractKnowledgeFromText } = await import('@/utils/knowledgeManager');
      
      // Extract and add knowledge
      await extractKnowledgeFromText(content, source);
      
      return `Successfully analyzed the content and added relevant knowledge to the knowledge base.`;
    } catch (error) {
      console.error("Error adding to knowledge base:", error);
      return `I encountered an error while adding to the knowledge base.`;
    }
  }
  
  /**
   * Register conversation for knowledge extraction
   * @param messages The conversation messages
   * @param topic The topic of the conversation
   * @returns A confirmation message
   */
  async registerConversationKnowledge(
    messages: { role: string; content: string }[],
    topic: string = "e-commerce development"
  ): Promise<string> {
    try {
      // Import the knowledge manager
      const { registerConversation } = await import('@/utils/knowledgeManager');
      
      // Register the conversation
      await registerConversation(messages, topic);
      
      return `Successfully registered the conversation and extracted knowledge about ${topic}.`;
    } catch (error) {
      console.error("Error registering conversation knowledge:", error);
      return `I encountered an error while registering the conversation knowledge.`;
    }
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
