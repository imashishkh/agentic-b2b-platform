
import { AgentType } from "./AgentTypes";
import { FrontendAgent } from "./FrontendAgent";
import { BackendAgent } from "./BackendAgent";
import { DatabaseAgent } from "./DatabaseAgent";
import { DevOpsAgent } from "./DevOpsAgent";
import { UXAgent } from "./UXAgent";
import { ManagerAgent } from "./ManagerAgent";

/**
 * Factory to create the appropriate AI agent based on type
 */
export const createAgent = (type: AgentType) => {
  switch (type) {
    case AgentType.FRONTEND:
      return new FrontendAgent(AgentType.FRONTEND);
    case AgentType.BACKEND:
      return new BackendAgent(AgentType.BACKEND);
    case AgentType.DATABASE:
      return new DatabaseAgent(AgentType.DATABASE);
    case AgentType.DEVOPS:
      return new DevOpsAgent(AgentType.DEVOPS);
    case AgentType.UX:
      return new UXAgent(AgentType.UX);
    case AgentType.MANAGER:
    default:
      return new ManagerAgent(AgentType.MANAGER);
  }
};

/**
 * Determines the best agent to handle a specific user message
 */
export const determineAgentType = (message: string, projectPhases: any[]): AgentType => {
  // Analyze the message content to determine which agent should handle it
  
  // Check for DevOps and GitHub repository related keywords
  if (message.match(/github|repository|repo|branch|commit|pull request|PR|merge|CI\/CD|pipeline|workflow|git|deployment|docker|kubernetes|infrastructure|DevOps/i)) {
    return AgentType.DEVOPS;
  }
  
  // Check for frontend-related keywords
  if (message.match(/frontend|UI|component|react|design|css|tailwind|style|layout|responsiv|mobile|desktop/i)) {
    return AgentType.FRONTEND;
  }
  
  // Check for backend-related keywords
  if (message.match(/backend|server|api|endpoint|route|controller|middleware|authentication|authorization/i)) {
    return AgentType.BACKEND;
  }
  
  // Check for database-related keywords
  if (message.match(/database|schema|table|query|SQL|noSQL|MongoDB|PostgreSQL|data model|migration|seeding/i)) {
    return AgentType.DATABASE;
  }
  
  // Check for UX-related keywords
  if (message.match(/user experience|UX|usability|accessibility|user flow|information architecture|wireframe|prototype/i)) {
    return AgentType.UX;
  }
  
  // Default to the Manager Agent if no specific domain is detected
  // or if the message is about project management
  if (message.match(/project|phase|task|timeline|planning|milestone|requirement|specification/i)) {
    return AgentType.MANAGER;
  }
  
  // If we can't determine, use the Manager agent
  return AgentType.MANAGER;
};
