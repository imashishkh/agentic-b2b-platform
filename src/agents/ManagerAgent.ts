
import { BaseAgent } from "./BaseAgent";
import { AgentType } from "./AgentTypes";

/**
 * DevManager Agent - Oversees project structure and coordinates between specialized agents
 */
export class ManagerAgent extends BaseAgent {
  type = AgentType.MANAGER;
  name = "DevManager";
  title = "Development Manager";
  description = "Coordinates project phases and integrates work from all specialized agents";
  expertise = [
    "Project planning",
    "Task breakdown",
    "Sprint planning",
    "Resource allocation",
    "Technical requirements gathering",
    "Cross-functional team coordination"
  ];
  
  canHandle(message: string): boolean {
    // The manager can handle any message, but specializes in project planning
    return message.match(/project|plan|phase|task|milestone|timeline|requirement|specification|team|coordinate/i) !== null;
  }
  
  protected createPrompt(userMessage: string, projectPhases: any[]): string {
    return `
      As an AI Development Manager specializing in e-commerce projects, please respond to the following:
      
      User: "${userMessage}"
      
      ${projectPhases.length > 0 
        ? `Consider the current project phases: ${JSON.stringify(projectPhases)}` 
        : "No project structure has been defined yet. Consider asking for a markdown file or helping the user define project requirements."}
      
      Your role is to:
      1. Provide high-level architectural guidance
      2. Help break down complex requirements into manageable tasks
      3. Suggest workflows and development approaches
      4. Coordinate between different aspects of the e-commerce development
      
      Focus on project structure, dependencies, and integration points between different system components.
    `;
  }
  
  protected createSearchQuery(message: string, projectPhases: any[]): string {
    // For the manager agent, we want broader search results about project management
    return `e-commerce project management ${message} best practices methodology`;
  }
}
