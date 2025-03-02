
import { KnowledgeBaseResource } from "@/contexts/types";
import { calculateRelevanceScore } from "./resourceExtractor";

/**
 * Find the most relevant resources for a given query or context
 */
export const findRelevantResources = (
  knowledgeBase: KnowledgeBaseResource[],
  query: string,
  limit: number = 5
): KnowledgeBaseResource[] => {
  if (!query || !knowledgeBase.length) return [];
  
  // Calculate scores for all resources
  const scoredResources = knowledgeBase.map(resource => {
    const score = calculateRelevanceScore(resource, query);
    return { ...resource, calculatedScore: score };
  });
  
  // Sort by score (highest first) and take the top 'limit' results
  return scoredResources
    .sort((a, b) => (b.calculatedScore || 0) - (a.calculatedScore || 0))
    .slice(0, limit)
    .map(({ calculatedScore, ...resource }) => resource);
};

/**
 * Update resource metadata when it's accessed or used
 */
export const trackResourceUsage = (
  resource: KnowledgeBaseResource
): KnowledgeBaseResource => {
  return {
    ...resource,
    lastAccessed: new Date().toISOString(),
    accessCount: (resource.accessCount || 0) + 1
  };
};

/**
 * Generate a knowledge context from relevant resources
 */
export const generateKnowledgeContext = (
  relevantResources: KnowledgeBaseResource[]
): string => {
  if (!relevantResources.length) return "";
  
  return relevantResources.map(resource => {
    return `
## ${resource.title}
Category: ${resource.category}
${resource.tags?.length ? `Tags: ${resource.tags.join(', ')}` : ''}
${resource.description}
Reference: ${resource.url}
    `.trim();
  }).join('\n\n');
};

/**
 * Analyzes resource content for relevance to architecture
 */
export const extractArchitectureInsights = (
  resources: KnowledgeBaseResource[]
): {
  patterns: string[];
  technologies: string[];
  bestPractices: string[];
} => {
  const patterns: string[] = [];
  const technologies: string[] = [];
  const bestPractices: string[] = [];
  
  // Common architectural patterns to look for
  const patternKeywords = [
    'microservices', 'monolithic', 'serverless', 'event-driven', 'layered',
    'mvc', 'mvvm', 'jamstack', 'soa', 'ddd', 'cqrs'
  ];
  
  // Common technology categories
  const techCategories = [
    'frontend', 'backend', 'database', 'api', 'server', 'cloud', 'container',
    'framework', 'library', 'language', 'platform'
  ];
  
  // Scan resources for relevant information
  resources.forEach(resource => {
    const content = resource.content || resource.description;
    if (!content) return;
    
    const contentLower = content.toLowerCase();
    
    // Look for architectural patterns
    patternKeywords.forEach(pattern => {
      if (contentLower.includes(pattern) && !patterns.includes(pattern)) {
        patterns.push(pattern);
      }
    });
    
    // Extract technology mentions
    const techRegex = /\b(react|angular|vue|node|express|django|flask|laravel|spring|dotnet|sql|nosql|mongodb|postgresql|mysql|graphql|rest|docker|kubernetes|aws|azure|gcp)\b/gi;
    const techMatches = content.match(techRegex);
    
    if (techMatches) {
      techMatches.forEach(tech => {
        const normalizedTech = tech.toLowerCase();
        if (!technologies.includes(normalizedTech)) {
          technologies.push(normalizedTech);
        }
      });
    }
    
    // Extract best practices
    if (contentLower.includes('best practice') || contentLower.includes('recommended') || contentLower.includes('guideline')) {
      const sentenceRegex = /[^.!?]*(?:best practice|recommended|guideline)[^.!?]*[.!?]/gi;
      const practiceMatches = content.match(sentenceRegex);
      
      if (practiceMatches) {
        practiceMatches.forEach(practice => {
          const trimmedPractice = practice.trim();
          if (trimmedPractice && !bestPractices.includes(trimmedPractice)) {
            bestPractices.push(trimmedPractice);
          }
        });
      }
    }
  });
  
  return {
    patterns: patterns.map(p => p.charAt(0).toUpperCase() + p.slice(1)),
    technologies,
    bestPractices: bestPractices.slice(0, 5) // Limit to top 5 best practices
  };
};

/**
 * Find architecture-related resources
 */
export const findArchitectureResources = (
  knowledgeBase: KnowledgeBaseResource[]
): KnowledgeBaseResource[] => {
  if (!knowledgeBase.length) return [];
  
  // Keywords related to architecture
  const architectureKeywords = [
    'architecture', 'design', 'component', 'microservice', 'monolith',
    'serverless', 'pattern', 'framework', 'structure', 'system'
  ];
  
  // Filter resources that match architecture keywords
  return knowledgeBase.filter(resource => {
    const content = (resource.content || resource.description || '').toLowerCase();
    const title = (resource.title || '').toLowerCase();
    const category = (resource.category || '').toLowerCase();
    const tags = (resource.tags || []).map(tag => tag.toLowerCase());
    
    // Check if resource contains architecture keywords
    return architectureKeywords.some(keyword => 
      content.includes(keyword) || 
      title.includes(keyword) || 
      category.includes(keyword) ||
      tags.includes(keyword)
    );
  });
};
