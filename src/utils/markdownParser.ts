
/**
 * Enhanced markdown parser utility for requirements extraction and analysis
 */

/**
 * Task type representing an extracted requirement task
 */
export interface ExtractedTask {
  id: string;
  title: string;
  description: string;
  subtasks: ExtractedTask[];
  priority: 'high' | 'medium' | 'low';
  category: string;
  dependencies: string[]; // IDs of tasks this task depends on
  estimatedEffort: number; // Estimated hours/points
  tags: string[];
}

/**
 * Extracts key features from markdown content for search queries
 */
export const extractKeyFeatures = (markdown: string): string => {
  // Look for common e-commerce features in the markdown
  const features = [];
  
  if (markdown.toLowerCase().includes("payment")) features.push("payment processing");
  if (markdown.toLowerCase().includes("product") && markdown.toLowerCase().includes("catalog")) 
    features.push("product catalog");
  if (markdown.toLowerCase().includes("cart") || markdown.toLowerCase().includes("checkout")) 
    features.push("shopping cart and checkout");
  if (markdown.toLowerCase().includes("user") && markdown.toLowerCase().includes("account")) 
    features.push("user accounts");
  if (markdown.toLowerCase().includes("search")) features.push("search functionality");
  if (markdown.toLowerCase().includes("review")) features.push("product reviews");
  
  return features.length > 0 ? features.join(", ") : "e-commerce platform features";
};

/**
 * Extracts project phases from an LLM response
 */
