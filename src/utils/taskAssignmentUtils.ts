
import { AgentType } from "@/agents/AgentTypes";

/**
 * Analyzes project phases and assigns tasks to appropriate agent types
 * This helps organize which specialist should handle each task
 * 
 * @param phases - Array of project phases with tasks
 * @returns Record mapping agent types to their assigned tasks
 */
export const assignTasksToAgents = (phases: any[]): Record<AgentType, string[]> => {
  const assignments: Record<AgentType, string[]> = {
    [AgentType.FRONTEND]: [],
    [AgentType.BACKEND]: [],
    [AgentType.DATABASE]: [],
    [AgentType.DEVOPS]: [],
    [AgentType.UX]: [],
    [AgentType.MANAGER]: []
  };
  
  phases.forEach(phase => {
    phase.tasks.forEach((task: string) => {
      // Use keywords to determine which agent should handle each task
      if (task.match(/frontend|UI|component|react|design|css|tailwind|style|layout|responsive|mobile|desktop|animation/i)) {
        assignments[AgentType.FRONTEND].push(task);
      } 
      else if (task.match(/backend|API|endpoint|server|route|controller|middleware|authentication|authorization/i)) {
        assignments[AgentType.BACKEND].push(task);
      }
      else if (task.match(/database|DB|schema|model|query|SQL|NoSQL|migration|table|document|collection|entity/i)) {
        assignments[AgentType.DATABASE].push(task);
      }
      else if (task.match(/deployment|CI\/CD|pipeline|container|docker|kubernetes|cloud|AWS|Azure|GCP|monitoring|logging/i)) {
        assignments[AgentType.DEVOPS].push(task);
      }
      else if (task.match(/UX|UI|user experience|wireframe|mockup|prototype|user research|usability|accessibility|flow/i)) {
        assignments[AgentType.UX].push(task);
      }
      else {
        // Default to manager for coordination tasks and anything not clearly matching other agents
        assignments[AgentType.MANAGER].push(task);
      }
    });
  });
  
  return assignments;
};

/**
 * Generates a formatted message with task assignments for each agent
 * This creates a visual breakdown of which agent is responsible for which tasks
 * 
 * @param assignments - Record mapping agent types to their assigned tasks
 * @returns Formatted markdown message with task assignments
 */
export const generateTaskAssignmentMessage = (assignments: Record<AgentType, string[]>): string => {
  const agentNames = {
    [AgentType.FRONTEND]: "Frontend Developer",
    [AgentType.BACKEND]: "Backend Developer",
    [AgentType.DATABASE]: "Database Architect",
    [AgentType.DEVOPS]: "DevOps Engineer",
    [AgentType.UX]: "UX Designer",
    [AgentType.MANAGER]: "Development Manager"
  };
  
  let message = "## Task Assignments by Specialist\n\n";
  
  Object.entries(assignments).forEach(([agentType, tasks]) => {
    if (tasks.length === 0) return;
    
    message += `### ${agentNames[agentType as AgentType]}\n`;
    tasks.forEach(task => {
      message += `- ${task}\n`;
    });
    message += "\n";
  });
  
  return message;
};
