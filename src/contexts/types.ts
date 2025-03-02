
import { ChatMessageProps } from "@/components/ChatMessage";
import { AgentType } from "@/agents/AgentTypes";

export interface KnowledgeBaseResource {
  id: string;
  title: string;
  url: string;
  category: string;
  description: string;
  dateAdded: string;
  source?: string;
}

export interface ArchitectureProposal {
  id: string;
  title: string;
  description: string;
  components: Array<{
    id: string;
    name: string;
    type: string;
    description: string;
    technologies: string[];
  }>;
  relationships: Array<{
    source: string;
    target: string;
    type: string;
    description: string;
  }>;
  dateCreated: string;
  status: "draft" | "proposed" | "approved" | "rejected";
}

export interface TestingStrategy {
  id: string;
  title: string;
  description: string;
  testingLevels: Array<{
    id: string;
    name: string;
    description: string;
    tools: string[];
    coverage: number;
  }>;
  automationStrategy: string;
  cicdIntegration: string;
  dateCreated: string;
  status: "draft" | "proposed" | "approved" | "rejected";
}

export interface GitHubRepository {
  owner: string;
  name: string;
  url: string;
  branch: string;
  connected: boolean;
  lastSynced?: string;
}

export interface SuggestionOption {
  id: string;
  label: string;
  message: string;
  icon: string;
  description: string;
}

export interface SuggestionProps {
  title: string;
  description: string;
  options: SuggestionOption[];
}

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
