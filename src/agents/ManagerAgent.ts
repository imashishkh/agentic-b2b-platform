
import { BaseAgent } from "./BaseAgent";
import { AgentType } from "./AgentTypes";
import { createAgent } from "./AgentFactory";
import { toast } from "sonner";
import { recommendArchitecturalPatterns, recommendTechnologyStack, createArchitectureProposal } from "@/utils/architectureUtils";
import { SecurityFinding, ComplianceRequirement, PerformanceMetric, OptimizationRecommendation, MonitoringTool } from "@/contexts/types";
import { 
  standardMetrics,
  generatePerformanceReport,
  monitoringToolIntegrations
} from "@/utils/performanceMonitoring";

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
  private performanceMetrics: PerformanceMetric[] = [...standardMetrics];
  private performanceRecommendations: OptimizationRecommendation[] = [];
  
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
        await this.assignTasksToSpecialists(extractedTasks);
        
        return this.generateEnhancedTaskSummary(extractedTasks, dependencyGraph);
      } catch (error) {
        console.error("Error using enhanced markdown parsing, falling back to basic:", error);
        // Fall back to basic parsing if enhanced parsing fails
      }
      
      // Fall back to original method if enhanced method fails
      // Extract tasks from the markdown
      const tasks = await this.extractTasksFromMarkdown(markdownContent);
      this.parsedTasks = tasks;
      
      // Assign tasks to different specialist agents
      await this.assignTasksToSpecialists(tasks);
      
      return this.generateTaskSummary();
    } catch (error) {
      console.error("Error processing markdown file:", error);
      return "I encountered an error while processing your requirements document. Please try again or upload a different file.";
    }
  }
  
  /**
   * Generate an enhanced task summary with dependency information
   */
  private generateEnhancedTaskSummary(extractedTasks: any[], dependencyGraph: any): string {
    const summary = ["# Enhanced Project Analysis Summary\n"];
    
    // Add the total number of tasks
    const totalTasks = extractedTasks.length;
    const totalSubtasks = extractedTasks.reduce((count, task) => {
      return count + (task.subtasks && Array.isArray(task.subtasks) ? task.subtasks.length : 0);
    }, 0);
    
    summary.push(`I've analyzed your requirements document and extracted ${totalTasks} main tasks and ${totalSubtasks} subtasks with dependencies and priority information.\n`);
    
    // Add dependency information
    summary.push("## Task Dependencies\n");
    if (dependencyGraph && dependencyGraph.nodes && dependencyGraph.edges) {
      const nodesLength = Array.isArray(dependencyGraph.nodes) ? dependencyGraph.nodes.length : 0;
      const edgesLength = Array.isArray(dependencyGraph.edges) ? dependencyGraph.edges.length : 0;
      
      summary.push(`I've identified dependencies between tasks. The dependency graph has ${nodesLength} nodes and ${edgesLength} connections.\n`);
      
      // Add critical path information if there are enough dependencies
      if (edgesLength > 3) {
        summary.push("### Critical Path\n");
        summary.push("Tasks on the critical path that should be prioritized:\n");
        
        // Find tasks with the most dependents (most blocking)
        const dependentCounts = new Map<string, number>();
        if (Array.isArray(dependencyGraph.edges)) {
          for (const edge of dependencyGraph.edges) {
            if (edge.type === 'dependency') {
              dependentCounts.set(edge.source, (dependentCounts.get(edge.source) || 0) + 1);
            }
          }
        }
        
        // Get the top 3 most critical tasks
        const criticalTasks = Array.from(dependentCounts.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3);
        
        if (criticalTasks.length > 0) {
          for (const [taskId, dependentCount] of criticalTasks) {
            const task = extractedTasks.find(t => t.id === taskId) || 
                       extractedTasks.flatMap(t => t.subtasks || []).find(st => st.id === taskId);
            
            if (task) {
              summary.push(`- **${task.title}** - Blocks ${dependentCount} other task(s)\n`);
            }
          }
        } else {
          summary.push("- No critical blocking tasks identified yet\n");
        }
      }
    } else {
      summary.push("No dependencies were identified between tasks.\n");
    }
    
    // Add priority breakdown
    const highPriorityTasks = extractedTasks.filter(t => t.priority === 'high');
    const mediumPriorityTasks = extractedTasks.filter(t => t.priority === 'medium');
    const lowPriorityTasks = extractedTasks.filter(t => t.priority === 'low');
    
    summary.push("\n## Priority Breakdown\n");
    summary.push(`- **High Priority:** ${highPriorityTasks.length} tasks\n`);
    summary.push(`- **Medium Priority:** ${mediumPriorityTasks.length} tasks\n`);
    summary.push(`- **Low Priority:** ${lowPriorityTasks.length} tasks\n`);
    
    // Add task categorization
    summary.push("\n## Task Categories\n");
    
    // Group tasks by category
    const categorizedTasks = extractedTasks.reduce((acc: {[key: string]: any[]}, task) => {
      const category = task.category || 'other';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(task);
      return acc;
    }, {});
    
    // Add tasks by category
    for (const [category, tasks] of Object.entries(categorizedTasks)) {
      const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
      summary.push(`### ${categoryName} (${tasks.length} tasks)\n`);
      
      // List up to 3 tasks per category
      const tasksToShow = tasks.slice(0, 3);
      for (const task of tasksToShow) {
        summary.push(`- ${task.title}\n`);
      }
      
      if (tasks.length > 3) {
        summary.push(`- ... and ${tasks.length - 3} more ${categoryName} tasks\n`);
      }
      
      summary.push("\n");
    }
    
    // Add architecture recommendations based on requirements
    summary.push("## Architecture Recommendations\n");
    const patternRecommendations = recommendArchitecturalPatterns(this.projectRequirements);
    const topPatterns = patternRecommendations.slice(0, 3);
    
    summary.push("Based on your requirements, I recommend these architectural patterns:\n");
    topPatterns.forEach((rec, index) => {
      summary.push(`${index + 1}. **${rec.pattern}** - ${rec.description}\n`);
    });
    summary.push("\n");
    
    // Add next steps
    summary.push("## Next Steps\n");
    summary.push("I recommend we take the following steps:\n");
    summary.push("1. Review the identified tasks and dependencies\n");
    summary.push("2. Adjust priorities if needed\n");
    summary.push("3. Begin implementation planning for high-priority tasks\n");
    summary.push("4. Set up technical architecture based on recommendations\n\n");
    
    summary.push("Would you like me to:\n");
    summary.push("1. Show you the detailed dependency graph?\n");
    summary.push("2. Create a technical architecture proposal based on the recommended patterns?\n");
    summary.push("3. Suggest a development timeline based on task dependencies?\n");
    summary.push("4. Something else?\n");
    
    return summary.join("");
  }
  
  /**
   * Extract tasks from markdown content
   * 
   * @param markdownContent - The markdown content to parse
   * @returns Array of extracted tasks
   */
  private async extractTasksFromMarkdown(markdownContent: string): Promise<any[]> {
    console.log("Extracting tasks from markdown");
    
    try {
      // Basic parsing of headings as tasks
      const lines = markdownContent.split('\n');
      const tasks: any[] = [];
      
      let currentTask: any = null;
      let currentSubtask: any = null;
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Parse headings as tasks and subtasks
        if (line.startsWith('# ')) {
          // Main sections (epics)
          const title = line.substring(2).trim();
          currentTask = {
            id: `task-${tasks.length + 1}`,
            title,
            description: '',
            subtasks: [],
            priority: 'medium',
            category: this.categorizeTask(title)
          };
          tasks.push(currentTask);
          currentSubtask = null;
        } else if (line.startsWith('## ')) {
          // Subtasks
          if (currentTask) {
            const title = line.substring(3).trim();
            currentSubtask = {
              id: `subtask-${currentTask.subtasks.length + 1}`,
              title,
              description: '',
              priority: 'medium',
              category: this.categorizeTask(title)
            };
            currentTask.subtasks.push(currentSubtask);
          }
        } else if (line.startsWith('- ') || line.startsWith('* ')) {
          // List items as requirements or details
          const detail = line.substring(2).trim();
          if (currentSubtask) {
            currentSubtask.description += `• ${detail}\n`;
          } else if (currentTask) {
            currentTask.description += `• ${detail}\n`;
          }
        } else if (line.length > 0) {
          // Regular text as description
          if (currentSubtask) {
            currentSubtask.description += `${line}\n`;
          } else if (currentTask) {
            currentTask.description += `${line}\n`;
          }
        }
      }
      
      console.log("Extracted tasks:", tasks);
      return tasks;
    } catch (error) {
      console.error("Error extracting tasks:", error);
      return [];
    }
  }
  
  /**
   * Categorize a task based on its title and description
   * 
   * @param text - The text to categorize
   * @returns The category of the task
   */
  private categorizeTask(text: string): AgentType {
    text = text.toLowerCase();
    
    // Frontend tasks
    if (text.match(/ui|interface|component|screen|page|view|frontend|css|html|style|animation|responsive|mobile|desktop|layout/)) {
      return AgentType.FRONTEND;
    }
    
    // Backend tasks
    if (text.match(/api|endpoint|server|backend|auth|authentication|authorization|middleware|service|controller|route|validator/)) {
      return AgentType.BACKEND;
    }
    
    // Database tasks
    if (text.match(/database|schema|model|entity|table|column|field|relation|query|sql|nosql|mongodb|postgresql|mysql|migration|seed/)) {
      return AgentType.DATABASE;
    }
    
    // DevOps tasks
    if (text.match(/deploy|ci|cd|pipeline|docker|container|kubernetes|k8s|aws|cloud|hosting|environment|config|monitor|log|performance|scale/)) {
      return AgentType.DEVOPS;
    }
    
    // UX tasks
    if (text.match(/ux|user experience|design|wireframe|prototype|usability|accessibility|flow|journey|persona|research|testing/)) {
      return AgentType.UX;
    }
    
    // Default to manager
    return AgentType.MANAGER;
  }
  
  /**
   * Assign tasks to specialist agents
   * 
   * @param tasks - The tasks to assign
   */
  private async assignTasksToSpecialists(tasks: any[]): Promise<void> {
    console.log("Assigning tasks to specialists");
    
    // Clear previous assignments
    this.assignedTasks.clear();
    
    // Initialize empty task lists for each agent type
    Object.values(AgentType).forEach(agentType => {
      this.assignedTasks.set(agentType, []);
    });
    
    // Assign tasks based on their category
    tasks.forEach(task => {
      const agentTasks = this.assignedTasks.get(task.category) || [];
      agentTasks.push(task);
      this.assignedTasks.set(task.category, agentTasks);
      
      // Also assign subtasks
      task.subtasks.forEach((subtask: any) => {
        const subtaskAgentType = subtask.category || task.category;
        const subtaskAgentTasks = this.assignedTasks.get(subtaskAgentType) || [];
        subtaskAgentTasks.push({
          ...subtask,
          parentTaskId: task.id,
          parentTaskTitle: task.title
        });
        this.assignedTasks.set(subtaskAgentType, subtaskAgentTasks);
      });
    });
    
    console.log("Task assignments:", Object.fromEntries(this.assignedTasks));
  }
  
  /**
   * Generate a summary of task assignments
   * 
   * @returns A formatted summary of task assignments
   */
  private generateTaskSummary(): string {
    const summary = ["# Project Analysis Summary\n"];
    
    // Add the total number of tasks
    const totalTasks = this.parsedTasks.length;
    const totalSubtasks = this.parsedTasks.reduce((count, task) => {
      return count + (task.subtasks && Array.isArray(task.subtasks) ? task.subtasks.length : 0);
    }, 0);
    summary.push(`I've analyzed your requirements document and extracted ${totalTasks} main tasks and ${totalSubtasks} subtasks.\n`);
    
    // Add the task assignments for each agent
    summary.push("## Task Assignments\n");
    
    const agentTypes = [
      { type: AgentType.FRONTEND, name: "Frontend Developer" },
      { type: AgentType.BACKEND, name: "Backend Developer" },
      { type: AgentType.DATABASE, name: "Database Engineer" },
      { type: AgentType.DEVOPS, name: "DevOps Engineer" },
      { type: AgentType.UX, name: "UX Designer" },
      { type: AgentType.MANAGER, name: "Development Manager" }
    ];
    
    agentTypes.forEach(({ type, name }) => {
      const tasks = this.assignedTasks.get(type) || [];
      if (tasks.length > 0) {
        summary.push(`### ${name} (${tasks.length} tasks)\n`);
        tasks.forEach((task: any) => {
          summary.push(`- ${task.title}\n`);
        });
        summary.push("\n");
      }
    });
    
    // Add next steps
    summary.push("## Next Steps\n");
    summary.push("I recommend we take the following steps:\n");
    summary.push("1. Review the task assignments and make any necessary adjustments\n");
    summary.push("2. Prioritize tasks and create a project timeline\n");
    summary.push("3. Set up the initial project architecture\n");
    summary.push("4. Begin development of the highest priority tasks\n\n");
    
    summary.push("Would you like me to:\n");
    summary.push("1. Provide more details about specific tasks?\n");
    summary.push("2. Create a technical architecture proposal?\n");
    summary.push("3. Propose a development timeline?\n");
    summary.push("4. Something else?\n");
    
    return summary.join("");
  }
  
  /**
   * Checks if a message is related to knowledge base requests
   * 
   * @param message - The user message to evaluate
   * @returns boolean indicating whether this is a knowledge base request
   */
  isKnowledgeBaseRequest(message: string): boolean {
    return message.match(/knowledge base|documentation|reference|resource|link|article|guide|tutorial|standard|best practice|example/i) !== null;
  }
  
  /**
   * Checks if a message is related to architecture proposals
   * 
   * @param message - The user message to evaluate
   * @returns boolean indicating whether this is an architecture proposal request
   */
  isArchitectureRequest(message: string): boolean {
    return message.match(/architecture|system design|component|diagram|structure|high level design|technical architecture|stack|technology choice/i) !== null;
  }
  
  /**
   * Checks if a message is related to testing strategies
   * 
   * @param message - The user message to evaluate
   * @returns boolean indicating whether this is a testing strategy request
   */
  isTestingStrategyRequest(message: string): boolean {
    return message.match(/testing|test strategy|unit test|integration test|end-to-end|e2e|quality assurance|qa plan/i) !== null;
  }
  
  /**
   * Checks if a message is related to GitHub integration
   * 
   * @param message - The user message to evaluate
   * @returns boolean indicating whether this is a GitHub integration request
   */
  isGitHubRequest(message: string): boolean {
    return message.match(/github|git|repository|version control|branch|commit|pr|pull request/i) !== null;
  }
  
  /**
   * Checks if the message contains a file upload
   * 
   * @param message - The user message to evaluate
   * @returns boolean indicating whether this message contains a file upload
   */
  isFileUploadRequest(message: string): boolean {
    return message.match(/analyze this file|uploaded|file upload|requirements document|spec document|project spec/i) !== null;
  }
  
  /**
   * Generates a knowledge base request prompt after task assignments
   * 
   * @returns A structured prompt asking for knowledge base resources
   */
  generateKnowledgeBasePrompt(): string {
    return `
## Knowledge Base Enhancement

To better support your e-commerce project, I'd like to build a knowledge base of relevant resources. Could you provide links to:

1. **Technology Documentation** - Links to docs for your preferred tech stack (frontend, backend, database)
2. **Industry Standards** - E-commerce best practices, security standards, accessibility guidelines
3. **Competitor Analysis** - Examples of similar e-commerce platforms you admire or want to reference
4. **Security Compliance** - Any specific security or regulatory requirements your project needs to meet

Adding these resources will help all specialists provide more accurate and relevant guidance throughout the development process.

To add a resource, simply share a link with a brief description of what it contains.
    `;
  }
  
  /**
   * Checks if a message is related to security assessment
   * 
   * @param message - The user message to evaluate
   * @returns boolean indicating whether this is a security assessment request
   */
  isSecurityAssessmentRequest(message: string): boolean {
    return message.match(/security|vulnerability|compliance|secure coding|best practices|owasp|penetration test|security scan/i) !== null;
  }
  
  /**
   * Performs code security scanning
   * 
   * @param code - The code to scan
   * @returns Security findings
   */
  async performSecurityScan(code: string): Promise<SecurityFinding[]> {
    const findings: SecurityFinding[] = [];
    
    // Check for common security issues in code
    
    // SQL Injection vulnerabilities
    if (code.match(/SELECT .* FROM .* WHERE .* = .*\$/i) && !code.match(/parameterized|prepared statement/i)) {
      findings.push({
        id: `sec-${Date.now()}-${findings.length}`,
        type: "vulnerability",
        severity: "high",
        description: "Potential SQL Injection vulnerability detected.",
        recommendation: "Use parameterized queries or prepared statements instead of string concatenation.",
        codeLocation: "SQL query using string concatenation"
      });
    }
    
    // XSS vulnerabilities
    if (code.match(/innerHTML|dangerouslySetInnerHTML/i) && !code.match(/sanitize|DOMPurify/i)) {
      findings.push({
        id: `sec-${Date.now()}-${findings.length}`,
        type: "vulnerability",
        severity: "medium",
        description: "Potential Cross-Site Scripting (XSS) vulnerability detected.",
        recommendation: "Sanitize user input before inserting into the DOM. Consider using libraries like DOMPurify.",
        codeLocation: "DOM manipulation using innerHTML or dangerouslySetInnerHTML"
      });
    }
    
    // Hardcoded credentials
    if (code.match(/password|apiKey|secret|token|key|credential/i) && code.match(/("|')([a-zA-Z0-9_\-$%^&*!@#]{8,})("|')/)) {
      findings.push({
        id: `sec-${Date.now()}-${findings.length}`,
        type: "vulnerability",
        severity: "critical",
        description: "Potential hardcoded credentials detected.",
        recommendation: "Use environment variables or a secure secrets management solution instead of hardcoding sensitive values.",
        codeLocation: "Hardcoded credential in code"
      });
    }
    
    // Insecure direct object references
    if (code.match(/params.id|req.params|request.params|userId|user_id/i) && !code.match(/authorize|authentication|permission|access control/i)) {
      findings.push({
        id: `sec-${Date.now()}-${findings.length}`,
        type: "vulnerability",
        severity: "medium",
        description: "Potential Insecure Direct Object Reference (IDOR) vulnerability detected.",
        recommendation: "Implement proper authorization checks before accessing resources based on user input IDs.",
        codeLocation: "Resource access using parameters without authorization checks"
      });
    }
    
    // Weak cryptography
    if (code.match(/md5|sha1|createCipher/i)) {
      findings.push({
        id: `sec-${Date.now()}-${findings.length}`,
        type: "vulnerability",
        severity: "high",
        description: "Use of weak cryptographic algorithms detected.",
        recommendation: "Use modern cryptographic algorithms (SHA256, SHA3) and libraries like bcrypt for password hashing.",
        codeLocation: "Weak cryptographic algorithm usage"
      });
    }
    
    // Best practices violations
    
    // Error disclosure
    if (code.match(/console\.error\(err\)|console\.log\(error\)|res\.status\(500\)\.send\(error\)/i)) {
      findings.push({
        id: `sec-${Date.now()}-${findings.length}`,
        type: "best_practice",
        severity: "medium",
        description: "Potentially sensitive error details may be exposed to users.",
        recommendation: "Implement proper error handling and logging that doesn't expose sensitive information to end users.",
        codeLocation: "Error message disclosure"
      });
    }
    
    // Missing input validation
    if (code.match(/req\.body|request\.body|event\.body|params/i) && !code.match(/validate|sanitize|schema|zod|yup|joi/i)) {
      findings.push({
        id: `sec-${Date.now()}-${findings.length}`,
        type: "best_practice",
        severity: "medium",
        description: "Missing input validation for user-supplied data.",
        recommendation: "Implement input validation using libraries like Zod, Yup, or Joi.",
        codeLocation: "User input without validation"
      });
    }
    
    // Missing CSRF protection
    if (code.match(/form|post|put|delete/i) && !code.match(/csrf|csrfToken|X-CSRF-Token/i)) {
      findings.push({
        id: `sec-${Date.now()}-${findings.length}`,
        type: "best_practice",
        severity: "medium",
        description: "Potential missing CSRF protection for state-changing operations.",
        recommendation: "Implement CSRF tokens for all state-changing operations.",
        codeLocation: "Form or state-changing request without CSRF protection"
      });
    }
    
    // Missing Content Security Policy
    if (code.match(/<script>|script src|fetch|axios|XMLHttpRequest/i) && !code.match(/Content-Security-Policy|CSP/i)) {
      findings.push({
        id: `sec-${Date.now()}-${findings.length}`,
        type: "best_practice",
        severity: "low",
        description: "No Content Security Policy detected.",
        recommendation: "Implement a Content Security Policy to protect against XSS and data injection attacks.",
        codeLocation: "Client-side code without CSP"
      });
    }
    
    // Compliance issues
    
    // Missing accessibility attributes
    if (code.match(/<img/i) && !code.match(/alt=/i)) {
      findings.push({
        id: `sec-${Date.now()}-${findings.length}`,
        type: "compliance",
        severity: "low",
        description: "Image elements without alt attributes may not be WCAG compliant.",
        recommendation: "Add descriptive alt attributes to all image elements for accessibility.",
        codeLocation: "Image without alt attribute"
      });
    }
    
    // Missing GDPR compliance for data collection
    if (code.match(/cookie|localStorage|sessionStorage|indexedDB/i) && !code.match(/consent|gdpr|privacy/i)) {
      findings.push({
        id: `sec-${Date.now()}-${findings.length}`,
        type: "compliance",
        severity: "medium",
        description: "Data storage without explicit user consent may violate GDPR.",
        recommendation: "Implement proper consent mechanisms before storing user data.",
        codeLocation: "Data storage without consent mechanism"
      });
    }
    
    return findings;
  }
  
  /**
   * Perform a compliance check against standard requirements
   * 
   * @param code - The code to check
   * @param standard - The compliance standard to check against
   * @returns Compliance check results
   */
  async performComplianceCheck(code: string, standard: string = "owasp"): Promise<ComplianceRequirement[]> {
    const requirements: ComplianceRequirement[] = [];
    
    if (standard.toLowerCase() === "owasp") {
      // OWASP Top 10 compliance checks
      
      // A1:2017-Injection
      requirements.push({
        id: `comp-${Date.now()}-1`,
        name: "Injection Prevention",
        description: "Prevent injection flaws (SQL, NoSQL, LDAP, etc.)",
        status: code.match(/parameterized|prepared statement|sanitize/i) ? "passed" : 
               (code.match(/SELECT|INSERT|UPDATE|DELETE|exec|eval/i) ? "failed" : "passed"),
        recommendation: "Use parameterized queries, ORM libraries, or input sanitization."
      });
      
      // A2:2017-Broken Authentication
      requirements.push({
        id: `comp-${Date.now()}-2`,
        name: "Authentication Security",
        description: "Implement secure authentication practices",
        status: code.match(/password.{0,10}hash|bcrypt|argon2|pbkdf2/i) ? "passed" : 
               (code.match(/password|login|auth/i) ? "warning" : "passed"),
        recommendation: "Use secure password hashing (bcrypt), implement MFA, and session management."
      });
      
      // A3:2017-Sensitive Data Exposure
      requirements.push({
        id: `comp-${Date.now()}-3`,
        name: "Data Protection",
        description: "Protect sensitive data in transit and at rest",
        status: code.match(/https|TLS|encrypt|hash/i) ? "passed" : 
               (code.match(/password|credit|card|ssn|personal/i) ? "warning" : "passed"),
        recommendation: "Use encryption for sensitive data, HTTPS for all communications."
      });
      
      // A5:2017-Broken Access Control
      requirements.push({
        id: `comp-${Date.now()}-5`,
        name: "Access Control",
        description: "Implement proper access controls",
        status: code.match(/authorize|authentication|permission|rbac|acl/i) ? "passed" : 
               (code.match(/admin|role|permission|restricted/i) ? "warning" : "passed"),
        recommendation: "Implement role-based access control and verify user permissions."
      });
      
      // A6:2017-Security Misconfiguration
      requirements.push({
        id: `comp-${Date.now()}-6`,
        name: "Secure Configuration",
        description: "Use secure configuration practices",
        status: code.match(/helmet|Content-Security-Policy|X-Frame-Options|X-XSS-Protection/i) ? "passed" : "warning",
        recommendation: "Use security headers, disable directory listings, and remove default accounts."
      });
      
      // A7:2017-Cross-Site Scripting (XSS)
      requirements.push({
        id: `comp-${Date.now()}-7`,
        name: "XSS Prevention",
        description: "Prevent cross-site scripting attacks",
        status: code.match(/DOMPurify|sanitize|escape|encodeURI/i) ? "passed" : 
               (code.match(/innerHTML|dangerouslySetInnerHTML/i) ? "failed" : "passed"),
        recommendation: "Use context-aware output encoding and input sanitization."
      });
    } else if (standard.toLowerCase() === "gdpr") {
      // GDPR compliance checks
      
      // Consent
      requirements.push({
        id: `comp-${Date.now()}-1`,
        name: "User Consent",
        description: "Obtain explicit consent before processing personal data",
        status: code.match(/consent|gdpr|opt-in|checkbox.{0,20}checked|accept.{0,20}terms/i) ? "passed" : 
               (code.match(/personal|data|email|name|address|phone|collect/i) ? "warning" : "passed"),
        recommendation: "Implement clear consent mechanisms before collecting any personal data."
      });
      
      // Right to Access
      requirements.push({
        id: `comp-${Date.now()}-2`,
        name: "Data Access Rights",
        description: "Allow users to access their personal data",
        status: code.match(/download.{0,20}data|export.{0,20}data|access.{0,20}data/i) ? "passed" : "warning",
        recommendation: "Implement functionality allowing users to export their personal data."
      });
      
      // Right to be Forgotten
      requirements.push({
        id: `comp-${Date.now()}-3`,
        name: "Data Deletion Rights",
        description: "Allow users to request deletion of their data",
        status: code.match(/delete.{0,20}account|remove.{0,20}data|forget.{0,20}me/i) ? "passed" : "warning",
        recommendation: "Implement functionality allowing users to delete their accounts and data."
      });
      
      // Data Breach Notification
      requirements.push({
        id: `comp-${Date.now()}-4`,
        name: "Breach Notification",
        description: "Capability to notify users of data breaches",
        status: code.match(/notification|alert|email.{0,20}users|notify/i) ? "passed" : "warning",
        recommendation: "Implement systems to detect and notify users of potential data breaches."
      });
    }
    
    return requirements;
  }
  
  /**
   * Generate a security report based on compliance checks
   * 
   * @param code - The code to check
   * @returns A formatted security report
   */
  async generateSecurityReport(code: string): Promise<string> {
    const findings = await this.performSecurityScan(code);
    const owasp = await this.performComplianceCheck(code, "owasp");
    const gdpr = await this.performComplianceCheck(code, "gdpr");
    
    const report = ["# Security Assessment Report\n\n"];
    
    // Summary
    const criticalVulnerabilities = findings.filter(f => f.severity === "critical").length;
    const highVulnerabilities = findings.filter(f => f.severity === "high").length;
    const mediumVulnerabilities = findings.filter(f => f.severity === "medium").length;
    const lowVulnerabilities = findings.filter(f => f.severity === "low").length;
    
    const owaspFailed = owasp.filter(r => r.status === "failed").length;
    const owaspWarning = owasp.filter(r => r.status === "warning").length;
    const gdprFailed = gdpr.filter(r => r.status === "failed").length;
    const gdprWarning = gdpr.filter(r => r.status === "warning").length;
    
    report.push("## Executive Summary\n\n");
    report.push("This security assessment identified:\n\n");
    report.push(`- **${criticalVulnerabilities}** critical vulnerabilities\n`);
    report.push(`- **${highVulnerabilities}** high-severity vulnerabilities\n`);
    report.push(`- **${mediumVulnerabilities}** medium-severity vulnerabilities\n`);
    report.push(`- **${lowVulnerabilities}** low-severity vulnerabilities\n\n`);
    
    report.push("### Compliance Status\n\n");
    report.push(`- **OWASP Top 10:** ${owaspFailed} failures, ${owaspWarning} warnings\n`);
    report.push(`- **GDPR:** ${gdprFailed} failures, ${gdprWarning} warnings\n\n`);
    
    // Detailed findings
    if (findings.length > 0) {
      report.push("## Detailed Vulnerability Findings\n\n");
      
      // Group by severity
      const criticals = findings.filter(f => f.severity === "critical");
      const highs = findings.filter(f => f.severity === "high");
      const mediums = findings.filter(f => f.severity === "medium");
      const lows = findings.filter(f => f.severity === "low");
      
      if (criticals.length > 0) {
        report.push("### Critical Vulnerabilities\n\n");
        criticals.forEach(f => {
          report.push(`#### ${f.description}\n`);
          report.push(`- **Location:** ${f.codeLocation}\n`);
          report.push(`- **Recommendation:** ${f.recommendation}\n\n`);
        });
      }
      
      if (highs.length > 0) {
        report.push("### High Vulnerabilities\n\n");
        highs.forEach(f => {
          report.push(`#### ${f.description}\n`);
          report.push(`- **Location:** ${f.codeLocation}\n`);
          report.push(`- **Recommendation:** ${f.recommendation}\n\n`);
        });
      }
      
      if (mediums.length > 0) {
        report.push("### Medium Vulnerabilities\n\n");
        mediums.forEach(f => {
          report.push(`#### ${f.description}\n`);
          report.push(`- **Location:** ${f.codeLocation}\n`);
          report.push(`- **Recommendation:** ${f.recommendation}\n\n`);
        });
      }
      
      if (lows.length > 0) {
        report.push("### Low Vulnerabilities\n\n");
        lows.forEach(f => {
          report.push(`#### ${f.description}\n`);
          report.push(`- **Location:** ${f.codeLocation}\n`);
          report.push(`- **Recommendation:** ${f.recommendation}\n\n`);
        });
      }
    }
    
    // Compliance details
    report.push("## Compliance Details\n\n");
    
    report.push("### OWASP Top 10 Compliance\n\n");
    owasp.forEach(r => {
      const statusEmoji = r.status === "passed" ? "✅" : r.status === "warning" ? "⚠️" : "❌";
      report.push(`#### ${statusEmoji} ${r.name}\n`);
      report.push(`- **Description:** ${r.description}\n`);
      report.push(`- **Status:** ${r.status}\n`);
      report.push(`- **Recommendation:** ${r.recommendation}\n\n`);
    });
    
    report.push("### GDPR Compliance\n\n");
    gdpr.forEach(r => {
      const statusEmoji = r.status === "passed" ? "✅" : r.status === "warning" ? "⚠️" : "❌";
      report.push(`#### ${statusEmoji} ${r.name}\n`);
      report.push(`- **Description:** ${r.description}\n`);
      report.push(`- **Status:** ${r.status}\n`);
      report.push(`- **Recommendation:** ${r.recommendation}\n\n`);
    });
    
    // Recommendations
    const requirements = [...owasp, ...gdpr];
    const failed = requirements.filter(r => r.status === "failed");
    
    report.push("## Priority Recommendations\n\n");
    
    if (failed.length > 0) {
      report.push("### Highest Priority\n\n");
      failed.forEach(r => {
        report.push(`- ${r.recommendation}\n`);
      });
      report.push("\n");
    }
    
    report.push("### General Recommendations\n\n");
    report.push("1. Implement secure coding practices across the development team\n");
    report.push("2. Establish regular security review checkpoints\n");
    report.push("3. Integrate automated security scanning in the CI/CD pipeline\n");
    report.push("4. Conduct regular penetration testing\n");
    report.push("5. Maintain up-to-date dependencies and apply security patches promptly\n");
    
    return report.join("");
  }
  
  /**
   * Add a performance metric to the metrics collection
   * 
   * @param metric - The performance metric to add
   */
  addPerformanceMetric(metric: PerformanceMetric): void {
    this.performanceMetrics.push(metric);
  }
  
  /**
   * Get all performance metrics
   * 
   * @returns Array of performance metrics
   */
  getPerformanceMetrics(): PerformanceMetric[] {
    return this.performanceMetrics;
  }
  
  /**
   * Add a performance optimization recommendation
   * 
   * @param recommendation - The optimization recommendation to add
   */
  addOptimizationRecommendation(recommendation: OptimizationRecommendation): void {
    this.performanceRecommendations.push(recommendation);
  }
  
  /**
   * Get all performance optimization recommendations
   * 
   * @returns Array of optimization recommendations
   */
  getOptimizationRecommendations(): OptimizationRecommendation[] {
    return this.performanceRecommendations;
  }
  
  /**
   * Generate a performance monitoring plan
   * 
   * @returns A formatted performance monitoring plan
   */
  generatePerformanceMonitoringPlan(): string {
    const plan = ["# Performance Monitoring Plan\n\n"];
    
    plan.push("## Key Performance Indicators\n\n");
    
    // Group metrics by category
    const frontendMetrics = this.performanceMetrics.filter(m => m.category === 'frontend');
    const backendMetrics = this.performanceMetrics.filter(m => m.category === 'backend');
    const databaseMetrics = this.performanceMetrics.filter(m => m.category === 'database');
    const networkMetrics = this.performanceMetrics.filter(m => m.category === 'network');
    const memoryMetrics = this.performanceMetrics.filter(m => m.category === 'memory');
    
    if (frontendMetrics.length > 0) {
      plan.push("### Frontend Performance\n\n");
      frontendMetrics.forEach(metric => {
        plan.push(`#### ${metric.name}\n`);
        plan.push(`- **Description:** ${metric.description}\n`);
        plan.push(`- **Target Value:** ${metric.target || 'Not defined'} ${metric.unit}\n`);
        plan.push(`- **Threshold - Warning:** ${metric.threshold.warning} ${metric.unit}\n`);
        plan.push(`- **Threshold - Critical:** ${metric.threshold.critical} ${metric.unit}\n`);
        if (metric.measurementMethod) {
          plan.push(`- **Measurement Method:** ${metric.measurementMethod}\n`);
        }
        plan.push("\n");
      });
    }
    
    if (backendMetrics.length > 0) {
      plan.push("### Backend Performance\n\n");
      backendMetrics.forEach(metric => {
        plan.push(`#### ${metric.name}\n`);
        plan.push(`- **Description:** ${metric.description}\n`);
        plan.push(`- **Target Value:** ${metric.target || 'Not defined'} ${metric.unit}\n`);
        plan.push(`- **Threshold - Warning:** ${metric.threshold.warning} ${metric.unit}\n`);
        plan.push(`- **Threshold - Critical:** ${metric.threshold.critical} ${metric.unit}\n`);
        if (metric.measurementMethod) {
          plan.push(`- **Measurement Method:** ${metric.measurementMethod}\n`);
        }
        plan.push("\n");
      });
    }
    
    if (databaseMetrics.length > 0) {
      plan.push("### Database Performance\n\n");
      databaseMetrics.forEach(metric => {
        plan.push(`#### ${metric.name}\n`);
        plan.push(`- **Description:** ${metric.description}\n`);
        plan.push(`- **Target Value:** ${metric.target || 'Not defined'} ${metric.unit}\n`);
        plan.push(`- **Threshold - Warning:** ${metric.threshold.warning} ${metric.unit}\n`);
        plan.push(`- **Threshold - Critical:** ${metric.threshold.critical} ${metric.unit}\n`);
        if (metric.measurementMethod) {
          plan.push(`- **Measurement Method:** ${metric.measurementMethod}\n`);
        }
        plan.push("\n");
      });
    }
    
    // Monitoring tools
    plan.push("## Recommended Monitoring Tools\n\n");
    
    if (typeof monitoringToolIntegrations === 'object') {
      Object.entries(monitoringToolIntegrations).forEach(([key, tool]) => {
        if (typeof tool === 'object' && tool !== null) {
          // @ts-ignore - Handle potentially missing properties
          const toolName = tool.name || key;
          // @ts-ignore - Handle potentially missing properties
          const toolDesc = tool.description || '';
          // @ts-ignore - Handle potentially missing properties
          const toolSetup = tool.setupInstructions || '';
          
          plan.push(`### ${toolName}\n\n`);
          plan.push(`${toolDesc}\n\n`);
          plan.push("#### Setup Instructions\n\n");
          plan.push(`${toolSetup}\n\n`);
        }
      });
    }
    
    // Implementation plan
    plan.push("## Implementation Timeline\n\n");
    plan.push("### Phase 1: Core Metrics Setup (Week 1-2)\n\n");
    plan.push("1. Set up monitoring for critical frontend performance metrics\n");
    plan.push("2. Implement API response time tracking\n");
    plan.push("3. Configure basic database performance monitoring\n\n");
    
    plan.push("### Phase 2: Advanced Monitoring (Week 3-4)\n\n");
    plan.push("1. Set up real user monitoring (RUM)\n");
    plan.push("2. Implement detailed database query analysis\n");
    plan.push("3. Configure network performance tracking\n\n");
    
    plan.push("### Phase 3: Alerting and Dashboards (Week 5-6)\n\n");
    plan.push("1. Configure alerting based on established thresholds\n");
    plan.push("2. Create performance dashboards for different stakeholders\n");
    plan.push("3. Implement automated performance reporting\n\n");
    
    // Optimization recommendations
    if (this.performanceRecommendations.length > 0) {
      plan.push("## Optimization Recommendations\n\n");
      
      // Group by priority
      const highPriority = this.performanceRecommendations.filter(r => r.priority === 'high');
      const mediumPriority = this.performanceRecommendations.filter(r => r.priority === 'medium');
      const lowPriority = this.performanceRecommendations.filter(r => r.priority === 'low');
      
      if (highPriority.length > 0) {
        plan.push("### High Priority Optimizations\n\n");
        highPriority.forEach(rec => {
          plan.push(`#### ${rec.title}\n`);
          plan.push(`- **Description:** ${rec.description}\n`);
          plan.push(`- **Impact:** ${rec.impact}\n`);
          plan.push(`- **Effort:** ${rec.effort}\n`);
          if (rec.estimatedImpact) {
            plan.push(`- **Estimated Impact:** ${rec.estimatedImpact}\n`);
          }
          plan.push("\n");
        });
      }
      
      if (mediumPriority.length > 0) {
        plan.push("### Medium Priority Optimizations\n\n");
        mediumPriority.forEach(rec => {
          plan.push(`#### ${rec.title}\n`);
          plan.push(`- **Description:** ${rec.description}\n`);
          plan.push(`- **Impact:** ${rec.impact}\n`);
          plan.push(`- **Effort:** ${rec.effort}\n`);
          if (rec.estimatedImpact) {
            plan.push(`- **Estimated Impact:** ${rec.estimatedImpact}\n`);
          }
          plan.push("\n");
        });
      }
    }
    
    return plan.join("");
  }
  
  /**
   * Generate a technical documentation
   * 
   * @param docType - The type of documentation to generate
   * @returns A formatted technical documentation
   */
  generateTechnicalDocumentation(docType: string): string {
    switch (docType.toLowerCase()) {
      case 'api':
        return this.generateApiDocumentation();
      case 'user':
        return this.generateUserGuide();
      case 'technical':
        return this.generateTechnicalGuide();
      case 'maintenance':
        return this.generateMaintenanceGuide();
      default:
        return "Documentation type not supported. Please specify 'API', 'user', 'technical', or 'maintenance'.";
    }
  }
  
  /**
   * Generate API documentation
   * 
   * @returns Formatted API documentation
   */
  private generateApiDocumentation(): string {
    const doc = ["# API Documentation\n\n"];
    
    doc.push("## Overview\n\n");
    doc.push("This document provides detailed information about the API endpoints available in the e-commerce system.\n\n");
    
    doc.push("## Authentication\n\n");
    doc.push("Most API endpoints require authentication. Use the following methods to authenticate your requests:\n\n");
    doc.push("### Bearer Token Authentication\n\n");
    doc.push("```\nAuthorization: Bearer {your_token}\n```\n\n");
    
    doc.push("## API Endpoints\n\n");
    
    // Products
    doc.push("### Products\n\n");
    
    doc.push("#### Get All Products\n\n");
    doc.push("```\nGET /api/products\n```\n\n");
    doc.push("**Query Parameters:**\n\n");
    doc.push("- `page` (optional): Page number (default: 1)\n");
    doc.push("- `limit` (optional): Items per page (default: 20)\n");
    doc.push("- `category` (optional): Filter by category\n");
    doc.push("- `search` (optional): Search term\n\n");
    
    doc.push("**Response:**\n\n");
    doc.push("```json\n{\n  \"data\": [\n    {\n      \"id\": \"string\",\n      \"name\": \"string\",\n      \"description\": \"string\",\n      \"price\": \"number\",\n      \"category\": \"string\",\n      \"imageUrl\": \"string\"\n    }\n  ],\n  \"meta\": {\n    \"currentPage\": \"number\",\n    \"totalPages\": \"number\",\n    \"totalItems\": \"number\"\n  }\n}\n```\n\n");
    
    doc.push("#### Get Product by ID\n\n");
    doc.push("```\nGET /api/products/{id}\n```\n\n");
    
    doc.push("**Response:**\n\n");
    doc.push("```json\n{\n  \"id\": \"string\",\n  \"name\": \"string\",\n  \"description\": \"string\",\n  \"price\": \"number\",\n  \"category\": \"string\",\n  \"imageUrl\": \"string\",\n  \"attributes\": {\n    \"key\": \"value\"\n  }\n}\n```\n\n");
    
    // Additional endpoints would be added here
    
    doc.push("## Error Handling\n\n");
    doc.push("The API uses conventional HTTP response codes to indicate the success or failure of requests:\n\n");
    doc.push("- `200 OK`: The request was successful\n");
    doc.push("- `400 Bad Request`: The request was invalid\n");
    doc.push("- `401 Unauthorized`: Authentication failed\n");
    doc.push("- `403 Forbidden`: The authenticated user doesn't have permission\n");
    doc.push("- `404 Not Found`: The requested resource was not found\n");
    doc.push("- `500 Internal Server Error`: An error occurred on the server\n\n");
    
    doc.push("## Rate Limiting\n\n");
    doc.push("The API implements rate limiting to prevent abuse. Clients are limited to 100 requests per minute.\n\n");
    
    return doc.join("");
  }
  
  /**
   * Generate user guide
   * 
   * @returns Formatted user guide
   */
  private generateUserGuide(): string {
    const doc = ["# User Guide\n\n"];
    
    doc.push("## Introduction\n\n");
    doc.push("Welcome to the e-commerce platform user guide. This document will help you understand how to use the system effectively.\n\n");
    
    doc.push("## Getting Started\n\n");
    doc.push("### Creating an Account\n\n");
    doc.push("1. Navigate to the sign-up page by clicking 'Create Account' in the top right corner\n");
    doc.push("2. Fill in your details including name, email, and password\n");
    doc.push("3. Verify your email address by clicking the link sent to your inbox\n");
    doc.push("4. Complete your profile by adding shipping address and payment methods\n\n");
    
    doc.push("### Logging In\n\n");
    doc.push("1. Click 'Login' in the top right corner\n");
    doc.push("2. Enter your email and password\n");
    doc.push("3. Use the 'Remember Me' option for convenience on trusted devices\n\n");
    
    doc.push("## Browsing Products\n\n");
    doc.push("### Search Functionality\n\n");
    doc.push("- Use the search bar at the top of any page\n");
    doc.push("- Filter results by category, price range, and other attributes\n");
    doc.push("- Sort results by relevance, price, or newest arrivals\n\n");
    
    doc.push("### Product Categories\n\n");
    doc.push("- Browse products by category using the main navigation menu\n");
    doc.push("- Click category names to see all products within that category\n");
    doc.push("- Use breadcrumbs to navigate back to previous categories\n\n");
    
    // Additional sections would be added here
    
    doc.push("## Customer Support\n\n");
    doc.push("### Contact Methods\n\n");
    doc.push("- Email: support@example.com\n");
    doc.push("- Phone: 1-800-123-4567 (Monday-Friday, 9am-5pm EST)\n");
    doc.push("- Live Chat: Available from the help section when logged in\n\n");
    
    doc.push("### FAQs\n\n");
    doc.push("Visit our FAQ section at example.com/faq for answers to common questions.\n\n");
    
    return doc.join("");
  }
  
  /**
   * Generate technical guide
   * 
   * @returns Formatted technical guide
   */
  private generateTechnicalGuide(): string {
    const doc = ["# Technical Documentation\n\n"];
    
    doc.push("## System Architecture\n\n");
    doc.push("The e-commerce platform is built using a microservices architecture with the following components:\n\n");
    doc.push("- **Frontend**: React.js application with Redux for state management\n");
    doc.push("- **Backend API**: Node.js with Express, implementing RESTful endpoints\n");
    doc.push("- **Authentication Service**: Handles user authentication and authorization\n");
    doc.push("- **Product Service**: Manages product catalog and inventory\n");
    doc.push("- **Order Service**: Processes orders and payments\n");
    doc.push("- **Database**: PostgreSQL for relational data and MongoDB for product catalog\n");
    doc.push("- **Search**: Elasticsearch for product search functionality\n");
    doc.push("- **Caching**: Redis for performance optimization\n\n");
    
    doc.push("## Development Environment Setup\n\n");
    doc.push("### Prerequisites\n\n");
    doc.push("- Node.js (v14 or later)\n");
    doc.push("- Docker and Docker Compose\n");
    doc.push("- Git\n");
    doc.push("- PostgreSQL client\n");
    doc.push("- MongoDB client\n\n");
    
    doc.push("### Installation Steps\n\n");
    doc.push("1. Clone the repository: `git clone https://github.com/example/ecommerce.git`\n");
    doc.push("2. Navigate to the project directory: `cd ecommerce`\n");
    doc.push("3. Install dependencies: `npm install`\n");
    doc.push("4. Set up environment variables: Copy `.env.example` to `.env` and update values\n");
    doc.push("5. Start the development environment: `docker-compose up -d`\n");
    doc.push("6. Run database migrations: `npm run migrate`\n");
    doc.push("7. Start the development server: `npm run dev`\n\n");
    
    // Additional sections would be added here
    
    doc.push("## Deployment\n\n");
    doc.push("### Production Environment\n\n");
    doc.push("The application is deployed using Kubernetes with the following components:\n\n");
    doc.push("- Kubernetes cluster on AWS EKS\n");
    doc.push("- CI/CD pipeline using GitHub Actions\n");
    doc.push("- AWS RDS for PostgreSQL database\n");
    doc.push("- AWS ElastiCache for Redis caching\n");
    doc.push("- AWS S3 for static assets and media storage\n");
    doc.push("- AWS CloudFront as CDN\n\n");
    
    doc.push("### Deployment Process\n\n");
    doc.push("1. Merge changes to the main branch\n");
    doc.push("2. CI/CD pipeline runs tests and builds Docker images\n");
    doc.push("3. Images are pushed to AWS ECR\n");
    doc.push("4. Kubernetes manifests are updated\n");
    doc.push("5. Deployment is applied to the Kubernetes cluster\n");
    doc.push("6. Health checks confirm successful deployment\n\n");
    
    return doc.join("");
  }
  
  /**
   * Generate maintenance guide
   * 
   * @returns Formatted maintenance guide
   */
  private generateMaintenanceGuide(): string {
    const doc = ["# Maintenance Guide\n\n"];
    
    doc.push("## Routine Maintenance Tasks\n\n");
    doc.push("### Daily Maintenance\n\n");
    doc.push("- Monitor system logs for errors and warnings\n");
    doc.push("- Check server health and resource utilization\n");
    doc.push("- Verify backup processes completed successfully\n");
    doc.push("- Review security alerts and potential threats\n\n");
    
    doc.push("### Weekly Maintenance\n\n");
    doc.push("- Analyze performance metrics and address any degradation\n");
    doc.push("- Review database query performance\n");
    doc.push("- Check for outdated dependencies and security patches\n");
    doc.push("- Perform database optimization tasks\n\n");
    
    doc.push("### Monthly Maintenance\n\n");
    doc.push("- Apply security patches and system updates\n");
    doc.push("- Conduct thorough security scan\n");
    doc.push("- Verify disaster recovery procedures\n");
    doc.push("- Analyze user behavior patterns and optimize accordingly\n\n");
    
    doc.push("## Troubleshooting\n\n");
    doc.push("### Common Issues and Solutions\n\n");
    
    doc.push("#### API Response Times Degraded\n\n");
    doc.push("1. Check database query performance\n");
    doc.push("2. Review caching effectiveness\n");
    doc.push("3. Monitor external service dependencies\n");
    doc.push("4. Check for increased traffic or DDoS attacks\n");
    doc.push("5. Verify server resource utilization\n\n");
    
    doc.push("#### Database Connection Failures\n\n");
    doc.push("1. Verify database server is running\n");
    doc.push("2. Check connection pool settings\n");
    doc.push("3. Review network connectivity\n");
    doc.push("4. Check for connection limits reached\n");
    doc.push("5. Verify credentials are correct\n\n");
    
    // Additional sections would be added here
    
    doc.push("## Scaling Considerations\n\n");
    doc.push("### Horizontal Scaling\n\n");
    doc.push("- Add more application servers when CPU utilization consistently exceeds 70%\n");
    doc.push("- Implement read replicas for the database when read operations become a bottleneck\n");
    doc.push("- Scale the Elasticsearch cluster when search response times exceed 200ms\n\n");
    
    doc.push("### Vertical Scaling\n\n");
    doc.push("- Upgrade database instance when approaching memory or CPU limits\n");
    doc.push("- Increase cache instance size when eviction rate increases\n");
    doc.push("- Upgrade API servers when processing complex requests with high latency\n\n");
    
    return doc.join("");
  }
  
  /**
   * Generate documentation about a monitoring tool
   * 
   * @param toolName - The name of the monitoring tool
   * @returns Information about the monitoring tool
   */
  generateMonitoringToolDoc(toolName: string): string {
    const normalizedToolName = toolName.toLowerCase();
    let toolInfo = null;
    
    if (typeof monitoringToolIntegrations === 'object') {
      // Try to find the tool by name
      for (const [key, tool] of Object.entries(monitoringToolIntegrations)) {
        if (typeof tool === 'object' && tool !== null) {
          // @ts-ignore - Handle potentially missing properties
          const name = (tool.name || key).toLowerCase();
          if (name.includes(normalizedToolName)) {
            toolInfo = tool;
            break;
          }
        }
      }
    }
    
    if (!toolInfo) {
      return `No information available for the monitoring tool: ${toolName}`;
    }
    
    // @ts-ignore - Handle potentially missing properties
    const doc = [`# ${toolInfo.name || toolName} Integration Guide\n\n`];
    
    // @ts-ignore - Handle potentially missing properties
    if (toolInfo.description) {
      doc.push("## Overview\n\n");
      // @ts-ignore - Handle potentially missing properties
      doc.push(`${toolInfo.description}\n\n`);
    }
    
    // @ts-ignore - Handle potentially missing properties
    if (toolInfo.purpose) {
      doc.push("## Purpose\n\n");
      // @ts-ignore - Handle potentially missing properties
      doc.push(`${toolInfo.purpose}\n\n`);
    }
    
    // @ts-ignore - Handle potentially missing properties
    if (toolInfo.features && Array.isArray(toolInfo.features)) {
      doc.push("## Key Features\n\n");
      // @ts-ignore - Handle potentially missing properties
      toolInfo.features.forEach(feature => {
        doc.push(`- ${feature}\n`);
      });
      doc.push("\n");
    }
    
    // @ts-ignore - Handle potentially missing properties
    if (toolInfo.setupInstructions) {
      doc.push("## Setup Instructions\n\n");
      // @ts-ignore - Handle potentially missing properties
      doc.push(`${toolInfo.setupInstructions}\n\n`);
    }
    
    // @ts-ignore - Handle potentially missing properties
    if (toolInfo.metricsMapping && typeof toolInfo.metricsMapping === 'object') {
      doc.push("## Metrics Mapping\n\n");
      doc.push("The following metrics are tracked by this tool:\n\n");
      
      doc.push("| Metric Name | Description |\n");
      doc.push("| ----------- | ----------- |\n");
      // @ts-ignore - Handle potentially missing properties
      for (const [key, value] of Object.entries(toolInfo.metricsMapping)) {
        doc.push(`| ${key} | ${value} |\n`);
      }
      doc.push("\n");
    }
    
    doc.push("## Integration Example\n\n");
    doc.push("```javascript\n");
    doc.push("// Example code for integrating with this monitoring tool\n");
    // @ts-ignore - Handle potentially missing properties
    doc.push(`// Initialize ${toolInfo.name || toolName}\n`);
    doc.push("import monitoringTool from 'monitoring-tool-package';\n\n");
    doc.push("// Configure the tool\n");
    doc.push("monitoringTool.init({\n");
    doc.push("  apiKey: process.env.MONITORING_API_KEY,\n");
    doc.push("  serviceName: 'e-commerce-app',\n");
    doc.push("  environment: process.env.NODE_ENV\n");
    doc.push("});\n\n");
    doc.push("// Track a custom metric\n");
    doc.push("monitoringTool.trackMetric('checkout_time', 1250);\n");
    doc.push("```\n\n");
    
    doc.push("## Best Practices\n\n");
    doc.push("1. Set appropriate alert thresholds to avoid alert fatigue\n");
    doc.push("2. Focus on monitoring business-critical paths first\n");
    doc.push("3. Correlate metrics with business outcomes\n");
    doc.push("4. Regularly review and adjust monitoring configuration\n");
    doc.push("5. Ensure proper error handling in the monitoring integration\n\n");
    
    return doc.join("");
  }
}
