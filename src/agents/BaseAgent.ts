import { Agent, AgentType } from "./AgentTypes";
import { 
  askClaude, 
  searchInternet, 
  searchCodeExamples, 
  searchPackages, 
  testCode, 
  troubleshootCode, 
  checkSecurity 
} from "@/utils/aiServices";
import { createAgent } from "./AgentFactory";

/**
 * Base class for all AI agents with common functionality
 */
export abstract class BaseAgent implements Agent {
  abstract type: AgentType;
  abstract name: string;
  abstract title: string;
  abstract description: string;
  abstract expertise: string[];
  private memory: Map<string, any> = new Map();
  
  /**
   * Determines if this agent can handle the specific message
   */
  abstract canHandle(message: string): boolean;
  
  /**
   * Generates a response for the given user message
   */
  async generateResponse(userMessage: string, projectPhases: any[] = []): Promise<string> {
    try {
      // Create a prompt template for Claude based on agent expertise
      const promptForClaude = this.createPrompt(userMessage, projectPhases);
      
      // Call Claude API (or simulated response)
      const claudeResponse = await askClaude(promptForClaude);
      
      // Check if dependencies on other teams are detected
      const dependencyInfo = this.detectDependencies(claudeResponse, userMessage);
      if (dependencyInfo.hasDependencies) {
        return await this.coordinateWithOtherAgents(userMessage, dependencyInfo, projectPhases);
      }
      
      // If the response indicates the agent is not confident or stuck
      if (this.isAgentStuck(claudeResponse)) {
        return await this.consultDevManager(userMessage, claudeResponse, projectPhases);
      }
      
      // Check if we need to search for code examples
      if (this.shouldSearchForCodeExamples(userMessage)) {
        const codeQuery = this.createCodeSearchQuery(userMessage);
        const codeExamples = await searchCodeExamples(codeQuery);
        return this.enhanceResponseWithCodeExamples(claudeResponse, codeExamples);
      }
      
      // Check if we need package information
      if (this.shouldSearchForPackageInfo(userMessage)) {
        const packageName = this.extractPackageName(userMessage);
        const packageInfo = await searchPackages(packageName);
        return this.enhanceResponseWithPackageInfo(claudeResponse, packageInfo);
      }
      
      // Check if there's code that needs testing
      if (this.shouldTestCode(userMessage, claudeResponse)) {
        const codeToTest = this.extractCodeToTest(claudeResponse);
        const testType = this.determineTestType(userMessage);
        const testResults = await testCode(codeToTest, testType);
        return this.enhanceResponseWithTestResults(claudeResponse, testResults);
      }
      
      // Check if there are errors that need troubleshooting
      if (this.shouldTroubleshootCode(userMessage)) {
        const errorMessage = this.extractErrorMessage(userMessage);
        const troubleshootingInfo = await troubleshootCode(errorMessage);
        return this.enhanceResponseWithTroubleshooting(claudeResponse, troubleshootingInfo);
      }
      
      // Check if we need to run a security check
      if (this.shouldCheckSecurity(userMessage, claudeResponse)) {
        const codeToCheck = this.extractCodeToCheck(claudeResponse);
        const securityResults = await checkSecurity(codeToCheck);
        return this.enhanceResponseWithSecurityCheck(claudeResponse, securityResults);
      }
      
      // If the message suggests we need additional information, search for it
      if (this.shouldSearchForAdditionalInfo(userMessage)) {
        const searchQuery = this.createSearchQuery(userMessage, projectPhases);
        const searchResults = await searchInternet(searchQuery);
        
        // Enhance the response with search results
        return this.enhanceResponseWithSearch(claudeResponse, searchResults);
      }
      
      return claudeResponse;
    } catch (error) {
      console.error(`${this.name} agent error:`, error);
      return `I encountered an error processing your request. Please try again or contact the development team if the issue persists.`;
    }
  }
  
  /**
   * Store information in agent's memory
   */
  protected rememberInfo(key: string, value: any): void {
    this.memory.set(key, value);
  }
  
  /**
   * Retrieve information from agent's memory
   */
  protected recallInfo(key: string): any {
    return this.memory.get(key);
  }
  
