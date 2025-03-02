
import React, { useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ChatMessages } from "@/components/chat/ChatMessages";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatProcessor } from "@/components/ChatProcessor";
import { useChat } from "@/contexts/ChatContext";
import { SuggestionBox } from "@/components/chat/SuggestionBox";
import { SetupWizardStep } from "@/contexts/types";

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
                  />
                </div>
              ))}
            </div>
          )}
          
          {/* Chat processor - contains input field */}
          <ChatProcessor chatRef={chatProcessorRef} />
        </div>
      </div>
    </div>
  );
}
