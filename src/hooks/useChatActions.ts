
import { useChat } from "@/contexts/ChatContext";
import { ChatMessageProps } from "@/components/ChatMessage";

/**
 * Hook that provides actions for managing chat state
 * This centralizes all chat state modifications
 */
export const useChatActions = () => {
  const {
    addMessage: contextAddMessage,
    setIsAgentTyping,
    setIsFetchingResponse,
    setProjectPhases,
    setHasRequestedFile,
    setCurrentAgentType,
    setIsRequestingKnowledge,
    knowledgeBase
  } = useChat();

  return {
    addMessage: contextAddMessage,
    setIsAgentTyping,
    setIsFetchingResponse,
    setProjectPhases,
    setHasRequestedFile,
    setCurrentAgentType,
    setIsRequestingKnowledge,
    knowledgeBase
  };
};

// Singleton pattern for accessing chat actions outside of React components
let globalAddMessage: ((message: ChatMessageProps) => void) | null = null;
let globalSetProjectPhases: ((phases: any[]) => void) | null = null;

/**
 * Set the global message handler
 * This allows non-React code to add messages to the chat
 * 
 * @param addMessageFn - Function to add a message to the chat
 */
export const setGlobalAddMessage = (addMessageFn: (message: ChatMessageProps) => void) => {
  globalAddMessage = addMessageFn;
};

/**
 * Set the global project phases handler
 * This allows non-React code to update project phases
 * 
 * @param setPhasesFn - Function to update project phases
 */
export const setGlobalSetProjectPhases = (setPhasesFn: (phases: any[]) => void) => {
  globalSetProjectPhases = setPhasesFn;
};

/**
 * Add a message to the chat from outside React components
 * 
 * @param message - The message to add
 */
export const addMessage = (message: ChatMessageProps) => {
  if (globalAddMessage) {
    globalAddMessage(message);
  } else {
    console.error("Global addMessage function not set");
  }
};

/**
 * Update project phases from outside React components
 * 
 * @param phases - The new project phases
 */
export const setProjectPhases = (phases: any[]) => {
  if (globalSetProjectPhases) {
    globalSetProjectPhases(phases);
  } else {
    console.error("Global setProjectPhases function not set");
  }
};
