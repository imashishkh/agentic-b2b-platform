
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
    "Security practices"
  ];
  
  /**
   * Determines if this agent can handle the given message
   * 
   * @param message - The user message to evaluate
   * @returns boolean indicating whether this agent can handle the message
   */
  canHandle(message: string): boolean {
    return message.match(/deployment|CI\/CD|Docker|Kubernetes|AWS|Azure|GCP|scaling|monitoring|logging|performance|infrastructure|container|cloud|pipeline|automation|DevOps/i) !== null;
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
    return `e-commerce ${message} DevOps deployment CI/CD cloud infrastructure best practices`;
  }
}
