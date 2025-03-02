
import React, { useRef, useEffect } from "react";
import { AgentTypingAnimation } from "@/components/chat/AgentTypingAnimation";
import { ChatMessageProps } from "@/components/ChatMessage";
import { useChat } from "@/contexts/ChatContext";
import { SuggestionBox } from "@/components/chat/SuggestionBox";
import { ResourceRecommendations } from "@/components/knowledge/ResourceRecommendations";
import { toast } from "sonner";

interface ChatMessagesProps {
  containerRef: React.RefObject<HTMLDivElement>;
  onSelectSuggestion: (message: string) => void;
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({ 
  containerRef, 
  onSelectSuggestion 
}) => {
  const { 
    messages, 
    isAgentTyping, 
    suggestions,
    knowledgeBase,
    addKnowledgeResource
  } = useChat();
  const shouldAutoScroll = useRef<boolean>(true);
  
  // Auto-scroll to the bottom when messages change
  useEffect(() => {
    if (containerRef.current && shouldAutoScroll.current) {
      const { scrollHeight, clientHeight } = containerRef.current;
      containerRef.current.scrollTop = scrollHeight - clientHeight;
    }
  }, [messages, isAgentTyping, suggestions, containerRef]);
  
  // Handle when a user scrolls up (disable auto-scroll)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isScrolledNearBottom = scrollTop + clientHeight >= scrollHeight - 100;
      shouldAutoScroll.current = isScrolledNearBottom;
    };
    
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [containerRef]);

  const handleOpenResource = (url: string) => {
    window.open(url, '_blank');
    toast.success('Opening resource in new tab');
  };
  
  const handleResourceUsed = (resource: any) => {
    // Update resource usage stats in knowledge base
    const updatedResource = {
      ...resource,
      accessCount: (resource.accessCount || 0) + 1,
      lastAccessed: new Date().toISOString()
    };
    addKnowledgeResource(updatedResource);
  };
  
  // Get the latest user message for context query
  const getLatestUserMessage = (): string => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].type === 'user') {
        return messages[i].content;
      }
    }
    return '';
  };
  
  return (
    <>
      {messages.map((message, index) => (
        <React.Fragment key={index}>
          <div 
            className={`py-4 ${
              message.type === "user" ? "bg-white" : "bg-slate-50"
            }`}
          >
            <div className="container mx-auto max-w-4xl">
              {message.children}
            </div>
          </div>
          
          {/* Show resource recommendations after user messages if we have a knowledge base */}
          {message.type === "user" && knowledgeBase.length > 0 && index === messages.length - 1 && (
            <div className="container mx-auto max-w-4xl px-4 py-2">
              <ResourceRecommendations
                knowledgeBase={knowledgeBase}
                contextQuery={message.content}
                onOpenResource={handleOpenResource}
                onResourceUsed={handleResourceUsed}
              />
            </div>
          )}
        </React.Fragment>
      ))}
      
      {/* Show suggestions after all messages */}
      {suggestions.map((suggestion, index) => (
        <div key={`suggestion-${index}`} className="container mx-auto max-w-4xl py-2 px-4">
          <SuggestionBox 
            title={suggestion.title}
            description={suggestion.description}
            options={suggestion.options}
            onSelect={onSelectSuggestion}
          />
        </div>
      ))}
      
      {/* Show agent typing animation */}
      {isAgentTyping && (
        <div className="py-4 bg-slate-50">
          <div className="container mx-auto max-w-4xl">
            <AgentTypingAnimation />
          </div>
        </div>
      )}
    </>
  );
};
