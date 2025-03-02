
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
