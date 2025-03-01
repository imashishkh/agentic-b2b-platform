
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
    "Technical oversight and guidance",
    "Architectural decision-making",
    "Quality assurance",
    "Security review",
    "Performance optimization strategy",
    "E-commerce domain expertise"
  ];
  
  canHandle(message: string): boolean {
    // The manager can handle any message, but specializes in project planning
    // and coordinating between different specialist domains
    return message.match(/project|plan|phase|task|milestone|timeline|requirement|specification|team|coordinate|oversee|manage|guide|help|stuck|uncertain|advice|architecture|decision|review|quality|security|performance/i) !== null;
  }
  
  protected createPrompt(userMessage: string, projectPhases: any[]): string {
    // Check if this is a consultation from another specialist
    const isConsultation = userMessage.includes("One of your team members") && 
                          userMessage.includes("needs guidance");
    
    // Check if this is a coordination request
    const isCoordination = userMessage.includes("synthesize these different specialist inputs");
    
    // Check if this is a technical decision request
    const isTechnicalDecision = userMessage.includes("technical decision") || 
                               userMessage.includes("architectural choice") ||
                               userMessage.includes("technology selection");
    
    // Check if this is a code review or quality check
    const isCodeReview = userMessage.includes("review this code") || 
                        userMessage.includes("quality check") ||
                        userMessage.includes("best practices review");
    
    if (isCodeReview) {
      return `
        As the Development Manager and lead architect, you're being asked to review code quality.
        
        ${userMessage}
        
        Provide a thorough code review that covers:
        1. Code structure and organization
        2. Adherence to best practices
        3. Potential bugs or edge cases
        4. Performance considerations
        5. Security implications (especially important for e-commerce)
        6. Maintainability and scalability
        
        Your review should be specific, actionable, and educational. Explain not just what should be changed, but why.
        Always consider the e-commerce context and how code quality impacts user experience and business outcomes.
      `;
    }
    
    if (isTechnicalDecision) {
      return `
        As the Development Manager and lead architect, you're being asked to make a technical decision.
        
        ${userMessage}
        
        Provide a clear decision with:
        1. Analysis of different options
        2. Pros and cons of each approach
        3. Your recommendation and reasoning
        4. Implementation considerations
        5. Potential risks and mitigation strategies
        
        Your decision should balance technical excellence with practicality for the e-commerce context.
        Consider factors like development speed, future scalability, security requirements, and team expertise.
      `;
    }
    
    if (isCoordination) {
      return `
        As the Development Manager and technical lead, you're being asked to coordinate inputs from multiple specialists.
        
        ${userMessage}
        
        Your job is to create a clear development plan that:
        1. Establishes the correct sequence of tasks
        2. Identifies critical dependencies between different parts of the system
        3. Highlights integration points that need special attention
        4. Provides clear technical guidance on how components should work together
        5. Sets quality standards and testing requirements
        6. Addresses potential risks and mitigation strategies
        
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
        
        Draw on your expertise in:
        1. E-commerce architecture patterns
        2. Technical standards and best practices
        3. Cross-domain integration approaches
        4. Risk assessment and mitigation
        5. Performance and security considerations
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
      6. Make authoritative technical decisions when needed
      7. Ensure quality, security, and performance standards are met
      8. Provide strategic direction aligned with e-commerce best practices
      
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
    return `e-commerce project management ${message} best practices methodology leadership architecture`;
  }
  
  /**
   * Override for Manager to provide more comprehensive code reviews
   */
  protected shouldCheckSecurity(message: string, response: string): boolean {
    // Manager always checks security when code is present
    return response.includes("```");
  }
  
  /**
   * Override for Manager to provide more detailed testing guidance
   */
  protected enhanceResponseWithTestResults(claudeResponse: string, testResults: string): string {
    return `
${claudeResponse}

## Code Review and Testing Recommendations

${testResults}

As the Development Manager, I recommend that all team members follow these testing practices for our e-commerce platform:

1. Write unit tests for all business logic components
2. Implement integration tests for API endpoints and data flows
3. Add end-to-end tests for critical user journeys like checkout
4. Perform security testing on all code that handles user data or payments
5. Test all responsive design breakpoints for mobile and desktop

Would you like me to help set up a testing framework or provide specific test cases for this code?
    `;
  }
}
