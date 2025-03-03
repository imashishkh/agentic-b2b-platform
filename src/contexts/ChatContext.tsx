import React, { createContext, useState, useContext, ReactNode } from "react";
import { ChatMessageProps } from "@/components/ChatMessage";
import { AgentType } from "@/agents/AgentTypes";
import { 
  KnowledgeBaseResource, 
  ArchitectureProposal, 
  TestingStrategy, 
  GitHubRepository, 
  ChatContextType,
  SuggestionProps,
  SecurityReview,
  ComplianceCheck,
  SetupWizardStep
} from "./types";
import { initialMessages, initialState } from "./initialState";

/**
 * Create the context with undefined as initial value
 * This forces consumers to use the useChat hook instead of directly accessing the context
 */
export const ChatContext = createContext<ChatContextType | undefined>(undefined);

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
  const [knowledgeBase, setKnowledgeBase] = useState<{[category: string]: KnowledgeBaseResource[]}>({});
  const [isRequestingKnowledge, setIsRequestingKnowledge] = useState(false);
  const [architectureProposals, setArchitectureProposals] = useState<ArchitectureProposal[]>([]);
  const [testingStrategies, setTestingStrategies] = useState<TestingStrategy[]>([]);
  const [gitHubRepository, setGitHubRepo] = useState<GitHubRepository | null>(null);
  const [suggestions, setSuggestions] = useState<SuggestionProps[]>([]);
  const [lastProcessedSuggestion, setLastProcessedSuggestion] = useState<string | null>(null);
  // New state for wizard step tracking
  const [currentWizardStep, setCurrentWizardStep] = useState<SetupWizardStep>(SetupWizardStep.INITIAL);
  
  // Security and compliance states
  const [securityReviewActive, setSecurityReviewActive] = useState(false);
  const [securityReviews, setSecurityReviews] = useState<SecurityReview[]>([]);
  const [complianceChecks, setComplianceChecks] = useState<ComplianceCheck[]>([]);
  const [vulnerabilityAssessments, setVulnerabilityAssessments] = useState<any[]>([]);
  const [bestPracticesViolations, setBestPracticesViolations] = useState<any[]>([]);
  
  // Agent intelligence states
  const [collaborationActive, setCollaborationActive] = useState(false);
  const [contextAwareEnabled, setContextAwareEnabled] = useState(true);
  const [currentCollaborators, setCurrentCollaborators] = useState<AgentType[]>([]);
  const [projectPlans, setProjectPlans] = useState<any[]>([]);
  const [currentPlanId, setCurrentPlanId] = useState<string | null>(null);
  const [claudeAPIEnabled, setClaudeAPIEnabled] = useState(true);
  const [agentMemory, setAgentMemory] = useState<Map<string, any>>(new Map());

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
  const addKnowledgeResource = (category: string, resource: KnowledgeBaseResource) => {
    setKnowledgeBase(prev => ({
      ...prev,
      [category]: [...(prev[category] || []), resource]
    }));
  };

  /**
   * Remove a knowledge base resource by ID
   * 
   * @param id - The ID of the resource to remove
   */
  const removeKnowledgeResource = (category: string, id: string) => {
    setKnowledgeBase(prev => ({
      ...prev,
      [category]: prev[category]?.filter(resource => resource.id !== id) || []
    }));
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

  /**
   * Add a new security review
   * 
   * @param review - The security review object to add
   */
  const addSecurityReview = (review: SecurityReview) => {
    setSecurityReviews(prev => [...prev, review]);
  };

  /**
   * Update an existing security review
   * 
   * @param id - The ID of the review to update
   * @param review - Partial review object with updates
   */
  const updateSecurityReview = (id: string, review: Partial<SecurityReview>) => {
    setSecurityReviews(prev => 
      prev.map(r => r.id === id ? { ...r, ...review } : r)
    );
  };

  /**
   * Add a new compliance check
   * 
   * @param check - The compliance check object to add
   */
  const addComplianceCheck = (check: ComplianceCheck) => {
    setComplianceChecks(prev => [...prev, check]);
  };

  /**
   * Update an existing compliance check
   * 
   * @param id - The ID of the check to update
   * @param check - Partial check object with updates
   */
  const updateComplianceCheck = (id: string, check: Partial<ComplianceCheck>) => {
    setComplianceChecks(prev => 
      prev.map(c => c.id === id ? { ...c, ...check } : c)
    );
  };

  /**
   * Add a new vulnerability assessment
   * 
   * @param assessment - The vulnerability assessment object to add
   */
  const addVulnerabilityAssessment = (assessment: any) => {
    setVulnerabilityAssessments(prev => [...prev, assessment]);
  };

  /**
   * Add a new best practices violation
   * 
   * @param violation - The best practices violation object to add
   */
  const addBestPracticesViolation = (violation: any) => {
    setBestPracticesViolations(prev => [...prev, violation]);
  };

  /**
   * Add a new project plan
   * 
   * @param plan - The plan object to add
   */
  const addProjectPlan = (plan: any) => {
    setProjectPlans(prev => [...prev, plan]);
    if (!currentPlanId) {
      setCurrentPlanId(plan.id);
    }
  };

  /**
   * Update an existing project plan
   * 
   * @param id - The ID of the plan to update
   * @param plan - Partial plan object with updates
   */
  const updateProjectPlan = (id: string, plan: Partial<any>) => {
    setProjectPlans(prev => 
      prev.map(p => p.id === id ? { ...p, ...plan } : p)
    );
  };

  /**
   * Set the current active plan
   * 
   * @param id - The ID of the plan to set as active
   */
  const setActivePlan = (id: string | null) => {
    setCurrentPlanId(id);
  };

  /**
   * Store information in agent memory
   * 
   * @param key - The key to store the information under
   * @param value - The information to store
   */
  const storeInAgentMemory = (key: string, value: any) => {
    setAgentMemory(prev => {
      const newMap = new Map(prev);
      newMap.set(key, value);
      return newMap;
    });
  };

  /**
   * Retrieve information from agent memory
   * 
   * @param key - The key to retrieve information for
   * @returns The stored information or undefined if not found
   */
  const retrieveFromAgentMemory = (key: string): any => {
    return agentMemory.get(key);
  };

  /**
   * Enable or disable Claude API integration
   * 
   * @param enabled - Whether to enable the Claude API
   */
  const toggleClaudeAPI = (enabled: boolean) => {
    setClaudeAPIEnabled(enabled);
  };

  /**
   * Set the current collaborators
   * 
   * @param collaborators - The agent types to set as current collaborators
   */
  const setCollaborators = (collaborators: AgentType[]) => {
    setCurrentCollaborators(collaborators);
    setCollaborationActive(collaborators.length > 0);
  };

  /**
   * Enable or disable context-aware responses
   * 
   * @param enabled - Whether to enable context-aware responses
   */
  const toggleContextAware = (enabled: boolean) => {
    setContextAwareEnabled(enabled);
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
      securityReviewActive,
      securityReviews,
      complianceChecks,
      vulnerabilityAssessments,
      bestPracticesViolations,
      collaborationActive,
      contextAwareEnabled,
      currentCollaborators,
      projectPlans,
      currentPlanId,
      claudeAPIEnabled,
      currentWizardStep,
      setCurrentWizardStep,
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
      setProcessedSuggestion,
      setSecurityReviewActive,
      addSecurityReview,
      updateSecurityReview,
      addComplianceCheck,
      updateComplianceCheck,
      addVulnerabilityAssessment,
      addBestPracticesViolation,
      addProjectPlan,
      updateProjectPlan,
      setActivePlan,
      storeInAgentMemory,
      retrieveFromAgentMemory,
      toggleClaudeAPI,
      setCollaborators,
      toggleContextAware
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
