
import { BaseAgent } from "./BaseAgent";
import { AgentType } from "./AgentTypes";

/**
 * Frontend Agent - Specializes in UI development and frontend architecture
 * 
 * This agent handles all aspects of the user interface, including:
 * - Component design and implementation
 * - Responsive layouts
 * - State management
 * - UI performance optimization
 * - Frontend testing
 */
export class FrontendAgent extends BaseAgent {
  type = AgentType.FRONTEND;
  name = "FrontendDev";
  title = "Frontend Developer";
  description = "Expert in React, Tailwind, and responsive UI development";
  
  /**
   * Areas of expertise for the Frontend Developer
   * These inform the agent's response generation capabilities
   */
  expertise = [
    "React components",
    "Tailwind CSS styling",
    "Responsive design",
    "State management",
    "Frontend performance optimization",
    "Accessibility",
    "UI animations",
    "Frontend testing"
  ];
  
  /**
   * Determines if this agent can handle the given message
   * 
   * @param message - The user message to evaluate
   * @returns boolean indicating whether this agent can handle the message
   */
  canHandle(message: string): boolean {
    return message.match(/frontend|UI|component|react|design|css|tailwind|style|layout|responsive|mobile|desktop|animation|transition|state management|redux|context|hook/i) !== null;
  }
  
  /**
   * Creates a specialized prompt for the AI model focused on frontend development
   * 
   * @param userMessage - The original user message
   * @param projectPhases - Current project phases and tasks
   * @returns A structured prompt that guides the AI response
   */
  protected createPrompt(userMessage: string, projectPhases: any[]): string {
    return `
      As an AI Frontend Developer specializing in e-commerce platforms, please respond to the following:
      
      User: "${userMessage}"
      
      ${projectPhases.length > 0 
        ? `Consider the current project phases when designing UI components: ${JSON.stringify(projectPhases)}` 
        : "No project structure has been defined yet. Focus on general frontend best practices for e-commerce."}
      
      Your expertise is in:
      - React component architecture
      - Tailwind CSS styling and responsive design
      - State management patterns
      - Frontend performance optimization
      - Accessibility and user experience
      
      Provide concrete code examples when applicable, focusing on modern React patterns with TypeScript and Tailwind CSS.
    `;
  }
  
  /**
   * Creates a frontend-focused search query
   * 
   * @param message - The user message to create a search from
   * @param projectPhases - Current project phases for context
   * @returns A search query string focused on frontend development
   */
  protected createSearchQuery(message: string, projectPhases: any[]): string {
    return `React Tailwind CSS ${message} e-commerce UI component best practices`;
  }
}
