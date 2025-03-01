
import { Agent, AgentType } from "./AgentTypes";
import { askClaude, searchInternet } from "@/utils/aiServices";

/**
 * Base class for all AI agents with common functionality
 */
export abstract class BaseAgent implements Agent {
  abstract type: AgentType;
  abstract name: string;
  abstract title: string;
  abstract description: string;
  abstract expertise: string[];
  
  /**
   * Determines if this agent can handle the specific message
   */
  abstract canHandle(message: string): boolean;
  
  /**
   * Generates a response for the given user message
   */
  async generateResponse(userMessage: string, projectPhases: any[] = []): Promise<string> {
    try {
      // Create a prompt template for Claude based on agent expertise
      const promptForClaude = this.createPrompt(userMessage, projectPhases);
      
      // Call Claude API (or simulated response)
      const claudeResponse = await askClaude(promptForClaude);
      
      // If the message suggests we need additional information, search for it
      if (this.shouldSearchForAdditionalInfo(userMessage)) {
        const searchQuery = this.createSearchQuery(userMessage, projectPhases);
        const searchResults = await searchInternet(searchQuery);
        
        // Enhance the response with search results
        return this.enhanceResponseWithSearch(claudeResponse, searchResults);
      }
      
      return claudeResponse;
    } catch (error) {
      console.error(`${this.name} agent error:`, error);
      return `I encountered an error processing your request. Please try again or contact the development team if the issue persists.`;
    }
  }
  
  /**
   * Creates a prompt for Claude based on the agent's expertise
   */
  protected createPrompt(userMessage: string, projectPhases: any[]): string {
    const expertiseContext = this.expertise.join(", ");
    
    return `
      As an AI agent specializing in ${expertiseContext} for e-commerce platforms, please respond to the following user message:
      
      User: "${userMessage}"
      
      ${projectPhases.length > 0 
        ? `Consider the following project phases while responding: ${JSON.stringify(projectPhases)}` 
        : "The project structure has not been defined yet."}
      
      Focus on providing technical, actionable advice specific to your domain of expertise.
      Be detailed yet concise. Include code snippets where appropriate.
    `;
  }
  
  /**
   * Determines if we should search for additional info
   */
  protected shouldSearchForAdditionalInfo(message: string): boolean {
    // Look for indications that the message needs external resources
    // e.g., "best practices", "examples", "resources", etc.
    return message.match(/best practice|recommend|example|how to|tutorial|resource|reference|library|framework|tool/i) !== null;
  }
  
  /**
   * Creates a search query based on the message and project phases
   */
  protected createSearchQuery(message: string, projectPhases: any[]): string {
    // Extract the core question or topic from the message
    const coreQuery = message.replace(/(?:can you|please|i want to|how do i|what is the best way to)\s+/gi, "");
    
    // Combine with agent expertise for a targeted search
    return `${this.type} ${coreQuery} e-commerce best practices`;
  }
  
  /**
   * Enhances the Claude response with information from external search
   */
  protected enhanceResponseWithSearch(claudeResponse: string, searchResults: string): string {
    return `
${claudeResponse}

## Additional Resources

Based on best practices and current industry standards:

${searchResults}

Would you like me to elaborate on any specific aspect of these recommendations?
    `;
  }
}
