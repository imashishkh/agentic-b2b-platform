import { BaseAgent } from "./BaseAgent";
import { AgentType } from "./AgentTypes";
import { createAgent } from "./AgentFactory";
import { toast } from "sonner";
import { recommendArchitecturalPatterns, recommendTechnologyStack, createArchitectureProposal } from "@/utils/architectureUtils";

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
    if (text.match(/database|schema|model|entity|table|column|field|relation|query|sql|nosql|migration|seed/)) {
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
   * Creates a tailored prompt for the AI model based on the message type
   * 
   * @param userMessage - The original user message
   * @param projectPhases - Current project phases and tasks
   * @returns A structured prompt that guides the AI response
   */
  protected createPrompt(userMessage: string, projectPhases: any[]): string {
    // Check if this is a file upload request
    if (this.isFileUploadRequest(userMessage)) {
      return `
        As the Development Manager for this project, you're analyzing a requirements document that was just uploaded.
        
        ${userMessage}
        
        Please analyze this document thoroughly and:
        1. Extract all the project requirements
        2. Break them down into clear tasks and subtasks
        3. Categorize each task by specialization (Frontend, Backend, Database, DevOps, UX)
        4. Assign each task to the appropriate specialist agent
        5. Provide a summary of your analysis and assignments
        6. Suggest next steps for the project
        
        Remember to be thorough in your analysis but also clear and concise in your response.
      `;
    }
    
    // Handle knowledge base-related messages specifically
    if (this.isKnowledgeBaseRequest(userMessage)) {
      return `
        As the Development Manager for this e-commerce project, you're managing the project knowledge base.
        
        ${userMessage}
        
        Please provide a response that:
        1. Acknowledges the resource information shared
        2. Explains how this will be used to inform development decisions
        3. If appropriate, requests additional specific resources that would complement what's been shared
        4. Organizes the knowledge into relevant categories (Tech Stack, Industry Standards, Security, etc.)
        
        Make your response helpful and focused on how these resources will improve the project's quality and efficiency.
      `;
    }
    
    // Handle architecture-related messages with enhanced architecture capabilities
    if (this.isArchitectureRequest(userMessage)) {
      return `
        As the Development Manager and system architect for this e-commerce project, you're being asked about system architecture.
        
        ${userMessage}
        
        Please provide a response that:
        1. Outlines a high-level architecture appropriate for an e-commerce system
        2. Describes key components and their relationships
        3. Explains technical decisions and trade-offs
        4. Recommends specific technologies for each component
        5. Suggests an appropriate architectural pattern (Microservices, Monolithic, Serverless, etc.)
        6. Includes a visual representation or diagram of the architecture
        7. Mentions how the architecture supports scalability, maintainability, and security
        
        Make your response detailed but accessible, explaining architectural concepts clearly.
      `;
    }
    
    // Handle testing strategy messages
    if (this.isTestingStrategyRequest(userMessage)) {
      return `
        As the Development Manager and quality assurance lead for this e-commerce project, you're being asked about testing strategies.
        
        ${userMessage}
        
        Please provide a response that:
        1. Outlines a comprehensive testing approach for an e-commerce system
        2. Covers different testing levels (unit, integration, e2e, etc.)
        3. Recommends testing frameworks and tools
        4. Explains how testing fits into the development lifecycle
        5. Mentions that you can create a formal testing strategy the user can view in the Project Features panel
        
        Make your response practical and actionable, with concrete examples.
      `;
    }
    
    // Handle GitHub integration messages
    if (this.isGitHubRequest(userMessage)) {
      return `
        As the Development Manager and DevOps expert for this e-commerce project, you're being asked about GitHub integration.
        
        ${userMessage}
        
        Please provide a response that:
        1. Explains the benefits of GitHub integration for an e-commerce project
        2. Outlines best practices for repository structure and branching strategies
        3. Suggests CI/CD workflows appropriate for e-commerce
        4. Directs the user to use the Project Features panel to connect their GitHub repository
        
        Make your response practical and focused on the e-commerce context.
      `;
    }
    
    // Determine the type of request to tailor the prompt appropriately
    const isConsultation = userMessage.includes("One of your team members") && 
                          userMessage.includes("needs guidance");
    
    const isCoordination = userMessage.includes("synthesize these different specialist inputs");
    
    const isTechnicalDecision = userMessage.includes("technical decision") || 
                               userMessage.includes("architectural choice") ||
                               userMessage.includes("technology selection");
    
    const isCodeReview = userMessage.includes("review this code") || 
                        userMessage.includes("quality check") ||
                        userMessage.includes("best practices review");
    
    // Create specialized prompts based on request type
    if (isCodeReview) {
      return `
        As the Development Manager and lead architect, you're being asked to review code quality.
        
        ${userMessage}
        
        Provide a thorough code review that covers:
        1. Code structure and organization
        2. Adherence to best practices
        3. Potential bugs or edge cases
        4. Performance considerations
        5. Security implications (especially important for e-commerce)
        6. Maintainability and scalability
        
        Your review should be specific, actionable, and educational. Explain not just what should be changed, but why.
        Always consider the e-commerce context and how code quality impacts user experience and business outcomes.
      `;
    }
    
    if (isTechnicalDecision) {
      return `
        As the Development Manager and lead architect, you're being asked to make a technical decision.
        
        ${userMessage}
        
        Provide a clear decision with:
        1. Analysis of different options
        2. Pros and cons of each approach
        3. Your recommendation and reasoning
        4. Implementation considerations
        5. Potential risks and mitigation strategies
        
        Your decision should balance technical excellence with practicality for the e-commerce context.
        Consider factors like development speed, future scalability, security requirements, and team expertise.
      `;
    }
    
    if (isCoordination) {
      return `
        As the Development Manager and technical lead, you're being asked to coordinate inputs from multiple specialists.
        
        ${userMessage}
        
        Your job is to create a clear development plan that:
        1. Establishes the correct sequence of tasks
        2. Identifies critical dependencies between different parts of the system
        3. Highlights integration points that need special attention
        4. Provides clear technical guidance on how components should work together
        5. Sets quality standards and testing requirements
        6. Addresses potential risks and mitigation strategies
        
        Remember that you have final decision-making authority on technical approaches.
      `;
    }
    
    if (isConsultation) {
      return `
        As the Development Manager and technical lead for this e-commerce project, you're being consulted by one of your team specialists.
        
        ${userMessage}
        
        Please provide authoritative guidance that combines your broad technical knowledge with project specifics.
        Remember you have oversight across all domains including: frontend, backend, database, DevOps, and UX.
        Your goal is to provide clear, actionable direction that will unblock your team member.
        
        Draw on your expertise in:
        1. E-commerce architecture patterns
        2. Technical standards and best practices
        3. Cross-domain integration approaches
        4. Risk assessment and mitigation
        5. Performance and security considerations
      `;
    }
    
    // Check if there are parsed tasks we can reference
    const hasParsedTasks = this.parsedTasks.length > 0;
    
    // Default prompt for general manager tasks
    return `
      As an AI Development Manager specializing in e-commerce projects, please respond to the following:
      
      User: "${userMessage}"
      
      ${hasParsedTasks
        ? `Consider the current project tasks: ${JSON.stringify(this.parsedTasks)}` 
        : "No project structure has been defined yet. Consider asking for a markdown file or helping the user define project requirements."}
      
      Your role is to:
      1. Provide high-level architectural guidance
      2. Help break down complex requirements into manageable tasks
      3. Suggest workflows and development approaches
      4. Coordinate between different aspects of the e-commerce development
      5. Support team members who need technical guidance across specialties
      6. Make authoritative technical decisions when needed
      7. Ensure quality, security, and performance standards are met
      8. Provide strategic direction aligned with e-commerce best practices
      9. Maintain and leverage the project knowledge base
      
      Focus on project structure, dependencies, and integration points between different system components.
      As the Development Manager, you have the final say on technical decisions and can provide authoritative guidance across all domains.
    `;
  }
  
  /**
   * Determines if the agent is stuck with a response
   * 
   * @param response - The generated response to evaluate
   * @returns boolean indicating whether the agent is stuck
   */
  protected isAgentStuck(response: string): boolean {
    // The manager is never "stuck" in the same way as specialists
    // This prevents infinite loops when consulting the manager
    return false;
  }
  
  /**
   * Override detectDependencies for the Manager to prevent circular dependencies
   * 
   * @param response - The generated response to analyze
   * @param userMessage - The original user message
   * @returns Object with dependency information
   */
  protected detectDependencies(response: string, userMessage: string): { 
    hasDependencies: boolean; 
    dependentAgents: AgentType[];
    dependencyDetails: string;
  } {
    // The manager doesn't need to coordinate with others as it has final authority
    return { 
      hasDependencies: false, 
      dependentAgents: [], 
      dependencyDetails: "" 
    };
  }
  
  /**
   * Creates a search query tailored for the manager's expertise
   * 
   * @param message - The user message to create a search from
   * @param projectPhases - Current project phases for context
   * @returns A search query string
   */
  protected createSearchQuery(message: string, projectPhases: any[]): string {
    // For the manager agent, we want broader search results about project management
    // and technical leadership
    return `e-commerce project management ${message} best practices methodology leadership architecture`;
  }
  
  /**
   * Enhanced security checking for code reviews
   * 
   * @param message - The user message
   * @param response - The generated response
   * @returns boolean indicating whether to perform security checks
   */
  protected shouldCheckSecurity(message: string, response: string): boolean {
    // Manager always checks security when code is present
    return response.includes("```");
  }
  
  /**
   * Provides detailed testing guidance with test results
   * 
   * @param claudeResponse - The original response
   * @param testResults - Results from automated tests
   * @returns Enhanced response with testing recommendations
   */
  protected enhanceResponseWithTestResults(claudeResponse: string, testResults: string): string {
    return `
${claudeResponse}

## Code Review and Testing Recommendations

${testResults}

As the Development Manager, I recommend that all team members follow these testing practices for our e-commerce platform:

1. Write unit tests for all business logic components
2. Implement integration tests for API endpoints and data flows
3. Add end-to-end tests for critical user journeys like checkout
4. Perform security testing on all code that handles user data or payments
5. Test all responsive design breakpoints for mobile and desktop

Would you like me to help set up a testing framework or provide specific test cases for this code?
    `;
  }
  
  /**
   * Enhanced response generation for knowledge base queries
   * 
   * @param response - The original response
   * @param knowledgeBase - The current knowledge base resources
   * @returns Enhanced response with knowledge base information
   */
  enhanceResponseWithKnowledgeBase(response: string, knowledgeBase: any[]): string {
    if (knowledgeBase.length === 0) {
      return response;
    }
    
    // Group resources by category
    const categorizedResources: Record<string, any[]> = {};
    knowledgeBase.forEach(resource => {
      if (!categorizedResources[resource.category]) {
        categorizedResources[resource.category] = [];
      }
      categorizedResources[resource.category].push(resource);
    });
    
    let knowledgeBaseSection = "\n\n## Relevant Knowledge Base Resources\n\n";
    
    // Add resources by category
    Object.entries(categorizedResources).forEach(([category, resources]) => {
      knowledgeBaseSection += `### ${category}\n`;
      resources.forEach(resource => {
        knowledgeBaseSection += `- [${resource.title}](${resource.url}) - ${resource.description}\n`;
      });
      knowledgeBaseSection += "\n";
    });
    
    return `${response}${knowledgeBaseSection}`;
  }
}
