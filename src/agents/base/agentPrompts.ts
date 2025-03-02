
/**
 * Utility functions for creating and handling agent prompts
 */

import { AgentType } from "../AgentTypes";

/**
 * Creates a prompt for Claude AI based on the agent's expertise
 */
export function createPrompt(userMessage: string, projectPhases: any[], expertise: string[], type: AgentType, title: string): string {
  const expertiseContext = expertise.join(", ");
  
  return `
    As an AI agent specializing in ${expertiseContext} for e-commerce platforms, please respond to the following user message:
    
    User: "${userMessage}"
    
    ${projectPhases.length > 0 
      ? `Consider the following project phases while responding: ${JSON.stringify(projectPhases)}` 
      : "The project structure has not been defined yet."}
    
    Focus on providing technical, actionable advice specific to your domain of expertise.
    Be detailed yet concise. Include code snippets where appropriate.
    
    If you need to coordinate with other specialists, include "COORDINATE_WITH:" followed by the specialist type and what you need from them.
    For example: "COORDINATE_WITH:BACKEND:Need API endpoints for product data before I can implement the frontend components"
    
    If you're not confident in your answer or this is outside your expertise, please respond with "ESCALATE:" followed by your best attempt at an answer.
  `;
}

/**
 * Creates a search query based on the message and project phases
 */
export function createSearchQuery(message: string, projectPhases: any[], type: AgentType): string {
  // Extract the core question or topic from the message
  const coreQuery = message.replace(/(?:can you|please|i want to|how do i|what is the best way to)\s+/gi, "");
  
  // Combine with agent expertise for a targeted search
  return `${type} ${coreQuery} e-commerce best practices`;
}

/**
 * Creates a search query for code examples
 */
export function createCodeSearchQuery(message: string, type: AgentType): string {
  return `${type.toLowerCase()} ${message.replace(/can you (show|provide|give) (me )?(an |some )?(example|code|implementation)/i, "")} e-commerce`;
}
