
import React, { createContext, useState, useContext, ReactNode } from "react";
import { ChatMessageProps } from "@/components/ChatMessage";
import { AgentType } from "@/agents/AgentTypes";
import { 
  KnowledgeBaseResource, 
  ArchitectureProposal, 
  TestingStrategy, 
  GitHubRepository, 
  ChatContextType,
  SuggestionProps
} from "./types";
import { initialMessages, initialState } from "./initialState";

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
  const [hasRequestedFile, setHasRequestedFile] = useState(false);
  const [currentAgentType, setCurrentAgentType] = useState<AgentType>(AgentType.MANAGER);
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeBaseResource[]>([]);
  const [isRequestingKnowledge, setIsRequestingKnowledge] = useState(false);
  const [architectureProposals, setArchitectureProposals] = useState<ArchitectureProposal[]>([]);
  const [testingStrategies, setTestingStrategies] = useState<TestingStrategy[]>([]);
  const [gitHubRepository, setGitHubRepo] = useState<GitHubRepository | null>(null);
  const [suggestions, setSuggestions] = useState<SuggestionProps[]>([]);
  const [lastProcessedSuggestion, setLastProcessedSuggestion] = useState<string | null>(null);

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
   * Add a new suggestion for next steps
   * 
   * @param suggestion - The suggestion object to add
   */
  const addSuggestion = (suggestion: SuggestionProps) => {
    setSuggestions(prev => [...prev, suggestion]);
  };

  /**
   * Clear all suggestions
   */
  const clearSuggestions = () => {
    setSuggestions([]);
  };

  /**
   * Set the last processed suggestion for tracking
   * 
   * @param message - The suggestion message that was processed
   */
  const setProcessedSuggestion = (message: string) => {
    setLastProcessedSuggestion(message);
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
      suggestions,
      lastProcessedSuggestion,
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
      setGitHubRepository,
      addSuggestion,
      clearSuggestions,
      setProcessedSuggestion
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
