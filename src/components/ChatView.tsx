
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
        
        <div className="absolute top-16 right-4 z-20 flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2 shadow-sm bg-white">
                <BarChart className="h-4 w-4 text-blue-600" />
                <span className="hidden sm:inline text-gray-700">Performance</span>
                <ChevronDown className="h-4 w-4 opacity-60" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Performance Monitoring</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handlePerformanceRequest("metrics")} className="gap-2">
                <Gauge className="h-4 w-4 text-blue-600" />
                <span>Define Performance Metrics</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handlePerformanceRequest("monitoring")} className="gap-2">
                <LineChart className="h-4 w-4 text-blue-600" />
                <span>Monitoring Tool Setup</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handlePerformanceRequest("benchmarks")} className="gap-2">
                <BarChart className="h-4 w-4 text-blue-600" />
                <span>Create Performance Benchmarks</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handlePerformanceRequest("optimizations")} className="gap-2">
                <Zap className="h-4 w-4 text-blue-600" />
                <span>Optimization Recommendations</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2 shadow-sm bg-white">
                <FileText className="h-4 w-4 text-blue-600" />
                <span className="hidden sm:inline text-gray-700">Documentation</span>
                <ChevronDown className="h-4 w-4 opacity-60" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Generate Documentation</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleDocumentRequest("API")} className="gap-2">
                <Code className="h-4 w-4 text-blue-600" />
                <span>API Documentation</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDocumentRequest("user")} className="gap-2">
                <BookOpen className="h-4 w-4 text-blue-600" />
                <span>User Guide</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDocumentRequest("technical")} className="gap-2">
                <Code className="h-4 w-4 text-blue-600" />
                <span>Technical Documentation</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDocumentRequest("maintenance")} className="gap-2">
                <Settings className="h-4 w-4 text-blue-600" />
                <span>Maintenance Guide</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="relative flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto">
            <ChatMessages 
              messages={messages}
              isLoadingExample={isLoadingExample} 
              isAgentTyping={isAgentTyping}
              securityReviewActive={securityReviewActive}
              collaborationActive={collaborationActive || false}
            />
          </div>
          
          {uniqueSuggestions.length > 0 && (
            <div className="fixed bottom-[5.5rem] left-0 right-0 z-10 px-4 pointer-events-none">
              <div className="max-w-2xl mx-auto space-y-2 pointer-events-auto">
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
        
        <div className="sticky bottom-0 z-20 bg-gradient-to-t from-background via-background/95 to-background/75 border-t py-2">
          <ChatProcessor chatRef={chatProcessorRef} />
        </div>
      </div>
    </div>
  );
}
