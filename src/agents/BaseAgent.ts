
import { AgentType } from './AgentTypes';
import { findRelevantResources, generateKnowledgeContext } from '@/utils/knowledgeRelevance';
import { KnowledgeResource } from '@/contexts/types';
import DOMPurify from 'dompurify';

/**
 * Configuration for API requests with retry options
 */
interface ApiRequestConfig {
  maxRetries?: number;
  retryDelay?: number;
  timeout?: number;
  fallbackResponse?: any;
}

/**
 * Default API request configuration
 */
const DEFAULT_API_CONFIG: ApiRequestConfig = {
  maxRetries: 3,
  retryDelay: 1000,
  timeout: 10000,
};

/**
 * Base Agent class that other specialized agents extend
 */
export class BaseAgent {
  agentType: AgentType;
  
  constructor(agentType: AgentType) {
    this.agentType = agentType;
  }
  
  /**
   * Generate a response based on the message with error handling
   */
  async generateResponse(message: string, previousMessages: string[]): Promise<string> {
    console.log(`BaseAgent(${this.agentType}): Generating response for message`);
    
    try {
      // Sanitize inputs to prevent XSS and other injection attacks
      const sanitizedMessage = this.sanitizeInput(message);
      const sanitizedPreviousMessages = previousMessages.map(this.sanitizeInput);
      
      // In a real implementation, this would make an API call to the actual backend
      // Here we're demonstrating proper error handling and retry logic
      const response = await this.makeApiRequestWithRetry(
        "https://api.example.com/generate-response",
        {
          agentType: this.agentType,
          message: sanitizedMessage,
          previousMessages: sanitizedPreviousMessages
        },
        {
          fallbackResponse: `I am the ${this.agentType} agent. I processed your message but I don't have a specific implementation for it yet.`
        }
      );
      
      return response;
    } catch (error) {
      console.error(`Error generating response for ${this.agentType}:`, error);
      // Graceful degradation - return a user-friendly message instead of exposing error details
      return `I apologize, but I'm currently unable to process your request. Our team has been notified of this issue.`;
    }
  }
  
  /**
   * Make API request with retry logic
   */
  async makeApiRequestWithRetry(url: string, data: any, config: ApiRequestConfig = {}): Promise<any> {
    const { maxRetries, retryDelay, timeout, fallbackResponse } = {
      ...DEFAULT_API_CONFIG,
      ...config
    };
    
    let lastError: Error | null = null;
    
    // For demonstration, we'll simulate API responses based on the agent type
    // In a real implementation, this would make actual API calls with proper retry logic
    for (let attempt = 0; attempt < (maxRetries || 1); attempt++) {
      try {
        // Simulating API call with potential errors
        const shouldThrowError = Math.random() < 0.3 && attempt < (maxRetries || 1) - 1;
        
        if (shouldThrowError) {
          throw new Error("Simulated API error for retry demonstration");
        }
        
        // Successful response simulation
        // In real implementation, this would be: const response = await fetch(url, { ... })
        return `I am the ${this.agentType} agent. I've processed your request successfully.`;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        console.warn(`API request attempt ${attempt + 1} failed:`, lastError);
        
        if (attempt < (maxRetries || 1) - 1) {
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          console.log(`Retrying request, attempt ${attempt + 2}/${maxRetries}`);
        }
      }
    }
    
    // If we exhaust all retries, use fallback or throw the last error
    if (fallbackResponse !== undefined) {
      console.warn("Using fallback response after all retry attempts failed");
      return fallbackResponse;
    }
    
    throw lastError || new Error("Failed to make API request after all retry attempts");
  }
  
  /**
   * Sanitize input to prevent XSS attacks
   */
  sanitizeInput(input: string): string {
    // Basic sanitization - in a real implementation, you might use DOMPurify or similar
    let sanitized = input.trim();
    
    // Escape HTML special characters
    sanitized = sanitized
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
    
    return sanitized;
  }
  
