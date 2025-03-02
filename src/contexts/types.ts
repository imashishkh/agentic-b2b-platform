
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
 * Interface defining the shape of the ChatContext
 * This provides TypeScript type safety for all context consumers
 */
export interface ChatContextType {
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