  /**
   * Creates a prompt for Claude based on the agent's expertise
   */
  protected createPrompt(userMessage: string, projectPhases: any[]): string {
    const expertiseContext = this.expertise.join(", ");
    
    return `
      As an AI agent specializing in ${expertiseContext} for e-commerce platforms, please respond to the following user message:
      
      User: "${userMessage}"
      
      ${projectPhases.length > 0 
        ? `Consider the following project phases while responding: ${JSON.stringify(projectPhases)}` 
        : "The project structure has not been defined yet."}
      
      Focus on providing technical, actionable advice specific to your domain of expertise.
      Be detailed yet concise. Include code snippets where appropriate.
      
      If you need to coordinate with other specialists, include "COORDINATE_WITH:" followed by the specialist type and what you need from them.
      For example: "COORDINATE_WITH:BACKEND:Need API endpoints for product data before I can implement the frontend components"
      
      If you're not confident in your answer or this is outside your expertise, please respond with "ESCALATE:" followed by your best attempt at an answer.
    `;
  }
  
  /**
   * Detects if the response or user message indicates dependencies on other teams
   */
  protected detectDependencies(response: string, userMessage: string): { 
    hasDependencies: boolean; 
    dependentAgents: AgentType[];
    dependencyDetails: string;
  } {
    const dependencyInfo = {
      hasDependencies: false,
      dependentAgents: [] as AgentType[],
      dependencyDetails: ""
    };
    
    // Check if the response explicitly mentions coordination needs
    const coordinateRegex = /COORDINATE_WITH:([A-Z]+):(.+?)(?=COORDINATE_WITH:|$)/g;
    let match;
    
    while ((match = coordinateRegex.exec(response)) !== null) {
      dependencyInfo.hasDependencies = true;
      const agentTypeStr = match[1].toLowerCase();
      const detail = match[2].trim();
      
      // Convert string to AgentType
      const agentType = this.stringToAgentType(agentTypeStr);
      if (agentType && !dependencyInfo.dependentAgents.includes(agentType)) {
        dependencyInfo.dependentAgents.push(agentType);
      }
      
      dependencyInfo.dependencyDetails += `${detail} `;
    }
    
    // If no explicit coordination tags but there's implicit dependency language
    if (!dependencyInfo.hasDependencies) {
      // Look for phrases that suggest dependencies
      const dependencyPhrases = [
        { regex: /need.*(api|endpoint|backend|server)/i, agent: AgentType.BACKEND },
        { regex: /backend.*first/i, agent: AgentType.BACKEND },
        { regex: /database.*(schema|model|design)/i, agent: AgentType.DATABASE },
        { regex: /UI|design.*needed/i, agent: AgentType.UX },
        { regex: /deployment|pipeline.*setup/i, agent: AgentType.DEVOPS },
        { regex: /frontend.*integration/i, agent: AgentType.FRONTEND }
      ];
      
      for (const phrase of dependencyPhrases) {
        if (response.match(phrase.regex) || userMessage.match(phrase.regex)) {
          dependencyInfo.hasDependencies = true;
          if (!dependencyInfo.dependentAgents.includes(phrase.agent)) {
            dependencyInfo.dependentAgents.push(phrase.agent);
            dependencyInfo.dependencyDetails += `Need input from ${phrase.agent} specialist. `;
          }
        }
      }
    }
    
    return dependencyInfo;
  }
  
  /**
   * Converts a string to an AgentType enum value
   */
  protected stringToAgentType(typeString: string): AgentType | null {
    const normalizedString = typeString.toLowerCase();
    switch (normalizedString) {
      case 'frontend': return AgentType.FRONTEND;
      case 'backend': return AgentType.BACKEND;
      case 'database': return AgentType.DATABASE;
      case 'devops': return AgentType.DEVOPS;
      case 'ux': return AgentType.UX;
      case 'manager': return AgentType.MANAGER;
      default: return null;
    }
  }
  
