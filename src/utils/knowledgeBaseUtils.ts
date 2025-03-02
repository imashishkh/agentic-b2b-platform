
/**
 * Utilities for handling knowledge base resources
 */

/**
 * Extract potential resource URLs from a user message
 * 
 * @param message - The user message to analyze
 * @returns Array of extracted URLs
 */
export function extractResourceUrls(message: string): string[] {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return message.match(urlRegex) || [];
}

/**
 * Suggest a category for a resource based on its URL and description
 * 
 * @param url - The resource URL
 * @param description - Optional description of the resource
 * @returns Suggested category
 */
export function suggestResourceCategory(url: string, description: string = ""): string {
  const combinedText = `${url} ${description}`.toLowerCase();
  
  if (combinedText.match(/react|vue|angular|svelte|javascript|typescript|css|html|tailwind|bootstrap|ui|frontend|front-end|design system/i)) {
    return "Technology Stack";
  }
  
  if (combinedText.match(/node|express|nest|spring|django|flask|api|backend|back-end|server|serverless/i)) {
    return "Technology Stack";
  }
  
  if (combinedText.match(/sql|mongo|postgres|mysql|database|schema|model|orm|prisma|sequelize|typeorm/i)) {
    return "Technology Stack";
  }
  
  if (combinedText.match(/best practice|standard|guide|pattern|architecture|iso|ieee|w3c|wcag|a11y|accessibility/i)) {
    return "Industry Standards";
  }
  
  if (combinedText.match(/amazon|shopify|etsy|ebay|competitor|market|commerce|retail|shop|store/i)) {
    return "Competitor Analysis";
  }
  
  if (combinedText.match(/security|compliance|pci|dss|gdpr|ccpa|hipaa|privacy|encrypt|auth|authentication|authorization/i)) {
    return "Security Compliance";
  }
  
  if (combinedText.match(/ux|ui|user experience|wireframe|mockup|prototype|figma|sketch|adobe|design/i)) {
    return "Design Principles";
  }
  
  return "Other";
}

/**
 * Extract a title from a URL
 * Attempts to create a readable title from a URL path
 * 
 * @param url - The URL to extract a title from
 * @returns Suggested title
 */
export function extractTitleFromUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    
    // Try to get a meaningful path segment
    let path = urlObj.pathname;
    
    // Remove trailing slash
    path = path.replace(/\/$/, "");
    
    // Get the last path segment
    const lastSegment = path.split('/').filter(Boolean).pop();
    
    if (lastSegment) {
      // Replace dashes and underscores with spaces and capitalize
      return lastSegment
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase());
    }
    
    // If no path segments, use the hostname
    return urlObj.hostname.replace('www.', '');
  } catch (error) {
    // If URL parsing fails, return a generic title
    return "Web Resource";
  }
}
