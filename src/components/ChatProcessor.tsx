
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
  const { addMessage, setIsAgentTyping } = useChat();
  const [isProcessing, setIsProcessing] = useState(false);
  const isMounted = useRef(true);
  const hasInitialMessage = useRef(false); // Add a flag to track initial message

  useEffect(() => {
    isMounted.current = true;
    
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Expose the message processing method through the ref
  useEffect(() => {
    if (chatRef) {
      chatRef.current = {
        processUserMessage: processMessage
      };
    }
    
    // Add a single welcome message only if no messages exist
    if (!hasInitialMessage.current) {
      hasInitialMessage.current = true;
      // Add a welcome message
      setTimeout(() => {
        if (isMounted.current) {
          addMessage({
            type: "agent",
            content: "Hello! I'm DevManager, your AI project manager. How can I help you today?",
            agentType: AgentType.MANAGER,
          });
        }
      }, 500);
    }
  }, [chatRef, addMessage]);

  const processMessage = async (message: string, files?: File[]) => {
    if (isProcessing || !message.trim()) return;
    
    setIsAgentTyping(true);
    setIsProcessing(true);
    
    try {
      // Determine which agent should handle the message
      const agentType = AgentFactory.determineAgentType(message, []);
      
      // Generate a response using the agent
      const agent = AgentFactory.createAgent(agentType);
      const generatedResponse = await agent.generateResponse(message, []);
      
      if (isMounted.current) {
        // Add agent response to chat with correct type
        addMessage({
          type: "agent",
          content: generatedResponse,
          agentType: agentType,
        });
      }
    } catch (error) {
      console.error("Error processing message:", error);
      toast.error("Failed to process message. Please try again.");
      
      if (isMounted.current) {
        // Add error message with correct type
        addMessage({
          type: "agent",
          content: "I'm sorry, I encountered an error while processing your message. Please try again.",
          agentType: AgentType.MANAGER,
        });
      }
    } finally {
      if (isMounted.current) {
        setIsProcessing(false);
        setIsAgentTyping(false);
      }
    }
  };

  return null; // This component doesn't render anything
}
