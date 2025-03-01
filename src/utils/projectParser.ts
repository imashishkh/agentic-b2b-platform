
import { askClaude, searchInternet } from "./aiServices";
import { extractKeyFeatures, extractPhasesFromResponse } from "./markdownParser";

/**
 * Parses markdown content and extracts project information
 * using AI services and internet search
 */
export const parseMarkdownToTasks = async (markdown: string) => {
  try {
    // First, ask Claude (or simulated LLM) to help structure the content
    const promptForClaude = `
      I have a markdown file with e-commerce project requirements. Please analyze it and structure it into development phases and specific tasks. 
      Break it down into logical sprints or milestones. For each task, include:
      1. Task name/description
      2. Estimated complexity (Low/Medium/High)
      3. Dependencies on other tasks if applicable
      
      Here's the markdown content:
      
      ${markdown}
    `;
    
    const claudeResponse = await askClaude(promptForClaude);
    
    // Now use the internet search to find relevant resources
    const searchQuery = "Best practices for implementing " + 
      extractKeyFeatures(markdown) + " in an e-commerce platform";
    const searchResults = await searchInternet(searchQuery);
    
    // Combine the Claude analysis with search results
    const enhancedResponse = `
      ## Project Analysis and Task Breakdown
      
      ${claudeResponse}
      
      ## Relevant Resources and Best Practices
      
      ${searchResults}
    `;
    
    // Extract project phases from the response
    const extractedPhases = extractPhasesFromResponse(enhancedResponse);
    
    return {
      response: enhancedResponse,
      phases: extractedPhases
    };
  } catch (error) {
    console.error("Error parsing markdown:", error);
    throw error;
  }
};
