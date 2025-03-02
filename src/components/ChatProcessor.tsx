
import React, { useState, useEffect, useRef } from "react";
import { useChat } from "@/contexts/ChatContext";
import { AgentType } from "@/agents/AgentTypes";
import * as AgentFactory from "@/agents/AgentFactory";
import { toast } from "sonner";
import { ManagerAgent } from "@/agents/ManagerAgent";

// Define the correct interface with chatRef
export interface ChatProcessorProps {
  chatRef: React.MutableRefObject<any>;
}

export function ChatProcessor({ chatRef }: ChatProcessorProps) {
  const { addMessage, setIsAgentTyping, messages, addSuggestion } = useChat();
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
    if (chatRef) {
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
        }
      }, 1500);
    }
  }, [chatRef, addMessage, messages, setIsAgentTyping]);

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

  const processMessage = async (message: string, files?: File[]) => {
    if (isProcessing || !message.trim() && (!files || files.length === 0)) return;
    
    setIsAgentTyping(true);
    setIsProcessing(true);
    
    try {
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
            enhancedMessage = `${message}\n\nHere is the content of the file:\n\n${fileContent}`;
            
            // Add initial processing message
            addMessage({
              type: "agent",
              content: "I'm analyzing your requirements document. This may take a moment...",
              agentType: AgentType.MANAGER,
            });
            
            // Use the manager agent's specialized markdown processor
            console.log("Using manager agent's markdown processor");
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
