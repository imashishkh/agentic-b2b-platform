
import React, { createContext, useState, useContext, ReactNode } from "react";
import { ChatMessageProps } from "@/components/ChatMessage";
import { AgentType } from "@/agents/AgentTypes";

/**
 * Initial messages to bootstrap the conversation when a user first interacts with the system
 * These provide guidance on how to start the project planning process
 */
const initialMessages: ChatMessageProps[] = [];

/**
 * Interface defining the shape of the ChatContext
 * This provides TypeScript type safety for all context consumers
 */
interface ChatContextType {
  messages: ChatMessageProps[];             // All chat messages (user and agent)
  isAgentTyping: boolean;                   // Whether an agent is currently typing
  isFetchingResponse: boolean;              // Whether we're waiting for an API response
  projectPhases: any[];                     // Structured project data
  hasRequestedFile: boolean;                // Whether we've asked for a requirements file
  currentAgentType: AgentType;              // Which agent is currently active
  addMessage: (message: ChatMessageProps) => void;  // Add a new message to the chat
  setIsAgentTyping: (isTyping: boolean) => void;    // Update typing indicator
  setIsFetchingResponse: (isFetching: boolean) => void;  // Update fetching status
  setProjectPhases: (phases: any[]) => void;        // Update project structure
  setHasRequestedFile: (hasRequested: boolean) => void;  // Update file request status
  setCurrentAgentType: (agentType: AgentType) => void;   // Change the active agent
}

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
  const [projectPhases, setProjectPhases] = useState<any[]>([]);
  const [hasRequestedFile, setHasRequestedFile] = useState(true);
  const [currentAgentType, setCurrentAgentType] = useState<AgentType>(AgentType.MANAGER);

  /**
   * Add a new message to the chat history
   * 
   * @param message - The message object to add to the chat
   */
  const addMessage = (message: ChatMessageProps) => {
    setMessages(prev => [...prev, message]);
  };

  // Provide the chat state and functions to all child components
  return (
    <ChatContext.Provider value={{
      messages,
      isAgentTyping,
      isFetchingResponse,
      projectPhases,
      hasRequestedFile,
      currentAgentType,
      addMessage,
      setIsAgentTyping,
      setIsFetchingResponse,
      setProjectPhases,
      setHasRequestedFile,
      setCurrentAgentType
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
