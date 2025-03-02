import { AgentType } from "@/agents/AgentTypes";

export interface ChatMessageProps {
  type: string;
  content: React.ReactNode;
  agentType?: AgentType;
  isSecurityReview?: boolean;
  complianceStatus?: "passed" | "warning" | "failed";
  collaborators?: AgentType[];
  projectContext?: string;
  className?: string;
}

export interface SuggestionOption {
  label: string;
  message: string;
}

export interface Suggestion {
  title: string;
  description?: string;
  options: string[] | SuggestionOption[];
}

export interface KnowledgeResource {
  id: string;
  title: string;
  content: string;
}

export interface ProjectTask {
  id: string;
  title: string;
  description: string;
  status: "open" | "in progress" | "completed";
  assignee?: string;
  dueDate?: Date;
}

export interface TaskDependency {
  id: string;
  sourceTaskId: string;
  targetTaskId: string;
  type: "finish-to-start" | "start-to-start" | "finish-to-finish" | "start-to-finish";
}

export interface TaskAssignment {
  id: string;
  taskId: string;
  agentType: AgentType;
}

export interface ChatContextType {
  messages: ChatMessageProps[];
  isAgentTyping: boolean;
  isFetchingResponse: boolean;
  isLoadingExample: boolean;
  projectPhases: any[];
  hasRequestedFile: boolean;
  currentAgentType: AgentType;
  setCurrentAgentType: (agentType: AgentType) => void;
  suggestions: Suggestion[];
  searchEnabled: boolean;
  searchResults: any[];
  securityReviewActive: boolean;
  securityAssessments: any[];
  complianceStatus: {
    [key: string]: "passed" | "warning" | "failed";
  };
  knowledgeBase: {
    [category: string]: KnowledgeResource[];
  };
  projectTasks: ProjectTask[];
  projectMilestones: any[];
  taskDependencies: TaskDependency[];
  taskAssignments: TaskAssignment[];
  vulnerabilityAssessments: any[];
  bestPracticesViolations: any[];
  collaborationActive: boolean;
  contextAwareEnabled?: boolean;  // Add this property
  currentCollaborators?: AgentType[];  // Add this property
  projectPlans?: any[];  // Add this property
  currentPlanId?: string | null;  // Add this property
  claudeAPIEnabled?: boolean;  // Add this property
  addMessage: (message: any) => void;
  clearMessages: () => void;
  setIsAgentTyping: (isTyping: boolean) => void;
  setIsFetchingResponse: (isFetching: boolean) => void;
  setIsLoadingExample: (isLoading: boolean) => void;
  addProjectPhase: (phase: any) => void;
  setHasRequestedFile: (hasRequested: boolean) => void;
  addSuggestion: (suggestion: Suggestion) => void;
  removeSuggestion: (title: string) => void;
  clearSuggestions: () => void;
  setSearchEnabled: (enabled: boolean) => void;
  addSearchResult: (result: any) => void;
  clearSearchResults: () => void;
  setSecurityReviewActive: (isActive: boolean) => void;
  addSecurityAssessment: (assessment: any) => void;
  updateComplianceStatus: (key: string, status: "passed" | "warning" | "failed") => void;
  addKnowledgeResource: (category: string, resource: KnowledgeResource) => void;
  removeKnowledgeResource: (category: string, id: string) => void;
  addProjectTask: (task: ProjectTask) => void;
  updateProjectTask: (id: string, task: Partial<ProjectTask>) => void;
  addProjectMilestone: (milestone: any) => void;
  addTaskDependency: (dependency: TaskDependency) => void;
  addTaskAssignment: (assignment: TaskAssignment) => void;
  addVulnerabilityAssessment: (assessment: any) => void;
  addBestPracticesViolation: (violation: any) => void;
  setCollaborationActive: (isActive: boolean) => void;
  addProjectPlan?: (plan: any) => void;  // Add these optional methods
  updateProjectPlan?: (id: string, plan: Partial<any>) => void;
  setActivePlan?: (id: string | null) => void;
  storeInAgentMemory?: (key: string, value: any) => void;
  retrieveFromAgentMemory?: (key: string) => any;
  toggleClaudeAPI?: (enabled: boolean) => void;
  setCollaborators?: (collaborators: AgentType[]) => void;
  toggleContextAware?: (enabled: boolean) => void;
}
