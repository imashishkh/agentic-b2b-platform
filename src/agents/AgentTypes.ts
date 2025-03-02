
/**
 * Defines the types of specialized AI agents available in the system
 */
export enum AgentType {
  MANAGER = "manager",
  FRONTEND = "frontend",
  BACKEND = "backend",
  DATABASE = "database",
  DEVOPS = "devops",
  UX = "ux",
  ECOMMERCE = "ecommerce"
}

/**
 * Represents the basic structure of an AI agent
 */
export interface Agent {
  type: AgentType;
  name: string;
  title: string;
  description: string;
  expertise: string[];
  canHandle: (message: string) => boolean;
  generateResponse: (message: string, projectPhases?: any[]) => Promise<string>;
  icon?: React.ComponentType<{ size?: number }>;
}

/**
 * Interface for code generation capabilities
 */
export interface CodeGenerationCapabilities {
  generateCode: (prompt: string, language: string, type: string, context?: string) => Promise<string>;
  generateComponentCode: (componentType: string, requirements: string, framework?: string) => Promise<string>;
  generateSchemaCode: (entityType: string, requirements: string, databaseType?: string) => Promise<string>;
  evaluateCode: (code: string, language: string) => Promise<CodeEvaluation>;
}

/**
 * Interface for code evaluation results
 */
export interface CodeEvaluation {
  isValid: boolean;
  issues: CodeIssue[];
  suggestions: string[];
  securityConcerns: string[];
  performanceNotes: string[];
}

/**
 * Interface for a code issue
 */
export interface CodeIssue {
  line?: number;
  column?: number;
  severity: 'error' | 'warning' | 'info';
  message: string;
  code?: string;
}

/**
 * Properties for the AgentMessage component
 */
export interface AgentMessageProps {
  message: string;
  agentType: AgentType;
  isLoading?: boolean;
  isTaskAssignment?: boolean;
}

/**
 * Interface for a performance metric
 */
export interface PerformanceMetric {
  name: string;
  description: string;
  category: string; // frontend, backend, database, user_experience, business
  target: string;
  measurementTool: string;
  priority: 'high' | 'medium' | 'low';
}

/**
 * Interface for an optimization recommendation
 */
export interface OptimizationRecommendation {
  area: string; // frontend, backend, database
  title: string;
  description: string;
  implementationComplexity: 'high' | 'medium' | 'low';
  impact: 'high' | 'medium' | 'low';
  priority: 'high' | 'medium' | 'low';
}
