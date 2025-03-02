import { useContext, useCallback, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatContext } from '@/contexts';
import { KnowledgeResource } from '@/contexts/types';
import {
  categorizeEcommerceResource,
  extractProductMetadata,
  generateProductRecommendations,
  findRelatedProducts,
  getResourcesByDevelopmentStage,
  findBestPractices,
  generateComponentDocTemplate,
  generateApiDocTemplate,
  generateSampleEcommerceResources
} from '@/utils/ecommerceKnowledgeUtils';
import { findEcommerceResources, groupByMarketSegment } from '@/utils/knowledgeRelevance';

/**
 * Hook for e-commerce specific knowledge base operations
 */
export function useEcommerceKnowledge() {
  const { knowledgeBase, addKnowledgeResource, removeKnowledgeResource } = useContext(ChatContext);
  
  // Additional state for development stage-based recommendations
  const [currentStage, setCurrentStage] = useState<string>("planning");
  const [stageRecommendations, setStageRecommendations] = useState<KnowledgeResource[]>([]);
  const [bestPractices, setBestPractices] = useState<KnowledgeResource[]>([]);
  const [ecommerceResources, setEcommerceResources] = useState<KnowledgeResource[]>([]);
  const [segmentedResources, setSegmentedResources] = useState<Record<string, KnowledgeResource[]>>({});

  /**
   * Add a new e-commerce resource with enhanced metadata
   * 
   * @param resource - The resource to add
   * @returns The added resource with metadata
   */
  const addEcommerceResource = useCallback((resource: Partial<KnowledgeResource>): KnowledgeResource => {
    // Create base resource with required fields
    const baseResource: KnowledgeResource = {
      id: resource.id || uuidv4(),
      title: resource.title || 'Untitled Resource',
      content: resource.content || '',
      dateAdded: new Date().toISOString(),
      ...resource
    };
    
    // Categorize if not already categorized
    if (!baseResource.category) {
      baseResource.category = categorizeEcommerceResource(baseResource);
    }
    
    // Extract e-commerce specific metadata
    const enhancedResource = extractProductMetadata(baseResource);
    
    // Add to knowledge base
    addKnowledgeResource(enhancedResource.category || 'Other', enhancedResource);
    
    return enhancedResource;
  }, [addKnowledgeResource]);

  /**
   * Remove a resource from the knowledge base
   * 
   * @param id - ID of the resource to remove
   * @param category - Category of the resource
   */
  const removeEcommerceResource = useCallback((id: string, category: string): void => {
    removeKnowledgeResource(category, id);
  }, [removeKnowledgeResource]);

  /**
   * Get product recommendations based on a query
   * 
   * @param query - The query to generate recommendations for
   * @returns Array of recommended products
   */
  const getProductRecommendations = useCallback((query: string): KnowledgeResource[] => {
    // Gather all resources from all categories
    const allResources: KnowledgeResource[] = Object.values(knowledgeBase)
      .flat()
      .filter(Boolean);
    
    return generateProductRecommendations(query, allResources);
  }, [knowledgeBase]);

  /**
   * Find products related to a specific product
   * 
   * @param productId - ID of the product to find relations for
   * @returns Array of related products
   */
  const getRelatedProducts = useCallback((productId: string): KnowledgeResource[] => {
    // Gather all resources
    const allResources: KnowledgeResource[] = Object.values(knowledgeBase)
      .flat()
      .filter(Boolean);
    
    // Find the product
    const product = allResources.find(resource => resource.id === productId);
    
    if (!product) {
      return [];
    }
    
    return findRelatedProducts(product, allResources);
  }, [knowledgeBase]);

  /**
   * Get all resources of a specific e-commerce category
   * 
   * @param category - The category to filter by
   * @returns Array of resources in that category
   */
  const getResourcesByCategory = useCallback((category: string): KnowledgeResource[] => {
    return knowledgeBase[category] || [];
  }, [knowledgeBase]);

  /**
   * Get all e-commerce specific categories that have resources
   * 
   * @returns Array of category names
   */
  const getEcommerceCategories = useCallback((): string[] => {
    const ecommerceCategories = [
      'Product Catalog',
      'Payment Solutions',
      'Order Management',
      'Customer Experience',
      'Logistics & Fulfillment',
      'Security & Compliance',
      'Design Patterns',
      'Analytics & Reporting'
    ];
    
    // Only return categories that have resources
    return ecommerceCategories.filter(category => 
      knowledgeBase[category] && knowledgeBase[category].length > 0
    );
  }, [knowledgeBase]);

  /**
   * Get resources by market segment
   * 
   * @param segment - The market segment to filter by
   * @returns Array of resources for that segment
   */
  const getResourcesByMarketSegment = useCallback((segment: string): KnowledgeResource[] => {
    // Gather all resources
    const allResources: KnowledgeResource[] = Object.values(knowledgeBase)
      .flat()
      .filter(Boolean);
    
    // Filter by market segment
    return allResources.filter(resource => resource.marketSegment === segment);
  }, [knowledgeBase]);
  
  /**
   * Get resources relevant to the current development stage
   * 
   * @param stage - The development stage to get resources for
   * @returns Resources relevant to that stage
   */
  const getResourcesForStage = useCallback((stage: string): KnowledgeResource[] => {
    setCurrentStage(stage);
    
    // Gather all resources
    const allResources: KnowledgeResource[] = Object.values(knowledgeBase)
      .flat()
      .filter(Boolean);
    
    const recommendations = getResourcesByDevelopmentStage(stage, allResources);
    setStageRecommendations(recommendations);
    return recommendations;
  }, [knowledgeBase]);
  
  /**
   * Get best practices for a specific area
   * 
   * @param area - The e-commerce area to get best practices for
   * @returns Resources with best practices for the area
   */
  const getBestPractices = useCallback((area: string): KnowledgeResource[] => {
    // Gather all resources
    const allResources: KnowledgeResource[] = Object.values(knowledgeBase)
      .flat()
      .filter(Boolean);
    
    const practices = findBestPractices(area, allResources);
    setBestPractices(practices);
    return practices;
  }, [knowledgeBase]);
  
  /**
   * Generate documentation for a component
   * 
   * @param componentName - Name of the component
   * @param componentType - Type of the component
   * @param description - Optional description
   * @returns Markdown documentation
   */
  const generateComponentDoc = useCallback((
    componentName: string, 
    componentType: string, 
    description?: string
  ): string => {
    return generateComponentDocTemplate(componentName, componentType, description);
  }, []);
  
  /**
   * Generate API documentation template
   * 
   * @param apiType - Type of API to document
   * @returns API documentation template
   */
  const generateApiDoc = useCallback((apiType: string): string => {
    return generateApiDocTemplate(apiType);
  }, []);
  
  /**
   * Populate the knowledge base with sample resources
   */
  const populateWithSamples = useCallback((): void => {
    const samples = generateSampleEcommerceResources();
    samples.forEach(sample => {
      addKnowledgeResource(sample.category || 'Other', sample);
    });
  }, [addKnowledgeResource]);
  
  // Update derived state when knowledge base changes
  useEffect(() => {
    // Gather all resources
    const allResources: KnowledgeResource[] = Object.values(knowledgeBase)
      .flat()
      .filter(Boolean);
    
    // Find all e-commerce specific resources
    const ecommerce = findEcommerceResources(allResources);
    setEcommerceResources(ecommerce);
    
    // Group resources by market segment
    const segmented = groupByMarketSegment(ecommerce);
    setSegmentedResources(segmented);
    
    // Update stage recommendations
    if (currentStage) {
      const recommendations = getResourcesByDevelopmentStage(currentStage, allResources);
      setStageRecommendations(recommendations);
    }
  }, [knowledgeBase, currentStage]);

  return {
    addEcommerceResource,
    removeEcommerceResource,
    getProductRecommendations,
    getRelatedProducts,
    getResourcesByCategory,
    getEcommerceCategories,
    getResourcesByMarketSegment,
    // New enhanced functions
    getResourcesForStage,
    getBestPractices,
    generateComponentDoc,
    generateApiDoc,
    populateWithSamples,
    // State
    currentStage,
    setCurrentStage,
    stageRecommendations,
    bestPractices,
    ecommerceResources,
    segmentedResources
  };
}

export default useEcommerceKnowledge;