
import React, { useEffect } from "react";
import { useChat } from "@/contexts/ChatContext";
import { AgentType } from "@/agents/AgentTypes";
import { createAgent, determineAgentType } from "@/agents/AgentFactory";
import { processMarkdownContent, extractMarkdownFromMessage } from "@/utils/markdownProcessingUtils";
import { useFileProcessor } from "@/hooks/useFileProcessor";
import { useKnowledgeProcessor } from "@/hooks/useKnowledgeProcessor";
import { useChatActions, setGlobalAddMessage, setGlobalSetProjectPhases } from "@/hooks/useChatActions";

/**
 * Props interface for the ChatProcessor component
 */
interface ChatProcessorProps {
  chatRef: React.MutableRefObject<any>;  // Reference to expose methods to parent
}

/**
 * ChatProcessor - Core component that processes user messages and generates agent responses
 * 
 * This component has been refactored to delegate functionality to specialized hooks and utilities
 * while maintaining the same external behavior and interface.
 * 
 * @param chatRef - Reference that exposes the processUserMessage method to parent components
 */
export function ChatProcessor({ chatRef }: ChatProcessorProps) {
  const {
    addMessage,
    setIsAgentTyping,
    setIsFetchingResponse,
    projectPhases,
    hasRequestedFile,
    setProjectPhases,
    setHasRequestedFile,
    setCurrentAgentType,
    knowledgeBase,
    isRequestingKnowledge,
    setIsRequestingKnowledge,
    addArchitectureProposal,
    addTestingStrategy,
    setGitHubRepository
  } = useChat();

  // Set up global action handlers for non-React code
  useEffect(() => {
    setGlobalAddMessage(addMessage);
    setGlobalSetProjectPhases(setProjectPhases);
    
    return () => {
      setGlobalAddMessage(null);
      setGlobalSetProjectPhases(null);
    };
  }, [addMessage, setProjectPhases]);

  // Initialize specialized hooks
  const { processUploadedFiles } = useFileProcessor();
  const { processKnowledgeRequest } = useKnowledgeProcessor();

  /**
   * Process the user's message and generate an agent response
   * This is the main method for handling user inputs
   * 
   * @param userMessage - The text message from the user
   * @param files - Optional array of uploaded files
   */
  const processUserMessage = async (userMessage: string, files?: File[]) => {
    // Add user message to chat
    addMessage({ type: "user", content: userMessage });
    
    // Show typing indicator
    setIsAgentTyping(true);
    
    try {
      // Check if files were uploaded
      if (files && files.length > 0) {
        const fileProcessed = await processUploadedFiles(
          files, 
          setIsAgentTyping, 
          setIsRequestingKnowledge, 
          setIsFetchingResponse,
          setHasRequestedFile
        );
        
        if (fileProcessed) return;
      }
      
      // Check if we're in knowledge base request mode
      if (isRequestingKnowledge) {
        const handled = processKnowledgeRequest(
          userMessage, 
          projectPhases, 
          setIsAgentTyping, 
          setIsRequestingKnowledge
        );
        
        if (handled) return;
      }
      
      // Handle GitHub integration request
      if (userMessage.toLowerCase().includes("github") && 
          (userMessage.toLowerCase().includes("connect") || 
           userMessage.toLowerCase().includes("integration") || 
           userMessage.toLowerCase().includes("repository"))) {
        setTimeout(() => {
          addMessage({ 
            type: "agent", 
            content: "I can help you set up GitHub integration. Please use the 'Show Project Features' button in the top right corner, then navigate to the GitHub tab to connect your repository.",
            agentType: AgentType.MANAGER
          });
          setIsAgentTyping(false);
        }, 1000);
        return;
      }
      
      // Handle architecture proposal request
      if (userMessage.toLowerCase().includes("architecture") && 
          (userMessage.toLowerCase().includes("propose") || 
           userMessage.toLowerCase().includes("suggestion") || 
           userMessage.toLowerCase().includes("plan"))) {
        setTimeout(() => {
          // Create a sample architecture proposal
          const proposal = {
            id: Date.now().toString(),
            title: "E-commerce Platform Architecture",
            description: "Scalable microservices architecture for an e-commerce platform with high availability and security.",
            components: [
              {
                name: "Frontend Client",
                type: "React SPA",
                description: "Single page application built with React, Redux for state management, and Tailwind CSS for styling.",
                dependencies: ["API Gateway"]
              },
              {
                name: "API Gateway",
                type: "Express.js",
                description: "Central gateway for all client requests, handles routing, authentication, and request validation.",
                dependencies: ["User Service", "Product Service", "Order Service"]
              },
              {
                name: "User Service",
                type: "Microservice",
                description: "Handles user authentication, profile management, and permissions.",
                dependencies: ["User Database"]
              },
              {
                name: "Product Service",
                type: "Microservice",
                description: "Manages product catalog, inventory, and product search functionality.",
                dependencies: ["Product Database", "Search Engine"]
              },
              {
                name: "Order Service",
                type: "Microservice",
                description: "Processes orders, payments, and shipping information.",
                dependencies: ["Order Database", "Payment Gateway"]
              }
            ],
            diagram: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmNWY1Ii8+PHRleHQgeD0iNDAwIiB5PSIyMDAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+QXJjaGl0ZWN0dXJlIERpYWdyYW0gUGxhY2Vob2xkZXI8L3RleHQ+PC9zdmc+",
            dateCreated: new Date(),
            approved: false
          };
          
          // Add the proposal to the context
          addArchitectureProposal(proposal);
          
          // Respond to the user
          addMessage({ 
            type: "agent", 
            content: "I've created an architecture proposal for your e-commerce platform. You can view the details by clicking the 'Show Project Features' button in the top right corner, then navigating to the Architecture tab.",
            agentType: AgentType.MANAGER
          });
          setIsAgentTyping(false);
        }, 1500);
        return;
      }
      
      // Handle testing strategy request
      if (userMessage.toLowerCase().includes("testing") && 
          (userMessage.toLowerCase().includes("strategy") || 
           userMessage.toLowerCase().includes("plan") || 
           userMessage.toLowerCase().includes("approach"))) {
        setTimeout(() => {
          // Create a sample testing strategy
          const strategy = {
            id: Date.now().toString(),
            title: "Comprehensive E-commerce Testing Strategy",
            description: "Multi-layered testing approach ensuring functionality, performance, and security of the e-commerce platform.",
            approaches: [
              {
                type: "Unit Testing",
                framework: "Jest",
                coverageGoal: 80,
                description: "Test individual functions and components in isolation with mocked dependencies."
              },
              {
                type: "Integration Testing",
                framework: "Jest + Supertest",
                coverageGoal: 70,
                description: "Verify interactions between components and services work correctly together."
              },
              {
                type: "End-to-End Testing",
                framework: "Cypress",
                coverageGoal: 60,
                description: "Test complete user flows like registration, product search, and checkout from a user perspective."
              },
              {
                type: "Performance Testing",
                framework: "k6",
                description: "Load test critical paths with simulated user traffic to ensure response times remain acceptable."
              },
              {
                type: "Security Testing",
                framework: "OWASP ZAP",
                description: "Automated vulnerability scanning and penetration testing to identify security issues."
              }
            ],
            dateCreated: new Date(),
            approved: false
          };
          
          // Add the strategy to the context
          addTestingStrategy(strategy);
          
          // Respond to the user
          addMessage({ 
            type: "agent", 
            content: "I've created a comprehensive testing strategy for your e-commerce platform. You can view the details by clicking the 'Show Project Features' button in the top right corner, then navigating to the Testing tab.",
            agentType: AgentType.MANAGER
          });
          setIsAgentTyping(false);
        }, 1500);
        return;
      }
      
      // Continue with existing logic for handling text inputs
      
      // Check if this is the first user message and they didn't upload a file
      if (hasRequestedFile && 
          !userMessage.includes("```markdown") && 
          !userMessage.includes("```md") &&
          !userMessage.toLowerCase().includes(".md")) {
        
        // They didn't provide a markdown file, so ask if they want to create a structured plan
        setTimeout(() => {
          addMessage({ 
            type: "agent", 
            content: "I notice you haven't uploaded a markdown file. Would you like me to help you create a structured development plan based on our conversation? I can break down your e-commerce requirements into phases and specific tasks. Let's start by discussing the core features you need.",
            agentType: AgentType.MANAGER
          });
          setHasRequestedFile(false);
          setIsAgentTyping(false);
        }, 1000);
        return;
      }
      
      // Check if this is a markdown parsing request (inline markdown)
      if (userMessage.includes("```markdown") || 
          userMessage.includes("```md") || 
          userMessage.toLowerCase().includes(".md")) {
        
        const markdownContent = extractMarkdownFromMessage(userMessage);
        
        setHasRequestedFile(false);
        await processMarkdownContent(
          markdownContent, 
          setIsAgentTyping, 
          setIsRequestingKnowledge, 
          setIsFetchingResponse
        );
        return;
      }
      
      // Regular response flow - determine the best agent to handle this message
      try {
        // Determine which agent should handle this message
        const agentType = determineAgentType(userMessage, projectPhases);
        
        // Set the current agent type in the context
        setCurrentAgentType(agentType);
        
        // Create the appropriate agent instance
        const agent = createAgent(agentType);
        
        // Generate response using the specialized agent
        const response = await agent.generateResponse(userMessage, projectPhases);
        
        // If this is the manager agent, check if we need to enhance response with knowledge base
        let enhancedResponse = response;
        if (agentType === AgentType.MANAGER && knowledgeBase.length > 0) {
          // Only enhance if the response doesn't already reference the knowledge base
          if (!response.includes("Knowledge Base Resources")) {
            const managerAgent = agent as any;
            if (managerAgent.enhanceResponseWithKnowledgeBase) {
              enhancedResponse = managerAgent.enhanceResponseWithKnowledgeBase(response, knowledgeBase);
            }
          }
        }
        
        setTimeout(() => {
          addMessage({ 
            type: "agent", 
            content: enhancedResponse,
            agentType: agentType
          });
          setIsAgentTyping(false);
        }, 1000);
      } catch (error) {
        console.error("Error generating response:", error);
        addMessage({ 
          type: "agent", 
          content: "I encountered an error processing your message. Please try again.",
          agentType: AgentType.MANAGER
        });
        setIsAgentTyping(false);
      }
    } catch (error) {
      console.error("Error processing message:", error);
      setIsAgentTyping(false);
      addMessage({ 
        type: "agent", 
        content: "I encountered an error processing your message. Please try again.",
        agentType: AgentType.MANAGER
      });
    }
  };

  /**
   * Expose the processUserMessage method to the parent component via the ref
   * This allows the Chat component to trigger message processing
   */
  useEffect(() => {
    if (chatRef) {
      chatRef.current = {
        processUserMessage
      };
    }
  }, [chatRef, projectPhases, hasRequestedFile, isRequestingKnowledge, knowledgeBase]);

  // This component doesn't render anything visible
  return null;
}
