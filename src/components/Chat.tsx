
import React, { useState, useEffect, useRef } from "react";
import { ChatMessage, ChatMessageProps } from "./ChatMessage";

// Initial messages to bootstrap the conversation
const initialMessages: ChatMessageProps[] = [
  {
    type: "agent",
    content: "Hello! I'm your project manager agent. I'll help guide you through building an e-commerce platform. Shall we start by defining the core requirements?"
  }
];

// Set of questions the agent will ask in sequence
const nextQuestions = [
  "What type of products do you want to focus on for your e-commerce platform?",
  "Do you want to include both buyer and seller interfaces like Alibaba?",
  "What payment methods would you like to support?",
  "What's your preferred design style? Modern, minimal, colorful, etc?",
  "Would you like to include features for international shipping and multiple currencies?",
  "Should we prioritize mobile responsiveness or desktop experience first?",
];

export function Chat() {
  const [messages, setMessages] = useState<ChatMessageProps[]>(initialMessages);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Add a new message to the chat
  const addMessage = (message: ChatMessageProps) => {
    setMessages(prev => [...prev, message]);
  };

  // Process the user's message and generate an agent response
  const processUserMessage = (userMessage: string) => {
    // Add user message to chat
    addMessage({ type: "user", content: userMessage });
    
    // Show typing indicator
    setIsAgentTyping(true);
    
    // Simulate "thinking" time
    setTimeout(() => {
      // Add agent response
      if (questionIndex < nextQuestions.length) {
        addMessage({ type: "agent", content: nextQuestions[questionIndex] });
        setQuestionIndex(questionIndex + 1);
      } else {
        // If we've gone through all predefined questions, provide a summary
        addMessage({ 
          type: "agent", 
          content: "Thank you for all this information! This gives us a great foundation to start planning your e-commerce platform. Let's start breaking down the technical components we'll need to implement." 
        });
      }
      setIsAgentTyping(false);
    }, 1500);
  };

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-full overflow-y-auto py-4 px-6 space-y-6">
      {/* Messages display */}
      {messages.map((message, index) => (
        <ChatMessage 
          key={index} 
          type={message.type} 
          content={message.content} 
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
  );
}
