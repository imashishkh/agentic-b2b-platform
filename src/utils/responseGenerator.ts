
import { askClaude } from "./aiServices";

/**
 * Generates a response based on user message and project context
 * @param userMessage The message from the user
 * @param projectPhases Current project phases if available
 * @returns A response string from the AI
 */
export const generateAgentResponse = async (userMessage: string, projectPhases: any[] = []) => {
  try {
    // If we have project phases, provide context-aware responses
    if (projectPhases.length > 0) {
      // Use Claude (or simulated LLM) to generate a response based on the context
      const promptForClaude = `
        The user is asking about their e-commerce project with the following phases:
        ${JSON.stringify(projectPhases)}
        
        Their message is: "${userMessage}"
        
        Please provide a helpful, technical response that references the project structure above.
        Focus on implementation details, technical considerations, and actionable advice.
      `;
      
      return await askClaude(promptForClaude);
    } else {
      // Generic response when we don't have structured project information yet
      return await askClaude(userMessage);
    }
  } catch (error) {
    console.error("Error generating response:", error);
    throw error;
  }
};
