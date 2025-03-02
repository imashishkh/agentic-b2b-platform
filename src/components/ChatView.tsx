
import React, { useRef, useEffect } from "react";
import { ChatMessage } from "@/components/ChatMessage";
import { useChat } from "@/contexts/ChatContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function ChatView() {
  const { messages, isAgentTyping, addMessage, setIsAgentTyping } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handler for starting with example project
  const handleStartExample = () => {
    const exampleRequirements = `# E-Commerce Platform Requirements

## Overview
We need a modern e-commerce platform that can sell physical and digital products with a focus on great user experience and scalability.

## Key Features
- User authentication and profiles
- Product catalog with categories and search
- Shopping cart and checkout process
- Payment processing (Stripe integration)
- Order management and history
- Admin dashboard for inventory management
- Responsive design for mobile and desktop

## Technical Requirements
- React frontend
- RESTful API
- PostgreSQL database
- Secure authentication
- Performance optimization for product listings
- Automated testing suite

## Deployment
- CI/CD pipeline
- AWS hosting
- Monitoring and analytics

## Timeline
6 months to MVP with monthly sprint cycles`;

    addMessage({
      type: "user",
      content: exampleRequirements,
    });
    
    // Simulate agent response
    setIsAgentTyping(true);
    setTimeout(() => {
      addMessage({
        type: "agent",
        content: "Thank you for sharing the e-commerce platform requirements. I'll help you analyze these requirements, create a structured plan, and break down the tasks for different specialized agents. Let's start by organizing this into a project plan with clear phases and milestones.",
        agentType: "manager",
      });
      setIsAgentTyping(false);
    }, 1500);
    
    toast.success("Started example e-commerce project");
  };

  // Handler for file upload button click
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Handler for file selection
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    // Check if file is markdown
    if (!file.name.endsWith('.md') && !file.name.endsWith('.markdown')) {
      toast.error("Please upload a markdown (.md) file");
      return;
    }
    
    try {
      const content = await file.text();
      addMessage({
        type: "user",
        content: content,
      });
      
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      toast.success(`Uploaded ${file.name}`);
      
      // Simulate agent typing response
      setIsAgentTyping(true);
      setTimeout(() => {
        addMessage({
          type: "agent",
          content: `Thank you for uploading "${file.name}". I'll analyze these requirements and help you create a structured project plan. Give me a moment to review the content.`,
          agentType: "manager",
        });
        setIsAgentTyping(false);
      }, 1500);
      
    } catch (error) {
      console.error("Error reading file:", error);
      toast.error("Failed to read file content");
    }
  };

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
                {/* Hidden file input for uploads */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".md,.markdown"
                />
                
                <Button 
                  onClick={handleUploadClick}
                  className="flex items-center gap-2 bg-sayhalo-coral hover:bg-sayhalo-coral/90 text-white"
                >
                  <Upload className="h-4 w-4" />
                  Upload Requirements
                </Button>
                
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={handleStartExample}
                >
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
