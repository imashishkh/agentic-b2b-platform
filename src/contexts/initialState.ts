
import { ChatMessageProps } from "@/components/ChatMessage";
import { AgentType } from "@/agents/AgentTypes";
import { KnowledgeBaseResource, ArchitectureProposal, TestingStrategy, GitHubRepository } from "./types";

/**
 * Initial messages to bootstrap the conversation when a user first interacts with the system
 * These provide guidance on how to start the project planning process
 */
export const initialMessages: ChatMessageProps[] = [];

/**
 * Initial state for the chat context
 * This provides default values for all state
 */
export const initialState = {
  messages: initialMessages,
  isAgentTyping: false,
  isFetchingResponse: false,
  isLoadingExample: false,
  projectPhases: [] as any[],
  hasRequestedFile: false,
  currentAgentType: AgentType.MANAGER,
  knowledgeBase: [] as KnowledgeBaseResource[],
  isRequestingKnowledge: false,
  architectureProposals: [] as ArchitectureProposal[],
  testingStrategies: [] as TestingStrategy[],
  gitHubRepository: null as GitHubRepository | null
};
