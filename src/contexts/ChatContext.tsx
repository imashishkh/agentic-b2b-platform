
import React, { createContext, useState, useContext, ReactNode } from "react";
import { ChatMessageProps } from "@/components/ChatMessage";
import { AgentType } from "@/agents/AgentTypes";

/**
 * Interface for knowledge base resource items
 * Represents documentation, links, and other reference materials
 */
export interface KnowledgeBaseResource {
  id: string;           // Unique identifier for the resource
  title: string;        // Display title for the resource
  url: string;          // URL to the resource
  category: string;     // Category (e.g., "Technology", "Industry Standards", "Security")
  description: string;  // Brief description of the resource
  dateAdded: Date;      // When the resource was added
  tags?: string[];      // Optional tags for improved indexing
  priority?: 'low' | 'medium' | 'high'; // Priority of the resource
  isIndexed?: boolean;  // Whether the resource has been processed/indexed
}

/**
 * Interface for system architecture proposal
 */
export interface ArchitectureProposal {
  id: string;
  title: string;
  description: string;
  components: Array<{
    name: string;
    type: string;
    description: string;
    dependencies?: string[];
  }>;
  diagram?: string; // URL or base64 representation of diagram
  dateCreated: Date;
  approved?: boolean;
}

/**
 * Interface for testing strategy
 */
export interface TestingStrategy {
  id: string;
  title: string;
  description: string;
  approaches: Array<{
    type: string; // e.g., "unit", "integration", "e2e"
    framework: string;
    coverageGoal?: number;
    description: string;
  }>;
  dateCreated: Date;
  approved?: boolean;
}

/**
 * Interface for GitHub repository information
 */
export interface GitHubRepository {
  name: string;
  url: string;
  branch: string;
  connected: boolean;
  lastSynced?: Date;
}

/**
 * Initial messages to bootstrap the conversation when a user first interacts with the system
 * These provide guidance on how to start the project planning process
 */
const initialMessages: ChatMessageProps[] = [];

/**
 * Interface defining the shape of the ChatContext
 * This provides TypeScript type safety for all context consumers
 */
interface ChatContextType {
  messages: ChatMessageProps[];             // All chat messages (user and agent)
  isAgentTyping: boolean;                   // Whether an agent is currently typing
  isFetchingResponse: boolean;              // Whether we're waiting for an API response
  isLoadingExample: boolean;                // Whether example project is being loaded
  projectPhases: any[];                     // Structured project data
  hasRequestedFile: boolean;                // Whether we've asked for a requirements file
  currentAgentType: AgentType;              // Which agent is currently active
  knowledgeBase: KnowledgeBaseResource[];   // Knowledge base resources
  isRequestingKnowledge: boolean;           // Whether we're currently requesting knowledge base resources
  architectureProposals: ArchitectureProposal[]; // System architecture proposals
  testingStrategies: TestingStrategy[];     // Testing strategies
  gitHubRepository: GitHubRepository | null; // GitHub repository information
  
  // Methods
  addMessage: (message: ChatMessageProps) => void;  // Add a new message to the chat
  clearMessages: () => void;                  // Clear all messages
  setIsAgentTyping: (isTyping: boolean) => void;    // Update typing indicator
  setIsFetchingResponse: (isFetching: boolean) => void;  // Update fetching status
  setIsLoadingExample: (isLoading: boolean) => void; // Update example loading status
  setProjectPhases: (phases: any[]) => void;        // Update project structure
  setHasRequestedFile: (hasRequested: boolean) => void;  // Update file request status
  setCurrentAgentType: (agentType: AgentType) => void;   // Change the active agent
  addKnowledgeResource: (resource: KnowledgeBaseResource) => void;  // Add a new knowledge resource
  removeKnowledgeResource: (id: string) => void;    // Remove a knowledge resource
  setIsRequestingKnowledge: (isRequesting: boolean) => void;  // Update knowledge request status
  addArchitectureProposal: (proposal: ArchitectureProposal) => void; // Add new architecture proposal
  updateArchitectureProposal: (id: string, proposal: Partial<ArchitectureProposal>) => void; // Update proposal
  addTestingStrategy: (strategy: TestingStrategy) => void; // Add new testing strategy
  updateTestingStrategy: (id: string, strategy: Partial<TestingStrategy>) => void; // Update strategy
  setGitHubRepository: (repo: GitHubRepository | null) => void; // Set GitHub repository
}

/**
 * Create the context with undefined as initial value
 * This forces consumers to use the useChat hook instead of directly accessing the context
 */
const ChatContext = createContext<ChatContextType | undefined>(undefined);

