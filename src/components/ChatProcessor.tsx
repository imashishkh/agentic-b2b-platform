
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
      type: "user",
      content: message,
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
          type: "agent",
          content: claudeResponse,
          agentType: agentType,
        });
      } else if (isMounted.current) {
        // Fallback to agent response generation
        const agent = AgentFactory.createAgent(agentType);
        const generatedResponse = await agent.generateResponse(message, []);
        
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
        // Add error message
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

  const sendMessageToClaudeAPI = async (message: string, agentType: AgentType) => {
    try {
      // Get API key from local storage
      const apiKey = localStorage.getItem("claude_api_key");
      if (!apiKey) {
        toast.warning("Claude API key is not set", {
          description: "Using simulated responses. Set your API key in settings for enhanced responses.",
          duration: 5000
        });
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
        
        let errorMessage = error.error?.message || "Unknown error occurred";
        let specificMsg = "";
        
        // Check for common error types
        if (errorMessage.includes("authentication")) {
          specificMsg = "Please check if your API key is valid";
        } else if (errorMessage.includes("rate limit")) {
          specificMsg = "You've reached your rate limit. Try again later";
        }
        
        toast.error(`Claude API Error: ${errorMessage}`, {
          description: specificMsg,
          duration: 8000
        });
        return null;
      }

      const data = await response.json();
      return data.content[0].text;
    } catch (error) {
      console.error("Error sending message to Claude API:", error);
      toast.error("Failed to connect to Claude API", {
        description: "Using simulated response instead. Please check your internet connection or API key.",
        duration: 5000
      });
      return null;
    }
  };

  return null; // This component doesn't render anything
}
