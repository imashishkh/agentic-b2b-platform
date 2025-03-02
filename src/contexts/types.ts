
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
  icon?: string;
  description?: string;
}

export interface Suggestion {
  title: string;
  description?: string;
  options: string[] | SuggestionOption[];
}

// Alias SuggestionProps to Suggestion for backward compatibility
export type SuggestionProps = Suggestion;

export interface KnowledgeResource {
  id: string;
  title: string;
  content: string;
  category?: string;
  tags?: string[];
  description?: string;
  url?: string;
  lastAccessed?: string;
  accessCount?: number;
  calculatedScore?: number;
  dateAdded?: string;
}

// Alias KnowledgeBaseResource to KnowledgeResource for backward compatibility
export type KnowledgeBaseResource = KnowledgeResource;

export interface ProjectTask {
  id: string;
  title: string;
  description: string;
  status: "open" | "in progress" | "completed";
  assignee?: string;
  dueDate?: Date;
  // Add missing properties used in components
  startDate?: string;
  endDate?: string;
  duration?: number;
  progress?: number;
  milestone?: boolean;
  priority?: string;
  assignedTo?: AgentType;
  dependencies?: string[];
  subtasks?: ProjectTask[];
}

// Define the Task type for compatibility
export type Task = ProjectTask;

export interface ProjectPhase {
  id: string;
  name: string;
  tasks: ProjectTask[];
  startDate?: string | Date;
  endDate?: string | Date;
  status?: "planned" | "in-progress" | "completed";
  milestones?: any[]; // Add to fix TaskVisualization.tsx errors
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  date: string;
  completed: boolean;
  relatedTasks?: string[];
}

export interface ProjectTimeline {
  phases: ProjectPhase[];
  milestones: Milestone[];
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

export interface ArchitectureProposal {
  id: string;
  title: string;
  description: string;
  components: {
    id: string;
    name: string;
    type: string;
    description: string;
    dependencies?: string[];
  }[];
  relationships: {
    source: string;
    target: string;
    type: string;
  }[];
  approved?: boolean;
  name?: string;
  dateCreated?: string;
  diagram?: string;
  pattern?: string;
  patternDescription?: string;
  technologies?: string[];
  dependencies?: any[];
}

export interface TestingStrategy {
  id: string;
  title: string;
  description: string;
  testTypes: {
    type: string;
    description: string;
    tools: string[];
  }[];
  coverage: {
    unit: number;
    integration: number;
    e2e: number;
  };
  approved?: boolean;
  approaches?: any[];
  testingLevels?: any[];
  tooling?: any[];
  name?: string;
}

export interface ExtendedTestingStrategy extends TestingStrategy {
  approaches: any[];
  testingLevels?: any[];
  tooling?: any[];
}

export interface GitHubRepository {
  name: string;
  url: string;
  owner: string;
  branches: {
    name: string;
    isDefault: boolean;
  }[];
  configured: boolean;
}

export interface SecurityReview {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in_progress" | "completed";
  findings: SecurityFinding[];
  date: string;
}

export interface SecurityFinding {
  id: string;
  title: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  status: "open" | "fixed" | "false_positive" | "wont_fix";
  recommendation: string;
  type?: string;
  codeLocation?: string;
}

export interface ComplianceCheck {
  id: string;
  standard: string;
  requirement: string;
  status: "passed" | "failed" | "not_applicable";
  evidence?: string;
}

export interface ComplianceRequirement {
  id: string;
  standard: string;
  description: string;
  status: "implemented" | "pending" | "not_applicable" | "passed" | "warning" | "failed";
  name?: string;
  recommendation?: string;
}

export interface PerformanceMetric {
  id: string;
  name: string;
  currentValue: number;
  unit: string;
  category: "frontend" | "backend" | "database" | "network";
  description: string;
  threshold: {
    warning: number;
    critical: number;
  };
}

export interface OptimizationRecommendation {
  id: string;
  title: string;
  description: string;
  impact: "low" | "medium" | "high";
  effort: "low" | "medium" | "high";
  category: "frontend" | "backend" | "database" | "infrastructure";
  implemented: boolean;
  metricId?: string;
}

export interface ChatContextType {
  messages: ChatMessageProps[];
  isAgentTyping: boolean;
  isFetchingResponse: boolean;
  isLoadingExample: boolean;
  projectPhases: ProjectPhase[];
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
  projectMilestones: Milestone[];
  taskDependencies: TaskDependency[];
  taskAssignments: TaskAssignment[];
  vulnerabilityAssessments: any[];
  bestPracticesViolations: any[];
  collaborationActive: boolean;
  contextAwareEnabled?: boolean;
  currentCollaborators?: AgentType[];
  projectPlans?: any[];
  currentPlanId?: string | null;
  claudeAPIEnabled?: boolean;
  architectureProposals?: ArchitectureProposal[];
  testingStrategies?: TestingStrategy[];
  gitHubRepository?: GitHubRepository | null;
  securityReviews?: SecurityReview[];
  complianceChecks?: ComplianceCheck[];
  isRequestingKnowledge?: boolean;
  addMessage: (message: any) => void;
  clearMessages: () => void;
  setIsAgentTyping: (isTyping: boolean) => void;
  setIsFetchingResponse: (isFetching: boolean) => void;
  setIsLoadingExample: (isLoading: boolean) => void;
  addProjectPhase: (phase: any) => void;
  setProjectPhases: (phases: ProjectPhase[]) => void; 
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
  addProjectPlan?: (plan: any) => void;
  updateProjectPlan?: (id: string, plan: Partial<any>) => void;
  setActivePlan?: (id: string | null) => void;
  storeInAgentMemory?: (key: string, value: any) => void;
  retrieveFromAgentMemory?: (key: string) => any;
  toggleClaudeAPI?: (enabled: boolean) => void;
  setCollaborators?: (collaborators: AgentType[]) => void;
  toggleContextAware?: (enabled: boolean) => void;
  setIsRequestingKnowledge?: (isRequesting: boolean) => void;
  addArchitectureProposal?: (proposal: ArchitectureProposal) => void;
  updateArchitectureProposal?: (id: string, proposal: Partial<ArchitectureProposal>) => void;
  addTestingStrategy?: (strategy: TestingStrategy) => void;
  updateTestingStrategy?: (id: string, strategy: Partial<TestingStrategy>) => void;
  setGitHubRepository?: (repo: GitHubRepository | null) => void;
  addSecurityReview?: (review: SecurityReview) => void;
  updateSecurityReview?: (id: string, review: Partial<SecurityReview>) => void;
  addComplianceCheck?: (check: ComplianceCheck) => void;
  updateComplianceCheck?: (id: string, check: Partial<ComplianceCheck>) => void;
}
