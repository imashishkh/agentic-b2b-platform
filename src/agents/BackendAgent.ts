
import { BaseAgent } from "./BaseAgent";
import { AgentType } from "./AgentTypes";

/**
 * Backend Agent - Specializes in server-side development and API design
 * 
 * This agent handles all aspects of server-side architecture, including:
 * - API design and implementation
 * - Authentication and authorization
 * - Data validation and business logic
 * - Server performance and scalability
 * - Security best practices
 */
export class BackendAgent extends BaseAgent {
  type = AgentType.BACKEND;
  name = "BackendDev";
  title = "Backend Developer";
  description = "Expert in API design, server architecture, and authentication";
  
  /**
   * Areas of expertise for the Backend Developer
   * These inform the agent's response generation capabilities
   */
  expertise = [
    "API design (REST and GraphQL)",
    "Authentication & authorization",
    "Payment processing integration",
    "Backend architecture",
    "Serverless functions",
    "Performance optimization",
    "Security best practices",
    "Server-side validation"
  ];
  
  /**
   * Determines if this agent can handle the given message
   * 
   * @param message - The user message to evaluate
   * @returns boolean indicating whether this agent can handle the message
   */
  canHandle(message: string): boolean {
    return message.match(/backend|server|api|endpoint|route|controller|middleware|authentication|authorization|jwt|session|serverless|lambda|function|security|validation/i) !== null;
  }
  
  /**
   * Creates a specialized prompt for the AI model focused on backend development
   * 
   * @param userMessage - The original user message
   * @param projectPhases - Current project phases and tasks
   * @returns A structured prompt that guides the AI response
   */
  protected createPrompt(userMessage: string, projectPhases: any[]): string {
    return `
      As an AI Backend Developer specializing in e-commerce platforms, please respond to the following:
      
      User: "${userMessage}"
      
      ${projectPhases.length > 0 
        ? `Consider the current project phases when designing APIs and backend services: ${JSON.stringify(projectPhases)}` 
        : "No project structure has been defined yet. Focus on general backend best practices for e-commerce."}
      
      Your expertise is in:
      - RESTful and GraphQL API design
      - Authentication systems and security
      - Payment processing integration
      - Scalable backend architecture
      - Serverless function development
      - Data validation and error handling
      
      Provide concrete code examples when applicable, focusing on modern backend patterns, security best practices, and scalable architectures.
    `;
  }
  
  /**
   * Creates a backend-focused search query
   * 
   * @param message - The user message to create a search from
   * @param projectPhases - Current project phases for context
   * @returns A search query string focused on backend development
   */
  protected createSearchQuery(message: string, projectPhases: any[]): string {
    return `e-commerce backend ${message} API design best practices security`;
  }
}
