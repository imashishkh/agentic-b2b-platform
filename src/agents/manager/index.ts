
import { BaseAgent } from "../BaseAgent";
import { AgentType } from "../AgentTypes";
import { toast } from "sonner";
import { recommendArchitecturalPatterns } from "@/utils/architectureUtils";
import { SecurityFinding, ComplianceRequirement } from "@/contexts/types";
import { PerformanceMetric, OptimizationRecommendation } from "../AgentTypes";

// Import the specialized manager modules
import * as TaskManager from "./TaskManager";
import * as SecurityManager from "./SecurityManager";
import * as PerformanceManager from "./PerformanceManager";
import * as MessageDetector from "./MessageDetector";
import * as KnowledgeManager from "./KnowledgeManager";

/**
 * DevManager Agent - Oversees project structure and coordinates between specialized agents
 * 
 * This agent serves as the primary coordinator for the entire e-commerce development project.
 * It handles high-level planning, task allocation, and cross-functional coordination.
 * The manager has final authority on technical decisions and can resolve conflicts between
 * specialist recommendations.
 */
export class ManagerAgent extends BaseAgent {
  type = AgentType.MANAGER;
  name = "DevManager";
  title = "Development Manager";
  description = "Coordinates project phases and integrates work from all specialized agents";
  
  // Track the current project state
  private projectRequirements: string = "";
  private parsedTasks: any[] = [];
  private assignedTasks: Map<AgentType, any[]> = new Map();
  private performanceMetrics: PerformanceMetric[] = [];
  private performanceRecommendations: OptimizationRecommendation[] = [];
  
  constructor() {
    super();
    // Initialize empty task assignments
    Object.values(AgentType).forEach(agentType => {
      this.assignedTasks.set(agentType, []);
    });
  }
  
  /**
   * Areas of expertise for the Development Manager
   * These inform the agent's capabilities and response generation
   */
  expertise = [
    "Project planning",
    "Task breakdown",
    "Sprint planning",
    "Resource allocation",
    "Technical requirements gathering",
    "Cross-functional team coordination",
    "Technical oversight and guidance",
    "Architectural decision-making",
    "Quality assurance",
    "Security review",
    "Security review checkpoints",
    "Vulnerability assessment",
    "Compliance checking",
    "Best practices enforcement",
    "Security review",
    "Vulnerability assessment",
    "Compliance checking",
    "Best practices enforcement",
    "Performance optimization strategy",
    "E-commerce domain expertise",
    "Knowledge base management",
    "Documentation management",
    "System architecture design",
    "Testing strategy development",
    "GitHub integration"
  ];
  
  /**
   * Determines if this agent can handle the given message
   * 
   * @param message - The user message to evaluate
   * @returns boolean indicating whether this agent can handle the message
   */
  canHandle(message: string): boolean {
    // The manager is the default agent and can handle all messages
    return true;
  }
  
  /**
   * Process markdown file content and extract project requirements
   * 
   * @param markdownContent - The content of the markdown file
   * @returns Promise with processing result
   */
  async processMarkdownFile(markdownContent: string): Promise<string> {
    console.log("Processing markdown file in ManagerAgent");
    
    try {
      // Store the requirements for future reference
      this.projectRequirements = markdownContent;
      
      // Use enhanced markdown parsing if available
      try {
        const { extractTasksWithDependencies, generateDependencyGraph } = await import('@/utils/markdownParser');
        
        // Use enhanced task extraction with dependencies and priority detection
        const extractedTasks = extractTasksWithDependencies(markdownContent);
        this.parsedTasks = extractedTasks;
        
        // Generate dependency graph
        const dependencyGraph = generateDependencyGraph(extractedTasks);
        console.log("Generated dependency graph:", dependencyGraph);
        
        // Assign tasks to different specialist agents
        this.assignedTasks = await TaskManager.assignTasksToSpecialists(extractedTasks);
        
        return TaskManager.generateEnhancedTaskSummary(extractedTasks, dependencyGraph, this.projectRequirements);
      } catch (error) {
        console.error("Error using enhanced markdown parsing, falling back to basic:", error);
        // Fall back to basic parsing if enhanced parsing fails
      }
      
      // Fall back to original method if enhanced method fails
      // Extract tasks from the markdown
      const tasks = await TaskManager.extractTasksFromMarkdown(markdownContent);
      this.parsedTasks = tasks;
      
      // Assign tasks to different specialist agents
      this.assignedTasks = await TaskManager.assignTasksToSpecialists(tasks);
      
      return TaskManager.generateTaskSummary(this.parsedTasks, this.assignedTasks);
    } catch (error) {
      console.error("Error processing markdown file:", error);
      return "I encountered an error while processing your requirements document. Please try again or upload a different file.";
    }
  }
  
