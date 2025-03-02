
import React, { useRef, useState } from "react";
import ChatView from "@/components/ChatView";
import { useChat } from "@/contexts/ChatContext";
import { toast } from "sonner";
import { ChatProcessor } from "@/components/ChatProcessor";
import { AgentType } from "@/agents/AgentTypes";
import { ChatInput } from "@/components/chat-input";
import { Trash2, Download, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ChatContainer() {
  const { 
    messages, 
    addMessage, 
    clearMessages, 
    isAgentTyping, 
    isLoadingExample,
    setIsAgentTyping
  } = useChat();

  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const chatRef = useRef<{ processUserMessage: (message: string, files?: File[]) => void }>(null);
  
  const handleSendMessage = async (message: string) => {
    try {
      if (message.trim() === "") return;
      
      // First, add the user message to the chat
      await addMessage({
        content: message,
        type: "user",
      });
      
      if (chatRef.current) {
        // Process the message using our ChatProcessor
        chatRef.current.processUserMessage(message, files.length > 0 ? files : undefined);
        
        if (files.length > 0) {
          toast.success(`Processing message with ${files.length} file(s)`);
          setFiles([]);
        }
      } else {
        console.error("ChatProcessor reference is not available");
        // Fallback simple response if ChatProcessor isn't available
        setIsAgentTyping(true);
        setTimeout(() => {
          addMessage({
            type: "agent",
            agentType: AgentType.MANAGER,
            content: "I'm processing your request. How can I assist you further with your project?"
          });
          setIsAgentTyping(false);
        }, 2000);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
      setIsAgentTyping(false);
    }
  };
  
  const handleClearFiles = () => {
    setFiles([]);
  };

  const handleFileInputChange = (selectedFiles: File[]) => {
    if (selectedFiles.length > 0) {
      setFiles(selectedFiles);
      setIsUploading(true);
      
      // Simulate file upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        
        if (progress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            handleFileUpload(selectedFiles);
            setIsUploading(false);
            setUploadProgress(0);
          }, 500);
        }
      }, 200);
    }
  };
  
  const handleFileUpload = (files: File[]) => {
    if (files.length > 0) {
      addMessage({
        type: "user",
        content: `Uploaded ${files.map(f => f.name).join(", ")}`,
      });
      
      // Process the file with minimal message text
      if (chatRef.current) {
        chatRef.current.processUserMessage("Please analyze this file.", files);
      } else {
        // Fallback if ChatProcessor isn't available
        setIsAgentTyping(true);
        setTimeout(() => {
          addMessage({
            type: "agent",
            agentType: AgentType.MANAGER,
            content: "I've received your files. I'll analyze them and get back to you with my findings.",
          });
          setIsAgentTyping(false);
          toast.success(`${files.length} file(s) received`);
        }, 3000);
      }
    }
  };
  
  const handleStartWithExample = () => {
    toast.info("Starting with example project");
    // Add example project message
    addMessage({
      type: "user",
      content: "I want to start with an example e-commerce project",
    });
    
    if (chatRef.current) {
      chatRef.current.processUserMessage("I want to start with an example e-commerce project");
    } else {
      // Fallback if ChatProcessor isn't available
      setIsAgentTyping(true);
      setTimeout(() => {
        addMessage({
          type: "agent",
          agentType: AgentType.MANAGER,
          content: "I've loaded an example e-commerce project for you. This includes a standard product catalog, shopping cart, and checkout flow. Would you like me to explain the architecture or should we customize it to your needs?",
        });
        setIsAgentTyping(false);
      }, 2500);
    }
  };
  
  const handleClearChat = () => {
    clearMessages();
    toast.success("Chat cleared");
    
    // Add welcome message after clearing
    setTimeout(() => {
      addMessage({
        type: "agent",
        agentType: AgentType.MANAGER,
        content: "Hello! I'm DevManager, your AI project manager. How can I help you today?",
      });
    }, 300);
  };

  const handleDownload = () => {
    toast.info("Downloading chat history");
    
    // Create a text file with current conversation
    const text = "Chat Export\n\n" + new Date().toLocaleString();
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `chat-export-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const handleHelp = () => {
    toast.info("Opening help dialog", {
      description: "This feature is still in development."
    });
  };
  
  return (
    <div className="flex flex-col h-full relative">
      <div className="flex-1 overflow-hidden">
        <ChatView />
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 border-t backdrop-blur-sm py-2 shadow-md z-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-between mb-1.5">
            <div className="flex items-center gap-1">
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={handleClearChat}
                className="text-gray-500 hover:text-red-500 h-8 w-8 p-0"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              
              <Button 
                size="sm" 
                variant="ghost"
                className="text-gray-500 hover:text-blue-500 h-8 w-8 p-0"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4" />
              </Button>
              
              <Button 
                size="sm" 
                variant="ghost"
                className="text-gray-500 hover:text-blue-500 h-8 w-8 p-0"
                onClick={handleHelp}
              >
                <HelpCircle className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <ChatInput 
            onSendMessage={handleSendMessage}
            files={files}
            onClearFiles={handleClearFiles}
            isUploading={isUploading}
            uploadProgress={uploadProgress}
            handleFileUpload={() => {
              if (fileInputRef.current) {
                fileInputRef.current.click();
              }
            }}
            isDisabled={isLoadingExample || isAgentTyping}
          />
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleFileInputChange(Array.from(e.target.files));
              }
            }}
            className="hidden"
            multiple
            accept=".md,.markdown,.txt,.pdf"
          />
        </div>
      </div>
      <ChatProcessor chatRef={chatRef} />
    </div>
  );
}
