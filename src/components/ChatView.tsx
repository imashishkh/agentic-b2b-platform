
import React, { useState, useRef } from "react";
import { useChat } from "@/contexts/ChatContext";
import { AgentType } from "@/agents/AgentTypes";
import { ApiSettings } from "@/components/ApiSettings";
import { ChatProcessor } from "./ChatProcessor";
import { ProjectFeaturesPanel } from "./project/ProjectFeaturesPanel";
import { ChatHeader } from "./chat/ChatHeader";
import { ChatMessages } from "./chat/ChatMessages";
import { ChatFooter } from "./chat/ChatFooter";

export function ChatView() {
  const { messages, addMessage, clearMessages, isAgentTyping } = useChat();
  const [isLoadingExample, setIsLoadingExample] = useState(false);
  const [showApiSettings, setShowApiSettings] = useState(false);
  const [showProjectPanel, setShowProjectPanel] = useState(false);
  const chatRef = useRef<any>(null);
  
  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;
    
    addMessage({ type: "user", content: message });
    
    if (chatRef.current && chatRef.current.processUserMessage) {
      await chatRef.current.processUserMessage(message);
    } else {
      console.warn("Chat processor not ready yet.");
      addMessage({ 
        type: 'agent', 
        content: "Chat processor not ready. Please try again.", 
        agentType: AgentType.MANAGER 
      });
    }
  };
  
  const handleStartWithExample = async () => {
    setIsLoadingExample(true);
    clearMessages(); // Clear existing messages
    
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
    
    setTimeout(() => {
      addMessage({
        type: "agent",
        content: welcomeWithExample,
        agentType: AgentType.MANAGER,
      });
      setIsLoadingExample(false);
    }, 1500);
  };
  
  const handleFileUpload = (files: File[]) => {
    if (!files || files.length === 0) {
      console.warn("No files selected.");
      return;
    }
    
    const file = files[0]; // Take the first file
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const fileContent = e.target?.result as string;
      
      addMessage({ type: "user", content: `I've uploaded a requirements document: ${file.name}` });
      
      setTimeout(() => {
        addMessage({
          type: "agent",
          content: "I've received and parsed your requirements document. Let me analyze it...",
          agentType: AgentType.MANAGER,
        });
      }, 1500);
      
      console.log("File content:", fileContent);
    };
    
    reader.onerror = (error) => {
      console.error("Error reading file:", error);
    };
    
    reader.readAsText(file);
  };

  const handleClearChat = () => {
    if (confirm("Are you sure you want to clear all messages?")) {
      clearMessages();
    }
  };
  
  return (
    <div className="flex flex-col h-screen bg-background">
      <ChatHeader 
        setShowApiSettings={setShowApiSettings}
        showProjectPanel={showProjectPanel}
        setShowProjectPanel={setShowProjectPanel}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <ChatMessages 
          messages={messages}
          isLoadingExample={isLoadingExample}
          isAgentTyping={isAgentTyping}
        />
        
        {showProjectPanel && (
          <div className="w-80 border-l bg-background overflow-y-auto">
            <ProjectFeaturesPanel />
          </div>
        )}
      </div>
      
      <ChatFooter 
        onSendMessage={handleSendMessage}
        handleFileUpload={handleFileUpload}
        handleStartWithExample={handleStartWithExample}
        handleClearChat={handleClearChat}
        isLoadingExample={isLoadingExample}
        isAgentTyping={isAgentTyping}
      />
      
      {showApiSettings && (
        <ApiSettings onClose={() => setShowApiSettings(false)} />
      )}
      
      <div style={{ display: 'none' }}>
        <ChatProcessor chatRef={chatRef} />
      </div>
    </div>
  );
}
