/**
 * Vector Memory Implementation
 * 
 * This module provides tools for creating and managing persistent vector memory
 * for AI agents using vector databases. It enables:
 * - Semantic search for relevant context
 * - Long-term memory across sessions
 * - Entity tracking and knowledge updates
 */

import { Document } from "langchain/document";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "@langchain/openai";
import { ChatMessageHistory } from "langchain/stores/message/in_memory";
import { VectorStoreRetrieverMemory } from "langchain/memory";
import { AgentType } from "@/agents/AgentTypes";

// In-memory vector store for now - would be replaced with Chroma or Pinecone in production
const memoryVectorStores = new Map<string, MemoryVectorStore>();

/**
 * Creates a new vector store for an agent or retrieves existing one
 */
export const getVectorStoreForAgent = async (agentType: AgentType): Promise<MemoryVectorStore> => {
  // If we already have a vector store for this agent, return it
  if (memoryVectorStores.has(agentType)) {
    return memoryVectorStores.get(agentType)!;
  }
  
  // Initialize a new vector store with OpenAI embeddings
  // In production, we would use environment variables for the API key
  const OPENAI_API_KEY = localStorage.getItem("openai_api_key") || "";
  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: OPENAI_API_KEY,
    modelName: "text-embedding-3-small",
  });
  
  // Create memory vector store
  const vectorStore = await MemoryVectorStore.fromTexts(
    // Start with basic agent knowledge
    [
      `Agent type: ${agentType}. This is a specialized AI agent for e-commerce platform development.`,
    ],
    [{ agentType, type: "agent_knowledge" }],
    embeddings
  );
  
  // Store for future use
  memoryVectorStores.set(agentType, vectorStore);
  
  return vectorStore;
};

/**
 * Create vector retriever memory for an agent
 */
export const createVectorMemory = async (agentType: AgentType): Promise<VectorStoreRetrieverMemory> => {
  const vectorStore = await getVectorStoreForAgent(agentType);
  const retriever = vectorStore.asRetriever({ k: 5 });
  
  // Create memory
  return new VectorStoreRetrieverMemory({
    vectorStoreRetriever: retriever,
    inputKey: "input",
    outputKey: "output",
    returnDocs: true,
    memoryKey: "memory",
  });
};

/**
 * Save a conversation to the agent's vector memory
 */
export const saveToAgentMemory = async (
  agentType: AgentType,
  message: string,
  response: string,
  metadata: Record<string, any> = {}
): Promise<void> => {
  try {
    const vectorStore = await getVectorStoreForAgent(agentType);
    
    // Split long messages into chunks for better retrieval
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    
    // Save user message
    const userMessageDoc = await textSplitter.createDocuments(
      [message],
      [{ 
        ...metadata, 
        role: "user", 
        timestamp: new Date().toISOString(),
        agentType,
      }]
    );
    
    // Save agent response
    const agentResponseDoc = await textSplitter.createDocuments(
      [response],
      [{ 
        ...metadata, 
        role: "assistant", 
        timestamp: new Date().toISOString(),
        agentType,
      }]
    );
    
    // Add to vector store
    await vectorStore.addDocuments([...userMessageDoc, ...agentResponseDoc]);
    
    console.log(`Saved conversation to ${agentType} agent memory`);
  } catch (error) {
    console.error("Error saving to agent memory:", error);
  }
};

/**
 * Extract entities from a message and update the knowledge base
 */
export const extractAndSaveEntities = async (
  agentType: AgentType,
  message: string,
  entityTypes: string[] = ["product", "user", "feature", "requirement"]
): Promise<void> => {
  try {
    // This would be a call to an entity extraction model or API
    // For now, we'll simulate extraction
    const entities: Record<string, string>[] = [];
    
    // Extract product entities (simplified simulation)
    if (message.toLowerCase().includes("product") && entityTypes.includes("product")) {
      const productMatch = message.match(/product\s+(?:called|named)?\s*["']?([A-Za-z0-9\s]+)["']?/i);
      if (productMatch && productMatch[1]) {
        entities.push({
          type: "product",
          name: productMatch[1].trim(),
          description: `A product mentioned in the conversation with ${agentType} agent.`,
        });
      }
    }
    
    // Extract user entities (simplified simulation)
    if (message.toLowerCase().includes("user") && entityTypes.includes("user")) {
      const userMatch = message.match(/user\s+(?:called|named)?\s*["']?([A-Za-z0-9\s]+)["']?/i);
      if (userMatch && userMatch[1]) {
        entities.push({
          type: "user",
          name: userMatch[1].trim(),
          description: `A user type mentioned in the conversation with ${agentType} agent.`,
        });
      }
    }
    
    // Extract feature entities (simplified simulation)
    if (message.toLowerCase().includes("feature") && entityTypes.includes("feature")) {
      const featureMatch = message.match(/feature\s+(?:called|named)?\s*["']?([A-Za-z0-9\s]+)["']?/i);
      if (featureMatch && featureMatch[1]) {
        entities.push({
          type: "feature",
          name: featureMatch[1].trim(),
          description: `A feature mentioned in the conversation with ${agentType} agent.`,
        });
      }
    }
    
    // Save entities to vector store
    if (entities.length > 0) {
      const vectorStore = await getVectorStoreForAgent(agentType);
      
      for (const entity of entities) {
        const document = new Document({
          pageContent: `${entity.type}: ${entity.name} - ${entity.description}`,
          metadata: {
            type: "entity",
            entityType: entity.type,
            name: entity.name,
            agentType,
            timestamp: new Date().toISOString(),
          },
        });
        
        await vectorStore.addDocuments([document]);
      }
      
      console.log(`Extracted and saved ${entities.length} entities to ${agentType} agent memory`);
    }
  } catch (error) {
    console.error("Error extracting and saving entities:", error);
  }
};

/**
 * Search for relevant context in the agent's memory
 */
export const searchAgentMemory = async (
  agentType: AgentType,
  query: string,
  maxResults: number = 5
): Promise<Document[]> => {
  try {
    const vectorStore = await getVectorStoreForAgent(agentType);
    
    // Search vector store
    const results = await vectorStore.similaritySearch(query, maxResults);
    
    return results;
  } catch (error) {
    console.error("Error searching agent memory:", error);
    return [];
  }
};

/**
 * Generate conversation summary and save to memory
 */
export const summarizeAndSaveConversation = async (
  agentType: AgentType,
  messages: { role: string; content: string }[]
): Promise<string> => {
  try {
    // If too few messages, don't summarize
    if (messages.length < 3) {
      return "";
    }
    
    // Prepare conversation text
    const conversationText = messages
      .map(msg => `${msg.role}: ${msg.content}`)
      .join("\n\n");
    
    // This would normally call an LLM to generate a summary
    // For now we'll simulate it
    const summary = `Summary of conversation with ${agentType} agent about e-commerce development.`;
    
    // Save summary to vector store
    const vectorStore = await getVectorStoreForAgent(agentType);
    await vectorStore.addDocuments([
      new Document({
        pageContent: summary,
        metadata: {
          type: "conversation_summary",
          agentType,
          messageCount: messages.length,
          timestamp: new Date().toISOString(),
        },
      }),
    ]);
    
    return summary;
  } catch (error) {
    console.error("Error summarizing and saving conversation:", error);
    return "";
  }
};