  /**
   * Generate a response based on the message
   * 
   * @param message - The user message
   * @param projectPhases - Optional project phases
   * @returns Promise with the response
   */
  async generateResponse(message: string, projectPhases?: any[]): Promise<string> {
    console.log("Generating response for:", message);
    
    // Check for message intent
    if (MessageDetector.isFileUploadRequest(message)) {
      // Handle file upload requests
      return "I'll analyze your uploaded requirements document. Please give me a moment to process it.";
    } else if (MessageDetector.isKnowledgeBaseRequest(message)) {
      // Handle knowledge base requests
      return KnowledgeManager.generateKnowledgeBasePrompt();
    } else if (MessageDetector.isArchitectureRequest(message)) {
      // Handle architecture proposals
      const recommendations = recommendArchitecturalPatterns(this.projectRequirements || message);
      const topPatterns = recommendations.slice(0, 3);
      
      const response = ["# Architecture Recommendations\n\n"];
      response.push("Based on your requirements, I recommend these architectural patterns:\n\n");
      
      topPatterns.forEach((rec, index) => {
        response.push(`## ${index + 1}. ${rec.pattern}\n\n`);
        response.push(`${rec.description}\n\n`);
        response.push("**Benefits:**\n\n");
        response.push("- Scalability\n");
        response.push("- Maintainability\n");
        response.push("- Separation of concerns\n\n");
      });
      
      return response.join("");
    } else if (MessageDetector.isSecurityAssessmentRequest(message)) {
      // Handle security assessment requests
      const mockCode = "Sample code for demonstration"; // This would be actual code in a real implementation
      const findings = await SecurityManager.performSecurityScan(mockCode);
      const requirements = await SecurityManager.performComplianceCheck(mockCode);
      
      return SecurityManager.generateSecurityReport(findings, requirements);
    } else if (MessageDetector.isPerformanceOptimizationRequest(message)) {
      // Handle performance optimization requests
      const metrics = PerformanceManager.getPerformanceMetrics();
      return PerformanceManager.generatePerformanceMonitoringPlan("Your E-commerce Application");
    } else if (MessageDetector.isTaskManagementRequest(message) && this.parsedTasks.length > 0) {
      // Handle task management requests if tasks have been parsed
      return TaskManager.generateTaskSummary(this.parsedTasks, this.assignedTasks);
    } else {
      // Default response
      return super.generateResponse(message, projectPhases);
    }
  }
  
  /**
   * Perform security scan on code
   * 
   * @param code - The code to scan
   * @returns Promise with security findings
   */
  async performSecurityScan(code: string): Promise<SecurityFinding[]> {
    return SecurityManager.performSecurityScan(code);
  }
  
  /**
   * Perform compliance check on code
   * 
   * @param code - The code to check
   * @param standard - The compliance standard
   * @returns Promise with compliance requirements
   */
  async performComplianceCheck(code: string, standard: string = "owasp"): Promise<ComplianceRequirement[]> {
    return SecurityManager.performComplianceCheck(code, standard);
  }
  
  /**
   * Generate security report
   * 
   * @param findings - Security findings
   * @param complianceRequirements - Compliance requirements
   * @returns Formatted security report
   */
  generateSecurityReport(findings: SecurityFinding[], complianceRequirements: ComplianceRequirement[]): string {
    return SecurityManager.generateSecurityReport(findings, complianceRequirements);
  }
}
