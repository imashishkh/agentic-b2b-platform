
import React, { useRef } from "react";
import { useParams } from "react-router-dom";
import { ChatMessages } from "@/components/chat/ChatMessages";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatProcessor } from "@/components/ChatProcessor";
import { useChat } from "@/contexts/ChatContext";
import { AgentType } from "@/agents/AgentTypes";
import { SuggestionBox } from "@/components/chat/SuggestionBox";

export default function ChatView() {
  const { chatId } = useParams<{ chatId: string }>();
  const { 
    messages, 
    isAgentTyping, 
    isLoadingExample, 
    suggestions,
    addMessage 
  } = useChat();
  
  // Create a ref for the ChatProcessor
  const chatProcessorRef = useRef<any>(null);
  
  // State variables for ChatHeader props
  const [showApiSettings, setShowApiSettings] = React.useState(false);
  const [showProjectPanel, setShowProjectPanel] = React.useState(false);

  // Handle suggestion selection
  const handleSuggestionSelect = (message: string) => {
    if (chatProcessorRef.current) {
      // Add the message to the chat as a user message
      addMessage({
        content: message,
        type: "user",
      });
      
      // Process the message using the ChatProcessor
      chatProcessorRef.current.processUserMessage(message);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background">
      <ChatHeader 
        setShowApiSettings={setShowApiSettings}
        showProjectPanel={showProjectPanel}
        setShowProjectPanel={setShowProjectPanel}
      />
      <div className="flex-1 overflow-auto">
        <ChatMessages 
          messages={messages} 
          isLoadingExample={isLoadingExample} 
          isAgentTyping={isAgentTyping} 
        />
        
        {/* Render suggestions after the chat messages */}
        {suggestions.length > 0 && (
          <div className="px-4 pb-4">
            {suggestions.map((suggestion, index) => (
              <SuggestionBox
                key={index}
                title={suggestion.title}
                description={suggestion.description}
                options={suggestion.options}
                onSelect={handleSuggestionSelect}
              />
            ))}
          </div>
        )}
      </div>
      <ChatProcessor chatRef={chatProcessorRef} />
    </div>
  );
}
