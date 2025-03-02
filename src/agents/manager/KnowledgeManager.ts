
import { KnowledgeBaseResource } from "@/contexts/types";

/**
 * Generates a knowledge base request prompt after task assignments
 * 
 * @returns A structured prompt asking for knowledge base resources
 */
export function generateKnowledgeBasePrompt(): string {
  return `
## Knowledge Base Enhancement

To better support your e-commerce project, I'd like to build a knowledge base of relevant resources. Could you provide links to:

1. **Technology Documentation** - Links to docs for your preferred tech stack (frontend, backend, database)
2. **Industry Standards** - E-commerce best practices, security standards, accessibility guidelines
3. **Competitor Analysis** - Examples of similar e-commerce platforms you admire or want to reference
4. **Security Compliance** - Any specific security or regulatory requirements your project needs to meet

Adding these resources will help all specialists provide more accurate and relevant guidance throughout the development process.

To add a resource, simply share a link with a brief description of what it contains.
  `;
}

/**
 * Calculate relevance score for a resource based on a query
 * 
 * @param resource - The knowledge base resource
 * @param query - The search query
 * @returns Relevance score between 0 and 1
 */
export function calculateResourceRelevance(resource: KnowledgeBaseResource, query: string): number {
  if (!query) return 0;
  
  const queryTerms = query.toLowerCase().split(/\s+/);
  let score = 0;
  
  // Check title
  queryTerms.forEach(term => {
    if (resource.title.toLowerCase().includes(term)) {
      score += 0.3;
    }
  });
  
  // Check description
  queryTerms.forEach(term => {
    if (resource.description.toLowerCase().includes(term)) {
      score += 0.2;
    }
  });
  
  // Check tags
  if (resource.tags) {
    queryTerms.forEach(term => {
      resource.tags!.forEach(tag => {
        if (tag.toLowerCase().includes(term)) {
          score += 0.4;
        }
      });
    });
  }
  
  // Check category
  queryTerms.forEach(term => {
    if (resource.category.toLowerCase().includes(term)) {
      score += 0.1;
    }
  });
  
  // Normalize score to be between 0 and 1
  return Math.min(1, score);
}

/**
 * Search knowledge base resources
 * 
 * @param resources - Array of knowledge base resources
 * @param query - Search query
 * @returns Array of resources sorted by relevance
 */
export function searchKnowledgeBase(resources: KnowledgeBaseResource[], query: string): KnowledgeBaseResource[] {
  if (!query || !resources.length) return [];
  
  // Calculate relevance scores
  const scoredResources = resources.map(resource => ({
    resource,
    score: calculateResourceRelevance(resource, query)
  }));
  
  // Filter out irrelevant resources (score below threshold)
  const relevantResources = scoredResources.filter(item => item.score > 0.2);
  
  // Sort by relevance score (descending)
  relevantResources.sort((a, b) => b.score - a.score);
  
  // Return the resources with scores
  return relevantResources.map(item => ({
    ...item.resource,
    relevanceScore: item.score
  }));
}

/**
 * Categorize a knowledge base resource
 * 
 * @param resource - The resource to categorize
 * @returns The category of the resource
 */
export function categorizeResource(resource: KnowledgeBaseResource): string {
  const url = resource.url.toLowerCase();
  const title = resource.title.toLowerCase();
  const description = resource.description.toLowerCase();
  
  // Technical documentation
  if (url.includes('docs.') || 
      url.includes('/documentation') || 
      title.includes('documentation') || 
      title.includes('guide') || 
      title.includes('reference')) {
    return 'technical';
  }
  
  // Industry standards
  if (title.includes('standard') || 
      title.includes('best practice') || 
      title.includes('guideline') || 
      description.includes('standard') || 
      description.includes('best practice')) {
    return 'standards';
  }
  
  // Competitor analysis
  if (title.includes('competitor') || 
      description.includes('competitor') || 
      description.includes('similar platform')) {
    return 'competitors';
  }
  
  // Security and compliance
  if (title.includes('security') || 
      title.includes('compliance') || 
      title.includes('gdpr') || 
      title.includes('pci') || 
      description.includes('security') || 
      description.includes('compliance')) {
    return 'security';
  }
  
  // Default to other
  return 'other';
}

/**
 * Generate resource recommendations based on project requirements
 * 
 * @param requirements - The project requirements text
 * @returns Array of recommended resource types
 */
export function generateResourceRecommendations(requirements: string): string[] {
  const recommendations: string[] = [];
  
  // Check for frontend-related requirements
  if (requirements.match(/ui|interface|component|screen|frontend|css|html|style|responsive|mobile|desktop/i)) {
    recommendations.push('Frontend design documentation');
    recommendations.push('UI component libraries');
    recommendations.push('Responsive design guidelines');
  }
  
  // Check for backend-related requirements
  if (requirements.match(/api|endpoint|server|backend|auth|authentication|authorization|middleware|service/i)) {
    recommendations.push('Backend frameworks documentation');
    recommendations.push('API design best practices');
    recommendations.push('Authentication implementation guides');
  }
  
  // Check for database-related requirements
  if (requirements.match(/database|schema|model|entity|table|query|sql|nosql/i)) {
    recommendations.push('Database modeling guides');
    recommendations.push('Query optimization resources');
    recommendations.push('Data migration strategies');
  }
  
  // Check for e-commerce specific requirements
  if (requirements.match(/payment|checkout|cart|product|inventory|order|shipping/i)) {
    recommendations.push('E-commerce platform comparison');
    recommendations.push('Payment gateway documentation');
    recommendations.push('E-commerce UX best practices');
  }
  
  // Check for security requirements
  if (requirements.match(/security|secure|encryption|protection|privacy|compliance/i)) {
    recommendations.push('Web application security checklists');
    recommendations.push('OWASP top 10 vulnerabilities');
    recommendations.push('Data protection regulations');
  }
  
  return recommendations;
}
