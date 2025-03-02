
import { AgentType } from "@/agents/AgentTypes";
import { createAgent } from "@/agents/AgentFactory";
import { addMessage } from "@/hooks/useChatActions";

/**
 * Hook for handling knowledge base requests and responses
 * This isolates knowledge base logic from the main chat processor
 */
export const useKnowledgeProcessor = () => {
  /**
   * Process a message when in knowledge base request mode
   * Handles URL inputs and knowledge base transitions
   * 
   * @param userMessage - The user's message text
   * @param projectPhases - Current project phases
   * @param setIsAgentTyping - Function to update typing indicator
   * @param setIsRequestingKnowledge - Function to update knowledge request status
   * @returns True if the message was handled as a knowledge base request, false otherwise
   */
  const processKnowledgeRequest = (
    userMessage: string,
    projectPhases: any[],
    setIsAgentTyping: (isTyping: boolean) => void,
    setIsRequestingKnowledge: (isRequesting: boolean) => void
  ): boolean => {
    // Check if this message contains a URL for the knowledge base
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urls = userMessage.match(urlRegex);
    
    if (urls && urls.length > 0) {
      // User is likely providing a resource, respond accordingly
      setTimeout(() => {
        const managerAgent = createAgent(AgentType.MANAGER);
        managerAgent.generateResponse(userMessage, projectPhases).then(response => {
          addMessage({ 
            type: "agent", 
            content: response,
            agentType: AgentType.MANAGER
          });
          setIsAgentTyping(false);
        });
      }, 1000);
      return true;
    } else {
      // No URL found, assume user wants to move on
      setTimeout(() => {
        setIsRequestingKnowledge(false);
        addMessage({ 
          type: "agent", 
          content: "Now that we have set up the knowledge base, we can proceed with architecture planning. What specific aspect of the e-commerce platform would you like to focus on first?",
          agentType: AgentType.MANAGER
        });
        setIsAgentTyping(false);
      }, 1000);
      return true;
    }
  };

  return {
    processKnowledgeRequest
  };
};
