
import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { ChatMessage, ChatMessageProps } from "./ChatMessage";
import { toast } from "sonner";

// Enhanced backstory for the agent
const agentBackstory = `
# DevManager AI Agent

## Background
I'm an AI development manager with extensive experience in building e-commerce platforms. I've led teams that built platforms like Shopify, WooCommerce, and custom solutions for Fortune 500 retailers. My expertise spans:

- Frontend development with React, Vue, and Angular
- Backend systems with Node.js, Python, and Java
- Payment processing integration (Stripe, PayPal, etc.)
- Inventory management systems
- User authentication and personalization
- Search and recommendation engines
- Mobile-responsive design
- Analytics and reporting dashboards

## Approach
I believe in an iterative development process that starts with core functionality and expands based on user feedback. I'll help break down your project into manageable sprints and prioritize features based on business impact.

## Specialties
- Converting business requirements into technical specifications
- Identifying potential scalability challenges early
- Recommending optimal tech stacks for specific e-commerce needs
- Breaking complex projects into achievable milestones
`;

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

interface ChatProps {
  chatRef: React.MutableRefObject<any>;
}

export function Chat({ chatRef }: ChatProps) {
  const [messages, setMessages] = useState<ChatMessageProps[]>(initialMessages);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const [isFetchingResponse, setIsFetchingResponse] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Add a new message to the chat
  const addMessage = (message: ChatMessageProps) => {
    setMessages(prev => [...prev, message]);
  };

  // Parse markdown content from a string or file
  const parseMarkdownToTasks = async (markdown: string) => {
    try {
      setIsFetchingResponse(true);
      
      // Simple markdown task extraction (headers become task categories, list items become tasks)
      const tasks: { category: string; items: string[] }[] = [];
      let currentCategory = "General";
      let currentItems: string[] = [];
      
      markdown.split('\n').forEach(line => {
        const trimmedLine = line.trim();
        
        // Check for headers
        if (trimmedLine.startsWith('# ')) {
          // If we have items in the current category, save them
          if (currentItems.length > 0) {
            tasks.push({ category: currentCategory, items: [...currentItems] });
            currentItems = [];
          }
          currentCategory = trimmedLine.substring(2);
        } 
        // Check for h2 headers
        else if (trimmedLine.startsWith('## ')) {
          // If we have items in the current category, save them
          if (currentItems.length > 0) {
            tasks.push({ category: currentCategory, items: [...currentItems] });
            currentItems = [];
          }
          currentCategory = trimmedLine.substring(3);
        }
        // Check for list items
        else if (trimmedLine.startsWith('- ') || trimmedLine.match(/^\d+\. /)) {
          // Extract the task content (remove the list marker)
          const taskContent = trimmedLine.replace(/^- /, '').replace(/^\d+\. /, '');
          currentItems.push(taskContent);
        }
      });
      
      // Add any remaining items
      if (currentItems.length > 0) {
        tasks.push({ category: currentCategory, items: [...currentItems] });
      }
      
      setIsFetchingResponse(false);
      
      // Format the extracted tasks as a message
      let taskMessage = "I've analyzed the markdown and extracted these tasks:\n\n";
      
      tasks.forEach(({ category, items }) => {
        taskMessage += `**${category}**\n`;
        items.forEach((item, index) => {
          taskMessage += `${index + 1}. ${item}\n`;
        });
        taskMessage += '\n';
      });
      
      return taskMessage;
    } catch (error) {
      console.error("Error parsing markdown:", error);
      setIsFetchingResponse(false);
      return "I encountered an error parsing the markdown. Please check the format and try again.";
    }
  };

  // Process the user's message and generate an agent response
  const processUserMessage = async (userMessage: string) => {
    // Add user message to chat
    addMessage({ type: "user", content: userMessage });
    
    // Show typing indicator
    setIsAgentTyping(true);
    
    try {
      // Check if this is a markdown parsing request
      if (userMessage.toLowerCase().includes("parse markdown") || 
          userMessage.toLowerCase().includes("convert markdown") || 
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
        
        const taskList = await parseMarkdownToTasks(markdownContent);
        setTimeout(() => {
          addMessage({ type: "agent", content: taskList });
          setIsAgentTyping(false);
        }, 1000);
        return;
      }
      
      // Regular response flow
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
  React.useEffect(() => {
    if (chatRef) {
      chatRef.current = {
        processUserMessage
      };
    }
  }, [chatRef, questionIndex]);

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
