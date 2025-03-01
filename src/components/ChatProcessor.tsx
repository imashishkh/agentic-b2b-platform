
import React, { useEffect } from "react";
import { useChat } from "@/contexts/ChatContext";
import { parseMarkdownToTasks } from "@/utils/projectParser";
import { generateAgentResponse } from "@/utils/responseGenerator";

interface ChatProcessorProps {
  chatRef: React.MutableRefObject<any>;
}

export function ChatProcessor({ chatRef }: ChatProcessorProps) {
  const {
    addMessage,
    setIsAgentTyping,
    setIsFetchingResponse,
    projectPhases,
    hasRequestedFile,
    setProjectPhases,
    setHasRequestedFile
  } = useChat();

  // Process the user's message and generate an agent response
  const processUserMessage = async (userMessage: string) => {
    // Add user message to chat
    addMessage({ type: "user", content: userMessage });
    
    // Show typing indicator
    setIsAgentTyping(true);
    
    try {
      // Check if this is the first user message and they didn't upload a file
      if (hasRequestedFile && 
          !userMessage.includes("```markdown") && 
          !userMessage.includes("```md") &&
          !userMessage.toLowerCase().includes(".md")) {
        
        // They didn't provide a markdown file, so ask if they want to create a structured plan
        setTimeout(() => {
          addMessage({ 
            type: "agent", 
            content: "I notice you haven't uploaded a markdown file. Would you like me to help you create a structured development plan based on our conversation? I can break down your e-commerce requirements into phases and specific tasks. Let's start by discussing the core features you need."
          });
          setHasRequestedFile(false);
          setIsAgentTyping(false);
        }, 1000);
        return;
      }
      
      // Check if this is a markdown parsing request
      if (userMessage.includes("```markdown") || 
          userMessage.includes("```md") || 
          userMessage.toLowerCase().includes(".md")) {
        
        let markdownContent = userMessage;
        
        // Extract markdown content from the message if it's not the entire message
        if (userMessage.includes("```markdown") || userMessage.includes("```md")) {
          const regex = /```(?:markdown|md)?\s*([\s\S]*?)```/;
          const match = userMessage.match(regex);
          if (match && match[1]) {
            markdownContent = match[1];
          }
        }
        
        setHasRequestedFile(false);
        setIsFetchingResponse(true);
        
        try {
          const result = await parseMarkdownToTasks(markdownContent);
          setProjectPhases(result.phases);
          
          setTimeout(() => {
            addMessage({ type: "agent", content: result.response });
            
            // Follow-up question about the breakdown
            setTimeout(() => {
              addMessage({ 
                type: "agent", 
                content: "Now that we have the project broken down, which phase or specific task would you like to discuss in more detail? I can provide technical advice, implementation strategies, or suggest resources for any part of the project."
              });
              setIsAgentTyping(false);
            }, 1000);
          }, 1000);
        } catch (error) {
          console.error("Error parsing markdown:", error);
          addMessage({ 
            type: "agent", 
            content: "I encountered an error while parsing your markdown. Please check the format and try again." 
          });
          setIsAgentTyping(false);
        } finally {
          setIsFetchingResponse(false);
        }
        return;
      }
      
      // Regular response flow
      try {
        const response = await generateAgentResponse(userMessage, projectPhases);
        
        setTimeout(() => {
          addMessage({ type: "agent", content: response });
          setIsAgentTyping(false);
        }, 1000);
      } catch (error) {
        console.error("Error generating response:", error);
        addMessage({ 
          type: "agent", 
          content: "I encountered an error processing your message. Please try again." 
        });
        setIsAgentTyping(false);
      }
    } catch (error) {
      console.error("Error processing message:", error);
      setIsAgentTyping(false);
      addMessage({ 
        type: "agent", 
        content: "I encountered an error processing your message. Please try again." 
      });
    }
  };

  // Expose the processUserMessage method to the parent component via the ref
  useEffect(() => {
    if (chatRef) {
      chatRef.current = {
        processUserMessage
      };
    }
  }, [chatRef, projectPhases, hasRequestedFile]);

  return null;
}
