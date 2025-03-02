
import React, { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { ChatMessages } from "@/components/chat/ChatMessages";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatProcessor } from "@/components/ChatProcessor";
import { useChat } from "@/contexts/ChatContext";
import { SuggestionBox } from "@/components/chat/SuggestionBox";
import { Button } from "@/components/ui/button";
import { FileText, BookOpen, Code, Settings, ChevronDown, BarChart, Gauge, LineChart, Zap } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * ChatView Component
 * 
 * The main chat interface that displays messages and provides interaction options.
 * This component orchestrates the chat experience with the following features:
 * 
 * - Message display area showing the conversation history
 * - Suggestion boxes for common user actions
 * - Access to documentation and performance monitoring tools
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

  /**
   * Handle document generation requests
   * @param docType - The type of documentation to generate
   */
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
  
  /**
   * Handle performance-related requests
   * @param requestType - The type of performance request
   */
  const handlePerformanceRequest = (requestType: string) => {
    if (chatProcessorRef.current) {
      let message = "";
      
      switch (requestType) {
        case "metrics":
          message = "Define performance metrics for our project";
          break;
        case "monitoring":
          message = "Recommend monitoring tools for our project";
          break;
        case "benchmarks":
          message = "Create performance benchmarks for our project";
          break;
        case "optimizations":
          message = "Generate performance optimization recommendations";
          break;
        default:
          message = "Help me with performance monitoring";
      }
      
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
        
        {/* Dropdown menus for documentation and performance tools */}
        <div className="absolute top-16 right-4 z-20 flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1.5 shadow-sm bg-white">
                <BarChart className="h-3.5 w-3.5 text-blue-600" />
                <span className="hidden sm:inline text-xs text-gray-700">Performance</span>
                <ChevronDown className="h-3 w-3 opacity-60" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel className="text-xs">Performance Monitoring</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handlePerformanceRequest("metrics")} className="gap-2 text-xs">
                <Gauge className="h-3.5 w-3.5 text-blue-600" />
                <span>Define Performance Metrics</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handlePerformanceRequest("monitoring")} className="gap-2 text-xs">
                <LineChart className="h-3.5 w-3.5 text-blue-600" />
                <span>Monitoring Tool Setup</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handlePerformanceRequest("benchmarks")} className="gap-2 text-xs">
                <BarChart className="h-3.5 w-3.5 text-blue-600" />
                <span>Create Performance Benchmarks</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handlePerformanceRequest("optimizations")} className="gap-2 text-xs">
                <Zap className="h-3.5 w-3.5 text-blue-600" />
                <span>Optimization Recommendations</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1.5 shadow-sm bg-white">
                <FileText className="h-3.5 w-3.5 text-blue-600" />
                <span className="hidden sm:inline text-xs text-gray-700">Documentation</span>
                <ChevronDown className="h-3 w-3 opacity-60" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel className="text-xs">Generate Documentation</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleDocumentRequest("API")} className="gap-2 text-xs">
                <Code className="h-3.5 w-3.5 text-blue-600" />
                <span>API Documentation</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDocumentRequest("user")} className="gap-2 text-xs">
                <BookOpen className="h-3.5 w-3.5 text-blue-600" />
                <span>User Guide</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDocumentRequest("technical")} className="gap-2 text-xs">
                <Code className="h-3.5 w-3.5 text-blue-600" />
                <span>Technical Documentation</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDocumentRequest("maintenance")} className="gap-2 text-xs">
                <Settings className="h-3.5 w-3.5 text-blue-600" />
                <span>Maintenance Guide</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {/* Main chat message area */}
        <div className="relative flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto p-4">
            <ChatMessages 
              messages={messages}
              isLoadingExample={isLoadingExample} 
              isAgentTyping={isAgentTyping}
              securityReviewActive={securityReviewActive}
              collaborationActive={collaborationActive || false}
            />
          </div>
          
          {/* Suggestion boxes - displayed above the chat input but not overlapping messages */}
          {uniqueSuggestions.length > 0 && (
            <div className="fixed bottom-[4.5rem] left-0 right-0 z-10 px-4 pointer-events-none">
              <div className="max-w-2xl mx-auto space-y-1.5 pointer-events-auto">
                {uniqueSuggestions.map((suggestion, index) => (
                  <SuggestionBox
                    key={index}
                    title={suggestion.title}
                    description={suggestion.description}
                    options={suggestion.options}
                    onSelect={handleSuggestionSelect}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Chat input area with gradient background */}
        <div className="sticky bottom-0 z-20 bg-gradient-to-t from-background via-background/90 to-transparent pt-6 pb-1">
          <ChatProcessor chatRef={chatProcessorRef} />
        </div>
      </div>
    </div>
  );
}
