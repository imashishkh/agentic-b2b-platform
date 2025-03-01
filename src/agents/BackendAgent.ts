
import { BaseAgent } from "./BaseAgent";
import { AgentType } from "./AgentTypes";

/**
 * Backend Agent - Specializes in server-side development and API design
 */
export class BackendAgent extends BaseAgent {
  type = AgentType.BACKEND;
  name = "BackendDev";
  title = "Backend Developer";
  description = "Expert in API design, server architecture, and authentication";
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
  
  canHandle(message: string): boolean {
    return message.match(/backend|server|api|endpoint|route|controller|middleware|authentication|authorization|jwt|session|serverless|lambda|function|security|validation/i) !== null;
  }
  
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
  
  protected createSearchQuery(message: string, projectPhases: any[]): string {
    return `e-commerce backend ${message} API design best practices security`;
  }
}
