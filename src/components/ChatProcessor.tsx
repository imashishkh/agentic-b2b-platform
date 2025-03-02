
import React, { useState, useEffect, useRef } from "react";
import { useChat } from "@/contexts/ChatContext";
import { AgentType } from "@/agents/AgentTypes";
import * as AgentFactory from "@/agents/AgentFactory";
import { toast } from "sonner";
import { ManagerAgent } from "@/agents/ManagerAgent";
import { extractTasksWithDependencies, generateDependencyGraph } from "@/utils/markdownParser";

// Define the correct interface with chatRef
export interface ChatProcessorProps {
  chatRef: React.MutableRefObject<any>;
}

export function ChatProcessor({ chatRef }: ChatProcessorProps) {
  const { 
    addMessage, 
    setIsAgentTyping, 
    messages, 
    addSuggestion, 
    clearSuggestions,
    isAgentTyping
  } = useChat();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const isMounted = useRef(true);
  const initialMessageSent = useRef(false);
  const managerAgent = useRef<ManagerAgent>(AgentFactory.createAgent(AgentType.MANAGER) as ManagerAgent);

  useEffect(() => {
    isMounted.current = true;
    
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Only send welcome message if no messages exist
  useEffect(() => {
    if (!chatRef.current) {
      chatRef.current = {
        processUserMessage: processMessage
      };
    }
    
    // Check if there are no messages and we haven't sent an initial message yet
    if (messages.length === 0 && !initialMessageSent.current) {
      initialMessageSent.current = true;
      
      // Add typing indicator first
      setIsAgentTyping(true);
      
      setTimeout(() => {
        if (isMounted.current) {
          setIsAgentTyping(false);
          addMessage({
            type: "agent",
            content: "Hello! I'm DevManager, your AI project manager. How can I help you today?",
            agentType: AgentType.MANAGER,
          });
          
          // Add initial suggestions after welcome message
          addSuggestion({
            title: "Getting Started",
            description: "Here are some ways to get started with your project:",
            options: [
              {
                id: "upload-requirements",
                label: "Upload requirements document",
                message: "I'd like to upload a project requirements document",
                icon: "file-code",
                description: "Upload a markdown file with your project requirements"
              },
              {
                id: "example-project",
                label: "Start with example project",
                message: "I want to start with an example e-commerce project",
                icon: "layout",
                description: "Use a pre-configured e-commerce project template"
              },
              {
                id: "knowledge-base",
                label: "Create knowledge base",
                message: "Let's set up a knowledge base for the project",
                icon: "book-open",
                description: "Add documentation and resources to inform development"
              },
              {
                id: "custom-requirements",
                label: "Describe project manually",
                message: "I want to describe my project requirements manually",
                icon: "users",
                description: "Explain your project requirements in chat"
              }
            ]
          });
        }
      }, 1500);
    }
  }, [chatRef, addMessage, messages, setIsAgentTyping, addSuggestion]);

  const processMarkdownFile = async (file: File) => {
    console.log("Processing markdown file in ChatProcessor:", file.name);
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const content = e.target?.result as string;
          console.log("File content loaded, length:", content.length);
          console.log("File content preview:", content.substring(0, 200) + "...");
          resolve(content);
        } catch (error) {
          console.error("Error processing file content:", error);
          reject(error);
        }
      };
      
      reader.onerror = (error) => {
        console.error("FileReader error:", error);
        reject(error);
      };
      
      reader.readAsText(file);
    });
  };

  const generateNextStepSuggestions = () => {
    // Generate next step suggestions based on the user flow in knowledge base
    const nextStepSuggestions = [
      {
        id: "architecture-planning",
        label: "Architecture Planning",
        message: "I'd like to start planning the system architecture for this project",
        icon: "layout",
        description: "Begin designing the technical architecture for your project"
      },
      {
        id: "knowledge-base",
        label: "Enhance Knowledge Base",
        message: "Let's add resources to the knowledge base for this project",
        icon: "book-open",
        description: "Add technical documentation and resources to inform development"
      },
      {
        id: "testing-strategy",
        label: "Testing Strategy",
        message: "Let's develop a testing strategy for the project",
        icon: "check-circle",
        description: "Create a comprehensive testing approach for quality assurance"
      },
      {
        id: "prioritize-tasks",
        label: "Prioritize Tasks",
        message: "Help me prioritize the tasks we've identified",
        icon: "list-ordered",
        description: "Organize tasks by importance and dependencies"
      }
    ];
    
    return nextStepSuggestions;
  };

  // Handle specific agent-related actions based on message content
  const handleSpecificActions = async (message: string): Promise<boolean> => {
    // Architecture planning message
    if (message.toLowerCase().includes("architecture") && 
        message.toLowerCase().includes("planning")) {
      if (!isAgentTyping) {
        setIsAgentTyping(true);
        setTimeout(() => {
          setIsAgentTyping(false);
          addMessage({
            type: "agent",
            content: `# Architecture Planning\n\nI'll help you plan the system architecture for your project. Let's start by defining the key components:\n\n## Frontend Architecture\n- React SPA with Tailwind CSS for styling\n- Component library: shadcn/ui\n- State management: Context API for simple state, Tanstack Query for remote data\n\n## Backend Architecture\n- RESTful API design\n- Authentication system with JWT\n- Server-side validation\n\n## Database Architecture\n- Entity relationships\n- Data schema design\n- Indexing strategy\n\nWould you like me to elaborate on any specific part of the architecture?`,
            agentType: AgentType.MANAGER,
          });
        }, 3000);
        return true;
      }
    }
    
    // Knowledge base message
    if (message.toLowerCase().includes("knowledge base")) {
      if (!isAgentTyping) {
        setIsAgentTyping(true);
        setTimeout(() => {
          setIsAgentTyping(false);
          addMessage({
            type: "agent",
            content: `# Knowledge Base Enhancement\n\nTo better support your project, I recommend gathering documentation and resources in the following categories:\n\n## Technology Stack Documentation\n- Frontend framework documentation\n- Backend framework documentation\n- Database documentation\n\n## Industry Standards\n- Security best practices\n- Accessibility guidelines\n- Performance benchmarks\n\n## Example Projects\n- Similar applications for reference\n- Code samples\n\nPlease share any specific resources you'd like to add to the project knowledge base.`,
            agentType: AgentType.MANAGER,
          });
        }, 3000);
        return true;
      }
    }
    
    // Testing strategy message
    if (message.toLowerCase().includes("testing strategy")) {
      if (!isAgentTyping) {
        setIsAgentTyping(true);
        setTimeout(() => {
          setIsAgentTyping(false);
          addMessage({
            type: "agent",
            content: `# Testing Strategy\n\nI'll help develop a comprehensive testing approach for your project:\n\n## Unit Testing\n- Test individual functions and components\n- Use Jest for JavaScript/TypeScript testing\n- Aim for >80% code coverage\n\n## Integration Testing\n- Test interactions between components\n- API endpoint testing\n- Database query testing\n\n## End-to-End Testing\n- Test complete user flows\n- Use Cypress or Playwright\n- Automate critical user journeys\n\n## Performance Testing\n- Load testing with k6 or JMeter\n- Browser performance profiling\n\n## Security Testing\n- Static code analysis\n- Dependency vulnerability scanning\n- OWASP top 10 compliance\n\nWould you like me to prepare a detailed testing plan for a specific part of your application?`,
            agentType: AgentType.MANAGER,
          });
        }, 3000);
        return true;
      }
    }
    
    // Task prioritization message
    if (message.toLowerCase().includes("prioritize tasks")) {
      if (!isAgentTyping) {
        setIsAgentTyping(true);
        setTimeout(() => {
          setIsAgentTyping(false);
          addMessage({
            type: "agent",
            content: `# Task Prioritization\n\nLet's organize your project tasks by priority, considering dependencies and business impact:\n\n## High Priority (Sprint 1)\n1. User authentication system\n2. Core database schema design\n3. Basic UI framework implementation\n4. API endpoints for critical features\n\n## Medium Priority (Sprint 2)\n1. Secondary features implementation\n2. Refinement of user flows\n3. Performance optimization\n4. Basic analytics integration\n\n## Lower Priority (Sprint 3+)\n1. Advanced features\n2. UI polish and animations\n3. Additional platform support\n4. Extended analytics\n\nWould you like me to help create a detailed schedule with time estimates for these tasks?`,
            agentType: AgentType.MANAGER,
          });
        }, 3000);
        return true;
      }
    }
    
    // Example project message
    if (message.toLowerCase().includes("example") && 
        message.toLowerCase().includes("project")) {
      if (!isAgentTyping) {
        setIsAgentTyping(true);
        setTimeout(() => {
          setIsAgentTyping(false);
          addMessage({
            type: "agent",
            content: `# Example E-Commerce Project\n\nI've loaded an example e-commerce project template for you. This includes:\n\n## Key Features\n- Product catalog with categories and search\n- User authentication and profiles\n- Shopping cart functionality\n- Checkout process with payment integration\n- Order history and tracking\n\n## Technical Components\n- Responsive design with Tailwind CSS\n- React frontend with shadcn/ui components\n- RESTful API design\n- Database schema for products, users, orders\n\n## Next Steps\n1. Customize the product catalog\n2. Configure payment processing\n3. Set up the database\n4. Implement the frontend UI\n\nWould you like me to explain more about any specific part of this project?`,
            agentType: AgentType.MANAGER,
          });
          
          // Add follow-up suggestions
          addSuggestion({
            title: "Customize Example Project",
            description: "How would you like to customize this example project?",
            options: [
              {
                id: "product-catalog",
                label: "Customize product catalog",
                message: "I'd like to customize the product catalog structure",
                icon: "database",
                description: "Define product categories and attributes"
              },
              {
                id: "payment-integration",
                label: "Payment integration",
                message: "Let's configure the payment processing system",
                icon: "shield",
                description: "Set up secure payment processing"
              },
              {
                id: "ui-customization",
                label: "UI customization",
                message: "I want to customize the UI design",
                icon: "layout",
                description: "Personalize the look and feel of the application"
              },
              {
                id: "deployment",
                label: "Deployment setup",
                message: "Help me set up deployment for this project",
                icon: "code",
                description: "Configure CI/CD and hosting"
              }
            ]
          });
        }, 3000);
        return true;
      }
    }
    
    return false; // No specific action was taken
  };

  const processMessage = async (message: string, files?: File[]) => {
    if (isProcessing || (!message.trim() && (!files || files.length === 0))) return;
    
    setIsAgentTyping(true);
    setIsProcessing(true);
    
    try {
      // Clear previous suggestions when processing a new message
      clearSuggestions();
      
      // Check if this message should trigger a specific predefined action
      const isSpecificAction = await handleSpecificActions(message);
      if (isSpecificAction) {
        setIsProcessing(false);
        return;
      }
      
      // If files were provided and it's a markdown file, process it
      let enhancedMessage = message;
      let fileContent = "";
      
      if (files && files.length > 0) {
        const file = files[0];
        console.log("Processing file:", file.name, "type:", file.type);
        
        if (file.name.endsWith('.md') || file.type === 'text/markdown' || file.type === 'text/plain') {
          try {
            // Show typing indicator before processing
            setIsAgentTyping(true);
            
            // Process the file
            fileContent = await processMarkdownFile(file);
            
            if (!fileContent || fileContent.trim() === "") {
              throw new Error("File content is empty");
            }
            
            enhancedMessage = `${message}\n\nHere is the content of the file:\n\n${fileContent}`;
            
            // Add initial processing message
            addMessage({
              type: "agent",
              content: "I'm analyzing your requirements document. This may take a moment...",
              agentType: AgentType.MANAGER,
            });
            
            // Use the manager agent's specialized markdown processor
            console.log("Using manager agent's markdown processor");
            if (!managerAgent.current) {
              managerAgent.current = AgentFactory.createAgent(AgentType.MANAGER) as ManagerAgent;
            }
            
            const managerResponse = await managerAgent.current.processMarkdownFile(fileContent);
            
            if (isMounted.current) {
              // Add a slight delay to simulate processing
              setTimeout(() => {
                setIsAgentTyping(false);
                
                // Add the manager's response
                addMessage({
                  type: "agent",
                  content: managerResponse,
                  agentType: AgentType.MANAGER,
                });
                
                // Generate and add next step suggestions
                const suggestions = generateNextStepSuggestions();
                addSuggestion({
                  title: "Next Steps",
                  description: "Here are some suggested next steps for your project:",
                  options: suggestions
                });
                
                // Add guidance message for next steps
                addMessage({
                  type: "agent",
                  content: "Now that I've analyzed your requirements, you can proceed with one of the suggested next steps above, or ask me any specific questions about the project.",
                  agentType: AgentType.MANAGER,
                });
                
                setIsProcessing(false);
              }, 2000);
            }
            return;
          } catch (error) {
            console.error("Error processing markdown file:", error);
            setIsAgentTyping(false);
            addMessage({
              type: "agent",
              content: "I had trouble reading your markdown file. Please try uploading it again.",
              agentType: AgentType.MANAGER,
            });
            setIsAgentTyping(false);
            setIsProcessing(false);
            return;
          }
        } else {
          console.log("File type not supported for parsing:", file.type);
          setIsAgentTyping(false);
          addMessage({
            type: "agent",
            content: `I notice you uploaded a file (${file.name}) but I can only process markdown (.md) files for project requirements.`,
            agentType: AgentType.MANAGER,
          });
          setIsAgentTyping(false);
          setIsProcessing(false);
          return;
        }
      }
      
      // Determine which agent should handle the message
      const agentType = AgentFactory.determineAgentType(enhancedMessage, []);
      console.log("Selected agent type:", agentType);
      
      // Generate a response using the agent
      const agent = AgentFactory.createAgent(agentType);
      
      // If we have file content, provide it to the agent for processing
      const generatedResponse = await agent.generateResponse(enhancedMessage, []);
      
      if (isMounted.current) {
        // Simulate typing delay for more natural interaction
        const typingDelay = fileContent ? 2000 : 1000; // Longer delay for file processing
        
        setTimeout(() => {
          setIsAgentTyping(false);
          
          // Add agent response to chat with correct type
          addMessage({
            type: "agent",
            content: generatedResponse,
            agentType: agentType,
          });
          
          setIsProcessing(false);
        }, typingDelay);
      }
    } catch (error) {
      console.error("Error processing message:", error);
      toast.error("Failed to process message. Please try again.");
      
      if (isMounted.current) {
        setIsAgentTyping(false);
        // Add error message with correct type
        addMessage({
          type: "agent",
          content: "I'm sorry, I encountered an error while processing your message. Please try again.",
          agentType: AgentType.MANAGER,
        });
        setIsProcessing(false);
      }
    }
  };

  return null; // This component doesn't render anything
}
