import React, { useState, useEffect, useRef } from "react";
import { useChat } from "@/contexts/ChatContext";
import { AgentType } from "@/agents/AgentTypes";
import { AgentFactory } from "@/agents/AgentFactory";
import { toast } from "sonner";

export interface ChatProcessorProps {
  message: string;
  onResponse: (response: string) => void;
  agentType: AgentType;
}

export function ChatProcessor({ message, onResponse, agentType }: ChatProcessorProps) {
  const { conversationContext, updateConversationContext } = useChat();
  const [isProcessing, setIsProcessing] = useState(false);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (message && !isProcessing) {
      processMessage();
    }
  }, [message]);

  const processMessage = async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    try {
      // Try to use Claude API first
      const claudeResponse = await sendMessageToClaudeAPI(message, agentType);
      
      if (claudeResponse && isMounted.current) {
        onResponse(claudeResponse);
      } else if (isMounted.current) {
        // Fallback to simulated response if Claude API fails
        const simulatedResponse = simulateResponse(message, agentType);
        onResponse(simulatedResponse);
      }
    } catch (error) {
      console.error("Error processing message:", error);
      if (isMounted.current) {
        const simulatedResponse = simulateResponse(message, agentType);
        onResponse(simulatedResponse);
      }
    } finally {
      if (isMounted.current) {
        setIsProcessing(false);
      }
    }
  };

  const sendMessageToClaudeAPI = async (message: string, agentType: AgentType) => {
    try {
      // Get API key from local storage
      const apiKey = localStorage.getItem("claude_api_key");
      if (!apiKey) {
        toast.error("Claude API key not found. Please add your API key in settings.");
        return null;
      }

      const agent = AgentFactory.createAgent(agentType);
      
      // Use the appropriate method for creating prompts based on agent type
      let prompt = "";
      if (agentType === AgentType.MANAGER) {
        // Manager agent has its own specific prompt format
        prompt = agent.generatePrompt(message, conversationContext);
      } else {
        // Other agents use a standardized prompt format
        prompt = agent.generateSpecializedPrompt(message, conversationContext);
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

  const simulateResponse = (message: string, agentType: AgentType): string => {
    const agent = AgentFactory.createAgent(agentType);
    return agent.simulateResponse(message, conversationContext);
  };

  return null; // This component doesn't render anything
}
