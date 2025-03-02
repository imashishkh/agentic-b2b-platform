
import { BaseAgent } from "./BaseAgent";
import { AgentType } from "./AgentTypes";

/**
 * UX Agent - Specializes in user experience and interface design
 * 
 * This agent handles all aspects of user experience, including:
 * - Information architecture and user flows
 * - Interaction design and usability
 * - Accessibility compliance
 * - Conversion optimization
 * - User research and testing methodologies
 */
export class UXAgent extends BaseAgent {
  type = AgentType.UX;
  name = "UXDesigner";
  title = "UX Designer";
  description = "Expert in user experience, interaction design, and accessibility";
  
  /**
   * Areas of expertise for the UX Designer
   * These inform the agent's response generation capabilities
   */
  expertise = [
    "User experience (UX) design",
    "User interface (UI) patterns",
    "Interaction design",
    "Information architecture",
    "User flow optimization",
    "Accessibility (WCAG)",
    "Usability testing",
    "Conversion optimization"
  ];
  
  /**
   * Determines if this agent can handle the given message
   * 
   * @param message - The user message to evaluate
   * @returns boolean indicating whether this agent can handle the message
   */
  canHandle(message: string): boolean {
    return message.match(/user experience|UX|usability|accessibility|user flow|information architecture|wireframe|prototype|user research|persona|journey map|interaction design|conversion|funnel/i) !== null;
  }
  
  /**
   * Creates a specialized prompt for the AI model focused on UX design
   * 
   * @param userMessage - The original user message
   * @param projectPhases - Current project phases and tasks
   * @returns A structured prompt that guides the AI response
   */
  protected createPrompt(userMessage: string, projectPhases: any[]): string {
    return `
      As an AI UX Designer specializing in e-commerce platforms, please respond to the following:
      
      User: "${userMessage}"
      
      ${projectPhases.length > 0 
        ? `Consider the current project phases when designing user experiences: ${JSON.stringify(projectPhases)}` 
        : "No project structure has been defined yet. Focus on general UX best practices for e-commerce."}
      
      Your expertise is in:
      - E-commerce user experience patterns and best practices
      - Conversion-optimized user flows and checkout processes
      - Accessible interface design (WCAG compliance)
      - Mobile-first and responsive design approaches
      - User testing methodologies for e-commerce
      - Information architecture for product catalogs and navigation
      
      Provide concrete UX recommendations and interface patterns when applicable, focusing on conversion optimization, accessibility, and usability.
    `;
  }
  
  /**
   * Creates a UX-focused search query
   * 
   * @param message - The user message to create a search from
   * @param projectPhases - Current project phases for context
   * @returns A search query string focused on UX design
   */
  protected createSearchQuery(message: string, projectPhases: any[]): string {
    return `e-commerce ${message} UX design user experience conversion optimization best practices`;
  }
}
