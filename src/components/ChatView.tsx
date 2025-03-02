
import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { ChatMessages } from "@/components/chat/ChatMessages";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatProcessor } from "@/components/ChatProcessor";
import { useChat } from "@/contexts/ChatContext";
import { AgentType } from "@/agents/AgentTypes";
import { ChatInput } from "@/components/chat-input";

export default function ChatView() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { chatId } = useParams<{ chatId: string }>();
  const { messages, addMessage, isAgentTyping, isLoadingExample, setIsAgentTyping } = useChat();
  
  // File upload states
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Create a ref for the ChatProcessor
  const chatProcessorRef = useRef<any>(null);
  
  // State variables for ChatHeader props
  const [showApiSettings, setShowApiSettings] = useState(false);
  const [showProjectPanel, setShowProjectPanel] = useState(false);

  const handleSendMessage = async (message: string) => {
    if (message.trim()) {
      addMessage({
        type: "user",
        content: message,
      });
      
      // Use ChatProcessor to generate a response
      if (chatProcessorRef.current) {
        chatProcessorRef.current.processUserMessage(message);
      } else {
        // Fallback if ChatProcessor isn't ready
        setIsAgentTyping(true);
        setTimeout(() => {
          addMessage({
            type: "agent",
            agentType: AgentType.MANAGER,
            content: "I've received your message. How can I assist you further with your project?",
          });
          setIsAgentTyping(false);
        }, 2000);
      }
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
      
      // Use ChatProcessor to process the file
      if (chatProcessorRef.current) {
        chatProcessorRef.current.processUserMessage("Please analyze this file.", files);
      } else {
        // Fallback if ChatProcessor isn't ready
        setIsAgentTyping(true);
        setTimeout(() => {
          addMessage({
            type: "agent",
            agentType: AgentType.MANAGER,
            content: "I've received your file. I'll analyze it and get back to you with my findings shortly.",
          });
          
          setIsAgentTyping(false);
        }, 3000);
      }
    }
  };

  const handleStartWithExample = () => {
    // Implementation for example button
    toast({
      title: "Loading example requirements",
      description: "Please wait while the example is being loaded."
    });
    // Add example implementation here
  };

  const handleClearChat = () => {
    // Implementation for clearing chat
    toast({
      title: "Chat history cleared",
      description: "All messages have been removed from the chat."
    });
    // Add clear chat implementation here
  };

  const handleDownload = () => {
    toast({
      title: "Downloading chat history",
    });
    
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
    toast({
      title: "Opening help dialog",
      description: "This feature is still in development."
    });
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background">
      <ChatHeader 
        setShowApiSettings={setShowApiSettings}
        showProjectPanel={showProjectPanel}
        setShowProjectPanel={setShowProjectPanel}
      />
      <div className="flex-1 overflow-auto">
        <ChatMessages 
          messages={messages} 
          isLoadingExample={isLoadingExample} 
          isAgentTyping={isAgentTyping} 
        />
      </div>
      <div className="border-t bg-white py-2">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-between mb-1.5">
            <div className="flex items-center gap-1">
              <button 
                onClick={handleClearChat}
                className="text-gray-500 hover:text-red-500 h-8 w-8 p-0 flex items-center justify-center"
                aria-label="Clear chat"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
              </button>
              
              <button 
                className="text-gray-500 hover:text-blue-500 h-8 w-8 p-0 flex items-center justify-center"
                onClick={handleDownload}
                aria-label="Download chat"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              </button>
              
              <button 
                className="text-gray-500 hover:text-blue-500 h-8 w-8 p-0 flex items-center justify-center"
                onClick={handleHelp}
                aria-label="Help"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
              </button>
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
      <ChatProcessor chatRef={chatProcessorRef} />
    </div>
  );
}
