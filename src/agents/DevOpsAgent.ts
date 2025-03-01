
import { BaseAgent } from "./BaseAgent";
import { AgentType } from "./AgentTypes";

/**
 * DevOps Agent - Specializes in deployment, CI/CD, and infrastructure
 */
export class DevOpsAgent extends BaseAgent {
  type = AgentType.DEVOPS;
  name = "DevOpsEng";
  title = "DevOps Engineer";
  description = "Expert in deployment, CI/CD, and infrastructure management";
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
  
  canHandle(message: string): boolean {
    return message.match(/deployment|CI\/CD|Docker|Kubernetes|AWS|Azure|GCP|scaling|monitoring|logging|performance|infrastructure|container|cloud|pipeline|automation|DevOps/i) !== null;
  }
  
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
  
  protected createSearchQuery(message: string, projectPhases: any[]): string {
    return `e-commerce ${message} DevOps deployment CI/CD cloud infrastructure best practices`;
  }
}
