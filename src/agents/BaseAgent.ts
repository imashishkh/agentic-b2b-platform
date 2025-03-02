
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

// Import refactored utility functions
import { createPrompt, createSearchQuery, createCodeSearchQuery } from "./base/agentPrompts";
import { 
  enhanceResponseWithSearch, 
  enhanceResponseWithCodeExamples, 
  enhanceResponseWithPackageInfo,
  enhanceResponseWithTestResults,
  enhanceResponseWithTroubleshooting,
  enhanceResponseWithSecurityCheck
} from "./base/agentEnhancers";
import {
  detectDependencies,
  isAgentStuck,
  shouldSearchForAdditionalInfo,
  shouldSearchForCodeExamples,
  shouldSearchForPackageInfo,
  extractPackageName,
  shouldTestCode,
  extractCodeToTest,
  determineTestType,
  shouldTroubleshootCode,
  extractErrorMessage,
  shouldCheckSecurity,
  extractCodeToCheck
} from "./base/agentDetectors";
import {
  coordinateWithOtherAgents,
  consultDevManager
} from "./base/agentCoordinator";

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
      const promptForClaude = createPrompt(userMessage, projectPhases, this.expertise, this.type, this.title);
      
      // Call Claude API (or simulated response)
      const claudeResponse = await askClaude(promptForClaude);
      
      // Check if dependencies on other teams are detected
      const dependencyInfo = detectDependencies(claudeResponse, userMessage);
      if (dependencyInfo.hasDependencies) {
        return await coordinateWithOtherAgents(userMessage, dependencyInfo, projectPhases, this.type, this.title);
      }
      
      // If the response indicates the agent is not confident or stuck
      if (isAgentStuck(claudeResponse)) {
        return await consultDevManager(userMessage, claudeResponse, projectPhases, this.type, this.title);
      }
      
      // Check if we need to search for code examples
      if (shouldSearchForCodeExamples(userMessage)) {
        const codeQuery = createCodeSearchQuery(userMessage, this.type);
        const codeExamples = await searchCodeExamples(codeQuery);
        return enhanceResponseWithCodeExamples(claudeResponse, codeExamples);
      }
      
      // Check if we need package information
      if (shouldSearchForPackageInfo(userMessage)) {
        const packageName = extractPackageName(userMessage, this.type);
        const packageInfo = await searchPackages(packageName);
        return enhanceResponseWithPackageInfo(claudeResponse, packageInfo);
      }
      
      // Check if there's code that needs testing
      if (shouldTestCode(userMessage, claudeResponse)) {
        const codeToTest = extractCodeToTest(claudeResponse);
        const testType = determineTestType(userMessage);
        const testResults = await testCode(codeToTest, testType);
        return enhanceResponseWithTestResults(claudeResponse, testResults);
      }
      
      // Check if there are errors that need troubleshooting
      if (shouldTroubleshootCode(userMessage)) {
        const errorMessage = extractErrorMessage(userMessage);
        const troubleshootingInfo = await troubleshootCode(errorMessage);
        return enhanceResponseWithTroubleshooting(claudeResponse, troubleshootingInfo);
      }
      
      // Check if we need to run a security check
      if (shouldCheckSecurity(userMessage, claudeResponse)) {
        const codeToCheck = extractCodeToCheck(claudeResponse);
        const securityResults = await checkSecurity(codeToCheck);
        return enhanceResponseWithSecurityCheck(claudeResponse, securityResults);
      }
      
      // If the message suggests we need additional information, search for it
      if (shouldSearchForAdditionalInfo(userMessage)) {
        const searchQuery = createSearchQuery(userMessage, projectPhases, this.type);
        const searchResults = await searchInternet(searchQuery);
        
        // Enhance the response with search results
        return enhanceResponseWithSearch(claudeResponse, searchResults);
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
   * Creates a specialized prompt for the AI model
   * This method can be overridden by subclasses for customization
   */
  protected createPrompt(userMessage: string, projectPhases: any[]): string {
    return createPrompt(userMessage, projectPhases, this.expertise, this.type, this.title);
  }
  
  /**
   * Creates a search query based on the message
   * This method can be overridden by subclasses for customization
   */
  protected createSearchQuery(message: string, projectPhases: any[]): string {
    return createSearchQuery(message, projectPhases, this.type);
  }
}
