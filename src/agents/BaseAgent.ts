
import { AgentType } from './AgentTypes';
import { findRelevantResources, generateKnowledgeContext } from '@/utils/knowledgeRelevance';
import { KnowledgeResource } from '@/contexts/types';

/**
 * Base Agent class that other specialized agents extend
 */
export class BaseAgent {
  agentType: AgentType;
  
  constructor(agentType: AgentType) {
    this.agentType = agentType;
  }
  
  /**
   * Generate a response based on the message
   */
  async generateResponse(message: string, previousMessages: string[]): Promise<string> {
    console.log(`BaseAgent(${this.agentType}): Generating response for message`);
    
    // Base implementation just returns a fallback message
    return `I am the ${this.agentType} agent. I processed your message but I don't have a specific implementation for it yet.`;
  }
  
  /**
   * Enrich response with knowledge base resources
   */
  enrichResponseWithKnowledge(message: string, knowledgeBase: KnowledgeResource[]): string {
    // Find relevant resources for this message
    const relevantResources = findRelevantResources(knowledgeBase, message, 3);
    
    if (relevantResources.length === 0) {
      return '';
    }
    
    // Generate knowledge context from relevant resources
    return generateKnowledgeContext(relevantResources);
  }
  
  /**
   * Format knowledge with the response
   */
  formatResponseWithKnowledge(response: string, knowledgeContext: string): string {
    if (!knowledgeContext) {
      return response;
    }
    
    return `${response}\n\n---\n\n**Relevant Knowledge Base Resources:**\n\n${knowledgeContext}`;
  }
  
  /**
   * Add knowledge-enhanced responses
   */
  async generateKnowledgeEnhancedResponse(
    message: string, 
    previousMessages: string[], 
    knowledgeBase: KnowledgeResource[]
  ): Promise<string> {
    // Get basic response
    const basicResponse = await this.generateResponse(message, previousMessages);
    
    // Enrich with knowledge if available
    if (knowledgeBase && knowledgeBase.length > 0) {
      const knowledgeContext = this.enrichResponseWithKnowledge(message, knowledgeBase);
      if (knowledgeContext) {
        return this.formatResponseWithKnowledge(basicResponse, knowledgeContext);
      }
    }
    
    return basicResponse;
  }
  
  /**
   * Perform security check on code snippets in the message
   */
  async performSecurityCheck(message: string): Promise<any> {
    // Extract code snippets from message
    const codeRegex = /```(?:javascript|typescript|js|ts|jsx|tsx)?\s*([\s\S]*?)```/g;
    const matches = [...message.matchAll(codeRegex)];
    
    if (matches.length === 0) {
      return null;
    }
    
    const codeSnippets = matches.map(match => match[1]);
    const securityIssues = [];
    
    for (const code of codeSnippets) {
      // Check for security issues
      if (this.containsSecurityIssue(code)) {
        securityIssues.push({
          code,
          issues: this.identifySecurityIssues(code)
        });
      }
    }
    
    return securityIssues.length > 0 ? securityIssues : null;
  }
  
  /**
   * Check if code contains security issues
   */
  containsSecurityIssue(code: string): boolean {
    // Basic checks for common security issues
    const securityPatterns = [
      // Injection vulnerabilities
      /exec\s*\(/i,
      /eval\s*\(/i,
      /new\s+Function\s*\(/i,
      /document\.write\s*\(/i,
      
      // XSS vulnerabilities
      /innerHTML\s*=/i,
      /outerHTML\s*=/i,
      /dangerouslySetInnerHTML/i,
      
      // Hardcoded credentials
      /const\s+(?:password|token|secret|key)\s*=\s*['"][^'"]+['"]/i,
      /let\s+(?:password|token|secret|key)\s*=\s*['"][^'"]+['"]/i,
      /var\s+(?:password|token|secret|key)\s*=\s*['"][^'"]+['"]/i,
      
      // Insecure crypto
      /crypto\.createHash\s*\(\s*['"]md5['"]/i,
      /crypto\.createHash\s*\(\s*['"]sha1['"]/i,
      
      // Insecure cookies
      /document\.cookie\s*=/i,
      /cookies\s*=.*?secure:\s*false/i,
      /cookies\s*=.*?httpOnly:\s*false/i
    ];
    
    return securityPatterns.some(pattern => pattern.test(code));
  }
  
  /**
   * Identify specific security issues in code
   */
  identifySecurityIssues(code: string): string[] {
    const issues = [];
    
    // Check for injection vulnerabilities
    if (/exec\s*\(/i.test(code) || /eval\s*\(/i.test(code) || /new\s+Function\s*\(/i.test(code)) {
      issues.push("Code injection vulnerability: Use of eval(), exec(), or new Function() can lead to code injection attacks.");
    }
    
    // Check for XSS vulnerabilities
    if (/innerHTML\s*=/i.test(code) || /outerHTML\s*=/i.test(code) || /dangerouslySetInnerHTML/i.test(code)) {
      issues.push("Cross-site scripting (XSS) vulnerability: Direct DOM manipulation without sanitization.");
    }
    
    // Check for hardcoded credentials
    if (/const\s+(?:password|token|secret|key)\s*=\s*['"][^'"]+['"]/i.test(code) ||
        /let\s+(?:password|token|secret|key)\s*=\s*['"][^'"]+['"]/i.test(code) ||
        /var\s+(?:password|token|secret|key)\s*=\s*['"][^'"]+['"]/i.test(code)) {
      issues.push("Hardcoded credentials: Sensitive information should not be hardcoded in the source code.");
    }
    
    // Check for insecure crypto
    if (/crypto\.createHash\s*\(\s*['"]md5['"]/i.test(code) || /crypto\.createHash\s*\(\s*['"]sha1['"]/i.test(code)) {
      issues.push("Insecure cryptography: MD5 and SHA-1 are considered cryptographically weak.");
    }
    
    // Check for insecure cookies
    if (/document\.cookie\s*=/i.test(code) || /cookies\s*=.*?secure:\s*false/i.test(code) || /cookies\s*=.*?httpOnly:\s*false/i.test(code)) {
      issues.push("Insecure cookie usage: Cookies should use secure and httpOnly flags.");
    }
    
    return issues;
  }
  
  /**
   * Enhance response with compliance guidance
   */
  enhanceWithComplianceGuidance(response: string, domain: string = 'e-commerce'): string {
    let complianceAddendum = "\n\n## Compliance Considerations\n\n";
    
    if (domain === 'e-commerce') {
      complianceAddendum += "When implementing this functionality, consider these compliance requirements:\n\n";
      complianceAddendum += "- **PCI DSS**: Ensure any payment card data is handled according to PCI DSS requirements.\n";
      complianceAddendum += "- **GDPR**: Implement proper user consent mechanisms and data handling practices.\n";
      complianceAddendum += "- **ADA/WCAG**: Ensure all user interfaces are accessible.\n";
      complianceAddendum += "- **Local e-commerce regulations**: Check for location-specific requirements.\n";
    }
    
    return response + complianceAddendum;
  }
}
