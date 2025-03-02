
import { BaseAgent } from "../BaseAgent";
import { AgentType } from "../AgentTypes";
import TaskManager from "./TaskManager";
import SecurityManager from "./SecurityManager";
import PerformanceManager from "./PerformanceManager";
import KnowledgeManager from "./KnowledgeManager";
import MessageDetector from "./MessageDetector";
import { 
  PerformanceMetric, 
  OptimizationRecommendation, 
  SecurityFinding,
  ComplianceRequirement
} from "@/contexts/types";
import { generatePerformanceReport } from "@/utils/performanceMonitoring";

/**
 * DevManager Agent - Main agent implementation that integrates specialized manager modules
 */
export class ManagerAgent extends BaseAgent {
  type = AgentType.MANAGER;
  name = "DevManager";
  title = "Development Manager";
  description = "Coordinates project phases and integrates work from all specialized agents";
  
  // Areas of expertise (kept from original implementation)
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
      // Extract tasks from the markdown using TaskManager
      const extractedTasks = await TaskManager.parseMarkdownForTasks(markdownContent);
      
      // Assign tasks to specialists
      TaskManager.assignTasksToSpecialists(extractedTasks);
      
      // Generate task summary
      try {
        const { generateDependencyGraph } = await import('@/utils/markdownParser');
        const dependencyGraph = generateDependencyGraph(extractedTasks);
        return TaskManager.generateEnhancedTaskSummary(extractedTasks, dependencyGraph);
      } catch (error) {
        console.error("Error generating enhanced summary:", error);
        return TaskManager.generateTaskSummary();
      }
    } catch (error) {
      console.error("Error processing markdown file:", error);
      return "I encountered an error while processing your requirements document. Please try again or upload a different file.";
    }
  }
  
  /**
   * Proxy methods to the MessageDetector
   */
  isKnowledgeBaseRequest(message: string): boolean {
    return MessageDetector.isKnowledgeBaseRequest(message);
  }
  
  isArchitectureRequest(message: string): boolean {
    return MessageDetector.isArchitectureRequest(message);
  }
  
  isTestingStrategyRequest(message: string): boolean {
    return MessageDetector.isTestingStrategyRequest(message);
  }
  
  isGitHubRequest(message: string): boolean {
    return MessageDetector.isGitHubRequest(message);
  }
  
  isFileUploadRequest(message: string): boolean {
    return MessageDetector.isFileUploadRequest(message);
  }
  
  isSecurityAssessmentRequest(message: string): boolean {
    return MessageDetector.isSecurityAssessmentRequest(message);
  }
  
  /**
   * Generate knowledge base prompt
   */
  generateKnowledgeBasePrompt(): string {
    return KnowledgeManager.generateKnowledgeBasePrompt();
  }
  
  /**
   * Proxy methods to the SecurityManager
   */
  async performSecurityScan(code: string): Promise<SecurityFinding[]> {
    return SecurityManager.performSecurityScan(code);
  }
  
  async performComplianceCheck(code: string, standard: string = "owasp"): Promise<ComplianceRequirement[]> {
    return SecurityManager.performComplianceCheck(code, standard);
  }
  
  generateSecurityReport(findings: SecurityFinding[], requirements: ComplianceRequirement[]): string {
    return SecurityManager.generateSecurityReport(findings, requirements);
  }
  
  /**
   * Proxy methods to the PerformanceManager
   */
  addPerformanceMetric(metric: PerformanceMetric): void {
    PerformanceManager.addPerformanceMetric(metric);
  }
  
  addOptimizationRecommendation(recommendation: OptimizationRecommendation): void {
    PerformanceManager.addOptimizationRecommendation(recommendation);
  }
  
  generatePerformanceReport(): string {
    return generatePerformanceReport(
      PerformanceManager.getPerformanceMetrics(), 
      PerformanceManager.getOptimizationRecommendations()
    );
  }
  
  generatePerformanceMonitoringPlan(appName: string): string {
    const metrics = PerformanceManager.getPerformanceMetrics();
    const recommendations = PerformanceManager.getOptimizationRecommendations();
    
    const plan = ["# Performance Monitoring Plan\n\n"];
    
    plan.push(`## Overview for ${appName}\n\n`);
    plan.push("This plan outlines the key metrics, tools, and processes for monitoring and optimizing the performance of your application.\n\n");
    
    // Key metrics
    plan.push("## Key Performance Metrics\n\n");
    
    metrics.forEach(metric => {
      plan.push(`### ${metric.name}\n\n`);
      plan.push(`- **Description:** ${metric.description}\n`);
      plan.push(`- **Target:** ${metric.threshold.warning} ${metric.unit}\n`);
      plan.push(`- **Category:** ${metric.category}\n\n`);
    });
    
    // Add recommendations
    if (recommendations.length > 0) {
      plan.push("## Recommended Optimizations\n\n");
      
      // Group by impact
      const highImpact = recommendations.filter(r => r.impact === 'high');
      const mediumImpact = recommendations.filter(r => r.impact === 'medium');
      const lowImpact = recommendations.filter(r => r.impact === 'low');
      
      if (highImpact.length > 0) {
        plan.push("### High Priority\n\n");
        highImpact.forEach(rec => {
          plan.push(`- **${rec.title}**: ${rec.description}\n\n`);
        });
      }
      
      if (mediumImpact.length > 0) {
        plan.push("### Medium Priority\n\n");
        mediumImpact.forEach(rec => {
          plan.push(`- **${rec.title}**: ${rec.description}\n\n`);
        });
      }
      
      if (lowImpact.length > 0) {
        plan.push("### Low Priority\n\n");
        lowImpact.forEach(rec => {
          plan.push(`- **${rec.title}**: ${rec.description}\n\n`);
        });
      }
    }
    
    return plan.join("");
  }
  
  /**
   * Generate a monitoring tool setup document
   */
  generateMonitoringToolDoc(toolKey: string): string {
    // Import monitoringToolIntegrations from the utility
    const { monitoringToolIntegrations } = require("@/utils/performanceMonitoring");
    
    if (!monitoringToolIntegrations[toolKey]) {
      return "# Error\n\nMonitoring tool not found.";
    }
    
    const tool = monitoringToolIntegrations[toolKey];
    return `# ${tool.name} Integration Guide\n\n${tool.description}\n\n${tool.setupInstructions}`;
  }
  
  /**
   * Generate technical documentation
   */
  generateTechnicalDocumentation(docType: string): string {
    // Basic template based on type
    switch (docType.toLowerCase()) {
      case 'api':
        return "# API Documentation\n\nThis document outlines the API endpoints and usage for the project.";
      case 'technical':
        return "# Technical Documentation\n\nThis document provides technical details about the project architecture and implementation.";
      case 'user':
        return "# User Guide\n\nThis document provides instructions for using the application.";
      case 'maintenance':
        return "# Maintenance Guide\n\nThis document provides guidelines for maintaining and updating the application.";
      default:
        return `# ${docType} Documentation\n\nThis document provides information about the ${docType} aspects of the project.`;
    }
  }
}
