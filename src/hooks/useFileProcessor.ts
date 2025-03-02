
import { useState } from "react";
import { AgentType } from "@/agents/AgentTypes";
import { addMessage } from "@/hooks/useChatActions";
import { processMarkdownContent } from "@/utils/markdownProcessingUtils";

/**
 * Hook for handling file uploads in the chat
 * This isolates file processing logic from the main chat processor
 */
export const useFileProcessor = () => {
  const [isProcessingFile, setIsProcessingFile] = useState(false);

  /**
   * Process uploaded files, particularly markdown files
   * 
   * @param files - Array of uploaded files
   * @param setIsAgentTyping - Function to update typing indicator
   * @param setIsRequestingKnowledge - Function to update knowledge request status
   * @param setIsFetchingResponse - Function to update fetching status
   * @param setHasRequestedFile - Function to update file request status
   * @returns True if a file was processed, false otherwise
   */
  const processUploadedFiles = async (
    files: File[],
    setIsAgentTyping: (isTyping: boolean) => void,
    setIsRequestingKnowledge: (isRequesting: boolean) => void,
    setIsFetchingResponse: (isFetching: boolean) => void,
    setHasRequestedFile: (hasRequested: boolean) => void
  ): Promise<boolean> => {
    if (!files || files.length === 0) return false;
    
    setIsProcessingFile(true);
    
    try {
      const markdownFiles = files.filter(file => 
        file.name.endsWith('.md') || file.type === 'text/markdown'
      );
      
      if (markdownFiles.length > 0) {
        // Read and process the first markdown file
        const file = markdownFiles[0];
        const reader = new FileReader();
        
        return new Promise((resolve) => {
          reader.onload = async (e) => {
            try {
              const markdownContent = e.target?.result as string;
              await processMarkdownContent(
                markdownContent,
                setIsAgentTyping,
                setIsRequestingKnowledge,
                setIsFetchingResponse
              );
              setHasRequestedFile(false);
              resolve(true);
            } catch (error) {
              console.error("Error reading markdown file:", error);
              addMessage({ 
                type: "agent", 
                content: "There was an error reading your file. Please try again with a different file.",
                agentType: AgentType.MANAGER
              });
              setIsAgentTyping(false);
              setIsFetchingResponse(false);
              resolve(false);
            }
          };
          
          reader.onerror = () => {
            addMessage({ 
              type: "agent", 
              content: "There was an error reading your file. Please try again with a different file.",
              agentType: AgentType.MANAGER
            });
            setIsAgentTyping(false);
            setIsFetchingResponse(false);
            resolve(false);
          };
          
          reader.readAsText(file);
        });
      }
    } finally {
      setIsProcessingFile(false);
    }
    
    return false;
  };

  return {
    isProcessingFile,
    processUploadedFiles
  };
};
