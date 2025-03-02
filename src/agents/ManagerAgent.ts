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
      summary.push(`I've identified dependencies between tasks. The dependency graph has ${dependencyGraph.nodes.length} nodes and ${dependencyGraph.edges.length} connections.\n`);
      
      // Add critical path information if there are enough dependencies
      if (dependencyGraph.edges.length > 3) {
        summary.push("### Critical Path\n");
        summary.push("Tasks on the critical path that should be prioritized:\n");
        
        // Find tasks with the most dependents (most blocking)
        const dependentCounts = new Map<string, number>();
        for (const edge of dependencyGraph.edges) {
          if (edge.type === 'dependency') {
            dependentCounts.set(edge.source, (dependentCounts.get(edge.source) || 0) + 1);
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
