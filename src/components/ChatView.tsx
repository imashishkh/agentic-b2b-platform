
import React, { useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ChatMessages } from "@/components/chat/ChatMessages";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatProcessor } from "@/components/ChatProcessor";
import { useChat } from "@/contexts/ChatContext";
import { SuggestionBox } from "@/components/chat/SuggestionBox";
import { SetupWizardStep } from "@/contexts/types";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

/**
 * ChatView Component
 * 
 * The main chat interface that displays messages and provides interaction options.
 * Now enhanced with a guided setup wizard experience that shows specific next steps
 * based on the current wizard state.
 */
export default function ChatView() {
  const { chatId } = useParams<{ chatId: string }>();
  const { 
    messages, 
    isAgentTyping, 
    isLoadingExample, 
    suggestions,
    addMessage,
    securityReviewActive,
    collaborationActive,
    currentWizardStep,
    setCurrentWizardStep,
    clearSuggestions,
    addSuggestion
  } = useChat();
  
  const chatProcessorRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [githubDialogOpen, setGithubDialogOpen] = React.useState(false);
  const [githubRepo, setGithubRepo] = React.useState("");
  const [docsDialogOpen, setDocsDialogOpen] = React.useState(false);
  const [docUrl, setDocUrl] = React.useState("");
  
  // Generate wizard step suggestions based on the current step
  useEffect(() => {
    clearSuggestions();
    
    // Only show wizard steps if we're in the wizard flow
    if (currentWizardStep !== SetupWizardStep.PROJECT_IN_PROGRESS) {
      generateWizardStepSuggestion();
    }
  }, [currentWizardStep]);
  
  /**
   * Generate the appropriate wizard step suggestion based on current state
   */
  const generateWizardStepSuggestion = () => {
    switch(currentWizardStep) {
      case SetupWizardStep.INITIAL:
        addSuggestion({
          title: "Start Your Project",
          description: "Let's begin by uploading your project requirements",
          options: [
            {
              label: "Upload Requirements Document",
              message: "I'd like to upload my project requirements document",
              description: "Upload a markdown file with your project specifications"
            }
          ]
        });
        break;
        
      case SetupWizardStep.REQUIREMENTS_UPLOADED:
        addSuggestion({
          title: "Connect GitHub Repository",
          description: "Let's set up version control for your project",
          options: [
            {
              label: "Connect GitHub Repository",
              message: "I want to connect my GitHub repository",
              description: "Link your project to a GitHub repository for version control"
            }
          ]
        });
        break;
        
      case SetupWizardStep.GITHUB_CONNECTED:
        addSuggestion({
          title: "Add Technical Documentation",
          description: "Let's add documentation for your tech stack",
          options: [
            {
              label: "Add Documentation Resources",
              message: "I'd like to add documentation for my tech stack",
              description: "Add links to documentation for frameworks and libraries"
            }
          ]
        });
        break;
        
      case SetupWizardStep.DOCUMENTATION_ADDED:
        addSuggestion({
          title: "Add UI Components",
          description: "Let's add UI design assets and components",
          options: [
            {
              label: "Upload UI Components",
              message: "I want to upload my UI components and design assets",
              description: "Add design files, code snippets, or reference images"
            }
          ]
        });
        break;
        
      case SetupWizardStep.UI_COMPONENTS_ADDED:
        addSuggestion({
          title: "Review Project Plan",
          description: "Let's review the project plan before proceeding",
          options: [
            {
              label: "Approve Project Plan",
              message: "I approve the project plan",
              description: "Begin development with the current specifications"
            },
            {
              label: "Add More Resources",
              message: "I'd like to add more resources",
              description: "Add additional documentation, UI components or specifications"
            },
            {
              label: "Reject Current Plan",
              message: "I'd like to modify the project plan",
              description: "Make changes to the current specifications"
            }
          ]
        });
        break;
        
      default:
        // Default suggestions for other states
        break;
    }
  };
  
  /**
   * Handle user selection from suggestion boxes
   * Also updates the wizard state based on the user's selection
   * @param message - The selected suggestion text
   */
  const handleSuggestionSelect = (message: string) => {
    if (chatProcessorRef.current) {
      addMessage({
        content: message,
        type: "user",
      });
      
      // Update wizard step based on user selection
      updateWizardStep(message);
      
      chatProcessorRef.current.processUserMessage(message);
    }
  };
  
  /**
   * Handle direct actions from the suggestion box
   * @param actionType - The type of action to perform
   * @param optionMessage - The original message from the option
   */
  const handleDirectAction = (actionType: string, optionMessage: string) => {
    switch (actionType) {
      case "upload-requirements":
        if (fileInputRef.current) {
          fileInputRef.current.click();
        }
        break;
        
      case "github-connect":
        setGithubDialogOpen(true);
        break;
        
      case "add-documentation":
        setDocsDialogOpen(true);
        break;
        
      case "upload-ui-components":
        if (fileInputRef.current) {
          fileInputRef.current.click();
        }
        break;
        
      case "add-resources":
        setDocsDialogOpen(true);
        break;
        
      default:
        // For unhandled actions, use the default message flow
        handleSuggestionSelect(optionMessage);
        break;
    }
  };
  
  /**
   * Handle file upload
   */
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      
      if (currentWizardStep === SetupWizardStep.UPLOAD_REQUIREMENTS || 
          currentWizardStep === SetupWizardStep.INITIAL) {
        if (file.name.endsWith('.md') || file.type === 'text/markdown' || file.type === 'text/plain') {
          // Add a message showing what was uploaded
          addMessage({
            content: `Uploaded requirements document: ${file.name}`,
            type: "user",
          });
          
          // Process the uploaded file
          if (chatProcessorRef.current) {
            chatProcessorRef.current.processUserMessage("I'd like to upload my project requirements document", [file]);
          }
          
          // Update wizard step
          setCurrentWizardStep(SetupWizardStep.REQUIREMENTS_UPLOADED);
        } else {
          toast.error("Please upload a markdown (.md) file for project requirements");
        }
      } else if (currentWizardStep === SetupWizardStep.UI_COMPONENTS_SETUP) {
        // Handle UI components upload
        addMessage({
          content: `Uploaded UI components: ${file.name}`,
          type: "user",
        });
        
        // Process the uploaded file
        if (chatProcessorRef.current) {
          chatProcessorRef.current.processUserMessage("I want to upload my UI components and design assets", [file]);
        }
        
        // Update wizard step
        setCurrentWizardStep(SetupWizardStep.UI_COMPONENTS_ADDED);
      }
    }
    
    // Reset the input so the same file can be uploaded again
    if (event.target) {
      event.target.value = '';
    }
  };
  
  /**
   * Handle GitHub repository connection
   */
  const handleGithubConnect = () => {
    if (githubRepo) {
      // Add a message showing what was connected
      addMessage({
        content: `Connected GitHub repository: ${githubRepo}`,
        type: "user",
      });
      
      // Process the GitHub connection
      if (chatProcessorRef.current) {
        chatProcessorRef.current.processUserMessage(`I want to connect my GitHub repository: ${githubRepo}`);
      }
      
      // Update wizard step
      setCurrentWizardStep(SetupWizardStep.GITHUB_CONNECTED);
      
      // Close the dialog
      setGithubDialogOpen(false);
      setGithubRepo("");
      
      // Show success message
      toast.success("GitHub repository connected successfully");
    } else {
      toast.error("Please enter a GitHub repository URL");
    }
  };
  
  /**
   * Handle documentation addition
   */
  const handleAddDocumentation = () => {
    if (docUrl) {
      // Add a message showing what was added
      addMessage({
        content: `Added documentation resource: ${docUrl}`,
        type: "user",
      });
      
      // Process the documentation addition
      if (chatProcessorRef.current) {
        chatProcessorRef.current.processUserMessage(`I'd like to add documentation for my tech stack: ${docUrl}`);
      }
      
      // Update wizard step
      setCurrentWizardStep(SetupWizardStep.DOCUMENTATION_ADDED);
      
      // Close the dialog
      setDocsDialogOpen(false);
      setDocUrl("");
      
      // Show success message
      toast.success("Documentation resource added successfully");
    } else {
      toast.error("Please enter a documentation URL");
    }
  };
  
  /**
   * Update the wizard step based on the user's message
   * @param message - The user's message
   */
  const updateWizardStep = (message: string) => {
    const lowerMessage = message.toLowerCase();
    
    // Determine the next wizard step based on current step and message content
    if (currentWizardStep === SetupWizardStep.INITIAL && 
        lowerMessage.includes("upload") && lowerMessage.includes("requirements")) {
      setCurrentWizardStep(SetupWizardStep.UPLOAD_REQUIREMENTS);
    }
    else if (currentWizardStep === SetupWizardStep.UPLOAD_REQUIREMENTS) {
      // This transition will happen when file is actually uploaded
      // For now, it's handled in ChatProcessor component
    }
    else if (currentWizardStep === SetupWizardStep.REQUIREMENTS_UPLOADED && 
             lowerMessage.includes("github")) {
      setCurrentWizardStep(SetupWizardStep.GITHUB_SETUP);
    }
    else if (currentWizardStep === SetupWizardStep.GITHUB_SETUP) {
      // This will be triggered after GitHub repo is connected
    }
    else if (currentWizardStep === SetupWizardStep.GITHUB_CONNECTED && 
             (lowerMessage.includes("documentation") || lowerMessage.includes("tech stack"))) {
      setCurrentWizardStep(SetupWizardStep.DOCUMENTATION_SETUP);
    }
    else if (currentWizardStep === SetupWizardStep.DOCUMENTATION_SETUP) {
      // This will be triggered after documentation is added
    }
    else if (currentWizardStep === SetupWizardStep.DOCUMENTATION_ADDED && 
             (lowerMessage.includes("ui") || lowerMessage.includes("components"))) {
      setCurrentWizardStep(SetupWizardStep.UI_COMPONENTS_SETUP);
    }
    else if (currentWizardStep === SetupWizardStep.UI_COMPONENTS_SETUP) {
      // This will be triggered after UI components are uploaded
    }
    else if (currentWizardStep === SetupWizardStep.UI_COMPONENTS_ADDED) {
      if (lowerMessage.includes("approve")) {
        setCurrentWizardStep(SetupWizardStep.PROJECT_APPROVED);
      }
      else if (lowerMessage.includes("add more")) {
        // Stay in the same state, but the dialog will show
      }
      else if (lowerMessage.includes("reject") || lowerMessage.includes("modify")) {
        setCurrentWizardStep(SetupWizardStep.PROJECT_REVIEW);
      }
    }
    else if (currentWizardStep === SetupWizardStep.PROJECT_APPROVED) {
      setCurrentWizardStep(SetupWizardStep.PROJECT_IN_PROGRESS);
    }
  };

  return (
    <div className="flex h-full overflow-hidden bg-background relative">
      <div className="flex flex-col flex-1 overflow-hidden">
        <ChatHeader />
        
        {/* Main chat message area - increased height and improved spacing */}
        <div className="relative flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto pb-24 px-4">
            <ChatMessages 
              messages={messages}
              isLoadingExample={isLoadingExample} 
              isAgentTyping={isAgentTyping}
              securityReviewActive={securityReviewActive}
              collaborationActive={collaborationActive || false}
            />
          </div>
        </div>
        
        {/* Chat input area with wizard steps - repositioned closer to messages */}
        <div className="sticky bottom-0 z-20 bg-gradient-to-t from-background via-background to-transparent py-4">
          {/* Display the wizard step if there is one */}
          {suggestions.length > 0 && (
            <div className="max-w-2xl mx-auto px-4 mb-3">
              {suggestions.map((suggestion, index) => (
                <div key={index} className="mb-2 animate-fade-in">
                  <SuggestionBox
                    title={suggestion.title}
                    description={suggestion.description}
                    options={suggestion.options}
                    onSelect={handleSuggestionSelect}
                    isWizardStep={true} // Enable wizard styling
                    onDirectAction={handleDirectAction}
                  />
                </div>
              ))}
            </div>
          )}
          
          {/* File input for uploading documents (hidden) */}
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileUpload}
            accept=".md,.markdown,.txt,image/*,.pdf,.doc,.docx"
          />
          
          {/* GitHub repository dialog */}
          <Dialog open={githubDialogOpen} onOpenChange={setGithubDialogOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Connect GitHub Repository</DialogTitle>
                <DialogDescription>
                  Enter the URL of your GitHub repository to connect it to your project.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Input
                    id="githubRepo"
                    value={githubRepo}
                    onChange={(e) => setGithubRepo(e.target.value)}
                    placeholder="https://github.com/username/repository"
                    className="col-span-4"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="secondary" onClick={() => setGithubDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="button" onClick={handleGithubConnect}>
                  Connect
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          {/* Documentation dialog */}
          <Dialog open={docsDialogOpen} onOpenChange={setDocsDialogOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add Documentation Resource</DialogTitle>
                <DialogDescription>
                  Enter the URL of documentation resources for your tech stack.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Input
                    id="docUrl"
                    value={docUrl}
                    onChange={(e) => setDocUrl(e.target.value)}
                    placeholder="https://example.com/documentation"
                    className="col-span-4"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="secondary" onClick={() => setDocsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="button" onClick={handleAddDocumentation}>
                  Add Resource
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          {/* E-commerce Knowledge Access Button */}
          <div className="max-w-2xl mx-auto flex justify-center mb-3">
            <Button 
              variant="outline" 
              className="text-sm"
              onClick={() => {
                addMessage({
                  content: "I'd like to access the e-commerce knowledge base",
                  type: "user",
                });
                
                // Show e-commerce knowledge hub in sidebar
                document.querySelector('[aria-label="Knowledge Hub"]')?.dispatchEvent(
                  new MouseEvent('click', { bubbles: true })
                );
              }}
            >
              Access E-commerce Knowledge Hub
            </Button>
          </div>
          
          {/* Chat processor - contains input field */}
          <ChatProcessor chatRef={chatProcessorRef} />
        </div>
      </div>
    </div>
  );
}
