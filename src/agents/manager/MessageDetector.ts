
/**
 * Checks if a message is related to knowledge base requests
 * 
 * @param message - The user message to evaluate
 * @returns boolean indicating whether this is a knowledge base request
 */
export function isKnowledgeBaseRequest(message: string): boolean {
  return message.match(/knowledge base|documentation|reference|resource|link|article|guide|tutorial|standard|best practice|example/i) !== null;
}

/**
 * Checks if a message is related to architecture proposals
 * 
 * @param message - The user message to evaluate
 * @returns boolean indicating whether this is an architecture proposal request
 */
export function isArchitectureRequest(message: string): boolean {
  return message.match(/architecture|system design|component|diagram|structure|high level design|technical architecture|stack|technology choice/i) !== null;
}

/**
 * Checks if a message is related to testing strategies
 * 
 * @param message - The user message to evaluate
 * @returns boolean indicating whether this is a testing strategy request
 */
export function isTestingStrategyRequest(message: string): boolean {
  return message.match(/testing|test strategy|unit test|integration test|end-to-end|e2e|quality assurance|qa plan/i) !== null;
}

/**
 * Checks if a message is related to GitHub integration
 * 
 * @param message - The user message to evaluate
 * @returns boolean indicating whether this is a GitHub integration request
 */
export function isGitHubRequest(message: string): boolean {
  return message.match(/github|git|repository|version control|branch|commit|pr|pull request/i) !== null;
}

/**
 * Checks if the message contains a file upload
 * 
 * @param message - The user message to evaluate
 * @returns boolean indicating whether this message contains a file upload
 */
export function isFileUploadRequest(message: string): boolean {
  return message.match(/analyze this file|uploaded|file upload|requirements document|spec document|project spec/i) !== null;
}

/**
 * Checks if a message is related to performance optimization
 * 
 * @param message - The user message to evaluate
 * @returns boolean indicating whether this is a performance optimization request
 */
export function isPerformanceOptimizationRequest(message: string): boolean {
  return message.match(/performance|optimization|speed|latency|slow|fast|metrics|benchmark|monitoring/i) !== null;
}

/**
 * Checks if a message is related to task management
 * 
 * @param message - The user message to evaluate
 * @returns boolean indicating whether this is a task management request 
 */
export function isTaskManagementRequest(message: string): boolean {
  return message.match(/task|assignment|priority|dependency|milestone|timeline|schedule|plan|roadmap/i) !== null;
}

/**
 * Checks if a message is related to user feedback
 * 
 * @param message - The user message to evaluate
 * @returns boolean indicating whether this is a user feedback request
 */
export function isUserFeedbackRequest(message: string): boolean {
  return message.match(/feedback|survey|user testing|usability|interview|questionnaire|review/i) !== null;
}

/**
 * Checks if a message is related to deployment
 * 
 * @param message - The user message to evaluate
 * @returns boolean indicating whether this is a deployment request
 */
export function isDeploymentRequest(message: string): boolean {
  return message.match(/deploy|release|production|staging|environment|ci\/cd|pipeline|build/i) !== null;
}
