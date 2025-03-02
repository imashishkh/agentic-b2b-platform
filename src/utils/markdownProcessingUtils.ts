
import { parseMarkdownToTasks } from "@/utils/projectParser";
import { addMessage, setProjectPhases } from "@/hooks/useChatActions";
import { assignTasksToAgents, generateTaskAssignmentMessage } from "@/utils/taskAssignmentUtils";
import { AgentType } from "@/agents/AgentTypes";
import { createAgent } from "@/agents/AgentFactory";

/**
 * Process markdown content from a string or file
 * This extracts project phases and generates responses
 * 
 * @param markdownContent - The markdown text to process
 * @param setIsAgentTyping - Function to update typing indicator
 * @param setIsRequestingKnowledge - Function to update knowledge request status
 * @param setIsFetchingResponse - Function to update fetching status
 * @returns Promise that resolves when processing is complete
 */
export const processMarkdownContent = async (
  markdownContent: string,
  setIsAgentTyping: (isTyping: boolean) => void,
  setIsRequestingKnowledge: (isRequesting: boolean) => void,
  setIsFetchingResponse: (isFetching: boolean) => void
): Promise<void> => {
  setIsFetchingResponse(true);
  
  try {
    const result = await parseMarkdownToTasks(markdownContent);
    setProjectPhases(result.phases);
    
    // Create task assignments by agent type
    const taskAssignments = assignTasksToAgents(result.phases);
    
    // Add the analysis response
    setTimeout(() => {
      addMessage({ 
        type: "agent", 
        content: result.response,
        agentType: AgentType.MANAGER
      });
      
      // Add task assignments message
      setTimeout(() => {
        addMessage({ 
          type: "agent", 
          content: generateTaskAssignmentMessage(taskAssignments),
          agentType: AgentType.MANAGER
        });
        
        // Request knowledge base resources
        setTimeout(() => {
          const managerAgent = createAgent(AgentType.MANAGER) as any;
          const knowledgeBasePrompt = managerAgent.generateKnowledgeBasePrompt();
          
          addMessage({ 
            type: "agent", 
            content: knowledgeBasePrompt,
            agentType: AgentType.MANAGER
          });
          
          setIsRequestingKnowledge(true);
          setIsAgentTyping(false);
        }, 1000);
      }, 1000);
    }, 1000);
  } catch (error) {
    console.error("Error processing markdown:", error);
    addMessage({ 
      type: "agent", 
      content: "I encountered an error while processing your markdown. Please check the format and try again.",
      agentType: AgentType.MANAGER
    });
    setIsAgentTyping(false);
  } finally {
    setIsFetchingResponse(false);
  }
};

/**
 * Extracts markdown content from user message if it's wrapped in code blocks
 * 
 * @param userMessage - The message potentially containing markdown code blocks
 * @returns The extracted markdown content or the original message
 */
export const extractMarkdownFromMessage = (userMessage: string): string => {
  if (userMessage.includes("```markdown") || userMessage.includes("```md")) {
    const regex = /```(?:markdown|md)?\s*([\s\S]*?)```/;
    const match = userMessage.match(regex);
    if (match && match[1]) {
      return match[1];
    }
  }
  return userMessage;
};
