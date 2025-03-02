
import React, { useState, useRef, useEffect } from "react";
import { ChatInput } from "./chat-input";
import { ChatMessage } from "./ChatMessage";
import { useChat } from "@/contexts/ChatContext";
import { AgentType } from "@/agents/AgentTypes";
import { FileUploadButton } from "./chat-input/FileUploadButton";
import { ApiSettingsDialog } from "@/components/ApiSettingsDialog";

// Create initial messages template
const initialMessages = [
  {
    type: "agent",
    content: "Hello! I'm DevManager, your AI project manager. How can I help you today?",
    agentType: AgentType.MANAGER
  }
];

export function ChatView() {
  const { messages, addMessage } = useChat();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isLoadingExample, setIsLoadingExample] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const chatRef = useRef<any>(null); // Ref for ChatProcessor methods
  
  useEffect(() => {
    // Simulate loading initial messages
    const loadInitialMessages = async () => {
      // Wait for 0.5 second
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      // Add initial messages
      initialMessages.forEach((message) => {
        addMessage(message);
      });
      
      setIsInitialLoading(false);
    };
    
    loadInitialMessages();
  }, [addMessage]);
  
  useEffect(() => {
    // Scroll to bottom when messages change
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);
  
  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;
    
    addMessage({ type: "user", content: message });
    
    if (chatRef.current && chatRef.current.processUserMessage) {
      await chatRef.current.processUserMessage(message);
    } else {
      console.warn("Chat processor not ready yet.");
      addMessage({ type: 'agent', content: "Chat processor not ready. Please try again.", agentType: AgentType.MANAGER });
    }
  };
  
  const handleStartWithExample = async () => {
    setIsLoadingExample(true);
    
    // Simply add new messages without trying to clear
    addMessage({ type: "user", content: "Let's start with an example project" });
    
    const welcomeWithExample = `Okay, let's start with an example project:

## E-commerce Platform Development

### Project Goal
Develop a fully functional e-commerce platform to sell products online.

### Core Features
- **User Authentication**: Secure user registration and login.
- **Product Catalog**: Browse and search for products.
- **Shopping Cart**: Add, remove, and manage items in a cart.
- **Checkout Process**: Secure payment gateway integration.
- **Order Management**: Track and manage orders.

### Technical Requirements
- **Frontend**: React, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB

### Project Phases
1.  **Setup**: Initialize project and set up development environment.
2.  **User Authentication**: Implement user registration and login.
3.  **Product Catalog**: Develop product browsing and search.
4.  **Shopping Cart**: Implement shopping cart functionality.
5.  **Checkout Process**: Integrate payment gateway.
6.  **Order Management**: Develop order tracking and management.

Let me know if you'd like to proceed with this example!
`;
    
    // Simulate agent response with a delay
    setTimeout(() => {
      addMessage({
        type: "agent",
        content: welcomeWithExample,
        agentType: AgentType.MANAGER,
      });
      setIsLoadingExample(false);
    }, 1500);
  };
  
  const handleFileUpload = async (files: File[]) => {
    if (!files || files.length === 0) {
      console.warn("No files selected.");
      return;
    }
    
    const file = files[0]; // Take the first file
    
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      const fileContent = e.target?.result as string;
      
      addMessage({ type: "user", content: `I've uploaded a requirements document: ${file.name}` });
      
      // Simulate agent response with a delay
      setTimeout(() => {
        addMessage({
          type: "agent",
          content: "I've received and parsed your requirements document. Let me analyze it...",
          agentType: AgentType.MANAGER,
        });
      }, 1500);
      
      // Here you would typically send the fileContent to the AI for processing
      console.log("File content:", fileContent);
    };
    
    reader.onerror = (error) => {
      console.error("Error reading file:", error);
    };
    
    reader.readAsText(file);
  };
  
  return (
    <div className="flex flex-col h-screen">
      <div className="navbar bg-base-100 border-b-2">
        <div className="navbar-start">
          <div className="btn btn-ghost">🌙 / ☀️</div>
        </div>
        <div className="navbar-center">
          <a className="btn btn-ghost normal-case text-xl" href="/">
            DevManager
          </a>
        </div>
        <div className="navbar-end">
          <ApiSettingsDialog />
        </div>
      </div>
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4">
        {isInitialLoading ? (
          <div className="text-center text-gray-500">Loading initial messages...</div>
        ) : (
          messages.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))
        )}
        {isLoadingExample && (
          <div className="text-center text-gray-500">Loading example project...</div>
        )}
      </div>
      <div className="p-4 bg-base-200 border-t-2">
        <div className="flex items-center space-x-4">
          <FileUploadButton onChange={handleFileUpload} />
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoadingExample} />
          <button
            className="btn btn-sm btn-primary"
            onClick={handleStartWithExample}
            disabled={isLoadingExample}
          >
            {isLoadingExample ? "Loading..." : "Start with Example"}
          </button>
        </div>
      </div>
    
      {/* Hidden ChatProcessor component */}
      <div style={{ display: 'none' }}>
        {/* @ts-expect-error */}
        <ChatProcessor chatRef={chatRef} />
      </div>
    </div>
  );
}
