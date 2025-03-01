
import { BaseAgent } from "./BaseAgent";
import { AgentType } from "./AgentTypes";

/**
 * UX Agent - Specializes in user experience and interface design
 */
export class UXAgent extends BaseAgent {
  type = AgentType.UX;
  name = "UXDesigner";
  title = "UX Designer";
  description = "Expert in user experience, interaction design, and accessibility";
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
  
  canHandle(message: string): boolean {
    return message.match(/user experience|UX|usability|accessibility|user flow|information architecture|wireframe|prototype|user research|persona|journey map|interaction design|conversion|funnel/i) !== null;
  }
  
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
  
  protected createSearchQuery(message: string, projectPhases: any[]): string {
    return `e-commerce ${message} UX design user experience conversion optimization best practices`;
  }
}
