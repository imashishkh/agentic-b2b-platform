
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
    "Cross-functional team coordination",
    "Technical oversight and guidance"
  ];
  
  canHandle(message: string): boolean {
    // The manager can handle any message, but specializes in project planning
    // and coordinating between different specialist domains
    return message.match(/project|plan|phase|task|milestone|timeline|requirement|specification|team|coordinate|oversee|manage|guide|help|stuck|uncertain|advice/i) !== null;
  }
  
  protected createPrompt(userMessage: string, projectPhases: any[]): string {
    // Check if this is a consultation from another specialist
    const isConsultation = userMessage.includes("One of your team members") && 
                          userMessage.includes("needs guidance");
    
    // Check if this is a coordination request
    const isCoordination = userMessage.includes("synthesize these different specialist inputs");
    
    if (isCoordination) {
      return `
        As the Development Manager and technical lead, you're being asked to coordinate inputs from multiple specialists.
        
        ${userMessage}
        
        Your job is to create a clear development plan that:
        1. Establishes the correct sequence of tasks
        2. Identifies critical dependencies between different parts of the system
        3. Highlights integration points that need special attention
        4. Provides clear technical guidance on how components should work together
        
        Remember that you have final decision-making authority on technical approaches.
      `;
    }
    
    if (isConsultation) {
      return `
        As the Development Manager and technical lead for this e-commerce project, you're being consulted by one of your team specialists.
        
        ${userMessage}
        
        Please provide authoritative guidance that combines your broad technical knowledge with project specifics.
        Remember you have oversight across all domains including: frontend, backend, database, DevOps, and UX.
        Your goal is to provide clear, actionable direction that will unblock your team member.
      `;
    }
    
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
      5. Support team members who need technical guidance across specialties
      
      Focus on project structure, dependencies, and integration points between different system components.
      As the Development Manager, you have the final say on technical decisions and can provide authoritative guidance across all domains.
    `;
  }
  
  protected isAgentStuck(response: string): boolean {
    // The manager is never "stuck" in the same way as specialists
    // This prevents infinite loops when consulting the manager
    return false;
  }
  
  /**
   * Override detectDependencies for the Manager to return no dependencies
   * This prevents infinite loops in coordination
   */
  protected detectDependencies(response: string, userMessage: string): { 
    hasDependencies: boolean; 
    dependentAgents: AgentType[];
    dependencyDetails: string;
  } {
    // The manager doesn't need to coordinate with others as it has final authority
    return { 
      hasDependencies: false, 
      dependentAgents: [], 
      dependencyDetails: "" 
    };
  }
  
  protected createSearchQuery(message: string, projectPhases: any[]): string {
    // For the manager agent, we want broader search results about project management
    // and technical leadership
    return `e-commerce project management ${message} best practices methodology leadership`;
  }
}
