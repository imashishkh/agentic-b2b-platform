
/**
 * Utility functions for agent coordination
 */

import { AgentType } from "../AgentTypes";
import { createAgent } from "../AgentFactory";

/**
 * Coordinates with other agents when dependencies are detected
 */
export async function coordinateWithOtherAgents(
  userMessage: string,
  dependencyInfo: { hasDependencies: boolean; dependentAgents: AgentType[]; dependencyDetails: string },
  projectPhases: any[],
  agentType: AgentType,
  title: string
): Promise<string> {
  // If no dependencies to handle or we're the manager, skip coordination
  if (!dependencyInfo.hasDependencies || agentType === AgentType.MANAGER) {
    return consultDevManager(userMessage, "Need coordination with multiple teams", projectPhases, agentType, title);
  }
  
  let responses: string[] = [];
  
  // Consult each dependent agent
  for (const agentType of dependencyInfo.dependentAgents) {
    const agent = createAgent(agentType);
    
    // Create a focused prompt for the dependency
    const dependencyPrompt = `
      I'm the ${title} and I need your input on the following task:
      "${userMessage}"
      
      Specifically, I need your expertise on: ${dependencyInfo.dependencyDetails}
      
      Please provide a short, focused response that I can use to move forward with my part of the task.
      Focus on the technical requirements and interfaces between our systems.
    `;
    
    try {
      const agentResponse = await agent.generateResponse(dependencyPrompt, projectPhases);
      responses.push(`## Input from ${agent.title}:\n\n${agentResponse}\n`);
    } catch (error) {
      console.error(`Error consulting with ${agentType} agent:`, error);
      responses.push(`## Input from ${agentType} specialist (failed to retrieve):\n\nI was unable to get specific information from this team at the moment.\n`);
    }
  }
  
  // Synthesize a response that includes coordination details
  const myExpertise = `As the ${title}, here's my assessment based on the inputs from other teams:`;
  
  // Consult with manager to synthesize the final coordinated response
  const managerAgent = createAgent(AgentType.MANAGER);
  const synthesisPrompt = `
    As the Development Manager, please synthesize these different specialist inputs into a cohesive plan:
    
    Original user request: "${userMessage}"
    
    ${responses.join('\n')}
    
    The ${title}'s initial assessment: "${dependencyInfo.dependencyDetails}"
    
    Please create a coordinated response that outlines:
    1. The correct sequence of development steps
    2. Dependencies between different teams
    3. A clear path forward for implementation
    4. Any technical integration points that need special attention
  `;
  
  const coordinatedPlan = await managerAgent.generateResponse(synthesisPrompt, projectPhases);
  
  return `
# Coordinated Development Plan

${myExpertise}

${coordinatedPlan}

Let me know if you'd like to focus on a specific aspect of this plan or if you need more details on any part of the implementation.
  `;
}

/**
 * Consults the Dev Manager when this agent is stuck
 */
export async function consultDevManager(
  userMessage: string, 
  agentResponse: string, 
  projectPhases: any[],
  agentType: AgentType,
  title: string
): Promise<string> {
  // Only create a new manager if this isn't already the manager
  if (agentType === AgentType.MANAGER) {
    // If the manager is already stuck, we don't want an infinite loop
    return `I need more information to properly answer this question. ${agentResponse.replace("ESCALATE:", "")}`;
  }
  
  // Create a manager agent
  const managerAgent = createAgent(AgentType.MANAGER);
  
  // Create a prompt for the manager that includes the specialist's attempt
  const managerPrompt = `
    One of your team members (${title}) needs guidance on the following user question:
    
    "${userMessage}"
    
    The ${title} attempted to answer but wasn't confident:
    
    "${agentResponse.replace("ESCALATE:", "")}"
    
    As the Development Manager, please provide guidance or a more complete answer to help the team member.
  `;
  
  // Get the manager's response
  const managerResponse = await managerAgent.generateResponse(managerPrompt, projectPhases);
  
  // Format the final response to indicate it came via the manager
  return `
I consulted with the Development Manager about your question. Here's their guidance:

${managerResponse}

If you'd like more specific ${title.toLowerCase()} implementation details, please let me know.
  `;
}
