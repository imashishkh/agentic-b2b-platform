
import { AgentType } from './AgentTypes';
import { findRelevantResources, generateKnowledgeContext } from '@/utils/knowledgeRelevance';
import { KnowledgeBaseResource } from '@/contexts/types';

/**
 * Base Agent class that other specialized agents extend
 */
export class BaseAgent {
  agentType: AgentType;
  
  constructor(agentType: AgentType) {
    this.agentType = agentType;
  }
  
  /**
   * Generate a response based on the message
   */
  async generateResponse(message: string, previousMessages: string[]): Promise<string> {
    console.log(`BaseAgent(${this.agentType}): Generating response for message`);
    
    // Base implementation just returns a fallback message
    return `I am the ${this.agentType} agent. I processed your message but I don't have a specific implementation for it yet.`;
  }
  
  /**
   * Enrich response with knowledge base resources
   */
  enrichResponseWithKnowledge(message: string, knowledgeBase: KnowledgeBaseResource[]): string {
    // Find relevant resources for this message
    const relevantResources = findRelevantResources(knowledgeBase, message, 3);
    
    if (relevantResources.length === 0) {
      return '';
    }
    
    // Generate knowledge context from relevant resources
    return generateKnowledgeContext(relevantResources);
  }
  
  /**
   * Format knowledge with the response
   */
  formatResponseWithKnowledge(response: string, knowledgeContext: string): string {
    if (!knowledgeContext) {
      return response;
    }
    
    return `${response}\n\n---\n\n**Relevant Knowledge Base Resources:**\n\n${knowledgeContext}`;
  }
  
  /**
   * Add knowledge-enhanced responses
   */
  async generateKnowledgeEnhancedResponse(
    message: string, 
    previousMessages: string[], 
    knowledgeBase: KnowledgeBaseResource[]
  ): Promise<string> {
    // Get basic response
    const basicResponse = await this.generateResponse(message, previousMessages);
    
    // Enrich with knowledge if available
    if (knowledgeBase && knowledgeBase.length > 0) {
      const knowledgeContext = this.enrichResponseWithKnowledge(message, knowledgeBase);
      if (knowledgeContext) {
        return this.formatResponseWithKnowledge(basicResponse, knowledgeContext);
      }
    }
    
    return basicResponse;
  }
}