  /**
   * Enrich response with knowledge base resources
   */
  enrichResponseWithKnowledge(message: string, knowledgeBase: KnowledgeResource[]): string {
    // Sanitize input
    const sanitizedMessage = this.sanitizeInput(message);
    
    // Find relevant resources for this message
    const relevantResources = findRelevantResources(knowledgeBase, sanitizedMessage, 3);
    
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
   * Add knowledge-enhanced responses with error handling
   */
  async generateKnowledgeEnhancedResponse(
    message: string, 
    previousMessages: string[], 
    knowledgeBase: KnowledgeResource[]
  ): Promise<string> {
    try {
      // Get basic response with proper error handling
      const basicResponse = await this.generateResponse(message, previousMessages);
      
      // Enrich with knowledge if available
      if (knowledgeBase && knowledgeBase.length > 0) {
        const knowledgeContext = this.enrichResponseWithKnowledge(message, knowledgeBase);
        if (knowledgeContext) {
          return this.formatResponseWithKnowledge(basicResponse, knowledgeContext);
        }
      }
      
      return basicResponse;
    } catch (error) {
      console.error("Error generating knowledge-enhanced response:", error);
      return "I'm having trouble accessing my knowledge base right now. I can still try to help with your question.";
    }
  }
  
  /**
   * Improved security check on code snippets in the message with proper validation
   */
  async performSecurityCheck(message: string): Promise<any> {
    try {
      // Sanitize input
      const sanitizedMessage = this.sanitizeInput(message);
      
      // Extract code snippets from message
      const codeRegex = /```(?:javascript|typescript|js|ts|jsx|tsx)?\s*([\s\S]*?)```/g;
      const matches = [...sanitizedMessage.matchAll(codeRegex)];
      
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
    } catch (error) {
      console.error("Error performing security check:", error);
      return {
        error: "Failed to complete security check",
        message: "Unable to analyze code for security issues. Please review manually."
      };
    }
  }
  
  /**
   * Check if code contains security issues with improved patterns
   */
  containsSecurityIssue(code: string): boolean {
    // More comprehensive security checks
    const securityPatterns = [
      // Injection vulnerabilities
      /exec\s*\(/i,
      /eval\s*\(/i,
      /new\s+Function\s*\(/i,
      /document\.write\s*\(/i,
      /setTimeout\s*\(\s*['"`]/i,
      /setInterval\s*\(\s*['"`]/i,
      
      // XSS vulnerabilities
      /innerHTML\s*=/i,
      /outerHTML\s*=/i,
      /insertAdjacentHTML\s*\(/i,
      /dangerouslySetInnerHTML/i,
      
      // Hardcoded credentials
      /const\s+(?:password|token|secret|key|apiKey|api_key)\s*=\s*['"][^'"]+['"]/i,
      /let\s+(?:password|token|secret|key|apiKey|api_key)\s*=\s*['"][^'"]+['"]/i,
      /var\s+(?:password|token|secret|key|apiKey|api_key)\s*=\s*['"][^'"]+['"]/i,
      
      // Insecure crypto
      /crypto\.createHash\s*\(\s*['"]md5['"]/i,
      /crypto\.createHash\s*\(\s*['"]sha1['"]/i,
      
      // Insecure cookies
      /document\.cookie\s*=/i,
      /cookies\s*=.*?secure:\s*false/i,
      /cookies\s*=.*?httpOnly:\s*false/i,
      
      // SQL Injection
      /executeQuery\s*\(\s*['"`][^'"`]*\$\{/i,
      /executeQuery\s*\(\s*['"`][^'"`]*\+/i,
      
      // Prototype pollution
      /Object\.assign\s*\(\s*Object\.prototype/i,
      /\.__proto__\s*=/i,
      
      // Path traversal
      /\.\.\//,
      
      // Command injection
      /child_process\.exec\s*\(/i,
      /spawn\s*\(\s*['"`][^'"`]*\$\{/i
    ];
    
    return securityPatterns.some(pattern => pattern.test(code));
  }
  
  /**
   * Identify specific security issues in code with better descriptions
   */
  identifySecurityIssues(code: string): string[] {
    const issues = [];
    
    // Check for injection vulnerabilities
    if (/exec\s*\(/i.test(code) || /eval\s*\(/i.test(code) || /new\s+Function\s*\(/i.test(code) || 
        /setTimeout\s*\(\s*['"`]/i.test(code) || /setInterval\s*\(\s*['"`]/i.test(code)) {
      issues.push("Code injection vulnerability: Use of eval(), exec(), new Function(), or string-based setTimeout/setInterval can lead to code injection attacks.");
    }
    
    // Check for XSS vulnerabilities
    if (/innerHTML\s*=/i.test(code) || /outerHTML\s*=/i.test(code) || 
        /dangerouslySetInnerHTML/i.test(code) || /insertAdjacentHTML\s*\(/i.test(code)) {
      issues.push("Cross-site scripting (XSS) vulnerability: Direct DOM manipulation without sanitization. Use safe alternatives or sanitize HTML content.");
    }
    
    // Check for hardcoded credentials
    if (/const\s+(?:password|token|secret|key|apiKey|api_key)\s*=\s*['"][^'"]+['"]/i.test(code) ||
        /let\s+(?:password|token|secret|key|apiKey|api_key)\s*=\s*['"][^'"]+['"]/i.test(code) ||
        /var\s+(?:password|token|secret|key|apiKey|api_key)\s*=\s*['"][^'"]+['"]/i.test(code)) {
      issues.push("Hardcoded credentials: Sensitive information should not be hardcoded in the source code. Use environment variables or secure vaults.");
    }
    
    // Check for insecure crypto
    if (/crypto\.createHash\s*\(\s*['"]md5['"]/i.test(code) || /crypto\.createHash\s*\(\s*['"]sha1['"]/i.test(code)) {
      issues.push("Insecure cryptography: MD5 and SHA-1 are considered cryptographically weak. Use stronger algorithms like SHA-256 or SHA-3.");
    }
    
    // Check for insecure cookies
    if (/document\.cookie\s*=/i.test(code) || /cookies\s*=.*?secure:\s*false/i.test(code) || /cookies\s*=.*?httpOnly:\s*false/i.test(code)) {
      issues.push("Insecure cookie usage: Cookies should use secure and httpOnly flags to protect against XSS and MITM attacks.");
    }
    
    // Check for SQL injection
    if (/executeQuery\s*\(\s*['"`][^'"`]*\$\{/i.test(code) || /executeQuery\s*\(\s*['"`][^'"`]*\+/i.test(code)) {
      issues.push("SQL Injection vulnerability: Never construct SQL queries by concatenating user input. Use parameterized queries or an ORM.");
    }
    
    // Check for path traversal
    if (/\.\.\//i.test(code) && /(?:readFile|writeFile|createReadStream|fs\.)/i.test(code)) {
      issues.push("Path traversal vulnerability: Avoid using '../' in file paths, especially with user input. Use path.resolve() and validate inputs.");
    }
    
    // Check for prototype pollution
    if (/Object\.assign\s*\(\s*Object\.prototype/i.test(code) || /\.__proto__\s*=/i.test(code)) {
      issues.push("Prototype pollution: Modifying object prototypes can lead to prototype pollution attacks. Avoid assigning to __proto__ or Object.prototype.");
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