/**
 * ChatProvider component that wraps the application to provide chat state
 * This implements the React Context pattern for state management
 * 
 * @param children - Child components that will have access to the chat context
 */
export const ChatProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  // State initialization for all chat-related data
  const [messages, setMessages] = useState<ChatMessageProps[]>(initialMessages);
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const [isFetchingResponse, setIsFetchingResponse] = useState(false);
  const [isLoadingExample, setIsLoadingExample] = useState(false);
  const [projectPhases, setProjectPhases] = useState<any[]>([]);
  const [hasRequestedFile, setHasRequestedFile] = useState(false); // Changed from true to false
  const [currentAgentType, setCurrentAgentType] = useState<AgentType>(AgentType.MANAGER);
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeBaseResource[]>([]);
  const [isRequestingKnowledge, setIsRequestingKnowledge] = useState(false);
  const [architectureProposals, setArchitectureProposals] = useState<ArchitectureProposal[]>([]);
  const [testingStrategies, setTestingStrategies] = useState<TestingStrategy[]>([]);
  const [gitHubRepository, setGitHubRepo] = useState<GitHubRepository | null>(null);

  /**
   * Add a new message to the chat history
   * 
   * @param message - The message object to add to the chat
   */
  const addMessage = (message: ChatMessageProps) => {
    setMessages(prev => [...prev, message]);
  };

  /**
   * Clear all messages from the chat history
   */
  const clearMessages = () => {
    setMessages([]);
  };

  /**
   * Add a new knowledge base resource
   * 
   * @param resource - The resource object to add to the knowledge base
   */
  const addKnowledgeResource = (resource: KnowledgeBaseResource) => {
    setKnowledgeBase(prev => [...prev, resource]);
  };

  /**
   * Remove a knowledge base resource by ID
   * 
   * @param id - The ID of the resource to remove
   */
  const removeKnowledgeResource = (id: string) => {
    setKnowledgeBase(prev => prev.filter(resource => resource.id !== id));
  };

  /**
   * Add a new architecture proposal
   * 
   * @param proposal - The proposal object to add
   */
  const addArchitectureProposal = (proposal: ArchitectureProposal) => {
    setArchitectureProposals(prev => [...prev, proposal]);
  };

  /**
   * Update an existing architecture proposal
   * 
   * @param id - The ID of the proposal to update
   * @param proposal - Partial proposal object with updates
   */
  const updateArchitectureProposal = (id: string, proposal: Partial<ArchitectureProposal>) => {
    setArchitectureProposals(prev => 
      prev.map(p => p.id === id ? { ...p, ...proposal } : p)
    );
  };

  /**
   * Add a new testing strategy
   * 
   * @param strategy - The strategy object to add
   */
  const addTestingStrategy = (strategy: TestingStrategy) => {
    setTestingStrategies(prev => [...prev, strategy]);
  };

  /**
   * Update an existing testing strategy
   * 
   * @param id - The ID of the strategy to update
   * @param strategy - Partial strategy object with updates
   */
  const updateTestingStrategy = (id: string, strategy: Partial<TestingStrategy>) => {
    setTestingStrategies(prev => 
      prev.map(s => s.id === id ? { ...s, ...strategy } : s)
    );
  };

  /**
   * Set GitHub repository information
   *
   * @param repo - The GitHub repository object to set
   */
  const setGitHubRepository = (repo: GitHubRepository | null) => {
    setGitHubRepo(repo);
  };

  // Provide the chat state and functions to all child components
  return (
    <ChatContext.Provider value={{
      messages,
      isAgentTyping,
      isFetchingResponse,
      isLoadingExample,
      projectPhases,
      hasRequestedFile,
      currentAgentType,
      knowledgeBase,
      isRequestingKnowledge,
      architectureProposals,
      testingStrategies,
      gitHubRepository,
      addMessage,
      clearMessages,
      setIsAgentTyping,
      setIsFetchingResponse,
      setIsLoadingExample,
      setProjectPhases,
      setHasRequestedFile,
      setCurrentAgentType,
      addKnowledgeResource,
      removeKnowledgeResource,
      setIsRequestingKnowledge,
      addArchitectureProposal,
      updateArchitectureProposal,
      addTestingStrategy,
      updateTestingStrategy,
      setGitHubRepository
    }}>
      {children}
    </ChatContext.Provider>
  );
};

/**
 * Custom hook to access the chat context
 * This ensures the context is properly accessed and provides type safety
 * 
 * @returns The chat context value with all state and functions
 * @throws Error if used outside of a ChatProvider
 */
export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
