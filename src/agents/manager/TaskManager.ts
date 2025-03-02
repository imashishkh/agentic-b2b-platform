
import { AgentType } from "../AgentTypes";

/**
 * Extracts tasks from markdown content
 * 
 * @param markdownContent - The markdown content to parse
 * @returns Array of extracted tasks
 */
export async function extractTasksFromMarkdown(markdownContent: string): Promise<any[]> {
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
          category: categorizeTask(title)
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
            category: categorizeTask(title)
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
export function categorizeTask(text: string): AgentType {
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
 * @param assignedTasks - Map of agent types to task arrays
 */
export async function assignTasksToSpecialists(tasks: any[]): Promise<Map<AgentType, any[]>> {
  console.log("Assigning tasks to specialists");
  
  // Initialize task assignments
  const assignedTasks = new Map<AgentType, any[]>();
  
  // Initialize empty task lists for each agent type
  Object.values(AgentType).forEach(agentType => {
    assignedTasks.set(agentType, []);
  });
  
  // Assign tasks based on their category
  tasks.forEach(task => {
    const agentTasks = assignedTasks.get(task.category) || [];
    agentTasks.push(task);
    assignedTasks.set(task.category, agentTasks);
    
    // Also assign subtasks
    task.subtasks.forEach((subtask: any) => {
      const subtaskAgentType = subtask.category || task.category;
      const subtaskAgentTasks = assignedTasks.get(subtaskAgentType) || [];
      subtaskAgentTasks.push({
        ...subtask,
        parentTaskId: task.id,
        parentTaskTitle: task.title
      });
      assignedTasks.set(subtaskAgentType, subtaskAgentTasks);
    });
  });
  
  console.log("Task assignments:", Object.fromEntries(assignedTasks));
  return assignedTasks;
}

/**
 * Generate a summary of task assignments
 */
export function generateTaskSummary(parsedTasks: any[], assignedTasks: Map<AgentType, any[]>): string {
  const summary = ["# Project Analysis Summary\n"];
  
  // Add the total number of tasks
  const totalTasks = parsedTasks.length;
  const totalSubtasks = parsedTasks.reduce((count, task) => {
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
    const tasks = assignedTasks.get(type) || [];
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
 * Generate an enhanced task summary with dependency information
 */
export function generateEnhancedTaskSummary(extractedTasks: any[], dependencyGraph: any, projectRequirements: string): string {
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
  const { recommendArchitecturalPatterns } = require("@/utils/architectureUtils");
  const patternRecommendations = recommendArchitecturalPatterns(projectRequirements);
  const topPatterns = patternRecommendations.slice(0, 3);
  
  summary.push("Based on your requirements, I recommend these architectural patterns:\n");
  topPatterns.forEach((rec: any, index: number) => {
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
