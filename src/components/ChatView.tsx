
import React, { useRef } from "react";
import { useParams } from "react-router-dom";
import { ChatMessages } from "@/components/chat/ChatMessages";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatProcessor } from "@/components/ChatProcessor";
import { useChat } from "@/contexts/ChatContext";
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
  
  const chatProcessorRef = useRef<any>(null);
  
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
        <div className="flex-1 overflow-auto relative pb-40">
          <ChatMessages 
            messages={messages}
            isLoadingExample={isLoadingExample} 
            isAgentTyping={isAgentTyping} 
          />
          
          {suggestions.length > 0 && (
            <div className="px-4 pb-4 mb-32 absolute bottom-0 left-0 right-0 z-10">
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
    </div>
  );
}
