
import React, { useState, useEffect, useRef } from "react";
import { useChat } from "@/contexts/ChatContext";
import { AgentType } from "@/agents/AgentTypes";
import * as AgentFactory from "@/agents/AgentFactory";
import { toast } from "sonner";
import { ManagerAgent } from "@/agents/ManagerAgent";
import { extractTasksWithDependencies, generateDependencyGraph } from "@/utils/markdownParser";
import { KnowledgeResource, SetupWizardStep } from "@/contexts/types";

export interface ChatProcessorProps {
  chatRef: React.MutableRefObject<any>;
}

export function ChatProcessor({ chatRef }: ChatProcessorProps) {
  const { 
    addMessage, 
    setIsAgentTyping, 
    messages, 
    addSuggestion, 
    clearSuggestions,
    isAgentTyping,
    knowledgeBase,
    suggestions,
    currentWizardStep,
    setCurrentWizardStep
  } = useChat();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const isMounted = useRef(true);
  const initialMessageSent = useRef(false);
  const managerAgent = useRef<ManagerAgent>(AgentFactory.createAgent(AgentType.MANAGER) as ManagerAgent);

  useEffect(() => {
    isMounted.current = true;
    
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!chatRef.current) {
      chatRef.current = {
        processUserMessage: processMessage
      };
    }
    
    if (messages.length === 0 && !initialMessageSent.current) {
      initialMessageSent.current = true;
      
      setIsAgentTyping(true);
      
      setTimeout(() => {
        if (isMounted.current) {
          setIsAgentTyping(false);
          addMessage({
            type: "agent",
            content: "Hello! I'm DevManager, your AI project manager. Let's set up your e-commerce project together, following a simple step-by-step process.",
            agentType: AgentType.MANAGER,
          });
          
          // Set initial wizard step
          setCurrentWizardStep(SetupWizardStep.INITIAL);
        }
      }, 1500);
    }
  }, [chatRef, addMessage, messages, setIsAgentTyping, addSuggestion, suggestions]);

  const processMarkdownFile = async (file: File) => {
    console.log("Processing markdown file in ChatProcessor:", file.name);
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const content = e.target?.result as string;
          console.log("File content loaded, length:", content.length);
          console.log("File content preview:", content.substring(0, 200) + "...");
          resolve(content);
        } catch (error) {
          console.error("Error processing file content:", error);
          reject(error);
        }
      };
      
      reader.onerror = (error) => {
        console.error("FileReader error:", error);
        reject(error);
      };
      
      reader.readAsText(file);
    });
  };

  const generateNextStepSuggestions = () => {
    const nextStepSuggestions = [
      {
        label: "Architecture Planning",
        message: "I'd like to start planning the system architecture for this project",
        description: "Begin designing the technical architecture for your project"
      },
      {
        label: "Enhance Knowledge Base",
        message: "Let's add resources to the knowledge base for this project",
        description: "Add technical documentation and resources to inform development"
      },
      {
        label: "Testing Strategy",
        message: "Let's develop a testing strategy for the project",
        description: "Create a comprehensive testing approach for quality assurance"
      },
      {
        label: "Prioritize Tasks",
        message: "Help me prioritize the tasks we've identified",
        description: "Organize tasks by importance and dependencies"
      }
    ];
    
    return nextStepSuggestions;
  };

  const handleSpecificActions = async (message: string): Promise<boolean> => {
    if (message.toLowerCase().includes("architecture") && 
        message.toLowerCase().includes("planning")) {
      if (!isAgentTyping) {
        setIsAgentTyping(true);
        setTimeout(() => {
          setIsAgentTyping(false);
          addMessage({
            type: "agent",
            content: `# Architecture Planning\n\nI'll help you plan the system architecture for your project. Let's start by defining the key components:\n\n## Frontend Architecture\n- React SPA with Tailwind CSS for styling\n- Component library: shadcn/ui\n- State management: Context API for simple state, Tanstack Query for remote data\n\n## Backend Architecture\n- RESTful API design\n- Authentication system with JWT\n- Server-side validation\n\n## Database Architecture\n- Entity relationships\n- Data schema design\n- Indexing strategy\n\nWould you like me to elaborate on any specific part of the architecture?`,
            agentType: AgentType.MANAGER,
          });
        }, 3000);
        return true;
      }
    }
    
    if (message.toLowerCase().includes("knowledge base")) {
      if (!isAgentTyping) {
        setIsAgentTyping(true);
        setTimeout(() => {
          setIsAgentTyping(false);
          addMessage({
            type: "agent",
            content: `# Knowledge Base Enhancement\n\nTo better support your project, I recommend gathering documentation and resources in the following categories:\n\n## Technology Stack Documentation\n- Frontend framework documentation\n- Backend framework documentation\n- Database documentation\n\n## Industry Standards\n- Security best practices\n- Accessibility guidelines\n- Performance benchmarks\n\n## Example Projects\n- Similar applications for reference\n- Code samples\n\nPlease share any specific resources you'd like to add to the project knowledge base.`,
            agentType: AgentType.MANAGER,
          });
        }, 3000);
        return true;
      }
    }
    
    if (message.toLowerCase().includes("testing strategy")) {
      if (!isAgentTyping) {
        setIsAgentTyping(true);
        setTimeout(() => {
          setIsAgentTyping(false);
          addMessage({
            type: "agent",
            content: `# Testing Strategy\n\nI'll help develop a comprehensive testing approach for your project:\n\n## Unit Testing\n- Test individual functions and components\n- Use Jest for JavaScript/TypeScript testing\n- Aim for >80% code coverage\n\n## Integration Testing\n- Test interactions between components\n- API endpoint testing\n- Database query testing\n\n## End-to-End Testing\n- Test complete user flows\n- Use Cypress or Playwright\n- Automate critical user journeys\n\n## Performance Testing\n- Load testing with k6 or JMeter\n- Browser performance profiling\n\n## Security Testing\n- Static code analysis\n- Dependency vulnerability scanning\n- OWASP top 10 compliance\n\nWould you like me to prepare a detailed testing plan for a specific part of your application?`,
            agentType: AgentType.MANAGER,
          });
        }, 3000);
        return true;
      }
    }
    
    if (message.toLowerCase().includes("prioritize tasks")) {
      if (!isAgentTyping) {
        setIsAgentTyping(true);
        setTimeout(() => {
          setIsAgentTyping(false);
          addMessage({
            type: "agent",
            content: `# Task Prioritization\n\nLet's organize your project tasks by priority, considering dependencies and business impact:\n\n## High Priority (Sprint 1)\n1. User authentication system\n2. Core database schema design\n3. Basic UI framework implementation\n4. API endpoints for critical features\n\n## Medium Priority (Sprint 2)\n1. Secondary features implementation\n2. Refinement of user flows\n3. Performance optimization\n4. Basic analytics integration\n\n## Lower Priority (Sprint 3+)\n1. Advanced features\n2. UI polish and animations\n3. Additional platform support\n4. Extended analytics\n\nWould you like me to help create a detailed schedule with time estimates for these tasks?`,
            agentType: AgentType.MANAGER,
          });
        }, 3000);
        return true;
      }
    }
    
    if (message.toLowerCase().includes("example") && 
        message.toLowerCase().includes("project")) {
      if (!isAgentTyping) {
        setIsAgentTyping(true);
        setTimeout(() => {
          setIsAgentTyping(false);
          addMessage({
            type: "agent",
            content: `# Example E-Commerce Project\n\nI've loaded an example e-commerce project template for you. This includes:\n\n## Key Features\n- Product catalog with categories and search\n- User authentication and profiles\n- Shopping cart functionality\n- Checkout process with payment integration\n- Order history and tracking\n\n## Technical Components\n- Responsive design with Tailwind CSS\n- React frontend with shadcn/ui components\n- RESTful API design\n- Database schema for products, users, orders\n\n## Next Steps\n1. Customize the product catalog\n2. Configure payment processing\n3. Set up the database\n4. Implement the frontend UI\n\nWould you like me to explain more about any specific part of this project?`,
            agentType: AgentType.MANAGER,
          });
          
          addSuggestion({
            title: "Customize Example Project",
            description: "How would you like to customize this example project?",
            options: [
              {
                label: "Customize product catalog",
                message: "I'd like to customize the product catalog structure",
                description: "Define product categories and attributes"
              },
              {
                label: "Payment integration",
                message: "Let's configure the payment processing system",
                description: "Set up secure payment processing"
              },
              {
                label: "UI customization",
                message: "I want to customize the UI design",
                description: "Personalize the look and feel of the application"
              },
              {
                label: "Deployment setup",
                message: "Help me set up deployment for this project",
                description: "Configure CI/CD and hosting"
              }
            ]
          });
        }, 3000);
        return true;
      }
    }
    
    if (message.toLowerCase().includes("github") && 
        (message.toLowerCase().includes("repository") || message.toLowerCase().includes("repo"))) {
      if (!isAgentTyping) {
        setIsAgentTyping(true);
        setTimeout(() => {
          setIsAgentTyping(false);
          addMessage({
            type: "agent",
            content: `# GitHub Repository Management\n\nI'll help you set up and manage GitHub repositories for your project. You can:\n\n- Connect to your GitHub account\n- Create new repositories with best-practice templates\n- Set up branch protection rules\n- Configure CI/CD workflows\n- Manage pull requests\n\nYou can access these features in the GitHub Integration panel. Would you like me to explain any specific aspect of repository management?`,
            agentType: AgentType.DEVOPS,
          });
        }, 3000);
        return true;
      }
    }
    
    if (message.toLowerCase().includes("ci/cd") || 
        (message.toLowerCase().includes("pipeline") && message.toLowerCase().includes("workflow"))) {
      if (!isAgentTyping) {
        setIsAgentTyping(true);
        setTimeout(() => {
          setIsAgentTyping(false);
          addMessage({
            type: "agent",
            content: `# CI/CD Pipeline Configuration\n\nI'll help you set up continuous integration and deployment pipelines for your project. Our recommended workflow includes:\n\n## For Development\n- Automated testing on every push\n- Code quality checks\n- Preview deployments for feature branches\n\n## For Production\n- Staging environment deployment\n- Manual approval process\n- Zero-downtime deployment strategy\n- Automated rollback capability\n\nYou can configure these pipelines in the GitHub Integration panel. Would you like me to explain how to set up a specific workflow?`,
            agentType: AgentType.DEVOPS,
          });
        }, 3000);
        return true;
      }
    }
    
    if (message.toLowerCase().includes("branch") && 
        message.toLowerCase().includes("strategy")) {
      if (!isAgentTyping) {
        setIsAgentTyping(true);
        setTimeout(() => {
          setIsAgentTyping(false);
          addMessage({
            type: "agent",
            content: `# Branch Strategy Recommendation\n\nFor your project, I recommend the following branch strategy:\n\n## Main Branches\n- **main** - Production code that is deployed to users\n- **develop** - Integration branch for ongoing development\n\n## Supporting Branches\n- **feature/*** - For new features (e.g., feature/user-auth)\n- **bugfix/*** - For bug fixes (e.g., bugfix/login-error)\n- **release/*** - For release preparation (e.g., release/v1.0)\n- **hotfix/*** - For urgent production fixes\n\n## Workflow Process\n1. Develop features in feature branches\n2. Create pull requests to develop\n3. Conduct code reviews\n4. Merge approved features to develop\n5. Create release branches when ready\n6. Test in staging environment\n7. Merge to main and deploy to production\n\nYou can implement this strategy using the GitHub Integration panel. Would you like me to help you set this up?`,
            agentType: AgentType.DEVOPS,
          });
        }, 3000);
        return true;
      }
    }
    
    if (message.toLowerCase().includes("performance") && 
        (message.toLowerCase().includes("monitor") || message.toLowerCase().includes("metric"))) {
      if (!isAgentTyping) {
        setIsAgentTyping(true);
        setTimeout(() => {
          setIsAgentTyping(false);
          addMessage({
            type: "agent",
            content: `# Performance Monitoring\n\nI'll help you set up performance monitoring for your project. Here are the key metrics we should track:\n\n## Frontend Metrics\n- First Contentful Paint (FCP)\n- Time to Interactive (TTI)\n- Largest Contentful Paint (LCP)\n- Total Blocking Time (TBT)\n- Cumulative Layout Shift (CLS)\n\n## Backend Metrics\n- API Response Time\n- Database Query Time\n- Memory Usage\n- CPU Usage\n- Error Rate\n\nWould you like me to help you set up integration with monitoring tools like Lighthouse, New Relic, or Datadog?`,
            agentType: AgentType.DEVOPS,
          });
        }, 3000);
        return true;
      }
    }
    
    if (message.toLowerCase().includes("benchmark") && 
        (message.toLowerCase().includes("performance") || message.toLowerCase().includes("speed"))) {
      if (!isAgentTyping) {
        setIsAgentTyping(true);
        setTimeout(() => {
          setIsAgentTyping(false);
          addMessage({
            type: "agent",
            content: `# Performance Benchmarks\n\nI'll help you establish performance benchmarks for your project. We should create benchmarks for:\n\n1. **Development Environment**\n   - Establish baseline performance metrics\n   - Set performance budgets\n\n2. **Staging Environment**\n   - Compare with development benchmarks\n   - Identify environment-specific issues\n\n3. **Production Environment**\n   - Monitor real user metrics\n   - Set up alerts for performance degradation\n\nWould you like me to create baseline benchmarks for your development environment now?`,
            agentType: AgentType.DEVOPS,
          });
        }, 3000);
        return true;
      }
    }
    
    if (message.toLowerCase().includes("optimization") && 
        (message.toLowerCase().includes("performance") || message.toLowerCase().includes("speed") || 
         message.toLowerCase().includes("faster"))) {
      if (!isAgentTyping) {
        setIsAgentTyping(true);
        setTimeout(() => {
          setIsAgentTyping(false);
          addMessage({
            type: "agent",
            content: `# Performance Optimization Recommendations\n\nBased on common performance bottlenecks, here are key recommendations for optimizing your application:\n\n## Frontend Optimizations\n- Implement code splitting with React.lazy\n- Optimize images with WebP format and lazy loading\n- Minimize JavaScript bundle size\n- Use memoization for expensive calculations\n\n## Backend Optimizations\n- Implement API response caching\n- Optimize database queries\n- Use connection pooling\n- Consider serverless functions for scalability\n\n## Network Optimizations\n- Enable HTTP/2\n- Implement content compression\n- Use CDN for static assets\n- Optimize API payload size\n\nWould you like me to provide specific code examples for any of these optimizations?`,
            agentType: AgentType.DEVOPS,
          });
        }, 3000);
        return true;
      }
    }
    
    if (message.toLowerCase().includes("generate") && 
        message.toLowerCase().includes("performance") && 
        message.toLowerCase().includes("documentation")) {
      if (!isAgentTyping) {
        setIsAgentTyping(true);
        setTimeout(async () => {
          setIsAgentTyping(false);
          
          if (!managerAgent.current) {
            managerAgent.current = AgentFactory.createAgent(AgentType.MANAGER) as ManagerAgent;
          }
          
          managerAgent.current.getPerformanceMetrics();
          const performanceReport = managerAgent.current.generateOptimizations();
          
          addMessage({
            type: "agent",
            content: performanceReport,
            agentType: AgentType.MANAGER,
          });
        }, 3000);
        return true;
      }
    }
    
    if (message.toLowerCase().includes("monitoring tool") || 
        (message.toLowerCase().includes("tool") && message.toLowerCase().includes("integration"))) {
      if (!isAgentTyping) {
        setIsAgentTyping(true);
        setTimeout(() => {
          setIsAgentTyping(false);
          
          if (!managerAgent.current) {
            managerAgent.current = AgentFactory.createAgent(AgentType.MANAGER) as ManagerAgent;
          }
          
          const toolDoc = managerAgent.current.generateMonitoringToolDoc('lighthouse');
          
          addMessage({
            type: "agent",
            content: toolDoc,
            agentType: AgentType.DEVOPS,
          });
        }, 3000);
        return true;
      }
    }
    
    if (message.toLowerCase().includes("generate") && 
        message.toLowerCase().includes("technical") && 
        message.toLowerCase().includes("documentation")) {
      if (!isAgentTyping) {
        setIsAgentTyping(true);
        setTimeout(async () => {
          setIsAgentTyping(false);
          
          if (!managerAgent.current) {
            managerAgent.current = AgentFactory.createAgent(AgentType.MANAGER) as ManagerAgent;
          }
          
          const techDoc = await managerAgent.current.generateTechnicalDocumentation();
          
          addMessage({
            type: "agent",
            content: techDoc,
            agentType: AgentType.MANAGER,
          });
        }, 3000);
        return true;
      }
    }
    
    return false;
  };

  const processMessage = async (message: string, files?: File[]) => {
    if (isProcessing || (!message.trim() && (!files || files.length === 0))) return;
    
    setIsAgentTyping(true);
    setIsProcessing(true);
    
    try {
      clearSuggestions();
      
      // Skip hardcoded responses when a real Claude API key is present
      const apiKey = localStorage.getItem('claude_api_key');
      const isSpecificAction = !apiKey ? await handleSpecificActions(message) : false;
      if (isSpecificAction) {
        setIsProcessing(false);
        return;
      }
      
      let enhancedMessage = message;
      let fileContent = "";
      
      if (files && files.length > 0) {
        const file = files[0];
        console.log("Processing file:", file.name, "type:", file.type);
        
        if (file.name.endsWith('.md') || file.type === 'text/markdown' || file.type === 'text/plain') {
          try {
            setIsAgentTyping(true);
            
            const content = await processMarkdownFile(file);
            
            if (!content || content.trim() === "") {
              throw new Error("File content is empty");
            }
            
            enhancedMessage = `${message}\n\nHere is the content of the file:\n\n${content}`;
            
            addMessage({
              type: "agent",
              content: "I'm analyzing your requirements document. This may take a moment...",
              agentType: AgentType.MANAGER,
            });
            
            if (!managerAgent.current) {
              managerAgent.current = AgentFactory.createAgent(AgentType.MANAGER) as ManagerAgent;
            }
            
            const managerResponse = await managerAgent.current.processMarkdownFile(content);
            
            if (isMounted.current) {
              setTimeout(() => {
                setIsAgentTyping(false);
                
                addMessage({
                  type: "agent",
                  content: managerResponse,
                  agentType: AgentType.MANAGER,
                });
                
                // Progress to next wizard step after requirements uploaded
                setCurrentWizardStep(SetupWizardStep.REQUIREMENTS_UPLOADED);
                
                setIsProcessing(false);
              }, 2000);
            }
            return;
          } catch (error) {
            console.error("Error processing markdown file:", error);
            setIsAgentTyping(false);
            addMessage({
              type: "agent",
              content: "I had trouble reading your markdown file. Please try uploading it again.",
              agentType: AgentType.MANAGER,
            });
            setIsAgentTyping(false);
            setIsProcessing(false);
            return;
          }
        } else {
          console.log("File type not supported for parsing:", file.type);
          
          // Handle UI components upload
          if (currentWizardStep === SetupWizardStep.UI_COMPONENTS_SETUP) {
            setIsAgentTyping(false);
            addMessage({
              type: "agent",
              content: `I've received your UI components (${file.name}). These will be incorporated into the project design.`,
              agentType: AgentType.MANAGER,
            });
            
            // Progress to next wizard step for UI components
            setCurrentWizardStep(SetupWizardStep.UI_COMPONENTS_ADDED);
            setIsAgentTyping(false);
            setIsProcessing(false);
            return;
          } else {
            setIsAgentTyping(false);
            addMessage({
              type: "agent",
              content: `I notice you uploaded a file (${file.name}) but I can only process markdown (.md) files for project requirements.`,
              agentType: AgentType.MANAGER,
            });
            setIsAgentTyping(false);
            setIsProcessing(false);
            return;
          }
        }
      }
      
      // Handle GitHub repository connection
      if (currentWizardStep === SetupWizardStep.GITHUB_SETUP && 
          message.toLowerCase().includes("github")) {
        setTimeout(() => {
          setIsAgentTyping(false);
          addMessage({
            type: "agent",
            content: "I've connected your GitHub repository. This will be used for version control throughout the project.",
            agentType: AgentType.MANAGER,
          });
          
          // Progress to next wizard step for GitHub
          setCurrentWizardStep(SetupWizardStep.GITHUB_CONNECTED);
          setIsProcessing(false);
        }, 2000);
        return;
      }
      
      // Handle documentation setup
      if (currentWizardStep === SetupWizardStep.DOCUMENTATION_SETUP && 
          message.toLowerCase().includes("documentation")) {
        setTimeout(() => {
          setIsAgentTyping(false);
          addMessage({
            type: "agent",
            content: "I've indexed the documentation for your technology stack. This will help me provide more relevant suggestions during development.",
            agentType: AgentType.MANAGER,
          });
          
          // Progress to next wizard step for documentation
          setCurrentWizardStep(SetupWizardStep.DOCUMENTATION_ADDED);
          setIsProcessing(false);
        }, 2000);
        return;
      }
      
      // Handle project approval
      if (currentWizardStep === SetupWizardStep.UI_COMPONENTS_ADDED && 
          message.toLowerCase().includes("approve")) {
        setTimeout(() => {
          setIsAgentTyping(false);
          addMessage({
            type: "agent",
            content: "Great! I've approved your project plan. I'll now assign tasks to the specialized agents and we'll begin development on your e-commerce website.",
            agentType: AgentType.MANAGER,
          });
          
          // Progress to project in progress
          setCurrentWizardStep(SetupWizardStep.PROJECT_IN_PROGRESS);
          setIsProcessing(false);
        }, 2000);
        return;
      }
      
      // Handle adding more resources
      if (currentWizardStep === SetupWizardStep.UI_COMPONENTS_ADDED && 
          message.toLowerCase().includes("more resources")) {
        setTimeout(() => {
          setIsAgentTyping(false);
          addMessage({
            type: "agent",
            content: "You can add more resources to the project. Please upload any additional files or documentation that you'd like to include.",
            agentType: AgentType.MANAGER,
          });
          
          // Stay in the same step to allow for more resources
          setIsProcessing(false);
        }, 2000);
        return;
      }
      
      // Handle project modification
      if (currentWizardStep === SetupWizardStep.UI_COMPONENTS_ADDED && 
          (message.toLowerCase().includes("reject") || message.toLowerCase().includes("modify"))) {
        setTimeout(() => {
          setIsAgentTyping(false);
          addMessage({
            type: "agent",
            content: "I understand you'd like to modify the project plan. Please let me know what changes you'd like to make, and I'll update the plan accordingly.",
            agentType: AgentType.MANAGER,
          });
          
          // Go back to review step
          setCurrentWizardStep(SetupWizardStep.PROJECT_REVIEW);
          setIsProcessing(false);
        }, 2000);
        return;
      }
      
      // Default message handling for other cases
      const agentType = AgentFactory.determineAgentType(enhancedMessage, []);
      console.log("Selected agent type:", agentType);
      
      const agent = AgentFactory.createAgent(agentType);
      
      // Extract knowledge resources from knowledgeBase if it exists
      let knowledgeResources: KnowledgeResource[] = [];
      if (knowledgeBase) {
        // Flatten the knowledgeBase object into an array of KnowledgeResource
        Object.values(knowledgeBase).forEach(categoryResources => {
          if (Array.isArray(categoryResources)) {
            knowledgeResources = [...knowledgeResources, ...categoryResources];
          }
        });
      }
      
      const generatedResponse = knowledgeResources.length > 0 
        ? await agent.generateKnowledgeEnhancedResponse(enhancedMessage, [], knowledgeResources)
        : await agent.generateResponse(enhancedMessage, []);
      
      if (isMounted.current) {
        const typingDelay = fileContent ? 2000 : 1000;
        
        setTimeout(() => {
          setIsAgentTyping(false);
          
          addMessage({
            type: "agent",
            content: generatedResponse,
            agentType: agentType,
          });
          
          setIsProcessing(false);
        }, typingDelay);
      }
    } catch (error) {
      console.error("Error processing message:", error);
      toast.error("Failed to process message. Please try again.");
      
      if (isMounted.current) {
        setIsAgentTyping(false);
        addMessage({
          type: "agent",
          content: "I'm sorry, I encountered an error while processing your message. Please try again.",
          agentType: AgentType.MANAGER,
        });
        setIsProcessing(false);
      }
    }
  };

  return null;
}
