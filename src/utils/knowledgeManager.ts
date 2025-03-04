/**
 * Knowledge Manager for AI Agents
 * 
 * This module provides a central knowledge management system for AI agents using vector
 * storage. It enables:
 * - Persistent knowledge storage across sessions
 * - Semantic search for relevant knowledge
 * - Knowledge extraction and organization
 * - Automatic updates to the knowledge base
 */

import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Document } from "langchain/document";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { ChatAnthropic } from "@langchain/anthropic";
import { AgentType } from "@/agents/AgentTypes";

/**
 * Knowledge types supported by the system
 */
export enum KnowledgeType {
  DOCUMENTATION = "documentation",
  CODE_SNIPPET = "code_snippet",
  ARCHITECTURE = "architecture",
  BEST_PRACTICE = "best_practice",
  REFERENCE = "reference",
  PROJECT_REQUIREMENT = "project_requirement",
  CONVERSATION_SUMMARY = "conversation_summary",
  ENTITY = "entity",
}

/**
 * Interface for knowledge items
 */
export interface KnowledgeItem {
  id: string;
  content: string;
  type: KnowledgeType;
  source: string;
  timestamp: string;
  relevance?: number;
  agentType?: AgentType;
  metadata?: Record<string, any>;
}

// Singleton vector store for knowledge
let vectorStore: MemoryVectorStore | null = null;

/**
 * Initialize the knowledge vector store
 */
export const initializeKnowledgeStore = async (): Promise<MemoryVectorStore> => {
  // If already initialized, return the existing store
  if (vectorStore) {
    return vectorStore;
  }
  
  // Get API key for OpenAI (in production, use environment variables)
  const OPENAI_API_KEY = localStorage.getItem("openai_api_key") || "";
  
  // Create embeddings client
  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: OPENAI_API_KEY,
    modelName: "text-embedding-3-small",
  });
  
  // Initialize with basic knowledge
  vectorStore = await MemoryVectorStore.fromTexts(
    [
      "This is a B2B e-commerce platform connecting Indian manufacturers with global buyers.",
      "The platform is built using React, Node.js, and PostgreSQL.",
      "Key features include product catalog, order management, and payment processing.",
    ],
    [
      { type: KnowledgeType.PROJECT_REQUIREMENT, source: "initialization" },
      { type: KnowledgeType.DOCUMENTATION, source: "initialization" },
      { type: KnowledgeType.PROJECT_REQUIREMENT, source: "initialization" },
    ],
    embeddings
  );
  
  return vectorStore;
};

/**
 * Add a document to the knowledge base
 */
export const addKnowledge = async (
  content: string,
  type: KnowledgeType,
  source: string,
  metadata: Record<string, any> = {}
): Promise<void> => {
  try {
    // Get the vector store
    const store = await initializeKnowledgeStore();
    
    // Split long content into chunks
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    
    // Create document chunks
    const docs = await splitter.createDocuments(
      [content],
      [{ 
        type, 
        source, 
        timestamp: new Date().toISOString(),
        ...metadata 
      }]
    );
    
    // Add to vector store
    await store.addDocuments(docs);
    
    console.log(`Added ${docs.length} chunks to knowledge base from ${source}`);
  } catch (error) {
    console.error("Error adding to knowledge base:", error);
  }
};

/**
 * Search the knowledge base for relevant information
 */
export const searchKnowledge = async (
  query: string,
  filter?: { types?: KnowledgeType[], source?: string },
  maxResults: number = 5
): Promise<Document[]> => {
  try {
    // Get the vector store
    const store = await initializeKnowledgeStore();
    
    // Create filter function based on criteria
    const filterFunction = filter 
      ? (doc: Document) => {
          // Filter by type if specified
          if (filter.types && !filter.types.includes(doc.metadata.type as KnowledgeType)) {
            return false;
          }
          
          // Filter by source if specified
          if (filter.source && doc.metadata.source !== filter.source) {
            return false;
          }
          
          return true;
        }
      : undefined;
    
    // Search with optional filter
    const results = await store.similaritySearch(query, maxResults, filterFunction);
    
    return results;
  } catch (error) {
    console.error("Error searching knowledge base:", error);
    return [];
  }
};

/**
 * Extract knowledge from text using Claude
 */
