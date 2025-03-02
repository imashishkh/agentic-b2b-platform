
import { askClaude, searchInternet } from "./aiServices";
import { extractKeyFeatures, extractPhasesFromResponse } from "./markdownParser";

/**
 * Parses markdown content and extracts project information
 * using AI services and internet search
 * 
 * This function serves as the entry point for processing user-provided markdown
 * requirements and converting them into structured project data.
 * 
 * @param markdown - The raw markdown content containing project requirements
 * @returns Object containing the enhanced response and structured phases
 * @throws Error if parsing fails
 */
export const parseMarkdownToTasks = async (markdown: string) => {
  try {
    // First, ask Claude (or simulated LLM) to help structure the content
    // The prompt instructs the AI to organize requirements into logical phases
    const promptForClaude = `
      I have a markdown file with e-commerce project requirements. Please analyze it and structure it into development phases and specific tasks. 
      Break it down into logical sprints or milestones. For each task, include:
      1. Task name/description
      2. Estimated complexity (Low/Medium/High)
      3. Dependencies on other tasks if applicable
      
      Here's the markdown content:
      
      ${markdown}
    `;
    
    // Get AI-generated analysis of the markdown content
    const claudeResponse = await askClaude(promptForClaude);
    
    // Extract key features to create a more targeted search query
    // This helps find relevant best practices and resources
    const searchQuery = "Best practices for implementing " + 
      extractKeyFeatures(markdown) + " in an e-commerce platform";
    
    // Search for additional context and industry best practices
    const searchResults = await searchInternet(searchQuery);
    
    // Combine the AI analysis with search results to create a comprehensive response
    // This provides both structured tasks and relevant resources
    const enhancedResponse = `
      ## Project Analysis and Task Breakdown
      
      ${claudeResponse}
      
      ## Relevant Resources and Best Practices
      
      ${searchResults}
    `;
    
    // Extract the project phases from the response for structured data storage
    const extractedPhases = extractPhasesFromResponse(enhancedResponse);
    
    // Return both the human-readable response and the structured data
    return {
      response: enhancedResponse,
      phases: extractedPhases
    };
  } catch (error) {
    console.error("Error parsing markdown:", error);
    throw error;
  }
};
