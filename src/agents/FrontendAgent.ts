
import { BaseAgent } from "./BaseAgent";
import { AgentType } from "./AgentTypes";

/**
 * Frontend Agent - Specializes in UI development and frontend architecture
 */
export class FrontendAgent extends BaseAgent {
  type = AgentType.FRONTEND;
  name = "FrontendDev";
  title = "Frontend Developer";
  description = "Expert in React, Tailwind, and responsive UI development";
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
  
  canHandle(message: string): boolean {
    return message.match(/frontend|UI|component|react|design|css|tailwind|style|layout|responsive|mobile|desktop|animation|transition|state management|redux|context|hook/i) !== null;
  }
  
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
  
  protected createSearchQuery(message: string, projectPhases: any[]): string {
    return `React Tailwind CSS ${message} e-commerce UI component best practices`;
  }
}
