
import React, { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { ChatMessages } from "@/components/chat/ChatMessages";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatProcessor } from "@/components/ChatProcessor";
import { useChat } from "@/contexts/ChatContext";
import { SuggestionBox } from "@/components/chat/SuggestionBox";
import { Button } from "@/components/ui/button";
import { FileText, BookOpen, Code, Settings, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ChatView() {
  const { chatId } = useParams<{ chatId: string }>();
  const { 
    messages, 
    isAgentTyping, 
    isLoadingExample, 
    suggestions,
    addMessage,
    securityReviewActive,
    collaborationActive
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

  const handleDocumentRequest = (docType: string) => {
    if (chatProcessorRef.current) {
      const message = `Generate ${docType} documentation for our project`;
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
        <div className="absolute top-16 right-4 z-10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Documentation
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Generate Documentation</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleDocumentRequest("API")}>
                <Code className="h-4 w-4 mr-2" />
                API Documentation
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDocumentRequest("user")}>
                <BookOpen className="h-4 w-4 mr-2" />
                User Guide
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDocumentRequest("technical")}>
                <Code className="h-4 w-4 mr-2" />
                Technical Documentation
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDocumentRequest("maintenance")}>
                <Settings className="h-4 w-4 mr-2" />
                Maintenance Guide
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex-1 overflow-auto relative pb-40">
          <ChatMessages 
            messages={messages}
            isLoadingExample={isLoadingExample} 
            isAgentTyping={isAgentTyping}
            securityReviewActive={securityReviewActive}
            collaborationActive={collaborationActive}
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
