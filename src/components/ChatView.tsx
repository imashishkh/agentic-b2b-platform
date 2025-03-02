
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
    });
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
        
        <div className="fixed top-16 right-4 z-20 flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2 shadow-sm">
                <BarChart className="h-4 w-4" />
                <span className="hidden sm:inline">Performance</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Performance Monitoring</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handlePerformanceRequest("metrics")}>
                <Gauge className="h-4 w-4 mr-2" />
                Define Performance Metrics
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handlePerformanceRequest("monitoring")}>
                <LineChart className="h-4 w-4 mr-2" />
                Monitoring Tool Setup
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handlePerformanceRequest("benchmarks")}>
                <BarChart className="h-4 w-4 mr-2" />
                Create Performance Benchmarks
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handlePerformanceRequest("optimizations")}>
                <Zap className="h-4 w-4 mr-2" />
                Optimization Recommendations
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2 shadow-sm">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Documentation</span>
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
        
        <div className="flex-1 overflow-auto relative">
          <ChatMessages 
            messages={messages}
            isLoadingExample={isLoadingExample} 
            isAgentTyping={isAgentTyping}
            securityReviewActive={securityReviewActive}
            collaborationActive={collaborationActive || false}
          />
          
          {uniqueSuggestions.length > 0 && (
            <div className="fixed bottom-24 left-0 right-0 z-10 px-4">
              <div className="max-w-3xl mx-auto space-y-3">
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
        
        <div className="sticky bottom-0 z-20 bg-background/95 backdrop-blur-sm border-t">
          <ChatProcessor chatRef={chatProcessorRef} />
        </div>
      </div>
    </div>
  );
}
