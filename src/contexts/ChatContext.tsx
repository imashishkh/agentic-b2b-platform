
import React, { createContext, useState, useContext, ReactNode } from "react";
import { ChatMessageProps } from "@/components/ChatMessage";

// Initial messages to bootstrap the conversation
const initialMessages: ChatMessageProps[] = [
  {
    type: "agent",
    content: "Hello! I'm your project manager agent for building an e-commerce platform. Could you please upload a markdown file with your project requirements? Alternatively, you can describe your project and I'll help organize it into phases and tasks."
  }
];

interface ChatContextType {
  messages: ChatMessageProps[];
  isAgentTyping: boolean;
  isFetchingResponse: boolean;
  projectPhases: any[];
  hasRequestedFile: boolean;
  addMessage: (message: ChatMessageProps) => void;
  setIsAgentTyping: (isTyping: boolean) => void;
  setIsFetchingResponse: (isFetching: boolean) => void;
  setProjectPhases: (phases: any[]) => void;
  setHasRequestedFile: (hasRequested: boolean) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [messages, setMessages] = useState<ChatMessageProps[]>(initialMessages);
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const [isFetchingResponse, setIsFetchingResponse] = useState(false);
  const [projectPhases, setProjectPhases] = useState<any[]>([]);
  const [hasRequestedFile, setHasRequestedFile] = useState(true);

  // Add a new message to the chat
  const addMessage = (message: ChatMessageProps) => {
    setMessages(prev => [...prev, message]);
  };

  return (
    <ChatContext.Provider value={{
      messages,
      isAgentTyping,
      isFetchingResponse,
      projectPhases,
      hasRequestedFile,
      addMessage,
      setIsAgentTyping,
      setIsFetchingResponse,
      setProjectPhases,
      setHasRequestedFile
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
