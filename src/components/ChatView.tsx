
import React, { useRef } from "react";
import { useParams } from "react-router-dom";
import { ChatMessages } from "@/components/chat/ChatMessages";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatProcessor } from "@/components/ChatProcessor";
import { useChat } from "@/contexts/ChatContext";
import { SuggestionBox } from "@/components/chat/SuggestionBox";

/**
 * ChatView Component
 * 
 * The main chat interface that displays messages and provides interaction options.
 * This component orchestrates the chat experience with the following features:
 * 
 * - Message display area showing the conversation history
 * - Chat bubble suggestions for quick actions
 * - Integration with the chat processor for handling messages
 */
export default function ChatView() {
  const { chatId } = useParams<{ chatId: string }>();
  const { 
    messages, 
    isAgentTyping, 
    isLoadingExample, 
    suggestions,
    addMessage,
    securityReviewActive,
    collaborationActive,
  } = useChat();
  
  const chatProcessorRef = useRef<any>(null);
  
  // Filter out duplicate suggestion boxes by title
  const uniqueSuggestions = React.useMemo(() => {
    const uniqueTitles = new Set();
    return suggestions.filter(suggestion => {
      if (!uniqueTitles.has(suggestion.title)) {
        uniqueTitles.add(suggestion.title);
        return true;
      }
      return false;
    }).slice(0, 2); // Limit to 2 suggestions at a time to prevent UI clutter
  }, [suggestions]);
  
  /**
   * Handle user selection from suggestion boxes
   * @param message - The selected suggestion text
   */
  const handleSuggestionSelect = (message: string) => {
    if (chatProcessorRef.current) {
      addMessage({
        content: message,
        type: "user",
      });
      
      chatProcessorRef.current.processUserMessage(message);
    }
  };

  return (
    <div className="flex h-full overflow-hidden bg-background relative">
      <div className="flex flex-col flex-1 overflow-hidden">
        <ChatHeader />
        
        {/* Main chat message area - increased height and improved spacing */}
        <div className="relative flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto pb-24 px-4">
            <ChatMessages 
              messages={messages}
              isLoadingExample={isLoadingExample} 
              isAgentTyping={isAgentTyping}
              securityReviewActive={securityReviewActive}
              collaborationActive={collaborationActive || false}
            />
          </div>
        </div>
        
        {/* Chat input area with suggestions - repositioned closer to messages */}
        <div className="sticky bottom-0 z-20 bg-gradient-to-t from-background via-background to-transparent py-4">
          {/* Chat bubble suggestions - positioned above input */}
          {uniqueSuggestions.length > 0 && (
            <div className="max-w-2xl mx-auto px-4 mb-3">
              {uniqueSuggestions.map((suggestion, index) => (
                <div key={index} className="mb-2 animate-fade-in">
                  <SuggestionBox
                    title={suggestion.title}
                    description={suggestion.description}
                    options={suggestion.options}
                    onSelect={handleSuggestionSelect}
                  />
                </div>
              ))}
            </div>
          )}
          
          {/* Chat processor - contains input field */}
          <ChatProcessor chatRef={chatProcessorRef} />
        </div>
      </div>
    </div>
  );
}
