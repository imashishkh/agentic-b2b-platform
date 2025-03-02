
/**
 * MessageDetector - Helper functions to detect types of messages
 */
export class MessageDetector {
  /**
   * Checks if a message is related to knowledge base requests
   * 
   * @param message - The user message to evaluate
   * @returns boolean indicating whether this is a knowledge base request
   */
  static isKnowledgeBaseRequest(message: string): boolean {
    return message.match(/knowledge base|documentation|reference|resource|link|article|guide|tutorial|standard|best practice|example/i) !== null;
  }
  
  /**
   * Checks if a message is related to architecture proposals
   * 
   * @param message - The user message to evaluate
   * @returns boolean indicating whether this is an architecture proposal request
   */
  static isArchitectureRequest(message: string): boolean {
    return message.match(/architecture|system design|component|diagram|structure|high level design|technical architecture|stack|technology choice/i) !== null;
  }
  
  /**
   * Checks if a message is related to testing strategies
   * 
   * @param message - The user message to evaluate
   * @returns boolean indicating whether this is a testing strategy request
   */
  static isTestingStrategyRequest(message: string): boolean {
    return message.match(/testing|test strategy|unit test|integration test|end-to-end|e2e|quality assurance|qa plan/i) !== null;
  }
  
  /**
   * Checks if a message is related to GitHub integration
   * 
   * @param message - The user message to evaluate
   * @returns boolean indicating whether this is a GitHub integration request
   */
  static isGitHubRequest(message: string): boolean {
    return message.match(/github|git|repository|version control|branch|commit|pr|pull request/i) !== null;
  }
  
  /**
   * Checks if the message contains a file upload
   * 
   * @param message - The user message to evaluate
   * @returns boolean indicating whether this message contains a file upload
   */
  static isFileUploadRequest(message: string): boolean {
    return message.match(/analyze this file|uploaded|file upload|requirements document|spec document|project spec/i) !== null;
  }
  
  /**
   * Checks if a message is related to security assessment
   * 
   * @param message - The user message to evaluate
   * @returns boolean indicating whether this is a security assessment request
   */
  static isSecurityAssessmentRequest(message: string): boolean {
    return message.match(/security|vulnerability|compliance|secure coding|best practices|owasp|penetration test|security scan/i) !== null;
  }
  
  /**
   * Checks if a message is related to performance monitoring
   * 
   * @param message - The user message to evaluate
   * @returns boolean indicating whether this is a performance monitoring request
   */
  static isPerformanceRequest(message: string): boolean {
    return message.match(/performance|speed|optimization|monitoring|metrics|benchmark|load test|stress test|response time|latency/i) !== null;
  }
}

export default MessageDetector;