export const extractPhasesFromResponse = (response: string): any[] => {
  const phases = [];
  
  // Look for headings that might indicate phases
  const phaseRegex = /##\s+(Phase|Sprint|Milestone)\s+(\d+|[IVX]+):\s*([^\n]+)/gi;
  let phaseMatch;
  
  while ((phaseMatch = phaseRegex.exec(response)) !== null) {
    const phaseName = phaseMatch[3];
    const phaseContent = response.slice(phaseMatch.index + phaseMatch[0].length);
    const endIndex = phaseContent.search(/##\s+(Phase|Sprint|Milestone)/i);
    
    const phaseText = endIndex !== -1 ? 
      phaseContent.slice(0, endIndex) : 
      phaseContent;
    
    // Extract tasks from the phase content
    const tasks = [];
    const taskRegex = /-\s+([^\n]+)/g;
    let taskMatch;
    
    while ((taskMatch = taskRegex.exec(phaseText)) !== null) {
      tasks.push(taskMatch[1]);
    }
    
    phases.push({
      name: phaseName,
      tasks: tasks
    });
  }
  
  return phases;
};

/**
 * Extracts requirements from markdown content
 * @param markdown The markdown content to parse
 * @returns Array of extracted requirements
 */
export const extractRequirements = (markdown: string): string[] => {
  const requirements: string[] = [];
  const lines = markdown.split('\n');
  
  let inRequirementsSection = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Check if we're entering a requirements section
    if (line.match(/^#+\s*(requirements|user stories|features|functional requirements)/i)) {
      inRequirementsSection = true;
      continue;
    }
    
    // Check if we're leaving a requirements section
    if (inRequirementsSection && line.match(/^#+\s*/)) {
      inRequirementsSection = false;
    }
    
    // Extract requirements from bullet points
    if (inRequirementsSection && (line.startsWith('- ') || line.startsWith('* ') || line.match(/^\d+\.\s+/))) {
      const requirement = line.replace(/^(-|\*|\d+\.)\s+/, '').trim();
      if (requirement) {
        requirements.push(requirement);
      }
    }
  }
  
  return requirements;
};

/**
 * Extracts tasks from markdown content with dependencies
 * @param markdown The markdown content to parse
 * @returns Array of extracted tasks with dependencies
 */
export const extractTasksWithDependencies = (markdown: string): ExtractedTask[] => {
  console.log("Extracting tasks with dependencies from markdown");
  
  const tasks: ExtractedTask[] = [];
  const lines = markdown.split('\n');
  
  let currentMainTask: ExtractedTask | null = null;
  let currentSubtask: ExtractedTask | null = null;
  
  // First pass: Extract tasks and subtasks
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Parse headings as tasks and subtasks
    if (line.startsWith('# ')) {
      // Main sections (epics)
      const title = line.substring(2).trim();
      currentMainTask = {
        id: `task-${tasks.length + 1}`,
        title,
        description: '',
        subtasks: [],
        priority: 'medium',
        category: categorizeRequirement(title),
        dependencies: [],
        estimatedEffort: estimateEffort(title),
        tags: extractTags(title)
      };
      tasks.push(currentMainTask);
      currentSubtask = null;
    } else if (line.startsWith('## ')) {
      // Subtasks
      if (currentMainTask) {
        const title = line.substring(3).trim();
        currentSubtask = {
          id: `subtask-${currentMainTask.id}-${currentMainTask.subtasks.length + 1}`,
          title,
          description: '',
          subtasks: [],
          priority: 'medium',
          category: categorizeRequirement(title),
          dependencies: [],
          estimatedEffort: estimateEffort(title),
          tags: extractTags(title)
        };
        currentMainTask.subtasks.push(currentSubtask);
      }
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      // List items as requirements or details
      const detail = line.substring(2).trim();
      if (currentSubtask) {
        currentSubtask.description += `• ${detail}\n`;
      } else if (currentMainTask) {
        currentMainTask.description += `• ${detail}\n`;
      }
    } else if (line.length > 0) {
      // Regular text as description
      if (currentSubtask) {
        currentSubtask.description += `${line}\n`;
      } else if (currentMainTask) {
        currentMainTask.description += `${line}\n`;
      }
    }
  }
  
  // Second pass: Identify dependencies based on references in descriptions
  for (const task of tasks) {
    findDependenciesInDescription(task, tasks);
    
    for (const subtask of task.subtasks) {
      findDependenciesInDescription(subtask, tasks);
    }
  }
  
  // Third pass: Assign priorities based on dependencies and keywords
  assignPriorities(tasks);
  
  console.log("Extracted tasks:", tasks);
  return tasks;
};

/**
 * Find dependencies mentioned in task descriptions
 */
const findDependenciesInDescription = (task: ExtractedTask, allTasks: ExtractedTask[]): void => {
  // Look for explicit dependency mentions
  const dependsOnRegex = /depends on|requires|after|following|prerequisite/i;
  
  if (dependsOnRegex.test(task.description)) {
    // Check for references to other tasks
    for (const otherTask of allTasks) {
      if (otherTask.id !== task.id && 
          (task.description.toLowerCase().includes(otherTask.title.toLowerCase()) ||
           task.description.toLowerCase().includes(otherTask.id.toLowerCase()))) {
        task.dependencies.push(otherTask.id);
      }
      
      // Check subtasks too
      for (const otherSubtask of otherTask.subtasks) {
        if (otherSubtask.id !== task.id && 
            (task.description.toLowerCase().includes(otherSubtask.title.toLowerCase()) ||
             task.description.toLowerCase().includes(otherSubtask.id.toLowerCase()))) {
          task.dependencies.push(otherSubtask.id);
        }
      }
    }
  }
};

/**
 * Assign priorities based on dependencies and keywords
 */
const assignPriorities = (tasks: ExtractedTask[]): void => {
  // First, identify high priority tasks based on keywords
  for (const task of tasks) {
    // Check for high priority indicators
    if (task.title.match(/critical|urgent|important|high priority|essential|core|key/i) ||
        task.description.match(/critical|urgent|important|high priority|essential|core|key/i)) {
      task.priority = 'high';
    }
    
    // Check for low priority indicators
    if (task.title.match(/optional|nice to have|future|low priority|enhancement/i) ||
        task.description.match(/optional|nice to have|future|low priority|enhancement/i)) {
      task.priority = 'low';
    }
    
    // Assign priorities to subtasks
    for (const subtask of task.subtasks) {
      // Inherit parent priority as a starting point
      subtask.priority = task.priority;
      
      // Override based on subtask-specific keywords
      if (subtask.title.match(/critical|urgent|important|high priority|essential|core|key/i) ||
          subtask.description.match(/critical|urgent|important|high priority|essential|core|key/i)) {
        subtask.priority = 'high';
      }
      
      if (subtask.title.match(/optional|nice to have|future|low priority|enhancement/i) ||
          subtask.description.match(/optional|nice to have|future|low priority|enhancement/i)) {
        subtask.priority = 'low';
      }
    }
  }
  
  // Second pass: adjust priority based on dependency graph
  // Tasks that have many dependents should be higher priority
  const dependencyCounts = new Map<string, number>();
  
  // Count how many tasks depend on each task
  for (const task of tasks) {
    for (const depId of task.dependencies) {
      dependencyCounts.set(depId, (dependencyCounts.get(depId) || 0) + 1);
    }
    
    for (const subtask of task.subtasks) {
      for (const depId of subtask.dependencies) {
        dependencyCounts.set(depId, (dependencyCounts.get(depId) || 0) + 1);
      }
    }
  }
  
  // Adjust priorities based on dependency counts
  for (const task of tasks) {
    const count = dependencyCounts.get(task.id) || 0;
    if (count >= 3 && task.priority !== 'high') {
      task.priority = 'high';
    } else if (count >= 1 && task.priority === 'low') {
      task.priority = 'medium';
    }
    
    for (const subtask of task.subtasks) {
      const subtaskCount = dependencyCounts.get(subtask.id) || 0;
      if (subtaskCount >= 2 && subtask.priority !== 'high') {
        subtask.priority = 'high';
      } else if (subtaskCount >= 1 && subtask.priority === 'low') {
        subtask.priority = 'medium';
      }
    }
  }
};

/**
 * Categorize a requirement based on its content
 */
const categorizeRequirement = (text: string): string => {
  text = text.toLowerCase();
  
  // Frontend tasks
  if (text.match(/ui|interface|component|screen|page|view|frontend|css|html|style|animation|responsive|mobile|desktop|layout/)) {
    return "frontend";
  }
  
  // Backend tasks
  if (text.match(/api|endpoint|server|backend|auth|authentication|authorization|middleware|service|controller|route|validator/)) {
    return "backend";
  }
  
  // Database tasks
  if (text.match(/database|schema|model|entity|table|column|field|relation|query|sql|nosql|migration|seed/)) {
    return "database";
  }
  
  // DevOps tasks
  if (text.match(/deploy|ci|cd|pipeline|docker|container|kubernetes|k8s|aws|cloud|hosting|environment|config|monitor|log|performance|scale/)) {
    return "devops";
  }
  
  // UX tasks
  if (text.match(/ux|user experience|design|wireframe|prototype|usability|accessibility|flow|journey|persona|research|testing/)) {
    return "ux";
  }
  
  // Default to other
  return "other";
};

/**
 * Estimate effort based on task description
 */
const estimateEffort = (text: string): number => {
  text = text.toLowerCase();
  
  // Complex tasks
  if (text.match(/complex|difficult|challenging|extensive|comprehensive|complete|full|end-to-end/)) {
    return 8; // 8 points/hours
  }
  
  // Medium tasks
  if (text.match(/implement|create|develop|build|design|refactor/)) {
    return 5; // 5 points/hours
  }
  
  // Simple tasks
  if (text.match(/update|modify|fix|change|adjust|simple|easy|quick/)) {
    return 2; // 2 points/hours
  }
  
  // Default value
  return 3;
};

/**
 * Extract tags from text
 */
const extractTags = (text: string): string[] => {
  const tags: string[] = [];
  const lowercaseText = text.toLowerCase();
  
  // Technical tags
  if (lowercaseText.match(/react|frontend|ui|ux|component/)) tags.push('frontend');
  if (lowercaseText.match(/api|backend|server|service|controller/)) tags.push('backend');
  if (lowercaseText.match(/database|data|schema|model|entity/)) tags.push('database');
  if (lowercaseText.match(/deployment|ci|cd|pipeline|docker|cloud/)) tags.push('devops');
  if (lowercaseText.match(/test|testing|unit|integration|e2e|quality/)) tags.push('testing');
  if (lowercaseText.match(/security|auth|authorization|authentication/)) tags.push('security');
  if (lowercaseText.match(/performance|optimization|speed/)) tags.push('performance');
  
  // Functional tags
  if (lowercaseText.match(/user|account|profile/)) tags.push('user-management');
  if (lowercaseText.match(/product|catalog|inventory/)) tags.push('product-catalog');
  if (lowercaseText.match(/cart|checkout|payment/)) tags.push('shopping-cart');
  if (lowercaseText.match(/order|shipping|delivery/)) tags.push('order-management');
  if (lowercaseText.match(/search|filter|sort/)) tags.push('search');
  if (lowercaseText.match(/review|rating|feedback/)) tags.push('reviews');
  
  return tags;
};

/**
 * Generate a dependency graph for visualization
 */
export const generateDependencyGraph = (tasks: ExtractedTask[]): any => {
  const nodes: any[] = [];
  const edges: any[] = [];
  
  // Create a map for quick task lookup
  const taskMap = new Map<string, ExtractedTask>();
  
  // Add all tasks and subtasks to the map
  for (const task of tasks) {
    taskMap.set(task.id, task);
    
    // Add main task as node
    nodes.push({
      id: task.id,
      label: task.title,
      category: task.category,
      priority: task.priority
    });
    
    for (const subtask of task.subtasks) {
      taskMap.set(subtask.id, subtask);
      
      // Add subtask as node
      nodes.push({
        id: subtask.id,
        label: subtask.title,
        category: subtask.category,
        priority: subtask.priority,
        parentId: task.id
      });
      
      // Add edge from parent to child
      edges.push({
        source: task.id,
        target: subtask.id,
        type: 'parent-child'
      });
    }
  }
  
  // Add dependency edges
  for (const task of tasks) {
    for (const depId of task.dependencies) {
      if (taskMap.has(depId)) {
        edges.push({
          source: depId,
          target: task.id,
          type: 'dependency'
        });
      }
    }
    
    for (const subtask of task.subtasks) {
      for (const depId of subtask.dependencies) {
        if (taskMap.has(depId)) {
          edges.push({
            source: depId,
            target: subtask.id,
            type: 'dependency'
          });
        }
      }
    }
  }
  
  return { nodes, edges };
};