  /**
   * Coordinates with other agents when dependencies are detected
   */
  protected async coordinateWithOtherAgents(
    userMessage: string,
    dependencyInfo: { hasDependencies: boolean; dependentAgents: AgentType[]; dependencyDetails: string },
    projectPhases: any[]
  ): Promise<string> {
    // If no dependencies to handle or we're the manager, skip coordination
    if (!dependencyInfo.hasDependencies || this.type === AgentType.MANAGER) {
      return this.consultDevManager(userMessage, "Need coordination with multiple teams", projectPhases);
    }
    
    let responses: string[] = [];
    
    // Consult each dependent agent
    for (const agentType of dependencyInfo.dependentAgents) {
      const agent = createAgent(agentType);
      
      // Create a focused prompt for the dependency
      const dependencyPrompt = `
        I'm the ${this.title} and I need your input on the following task:
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
    const myExpertise = `As the ${this.title}, here's my assessment based on the inputs from other teams:`;
    
    // Consult with manager to synthesize the final coordinated response
    const managerAgent = createAgent(AgentType.MANAGER);
    const synthesisPrompt = `
      As the Development Manager, please synthesize these different specialist inputs into a cohesive plan:
      
      Original user request: "${userMessage}"
      
      ${responses.join('\n')}
      
      The ${this.title}'s initial assessment: "${dependencyInfo.dependencyDetails}"
      
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
   * Determines if the agent appears to be stuck or uncertain based on their response
   */
  protected isAgentStuck(response: string): boolean {
    // Check for indicators of uncertainty or explicit escalation requests
    return response.includes("ESCALATE:") || 
           response.includes("I'm not sure") || 
           response.includes("This is outside my expertise") ||
           response.includes("I don't have enough information");
  }
  
  /**
   * Consults the Dev Manager when this agent is stuck
   */
  protected async consultDevManager(userMessage: string, agentResponse: string, projectPhases: any[]): Promise<string> {
    // Only create a new manager if this isn't already the manager
    if (this.type === AgentType.MANAGER) {
      // If the manager is already stuck, we don't want an infinite loop
      return `I need more information to properly answer this question. ${agentResponse.replace("ESCALATE:", "")}`;
    }
    
    // Create a manager agent
    const managerAgent = createAgent(AgentType.MANAGER);
    
    // Create a prompt for the manager that includes the specialist's attempt
    const managerPrompt = `
      One of your team members (${this.title}) needs guidance on the following user question:
      
      "${userMessage}"
      
      The ${this.title} attempted to answer but wasn't confident:
      
      "${agentResponse.replace("ESCALATE:", "")}"
      
      As the Development Manager, please provide guidance or a more complete answer to help the team member.
    `;
    
    // Get the manager's response
    const managerResponse = await managerAgent.generateResponse(managerPrompt, projectPhases);
    
    // Format the final response to indicate it came via the manager
    return `
I consulted with the Development Manager about your question. Here's their guidance:

${managerResponse}

If you'd like more specific ${this.title.toLowerCase()} implementation details, please let me know.
    `;
  }
  
  /**
   * Determines if we should search for additional info
   */
  protected shouldSearchForAdditionalInfo(message: string): boolean {
    // Look for indications that the message needs external resources
    // e.g., "best practices", "examples", "resources", etc.
    return message.match(/best practice|recommend|example|how to|tutorial|resource|reference|library|framework|tool/i) !== null;
  }
  
  /**
   * Creates a search query based on the message and project phases
   */
  protected createSearchQuery(message: string, projectPhases: any[]): string {
    // Extract the core question or topic from the message
    const coreQuery = message.replace(/(?:can you|please|i want to|how do i|what is the best way to)\s+/gi, "");
    
    // Combine with agent expertise for a targeted search
    return `${this.type} ${coreQuery} e-commerce best practices`;
  }
  
  /**
   * Enhances the Claude response with information from external search
   */
  protected enhanceResponseWithSearch(claudeResponse: string, searchResults: string): string {
    return `
${claudeResponse}

## Additional Resources

Based on best practices and current industry standards:

${searchResults}

Would you like me to elaborate on any specific aspect of these recommendations?
    `;
  }
  
  /**
   * Determines if we should search for code examples
   */
  protected shouldSearchForCodeExamples(message: string): boolean {
    return message.match(/example|sample|code|implementation|how to implement|pattern/i) !== null;
  }
  
  /**
   * Creates a search query for code examples
   */
  protected createCodeSearchQuery(message: string): string {
    return `${this.type.toLowerCase()} ${message.replace(/can you (show|provide|give) (me )?(an |some )?(example|code|implementation)/i, "")} e-commerce`;
  }
  
  /**
   * Enhances the Claude response with code examples
   */
  protected enhanceResponseWithCodeExamples(claudeResponse: string, codeExamples: string): string {
    return `
${claudeResponse}

## Implementation Examples

Here are some code examples that might help:

${codeExamples}

Would you like me to explain any specific part in more detail?
    `;
  }
  
  /**
   * Determines if we should search for package information
   */
  protected shouldSearchForPackageInfo(message: string): boolean {
    return message.match(/package|library|dependency|install|npm|yarn/i) !== null;
  }
  
  /**
   * Extracts package name from user message
   */
  protected extractPackageName(message: string): string {
    // Try to extract a package name from the message
    const matches = message.match(/package[s]?\s+(?:called|named)?\s+['"]?([a-zA-Z0-9\-_@\/]+)['"]?/i) || 
                   message.match(/['"]?([a-zA-Z0-9\-_@\/]+)['"]?\s+package/i) ||
                   message.match(/install\s+['"]?([a-zA-Z0-9\-_@\/]+)['"]?/i);
    
    if (matches && matches[1]) {
      return matches[1];
    }
    
    // Default packages based on agent type if no specific package mentioned
    const defaultPackages: Record<AgentType, string> = {
      [AgentType.FRONTEND]: "react-query",
      [AgentType.BACKEND]: "express",
      [AgentType.DATABASE]: "prisma",
      [AgentType.DEVOPS]: "docker",
      [AgentType.UX]: "framer-motion",
      [AgentType.MANAGER]: "project-management"
    };
    
    return defaultPackages[this.type] || "react";
  }
  
  /**
   * Enhances the Claude response with package information
   */
  protected enhanceResponseWithPackageInfo(claudeResponse: string, packageInfo: string): string {
    return `
${claudeResponse}

## Package Information

${packageInfo}

Let me know if you'd like to explore other packages or need help with implementation.
    `;
  }
  
  /**
   * Determines if code testing is needed
   */
  protected shouldTestCode(message: string, response: string): boolean {
    return (message.match(/test|validate|check|verify/i) !== null && 
           response.includes("```")) || message.includes("test this code");
  }
  
  /**
   * Extracts code to test from Claude response
   */
  protected extractCodeToTest(response: string): string {
    const codeBlockRegex = /```(?:jsx?|tsx?|javascript|typescript)?\n([\s\S]*?)\n```/g;
    let match;
    let extractedCode = "";
    
    while ((match = codeBlockRegex.exec(response)) !== null) {
      extractedCode += match[1] + "\n\n";
    }
    
    return extractedCode.trim() || "// No code found to test";
  }
  
  /**
   * Determines what type of test to run
   */
  protected determineTestType(message: string): string {
    if (message.match(/unit test|test function|method test/i)) {
      return "unit";
    }
    if (message.match(/integration|api test|component test/i)) {
      return "integration";
    }
    return "general";
  }
  
  /**
   * Enhances the Claude response with test results
   */
  protected enhanceResponseWithTestResults(claudeResponse: string, testResults: string): string {
    return `
${claudeResponse}

## Code Testing Results

${testResults}

Would you like me to help implement any of these suggestions?
    `;
  }
  
  /**
   * Determines if troubleshooting is needed
   */
  protected shouldTroubleshootCode(message: string): boolean {
    return message.match(/error|not working|issue|bug|fix|trouble|debug/i) !== null;
  }
  
  /**
   * Extracts error message from user message
   */
  protected extractErrorMessage(message: string): string {
    // Try to extract text that looks like an error message
    const errorMatches = message.match(/error[:\s]+([^\n]+)/i) || 
                         message.match(/([^\s]+Error[^\.]+)/i);
    
    if (errorMatches && errorMatches[1]) {
      return errorMatches[1].trim();
    }
    
    // If no specific error found, use the whole message
    return message;
  }
  
  /**
   * Enhances the Claude response with troubleshooting information
   */
  protected enhanceResponseWithTroubleshooting(claudeResponse: string, troubleshootingInfo: string): string {
    return `
${claudeResponse}

## Troubleshooting Guide

${troubleshootingInfo}

Let me know if you'd like more specific help resolving this issue.
    `;
  }
  
  /**
   * Determines if security check is needed
   */
  protected shouldCheckSecurity(message: string, response: string): boolean {
    return (message.match(/secure|security|vulnerability|safe/i) !== null && 
           response.includes("```")) || 
           (message.includes("payment") && response.includes("```"));
  }
  
  /**
   * Extracts code to check for security issues
   */
  protected extractCodeToCheck(response: string): string {
    // Same as extractCodeToTest
    return this.extractCodeToTest(response);
  }
  
  /**
   * Enhances the Claude response with security check results
   */
  protected enhanceResponseWithSecurityCheck(claudeResponse: string, securityResults: string): string {
    return `
${claudeResponse}

## Security Analysis

${securityResults}

Security is particularly important for e-commerce platforms. Let me know if you'd like help implementing any of these recommendations.
    `;
  }
}
