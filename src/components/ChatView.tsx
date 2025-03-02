
import React, { useRef, useEffect } from "react";
import { ChatMessage } from "@/components/ChatMessage";
import { useChat } from "@/contexts/ChatContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ChatView() {
  const { messages, isAgentTyping } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <ScrollArea className="flex-1 h-full">
      <div className="flex flex-col py-6 px-8 space-y-6 min-h-full">
        {/* Welcome message if no messages yet */}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full py-20 text-center">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8 shadow-lg max-w-2xl glass animate-fade-in">
              <div className="flex items-center justify-center mb-6">
                <Sparkles className="h-10 w-10 text-sayhalo-coral mr-3" />
                <h2 className="text-2xl font-semibold text-sayhalo-dark">Welcome to DevManager AI</h2>
              </div>
              
              <p className="text-sayhalo mb-8 text-lg">
                I'm your AI development manager specializing in e-commerce platforms. 
                Upload a markdown file with your project requirements or describe your project to get started.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <FeatureCard 
                  title="Project Analysis" 
                  description="Upload project documentation to create structured task lists and assignments"
                />
                <FeatureCard 
                  title="Architecture Planning" 
                  description="Get system architecture proposals with data schemas and component recommendations"
                />
                <FeatureCard 
                  title="Testing Strategy" 
                  description="Develop comprehensive testing approaches for all aspects of your application"
                />
                <FeatureCard 
                  title="Documentation" 
                  description="Create standardized documentation for APIs, components, and user guides"
                />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="flex items-center gap-2 bg-sayhalo-coral hover:bg-sayhalo-coral/90 text-white">
                  <Upload className="h-4 w-4" />
                  Upload Requirements
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Start with Example Project
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {/* Messages display */}
        {messages.map((message, index) => (
          <ChatMessage 
            key={index} 
            type={message.type} 
            content={message.content} 
            agentType={message.agentType}
          />
        ))}
        
        {/* Typing indicator */}
        {isAgentTyping && (
          <ChatMessage 
            type="agent" 
            content="" 
            isLoading={true} 
          />
        )}
        
        {/* Empty div for auto-scrolling */}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
}

// Helper component for feature cards in welcome screen
const FeatureCard = ({ title, description }: { title: string; description: string }) => (
  <div className="bg-white/60 rounded-lg p-4 border border-gray-100 shadow-sm hover:shadow transition-shadow">
    <h3 className="font-medium text-sayhalo-dark mb-2">{title}</h3>
    <p className="text-sm text-gray-600">{description}</p>
  </div>
);
