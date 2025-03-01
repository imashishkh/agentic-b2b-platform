
import React, { useState, useEffect, useRef } from "react";
import { ChatMessage, ChatMessageProps } from "./ChatMessage";
import { toast } from "sonner";
import { searchInternet, askClaude } from "@/utils/aiServices";

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
    content: "Hello! I'm your project manager agent for building an e-commerce platform. Could you please upload a markdown file with your project requirements? Alternatively, you can describe your project and I'll help organize it into phases and tasks."
  }
];

interface ChatProps {
  chatRef: React.MutableRefObject<any>;
}

export function Chat({ chatRef }: ChatProps) {
  const [messages, setMessages] = useState<ChatMessageProps[]>(initialMessages);
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const [isFetchingResponse, setIsFetchingResponse] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [projectPhases, setProjectPhases] = useState<any[]>([]);
  const [hasRequestedFile, setHasRequestedFile] = useState(true);

  // Add a new message to the chat
  const addMessage = (message: ChatMessageProps) => {
    setMessages(prev => [...prev, message]);
  };

  // Parse markdown content from a string or file
  const parseMarkdownToTasks = async (markdown: string) => {
    try {
      setIsFetchingResponse(true);
      
      // First, ask Claude (or simulated LLM) to help structure the content
      const promptForClaude = `
        I have a markdown file with e-commerce project requirements. Please analyze it and structure it into development phases and specific tasks. 
        Break it down into logical sprints or milestones. For each task, include:
        1. Task name/description
        2. Estimated complexity (Low/Medium/High)
        3. Dependencies on other tasks if applicable
        
        Here's the markdown content:
        
        ${markdown}
      `;
      
      const claudeResponse = await askClaude(promptForClaude);
      
      // Now use the internet search to find relevant resources
      const searchQuery = "Best practices for implementing " + 
        extractKeyFeatures(markdown) + " in an e-commerce platform";
      const searchResults = await searchInternet(searchQuery);
      
      // Combine the Claude analysis with search results
      const enhancedResponse = `
        ## Project Analysis and Task Breakdown
        
        ${claudeResponse}
        
        ## Relevant Resources and Best Practices
        
        ${searchResults}
      `;
      
      setIsFetchingResponse(false);
      
      // Update project phases based on the analysis
      const extractedPhases = extractPhasesFromResponse(enhancedResponse);
      setProjectPhases(extractedPhases);
      
      return enhancedResponse;
    } catch (error) {
      console.error("Error parsing markdown:", error);
      setIsFetchingResponse(false);
      return "I encountered an error parsing the markdown. Please check the format and try again.";
    }
  };
  
  // Helper function to extract key features from markdown for search
  const extractKeyFeatures = (markdown: string): string => {
    // Look for common e-commerce features in the markdown
    const features = [];
    
    if (markdown.toLowerCase().includes("payment")) features.push("payment processing");
    if (markdown.toLowerCase().includes("product") && markdown.toLowerCase().includes("catalog")) 
      features.push("product catalog");
    if (markdown.toLowerCase().includes("cart") || markdown.toLowerCase().includes("checkout")) 
      features.push("shopping cart and checkout");
    if (markdown.toLowerCase().includes("user") && markdown.toLowerCase().includes("account")) 
      features.push("user accounts");
    if (markdown.toLowerCase().includes("search")) features.push("search functionality");
    if (markdown.toLowerCase().includes("review")) features.push("product reviews");
    
    return features.length > 0 ? features.join(", ") : "e-commerce platform features";
  };
  
  // Helper function to extract phases from the LLM response
  const extractPhasesFromResponse = (response: string): any[] => {
    // This is a simplified implementation - in a real app, 
    // you would have more sophisticated parsing
    const phases = [];
    
    // Look for headings that might indicate phases
    const phaseRegex = /##\s+(Phase|Sprint|Milestone)\s+(\d+|[IVX]+):\s*([^\n]+)/gi;
    let phaseMatch;
    
    while ((phaseMatch = phaseRegex.exec(response)) !== null) {
      const phaseName = phaseMatch[3];
      const phaseContent = response.slice(phaseMatch.index + phaseMatch[0].length);
      const endIndex = phaseContent.search(/##\s+(Phase|Sprint|Milestone)/i);
      
      const phaseText = endIndex !== -1 ? 
        phaseContent.slice(0, endIndex) : 
        phaseContent;
      
      // Extract tasks from the phase content
      const tasks = [];
      const taskRegex = /-\s+([^\n]+)/g;
      let taskMatch;
      
      while ((taskMatch = taskRegex.exec(phaseText)) !== null) {
        tasks.push(taskMatch[1]);
      }
      
      phases.push({
        name: phaseName,
        tasks: tasks
      });
    }
    
    return phases;
  };

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
        const taskList = await parseMarkdownToTasks(markdownContent);
        setTimeout(() => {
          addMessage({ type: "agent", content: taskList });
          
          // Follow-up question about the breakdown
          setTimeout(() => {
            addMessage({ 
              type: "agent", 
              content: "Now that we have the project broken down, which phase or specific task would you like to discuss in more detail? I can provide technical advice, implementation strategies, or suggest resources for any part of the project."
            });
            setIsAgentTyping(false);
          }, 1000);
        }, 1000);
        return;
      }
      
      // Regular response flow
      // If we have project phases, provide context-aware responses
      if (projectPhases.length > 0) {
        // Use Claude (or simulated LLM) to generate a response based on the context
        const promptForClaude = `
          The user is asking about their e-commerce project with the following phases:
          ${JSON.stringify(projectPhases)}
          
          Their message is: "${userMessage}"
          
          Please provide a helpful, technical response that references the project structure above.
          Focus on implementation details, technical considerations, and actionable advice.
        `;
        
        const claudeResponse = await askClaude(promptForClaude);
        
        setTimeout(() => {
          addMessage({ type: "agent", content: claudeResponse });
          setIsAgentTyping(false);
        }, 1000);
      } else {
        // Generic response when we don't have structured project information yet
        const claudeResponse = await askClaude(userMessage);
        
        setTimeout(() => {
          addMessage({ type: "agent", content: claudeResponse });
          setIsAgentTyping(false);
        }, 1000);
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
  React.useEffect(() => {
    if (chatRef) {
      chatRef.current = {
        processUserMessage
      };
    }
  }, [chatRef, projectPhases, hasRequestedFile]);

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
