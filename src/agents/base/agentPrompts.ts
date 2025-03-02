
/**
 * Utility functions for creating agent prompts
 */

/**
 * Create a prompt for the agent based on the message and context
 */
export const createPrompt = (message: string, context: string = '', agentType: string = ''): string => {
  const basePrompt = `You are a ${agentType || 'software development'} expert agent. Please help with the following request:`;
  
  let fullPrompt = basePrompt + '\n\n' + message;
  
  if (context) {
    fullPrompt += '\n\nContext:\n' + context;
  }
  
  return fullPrompt;
};

/**
 * Create a search query for finding relevant information
 */
export const createSearchQuery = (message: string, agentType: string = ''): string => {
  // Extract key terms from the message
  const searchTerms = message
    .replace(/[^\w\s]/gi, '') // Remove punctuation
    .split(/\s+/) // Split by whitespace
    .filter(term => term.length > 3) // Only keep terms with more than 3 characters
    .slice(0, 6) // Take at most 6 terms
    .join(' '); // Join with spaces
  
  // Add agent type context if available
  const agentContext = agentType ? `${agentType} development ` : '';
  
  return `${agentContext}${searchTerms}`;
};

/**
 * Create a search query specifically for code examples
 */
export const createCodeSearchQuery = (message: string, agentType: string = ''): string => {
  // Construct a query focused on code examples
  let query = createSearchQuery(message, agentType);
  
  // Add code-specific terms
  const codeTerms = ['code example', 'implementation', 'function', 'class', 'component'];
  const randomCodeTerm = codeTerms[Math.floor(Math.random() * codeTerms.length)];
  
  return `${query} ${randomCodeTerm}`;
};
