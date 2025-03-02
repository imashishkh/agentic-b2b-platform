
/**
 * Utility functions for detecting various conditions in agent inputs/outputs
 */

import { AgentType } from "../AgentTypes";

/**
 * Detects if the response or user message indicates dependencies on other teams
 */
export function detectDependencies(response: string, userMessage: string): { 
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
    const agentType = stringToAgentType(agentTypeStr);
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
export function stringToAgentType(typeString: string): AgentType | null {
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
 * Determines if the agent appears to be stuck or uncertain based on response
 */
export function isAgentStuck(response: string): boolean {
  // Check for indicators of uncertainty or explicit escalation requests
  return response.includes("ESCALATE:") || 
         response.includes("I'm not sure") || 
         response.includes("This is outside my expertise") ||
         response.includes("I don't have enough information");
}

/**
 * Determines if we should search for additional info
 */
export function shouldSearchForAdditionalInfo(message: string): boolean {
  // Look for indications that the message needs external resources
  return message.match(/best practice|recommend|example|how to|tutorial|resource|reference|library|framework|tool/i) !== null;
}

/**
 * Determines if we should search for code examples
 */
export function shouldSearchForCodeExamples(message: string): boolean {
  return message.match(/example|sample|code|implementation|how to implement|pattern/i) !== null;
}

/**
 * Determines if we should search for package information
 */
export function shouldSearchForPackageInfo(message: string): boolean {
  return message.match(/package|library|dependency|install|npm|yarn/i) !== null;
}

/**
 * Extracts package name from user message
 */
export function extractPackageName(message: string, type: AgentType): string {
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
  
  return defaultPackages[type] || "react";
}

/**
 * Determines if code testing is needed
 */
export function shouldTestCode(message: string, response: string): boolean {
  return (message.match(/test|validate|check|verify/i) !== null && 
         response.includes("```")) || message.includes("test this code");
}

/**
 * Extracts code to test from Claude response
 */
export function extractCodeToTest(response: string): string {
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
export function determineTestType(message: string): string {
  if (message.match(/unit test|test function|method test/i)) {
    return "unit";
  }
  if (message.match(/integration|api test|component test/i)) {
    return "integration";
  }
  return "general";
}

/**
 * Determines if troubleshooting is needed
 */
export function shouldTroubleshootCode(message: string): boolean {
  return message.match(/error|not working|issue|bug|fix|trouble|debug/i) !== null;
}

/**
 * Extracts error message from user message
 */
export function extractErrorMessage(message: string): string {
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
 * Determines if security check is needed
 */
export function shouldCheckSecurity(message: string, response: string): boolean {
  return (message.match(/secure|security|vulnerability|safe/i) !== null && 
         response.includes("```")) || 
         (message.includes("payment") && response.includes("```"));
}

/**
 * Extracts code to check for security issues
 */
export function extractCodeToCheck(response: string): string {
  // Same as extractCodeToTest
  return extractCodeToTest(response);
}
