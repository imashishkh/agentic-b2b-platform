
import React, { useEffect } from "react";
import { useChat } from "@/contexts/ChatContext";
import { parseMarkdownToTasks } from "@/utils/projectParser";
import { createAgent, determineAgentType } from "@/agents/AgentFactory";
import { AgentType } from "@/agents/AgentTypes";

/**
 * Props interface for the ChatProcessor component
 */
interface ChatProcessorProps {
  chatRef: React.MutableRefObject<any>;  // Reference to expose methods to parent
}

/**
 * ChatProcessor - Core component that processes user messages and generates agent responses
 * 
 * This component handles:
 * - Processing user text inputs and file uploads
 * - Determining which agent should respond
 * - Managing the conversation flow
 * - Parsing project requirements
 * - Assigning tasks to specialized agents
 * - Managing knowledge base resources
 * 
 * @param chatRef - Reference that exposes the processUserMessage method to parent components
 */
export function ChatProcessor({ chatRef }: ChatProcessorProps) {
  const {
    addMessage,
    setIsAgentTyping,
    setIsFetchingResponse,
    projectPhases,
    hasRequestedFile,
    setProjectPhases,
    setHasRequestedFile,
    setCurrentAgentType,
    knowledgeBase,
    isRequestingKnowledge,
    setIsRequestingKnowledge
  } = useChat();

  /**
   * Process the user's message and generate an agent response
   * This is the main method for handling user inputs
   * 
   * @param userMessage - The text message from the user
   * @param files - Optional array of uploaded files
   */
  const processUserMessage = async (userMessage: string, files?: File[]) => {
    // Add user message to chat
    addMessage({ type: "user", content: userMessage });
    
    // Show typing indicator
    setIsAgentTyping(true);
    
    try {
      // Check if files were uploaded
      if (files && files.length > 0) {
        const markdownFiles = files.filter(file => 
          file.name.endsWith('.md') || file.type === 'text/markdown'
        );
        
        if (markdownFiles.length > 0) {
          setIsFetchingResponse(true);
          
          // Read and process the first markdown file
          const reader = new FileReader();
          reader.onload = async (e) => {
            try {
              const markdownContent = e.target?.result as string;
              const result = await parseMarkdownToTasks(markdownContent);
              setProjectPhases(result.phases);
              
              // Create task assignments by agent type
              const taskAssignments = assignTasksToAgents(result.phases);
              
              // Add the analysis response
              addMessage({ 
                type: "agent", 
                content: result.response,
                agentType: AgentType.MANAGER
              });
              
              // Add task assignments message
              setTimeout(() => {
                addMessage({ 
                  type: "agent", 
                  content: generateTaskAssignmentMessage(taskAssignments),
                  agentType: AgentType.MANAGER
                });
                
                // Request knowledge base resources
                setTimeout(() => {
                  const managerAgent = createAgent(AgentType.MANAGER) as any;
                  const knowledgeBasePrompt = managerAgent.generateKnowledgeBasePrompt();
                  
                  addMessage({ 
                    type: "agent", 
                    content: knowledgeBasePrompt,
                    agentType: AgentType.MANAGER
                  });
                  
                  setIsRequestingKnowledge(true);
                  setIsAgentTyping(false);
                }, 1000);
              }, 1000);
            } catch (error) {
              console.error("Error processing markdown file:", error);
              addMessage({ 
                type: "agent", 
                content: "I encountered an error while processing your markdown file. Please check the format and try again.",
                agentType: AgentType.MANAGER
              });
              setIsAgentTyping(false);
            } finally {
              setIsFetchingResponse(false);
              setHasRequestedFile(false);
            }
          };
          
          reader.onerror = () => {
            addMessage({ 
              type: "agent", 
              content: "There was an error reading your file. Please try again with a different file.",
              agentType: AgentType.MANAGER
            });
            setIsAgentTyping(false);
            setIsFetchingResponse(false);
          };
          
          reader.readAsText(markdownFiles[0]);
          return;
        }
      }
      
      // Check if we're in knowledge base request mode
      if (isRequestingKnowledge) {
        // Check if this message contains a URL for the knowledge base
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const urls = userMessage.match(urlRegex);
        
        if (urls && urls.length > 0) {
          // User is likely providing a resource, respond accordingly
          setTimeout(() => {
            const managerAgent = createAgent(AgentType.MANAGER);
            managerAgent.generateResponse(userMessage, projectPhases).then(response => {
              addMessage({ 
                type: "agent", 
                content: response,
                agentType: AgentType.MANAGER
              });
              setIsAgentTyping(false);
            });
          }, 1000);
        } else {
          // No URL found, assume user wants to move on
          setTimeout(() => {
            setIsRequestingKnowledge(false);
            addMessage({ 
              type: "agent", 
              content: "Now that we have set up the knowledge base, we can proceed with architecture planning. What specific aspect of the e-commerce platform would you like to focus on first?",
              agentType: AgentType.MANAGER
            });
            setIsAgentTyping(false);
          }, 1000);
        }
        return;
      }
      
      // Continue with existing logic for handling text inputs
      
      // Check if this is the first user message and they didn't upload a file
      if (hasRequestedFile && 
          !userMessage.includes("```markdown") && 
          !userMessage.includes("```md") &&
          !userMessage.toLowerCase().includes(".md")) {
        
        // They didn't provide a markdown file, so ask if they want to create a structured plan
        setTimeout(() => {
          addMessage({ 
            type: "agent", 
            content: "I notice you haven't uploaded a markdown file. Would you like me to help you create a structured development plan based on our conversation? I can break down your e-commerce requirements into phases and specific tasks. Let's start by discussing the core features you need.",
            agentType: AgentType.MANAGER
          });
          setHasRequestedFile(false);
          setIsAgentTyping(false);
        }, 1000);
        return;
      }
      
      // Check if this is a markdown parsing request (inline markdown)
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
        setIsFetchingResponse(true);
        
        try {
          const result = await parseMarkdownToTasks(markdownContent);
          setProjectPhases(result.phases);
          
          // Create task assignments by agent type
          const taskAssignments = assignTasksToAgents(result.phases);
          
          setTimeout(() => {
            addMessage({ 
              type: "agent", 
              content: result.response,
              agentType: AgentType.MANAGER
            });
            
            // Add task assignments message
            setTimeout(() => {
              addMessage({ 
                type: "agent", 
                content: generateTaskAssignmentMessage(taskAssignments),
                agentType: AgentType.MANAGER
              });
              
              // Request knowledge base resources
              setTimeout(() => {
                const managerAgent = createAgent(AgentType.MANAGER) as any;
                const knowledgeBasePrompt = managerAgent.generateKnowledgeBasePrompt();
                
                addMessage({ 
                  type: "agent", 
                  content: knowledgeBasePrompt,
                  agentType: AgentType.MANAGER
                });
                
                setIsRequestingKnowledge(true);
                setIsAgentTyping(false);
              }, 1000);
            }, 1000);
          }, 1000);
        } catch (error) {
          console.error("Error parsing markdown:", error);
          addMessage({ 
            type: "agent", 
            content: "I encountered an error while parsing your markdown. Please check the format and try again.",
            agentType: AgentType.MANAGER
          });
          setIsAgentTyping(false);
        } finally {
          setIsFetchingResponse(false);
        }
        return;
      }
      
      // Regular response flow - determine the best agent to handle this message
      try {
        // Determine which agent should handle this message
        const agentType = determineAgentType(userMessage, projectPhases);
        
        // Set the current agent type in the context
        setCurrentAgentType(agentType);
        
        // Create the appropriate agent instance
        const agent = createAgent(agentType);
        
        // Generate response using the specialized agent
        const response = await agent.generateResponse(userMessage, projectPhases);
        
        // If this is the manager agent, check if we need to enhance response with knowledge base
        let enhancedResponse = response;
        if (agentType === AgentType.MANAGER && knowledgeBase.length > 0) {
          // Only enhance if the response doesn't already reference the knowledge base
          if (!response.includes("Knowledge Base Resources")) {
            const managerAgent = agent as any;
            if (managerAgent.enhanceResponseWithKnowledgeBase) {
              enhancedResponse = managerAgent.enhanceResponseWithKnowledgeBase(response, knowledgeBase);
            }
          }
        }
        
        setTimeout(() => {
          addMessage({ 
            type: "agent", 
            content: enhancedResponse,
            agentType: agentType
          });
          setIsAgentTyping(false);
        }, 1000);
      } catch (error) {
        console.error("Error generating response:", error);
        addMessage({ 
          type: "agent", 
          content: "I encountered an error processing your message. Please try again.",
          agentType: AgentType.MANAGER
        });
        setIsAgentTyping(false);
      }
    } catch (error) {
      console.error("Error processing message:", error);
      setIsAgentTyping(false);
      addMessage({ 
        type: "agent", 
        content: "I encountered an error processing your message. Please try again.",
        agentType: AgentType.MANAGER
      });
    }
  };

  /**
   * Analyzes project phases and assigns tasks to appropriate agent types
   * This helps organize which specialist should handle each task
   * 
   * @param phases - Array of project phases with tasks
   * @returns Record mapping agent types to their assigned tasks
   */
  const assignTasksToAgents = (phases: any[]): Record<AgentType, string[]> => {
    const assignments: Record<AgentType, string[]> = {
      [AgentType.FRONTEND]: [],
      [AgentType.BACKEND]: [],
      [AgentType.DATABASE]: [],
      [AgentType.DEVOPS]: [],
      [AgentType.UX]: [],
      [AgentType.MANAGER]: []
    };
    
    phases.forEach(phase => {
      phase.tasks.forEach((task: string) => {
        // Use keywords to determine which agent should handle each task
        if (task.match(/frontend|UI|component|react|design|css|tailwind|style|layout|responsive|mobile|desktop|animation/i)) {
          assignments[AgentType.FRONTEND].push(task);
        } 
        else if (task.match(/backend|API|endpoint|server|route|controller|middleware|authentication|authorization/i)) {
          assignments[AgentType.BACKEND].push(task);
        }
        else if (task.match(/database|DB|schema|model|query|SQL|NoSQL|migration|table|document|collection|entity/i)) {
          assignments[AgentType.DATABASE].push(task);
        }
        else if (task.match(/deployment|CI\/CD|pipeline|container|docker|kubernetes|cloud|AWS|Azure|GCP|monitoring|logging/i)) {
          assignments[AgentType.DEVOPS].push(task);
        }
        else if (task.match(/UX|UI|user experience|wireframe|mockup|prototype|user research|usability|accessibility|flow/i)) {
          assignments[AgentType.UX].push(task);
        }
        else {
          // Default to manager for coordination tasks and anything not clearly matching other agents
          assignments[AgentType.MANAGER].push(task);
        }
      });
    });
    
    return assignments;
  };

  /**
   * Generates a formatted message with task assignments for each agent
   * This creates a visual breakdown of which agent is responsible for which tasks
   * 
   * @param assignments - Record mapping agent types to their assigned tasks
   * @returns Formatted markdown message with task assignments
   */
  const generateTaskAssignmentMessage = (assignments: Record<AgentType, string[]>): string => {
    const agentNames = {
      [AgentType.FRONTEND]: "Frontend Developer",
      [AgentType.BACKEND]: "Backend Developer",
      [AgentType.DATABASE]: "Database Architect",
      [AgentType.DEVOPS]: "DevOps Engineer",
      [AgentType.UX]: "UX Designer",
      [AgentType.MANAGER]: "Development Manager"
    };
    
    let message = "## Task Assignments by Specialist\n\n";
    
    Object.entries(assignments).forEach(([agentType, tasks]) => {
      if (tasks.length === 0) return;
      
      message += `### ${agentNames[agentType as AgentType]}\n`;
      tasks.forEach(task => {
        message += `- ${task}\n`;
      });
      message += "\n";
    });
    
    return message;
  };

  /**
   * Expose the processUserMessage method to the parent component via the ref
   * This allows the Chat component to trigger message processing
   */
  useEffect(() => {
    if (chatRef) {
      chatRef.current = {
        processUserMessage
      };
    }
  }, [chatRef, projectPhases, hasRequestedFile, isRequestingKnowledge, knowledgeBase]);

  // This component doesn't render anything visible
  return null;
}
