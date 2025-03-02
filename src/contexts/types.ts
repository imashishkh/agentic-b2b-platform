
import { AgentType } from "@/agents/AgentTypes";
import { ChatMessageProps } from "@/components/ChatMessage";

// Architecture proposal interface
export interface ArchitectureProposal {
  id: string;
  name: string;
  type: string;
  description: string;
  technologies: string[];
  approved?: boolean;
  diagram?: string;
  dependencies?: string[];
  title?: string;
  components?: any[];
  relationships?: any[];
  dateCreated?: string;
  status?: string;
}

// Testing strategy interface
export interface TestingStrategy {
  id: string;
  name: string;
  description: string;
  type: string;
  approved?: boolean;
  approaches?: string[];
  title?: string;
  testingLevels?: any[];
  automationStrategy?: string;
  cicdIntegration?: string;
  coverageTargets?: string;
  tooling?: string[];
}

// Knowledge base resource interface
export interface KnowledgeBaseResource {
  id: string;
  title: string;
  url: string;
  description: string;
  category: string;
  dateAdded: string;
  tags?: string[];
}

// GitHub repository interface
export interface GitHubRepository {
  owner: string;
  name: string;
  url: string;
  branch: string;
  lastUpdated: string | Date;
  commitCount?: number;
}

// Suggestion option interface
export interface SuggestionOption {
  id?: string;
  label?: string;
  message: string;
  icon?: string;
  description?: string;
}

// Suggestion props interface
export interface SuggestionProps {
  title: string;
  description: string;
  options: SuggestionOption[];
}

// Chat context interface
export interface ChatContextType {
  messages: ChatMessageProps[];
  isAgentTyping: boolean;
  isFetchingResponse: boolean;
  isLoadingExample: boolean;
  projectPhases: any[];
  hasRequestedFile: boolean;
  currentAgentType: AgentType;
  knowledgeBase: KnowledgeBaseResource[];
  isRequestingKnowledge: boolean;
  architectureProposals: ArchitectureProposal[];
  testingStrategies: TestingStrategy[];
  gitHubRepository: GitHubRepository | null;
  suggestions: SuggestionProps[];
  
  addMessage: (message: ChatMessageProps) => void;
  clearMessages: () => void;
  setIsAgentTyping: (isTyping: boolean) => void;
  setIsFetchingResponse: (isFetching: boolean) => void;
  setIsLoadingExample: (isLoading: boolean) => void;
  setProjectPhases: (phases: any[]) => void;
  setHasRequestedFile: (hasRequested: boolean) => void;
  setCurrentAgentType: (agentType: AgentType) => void;
  addKnowledgeResource: (resource: KnowledgeBaseResource) => void;
  removeKnowledgeResource: (id: string) => void;
  setIsRequestingKnowledge: (isRequesting: boolean) => void;
  addArchitectureProposal: (proposal: ArchitectureProposal) => void;
  updateArchitectureProposal: (id: string, proposal: Partial<ArchitectureProposal>) => void;
  addTestingStrategy: (strategy: TestingStrategy) => void;
  updateTestingStrategy: (id: string, strategy: Partial<TestingStrategy>) => void;
  setGitHubRepository: (repo: GitHubRepository | null) => void;
  addSuggestion: (suggestion: SuggestionProps) => void;
  clearSuggestions: () => void;
}