export const extractKnowledgeFromText = async (
  text: string, 
  source: string
): Promise<void> => {
  try {
    // Get Claude API key from storage
    const CLAUDE_API_KEY = localStorage.getItem("claude_api_key") || 
      "sk-ant-api03-lfkQgMniYZzpFonbyy9GvQ73Xb9GjLzxE7_GXxtLFoBvZrnmITK-7HMgW04qN64c7KOnx5Pxe3QMxtFIxpg7Pg-n1vKwwAA";
    
    // Create Claude client
    const claude = new ChatAnthropic({
      apiKey: CLAUDE_API_KEY,
      modelName: "claude-3-sonnet-20240229",
    });
    
    // Create prompt for knowledge extraction
    const extractionPrompt = `
You are a knowledge extraction specialist. Extract key knowledge from the following text for an e-commerce platform knowledge base.

TEXT:
${text}

Extract the following types of knowledge:
1. Project requirements (key features, goals, constraints)
2. Technical details (technologies, patterns, architecture)
3. Best practices (security, performance, design principles)
4. Code snippets (with language identified)

For each knowledge item, indicate its type from: documentation, code_snippet, architecture, best_practice, reference, project_requirement.

Format your response in JSON strictly like:
[
  {
    "content": "Knowledge item text",
    "type": "type_from_list_above",
    "summary": "Brief 1-sentence summary"
  }
]

ONLY output valid JSON array, with no additional explanation. If no knowledge can be extracted, return an empty array [].
`;
    
    // Call Claude
    const response = await claude.invoke([
      { role: "user", content: extractionPrompt }
    ]);
    
    // Parse the response
    const responseText = response.content[0].text;
    
    try {
      const knowledgeItems = JSON.parse(responseText);
      
      // Add each knowledge item to the store
      for (const item of knowledgeItems) {
        await addKnowledge(
          item.content,
          item.type as KnowledgeType,
          source,
          { summary: item.summary }
        );
      }
      
      console.log(`Extracted ${knowledgeItems.length} knowledge items from text`);
    } catch (parseError) {
      console.error("Error parsing knowledge extraction response:", parseError);
    }
  } catch (error) {
    console.error("Error extracting knowledge from text:", error);
  }
};

/**
 * Generate a knowledge summary for a specific topic
 */
export const generateKnowledgeSummary = async (
  topic: string,
  relatedTypes: KnowledgeType[] = Object.values(KnowledgeType)
): Promise<string> => {
  try {
    // Search for relevant knowledge
    const results = await searchKnowledge(topic, { types: relatedTypes }, 10);
    
    if (results.length === 0) {
      return `No knowledge found related to "${topic}".`;
    }
    
    // Get Claude API key
    const CLAUDE_API_KEY = localStorage.getItem("claude_api_key") || 
      "sk-ant-api03-lfkQgMniYZzpFonbyy9GvQ73Xb9GjLzxE7_GXxtLFoBvZrnmITK-7HMgW04qN64c7KOnx5Pxe3QMxtFIxpg7Pg-n1vKwwAA";
    
    // Create Claude client
    const claude = new ChatAnthropic({
      apiKey: CLAUDE_API_KEY,
      modelName: "claude-3-sonnet-20240229",
    });
    
    // Format the knowledge for the prompt
    const knowledgeText = results
      .map(doc => `--- BEGIN KNOWLEDGE ITEM ---
Type: ${doc.metadata.type}
Source: ${doc.metadata.source}
Content: ${doc.pageContent}
--- END KNOWLEDGE ITEM ---`)
      .join("\n\n");
    
    // Create the summary prompt
    const summaryPrompt = `
You are a knowledge integrator for an e-commerce platform. Create a comprehensive summary of the following knowledge items about "${topic}".

${knowledgeText}

Format your response in markdown with proper sections and bullet points. Be concise but thorough, focusing on actionable information. Organize similar information together, and highlight any contradictions or gaps.
`;
    
    // Call Claude
    const response = await claude.invoke([
      { role: "user", content: summaryPrompt }
    ]);
    
    return response.content[0].text;
  } catch (error) {
    console.error("Error generating knowledge summary:", error);
    return `Error generating knowledge summary for "${topic}".`;
  }
};

/**
 * Register a conversation for knowledge extraction
 */
export const registerConversation = async (
  messages: { role: string; content: string }[],
  topic: string = "e-commerce development"
): Promise<void> => {
  try {
    // Format the conversation
    const conversationText = messages
      .map(msg => `${msg.role}: ${msg.content}`)
      .join("\n\n");
    
    // Get Claude API key
    const CLAUDE_API_KEY = localStorage.getItem("claude_api_key") || 
      "sk-ant-api03-lfkQgMniYZzpFonbyy9GvQ73Xb9GjLzxE7_GXxtLFoBvZrnmITK-7HMgW04qN64c7KOnx5Pxe3QMxtFIxpg7Pg-n1vKwwAA";
    
    // Create Claude client
    const claude = new ChatAnthropic({
      apiKey: CLAUDE_API_KEY,
      modelName: "claude-3-sonnet-20240229",
    });
    
    // Create prompt for conversation summarization
    const summaryPrompt = `
Summarize the key points, decisions, and knowledge from this conversation about ${topic}. Focus on extracting reusable information.

Conversation:
${conversationText}

Create a concise summary that captures the essential knowledge shared in this conversation.
`;
    
    // Generate summary
    const response = await claude.invoke([
      { role: "user", content: summaryPrompt }
    ]);
    
    const summary = response.content[0].text;
    
    // Add summary to knowledge base
    await addKnowledge(
      summary,
      KnowledgeType.CONVERSATION_SUMMARY,
      "conversation",
      { topic }
    );
    
    // Extract additional knowledge
    await extractKnowledgeFromText(conversationText, "conversation");
    
    console.log("Conversation registered and knowledge extracted");
  } catch (error) {
    console.error("Error registering conversation:", error);
  }
};