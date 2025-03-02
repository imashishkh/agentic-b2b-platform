
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
  const { messages, addMessage, setIsAgentTyping } = useChat();
  const [isProcessing, setIsProcessing] = useState(false);
  const isMounted = useRef(true);

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
  }, [chatRef]);

  const processMessage = async (message: string, files?: File[]) => {
    if (isProcessing || !message.trim()) return;
    
    // Add user message to chat
    addMessage({
      id: Date.now().toString(),
      content: message,
      sender: "user",
      timestamp: new Date(),
    });
    
    setIsAgentTyping(true);
    setIsProcessing(true);
    
    try {
      // Determine which agent should handle the message
      const agentType = AgentFactory.determineAgentType(message, []);
      
      // Try to use Claude API first
      const claudeResponse = await sendMessageToClaudeAPI(message, agentType);
      
      if (claudeResponse && isMounted.current) {
        // Add agent response to chat
        addMessage({
          id: (Date.now() + 1).toString(),
          content: claudeResponse,
          sender: "agent",
          agentType: agentType,
          timestamp: new Date(),
        });
      } else if (isMounted.current) {
        // Fallback to simulated response if Claude API fails
        const agent = AgentFactory.createAgent(agentType);
        const simulatedResponse = agent.simulateResponse(message, []);
        
        addMessage({
          id: (Date.now() + 1).toString(),
          content: simulatedResponse,
          sender: "agent",
          agentType: agentType,
          timestamp: new Date(),
        });
      }
    } catch (error) {
      console.error("Error processing message:", error);
      toast.error("Failed to process message. Please try again.");
      
      if (isMounted.current) {
        // Add error message
        addMessage({
          id: (Date.now() + 1).toString(),
          content: "I'm sorry, I encountered an error while processing your message. Please try again.",
          sender: "agent",
          agentType: AgentType.MANAGER,
          timestamp: new Date(),
        });
      }
    } finally {
      if (isMounted.current) {
        setIsProcessing(false);
        setIsAgentTyping(false);
      }
    }
  };

  const sendMessageToClaudeAPI = async (message: string, agentType: AgentType) => {
    try {
      // Get API key from local storage
      const apiKey = localStorage.getItem("claude_api_key");
      if (!apiKey) {
        return null;
      }

      const agent = AgentFactory.createAgent(agentType);
      
      // Generate a prompt based on agent type
      let prompt = "";
      if (agentType === AgentType.MANAGER) {
        prompt = `You are DevManager, an AI-powered project manager specialized in software development.
        
        Current message from user: "${message}"
        
        Respond in a clear, well-formatted style with:
        - Proper markdown formatting
        - Well-spaced paragraphs
        - Bullet points where appropriate
        - Headings for different sections
        
        Keep your response helpful, detailed, and professionally formatted.`;
      } else {
        prompt = `You are a specialized ${agentType} agent helping with software development.
        
        Current message from user: "${message}"
        
        Respond in a clear, well-formatted style with:
        - Proper markdown formatting
        - Well-spaced paragraphs
        - Bullet points where appropriate
        - Headings for different sections
        
        Keep your response helpful, detailed, and professionally formatted.`;
      }

      // Make API request to Claude
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify({
          model: "claude-3-opus-20240229",
          max_tokens: 4000,
          messages: [
            {
              role: "user",
              content: prompt
            }
          ]
        })
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Claude API error:", error);
        toast.error(`API Error: ${error.error?.message || "Unknown error occurred"}`);
        return null;
      }

      const data = await response.json();
      return data.content[0].text;
    } catch (error) {
      console.error("Error sending message to Claude API:", error);
      toast.error("Failed to connect to Claude API. Using simulated response instead.");
      return null;
    }
  };

  return null; // This component doesn't render anything
}
