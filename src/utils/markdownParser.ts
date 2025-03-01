
/**
 * Extracts key features from markdown content for search queries
 */
export const extractKeyFeatures = (markdown: string): string => {
  // Look for common e-commerce features in the markdown
  const features = [];
  
  if (markdown.toLowerCase().includes("payment")) features.push("payment processing");
  if (markdown.toLowerCase().includes("product") && markdown.toLowerCase().includes("catalog")) 
    features.push("product catalog");
  if (markdown.toLowerCase().includes("cart") || markdown.toLowerCase().includes("checkout")) 
    features.push("shopping cart and checkout");
  if (markdown.toLowerCase().includes("user") && markdown.toLowerCase().includes("account")) 
    features.push("user accounts");
  if (markdown.toLowerCase().includes("search")) features.push("search functionality");
  if (markdown.toLowerCase().includes("review")) features.push("product reviews");
  
  return features.length > 0 ? features.join(", ") : "e-commerce platform features";
};

/**
 * Extracts project phases from an LLM response
 */
export const extractPhasesFromResponse = (response: string): any[] => {
  const phases = [];
  
  // Look for headings that might indicate phases
  const phaseRegex = /##\s+(Phase|Sprint|Milestone)\s+(\d+|[IVX]+):\s*([^\n]+)/gi;
  let phaseMatch;
  
  while ((phaseMatch = phaseRegex.exec(response)) !== null) {
    const phaseName = phaseMatch[3];
    const phaseContent = response.slice(phaseMatch.index + phaseMatch[0].length);
    const endIndex = phaseContent.search(/##\s+(Phase|Sprint|Milestone)/i);
    
    const phaseText = endIndex !== -1 ? 
      phaseContent.slice(0, endIndex) : 
      phaseContent;
    
    // Extract tasks from the phase content
    const tasks = [];
    const taskRegex = /-\s+([^\n]+)/g;
    let taskMatch;
    
    while ((taskMatch = taskRegex.exec(phaseText)) !== null) {
      tasks.push(taskMatch[1]);
    }
    
    phases.push({
      name: phaseName,
      tasks: tasks
    });
  }
  
  return phases;
};
