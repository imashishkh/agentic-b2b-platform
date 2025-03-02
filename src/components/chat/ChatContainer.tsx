
import React, { useRef, useState } from "react";
import ChatView from "@/components/ChatView";
import { useChat } from "@/contexts/ChatContext";
import { toast } from "sonner";
import { ChatProcessor } from "@/components/ChatProcessor";
import { AgentType } from "@/agents/AgentTypes";
import { ChatInput } from "@/components/chat-input";
import { Trash2, Download, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { v4 as uuidv4 } from 'uuid';
import { extractContentFromUrl } from "@/utils/resourceExtractor";

/**
 * ChatContainer Component
 * 
 * The main container for the chat interface that manages:
 * - Message handling and processing
 * - File uploads with progress tracking
 * - Example project generation
 * - Chat history management (clear, download)
 */
export function ChatContainer() {
  const {
    messages,
    addMessage,
    clearMessages,
    isAgentTyping,
    isLoadingExample,
    setIsAgentTyping,
    addKnowledgeResource
  } = useChat();
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatRef = useRef<{
    processUserMessage: (message: string, files?: File[]) => void;
  }>(null);

  /**
   * Handles sending a user message to be processed
   * @param message - The text message from the user
   */
  const handleSendMessage = async (message: string) => {
    try {
      if (message.trim() === "") return;

      // First, add the user message to the chat
      await addMessage({
        content: message,
        type: "user"
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

  /**
   * Clears all selected files
   */
  const handleClearFiles = () => {
    setFiles([]);
  };

  /**
   * Handles file input changes and prepares them for upload
   * @param selectedFiles - Array of files selected by the user
   */
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
            if (chatRef.current) {
              chatRef.current.processUserMessage("Please analyze this file.", selectedFiles);
            }
            setIsUploading(false);
            setUploadProgress(0);

            // Add message about upload
            addMessage({
              type: "user",
              content: `Uploaded ${selectedFiles.map(f => f.name).join(", ")}`
            });
          }, 500);
        }
      }, 200);
    }
  };

  /**
   * Handles knowledge resource uploads
   * @param files - Files to add as knowledge resources
   * @param category - Resource category
   */
  const handleKnowledgeUpload = (files: File[], category: string = "UI Components") => {
    if (files.length === 0) return;
    
    setIsUploading(true);
    
    // Simulate file upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          // Add each file to knowledge base
          files.forEach(file => {
            const resource = {
              id: uuidv4(),
              title: file.name,
              description: `${category} resource: ${file.name}`,
              category: category,
              type: file.type,
              dateAdded: new Date().toISOString(),
              url: URL.createObjectURL(file),
              tags: [category.toLowerCase(), file.type.split('/')[0], 'resource'],
              source: 'upload',
              content: `Content of ${file.name}` // Placeholder for file content
            };
            
            addKnowledgeResource(category, resource);
          });
          
          // Add message about knowledge base update
          addMessage({
            type: "agent",
            agentType: AgentType.MANAGER,
            content: `I've added ${files.length} ${category} resource(s) to the knowledge base. I'll reference these when generating code and making design decisions.`
          });
          
          toast.success(`Added ${files.length} resources to knowledge base`);
          setIsUploading(false);
          setUploadProgress(0);
        }, 500);
      }
    }, 200);
  };

  /**
   * Handles file uploads directly from the UI
   * @param selectedFiles - Array of files selected by the user
   * @param context - Context of the upload (requirements, ui-components, etc.)
   */
  const handleFileUpload = (selectedFiles: File[], context?: string) => {
    if (selectedFiles.length > 0) {
      // Handle UI components differently
      if (context === "ui-components") {
        handleKnowledgeUpload(selectedFiles, "UI Components");
        return;
      }
      
      // Handle knowledge base resources
      if (context === "knowledge-base") {
        handleKnowledgeUpload(selectedFiles, "Resources");
        return;
      }
      
      // Handle documentation
      if (context === "documentation") {
        handleKnowledgeUpload(selectedFiles, "Documentation");
        return;
      }
      
      // Default file handling for requirements etc.
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
            // Add message about upload
            addMessage({
              type: "user",
              content: `Uploaded ${selectedFiles.map(f => f.name).join(", ")}`
            });

            // Process the file with minimal message text
            if (chatRef.current) {
              console.log("Processing file via chatRef:", selectedFiles);
              chatRef.current.processUserMessage("Please analyze this file.", selectedFiles);
            } else {
              console.error("ChatProcessor reference is not available");
              // Fallback if ChatProcessor isn't available
              setIsAgentTyping(true);
              setTimeout(() => {
                addMessage({
                  type: "agent",
                  agentType: AgentType.MANAGER,
                  content: "I've received your files. I'll analyze them and get back to you with my findings."
                });
                setIsAgentTyping(false);
                toast.success(`${selectedFiles.length} file(s) received`);
              }, 3000);
            }
            setIsUploading(false);
            setUploadProgress(0);
          }, 500);
        }
      }, 200);
    }
  };
  
  /**
   * Handles adding a URL to the knowledge base
   * @param url - URL to add as a knowledge resource
   * @param category - Resource category
   */
  const handleAddResourceUrl = async (url: string, category: string = "Documentation") => {
    try {
      setIsAgentTyping(true);
      const resourceInfo = await extractContentFromUrl(url);
      
      const resource = {
        id: uuidv4(),
        title: resourceInfo.title || url,
        description: resourceInfo.description || `Documentation resource from ${url}`,
        category: category,
        type: 'url',
        dateAdded: new Date().toISOString(),
        url: url,
        tags: resourceInfo.tags || [category.toLowerCase(), 'url', 'documentation'],
        source: 'url',
        content: resourceInfo.content || url
      };
      
      addKnowledgeResource(category, resource);
      
      // Add message about knowledge base update
      addMessage({
        type: "agent",
        agentType: AgentType.MANAGER,
        content: `I've added documentation from ${url} to the knowledge base. I'll reference this when answering questions about your project.`
      });
      
      toast.success(`Added resource from ${url} to knowledge base`);
      setIsAgentTyping(false);
    } catch (error) {
      console.error("Error adding resource URL:", error);
      toast.error("Failed to add resource URL");
      setIsAgentTyping(false);
      
      // Add error message
      addMessage({
        type: "agent",
        agentType: AgentType.MANAGER,
        content: `I had trouble processing the URL: ${url}. Please check that it's valid and try again.`
      });
    }
  };

  /**
   * Starts with an example project for demonstration purposes
   */
  const handleStartWithExample = () => {
    toast.info("Starting with example project");
    // Add example project message
    addMessage({
      type: "user",
      content: "I want to start with an example e-commerce project"
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
          content: "I've loaded an example e-commerce project for you. This includes a standard product catalog, shopping cart, and checkout flow. Would you like me to explain the architecture or should we customize it to your needs?"
        });
        setIsAgentTyping(false);
      }, 2500);
    }
  };

  /**
   * Clears the chat history and resets to initial state
   */
  const handleClearChat = () => {
    clearMessages();
    toast.success("Chat cleared");

    // Add welcome message after clearing
    setTimeout(() => {
      addMessage({
        type: "agent",
        agentType: AgentType.MANAGER,
        content: "Hello! I'm DevManager, your AI project manager. How can I help you today?"
      });
    }, 300);
  };

  /**
   * Downloads the chat history as a text file
   */
  const handleDownload = () => {
    toast.info("Downloading chat history");

    // Create a text file with current conversation
    const text = messages.map(m => `[${m.type}]${m.type === 'agent' ? ` [${m.agentType}]` : ''}: ${m.content}`).join('\n\n');
    const blob = new Blob([`Chat Export - ${new Date().toLocaleString()}\n\n${text}`], {
      type: "text/plain"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `chat-export-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  /**
   * Opens the help documentation
   */
  const handleHelp = () => {
    toast.info("Opening help dialog", {
      description: "This feature is still in development."
    });
  };

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex-1 overflow-hidden">
        <ChatView 
          onFileUpload={handleFileUpload}
          onAddResourceUrl={handleAddResourceUrl}
        />
      </div>
      
      <div className="border-t border-border/50 bg-background">
        <ChatInput
          onSendMessage={handleSendMessage}
          files={files}
          onClearFiles={handleClearFiles}
          isUploading={isUploading}
          uploadProgress={uploadProgress}
          handleFileUpload={handleFileUpload}
          isDisabled={isAgentTyping || isLoadingExample}
          onExampleClick={handleStartWithExample}
        />
        
        <div className="flex justify-between px-4 py-2 border-t border-border/30">
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleClearChat}
              className="text-xs text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              Clear Chat
            </Button>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleDownload}
              className="text-xs text-muted-foreground"
            >
              <Download className="h-3.5 w-3.5 mr-1" />
              Export
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleHelp}
              className="text-xs text-muted-foreground"
            >
              <HelpCircle className="h-3.5 w-3.5 mr-1" />
              Help
            </Button>
          </div>
        </div>
      </div>
      
      <ChatProcessor chatRef={chatRef} />
    </div>
  );
}
