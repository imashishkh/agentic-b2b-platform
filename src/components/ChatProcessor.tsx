
import React, { useState, useEffect, useRef } from "react";
import { useChat } from "@/contexts/ChatContext";
import { AgentType } from "@/agents/AgentTypes";
import * as AgentFactory from "@/agents/AgentFactory";
import { toast } from "sonner";

// Define the correct interface with chatRef
export interface ChatProcessorProps {
  chatRef: React.MutableRefObject<any>;
}

export function ChatProcessor({ chatRef }: ChatProcessorProps) {
  const { addMessage, setIsAgentTyping, messages } = useChat();
  const [isProcessing, setIsProcessing] = useState(false);
  const isMounted = useRef(true);
  const initialMessageSent = useRef(false);

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
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const content = e.target?.result as string;
          resolve(content);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = (error) => {
        reject(error);
      };
      
      reader.readAsText(file);
    });
  };

  const processMessage = async (message: string, files?: File[]) => {
    if (isProcessing || !message.trim()) return;
    
    setIsAgentTyping(true);
    setIsProcessing(true);
    
    try {
      // If files were provided and it's a markdown file, process it
      let enhancedMessage = message;
      let fileContent = "";
      
      if (files && files.length > 0) {
        const file = files[0];
        if (file.name.endsWith('.md') || file.type === 'text/markdown') {
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
        }
      }
      
      // Determine which agent should handle the message
      const agentType = AgentFactory.determineAgentType(enhancedMessage, files || []);
      
      // Generate a response using the agent
      const agent = AgentFactory.createAgent(agentType);
      
      // If we have file content, provide it to the agent for processing
      const generatedResponse = await agent.generateResponse(enhancedMessage, files || []);
      
      if (isMounted.current) {
        // Simulate typing delay for more natural interaction
        const typingDelay = fileContent ? 2000 : 1000; // Longer delay for file processing
        
        setTimeout(() => {
          setIsAgentTyping(false);
          
          // For Markdown files, provide a more detailed response
          if (fileContent) {
            const detailedResponse = `I've analyzed your requirements document. Here's my understanding:

${generatedResponse}

Would you like me to:
1. Break this down into specific tasks and milestones?
2. Suggest a technical stack for implementation?
3. Estimate timeline and resources needed?
4. Something else?`;
            
            // Add agent response to chat with correct type
            addMessage({
              type: "agent",
              content: detailedResponse,
              agentType: agentType,
            });
          } else {
            // Add standard agent response to chat
            addMessage({
              type: "agent",
              content: generatedResponse,
              agentType: agentType,
            });
          }
          
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
