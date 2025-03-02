
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
 * - User experience considerations
 * - Accessibility standards
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
    "UI/UX design principles",
    "UI animations",
    "Frontend testing",
    "Component architecture",
    "Design systems"
  ];
  
  /**
   * Determines if this agent can handle the given message
   * 
   * @param message - The user message to evaluate
   * @returns boolean indicating whether this agent can handle the message
   */
  canHandle(message: string): boolean {
    const frontendKeywords = [
      'frontend', 'ui', 'ux', 'component', 'react', 'design', 'css', 'tailwind', 
      'style', 'layout', 'responsive', 'mobile', 'desktop', 'animation', 
      'transition', 'state management', 'redux', 'context', 'hook', 'interface',
      'user interface', 'button', 'form', 'input', 'modal', 'sidebar', 'navbar',
      'design system', 'theme', 'accessibility', 'a11y'
    ];
    
    // Create a regex pattern that matches any of the keywords
    const pattern = new RegExp(frontendKeywords.join('|'), 'i');
    return pattern.test(message);
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
      - React component architecture and design patterns
      - Tailwind CSS styling and responsive design principles
      - State management strategies (Context API, useState, useReducer)
      - Frontend performance optimization techniques
      - Accessibility standards and user experience best practices
      - UI animations and interactive elements
      
      Provide concrete code examples when applicable, focusing on modern React patterns with TypeScript and Tailwind CSS.
      When discussing UI components, emphasize clean, maintainable code architecture.
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
    // Enhance search queries with more specific frontend-related terms
    const frontendTerms = ["React", "Tailwind CSS", "UI component", "responsive design"];
    
    // Extract any project-specific terms if available
    const projectTerms = projectPhases.length > 0 
      ? projectPhases
          .flatMap(phase => phase.tasks || [])
          .filter(task => task.type === 'frontend')
          .map(task => task.description)
          .slice(0, 2)
      : [];
      
    // Combine terms for a more focused search
    return `${frontendTerms.join(" ")} ${projectTerms.join(" ")} ${message} e-commerce best practices`;
  }
}
