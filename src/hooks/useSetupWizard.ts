import { useState, useCallback } from 'react';
import { AgentType } from '@/agents/AgentTypes';
import { SetupWizardStep } from '@/contexts/types';
import { ParsedSection } from '@/components/project/ParsingProgressIndicator';
import { SectionAssignment } from '@/components/project/AgentAssignmentPanel';
import { UIComponent } from '@/components/project/ComponentVisualizer';
import { ProjectPhase } from '@/components/project/ApprovalWorkflow';

/**
 * Hook for managing enhanced setup wizard functionality
 */
export function useSetupWizard() {
  const [currentStep, setCurrentStep] = useState<SetupWizardStep>(SetupWizardStep.INITIAL);
  const [fileName, setFileName] = useState<string>('');
  const [overallProgress, setOverallProgress] = useState<number>(0);
  const [parsedSections, setParsedSections] = useState<ParsedSection[]>([]);
  const [sectionAssignments, setSectionAssignments] = useState<SectionAssignment[]>([]);
  const [gitHubConnected, setGitHubConnected] = useState<boolean>(false);
  const [gitHubRepoUrl, setGitHubRepoUrl] = useState<string>('');
  const [uiComponents, setUiComponents] = useState<UIComponent[]>([]);
  const [projectPhases, setProjectPhases] = useState<ProjectPhase[]>([]);
  const [isParsingFile, setIsParsingFile] = useState<boolean>(false);
  
  /**
   * Start parsing a markdown file and track progress
   */
  const startFileParsing = useCallback((name: string) => {
    setFileName(name);
    setIsParsingFile(true);
    setOverallProgress(0);
    setParsedSections([]);
    
    // Create mock sections for the parsing visualization
    const mockSections: ParsedSection[] = [
      {
        title: "Project Requirements",
        agentType: AgentType.MANAGER,
        progress: 0,
        status: "pending"
      },
      {
        title: "Frontend Components",
        agentType: AgentType.FRONTEND,
        progress: 0,
        status: "pending"
      },
      {
        title: "Backend Services",
        agentType: AgentType.BACKEND,
        progress: 0,
        status: "pending"
      },
      {
        title: "Database Structure",
        agentType: AgentType.DATABASE,
        progress: 0,
        status: "pending"
      },
      {
        title: "DevOps Requirements",
        agentType: AgentType.DEVOPS,
        progress: 0,
        status: "pending"
      }
    ];
    
    setParsedSections(mockSections);
    
    // Simulate parsing progress
    const simulateParsingProgress = () => {
      let currentProgress = 0;
      
      const interval = setInterval(() => {
        currentProgress += 5;
        setOverallProgress(Math.min(currentProgress, 100));
        
        // Update individual section progress
        setParsedSections(prevSections => 
          prevSections.map((section, index) => {
            // Stagger the section progress to make it look realistic
            const sectionProgress = Math.max(0, Math.min(100, 
              currentProgress - (index * 10)
            ));
            
            let status: ParsedSection['status'] = "pending";
            if (sectionProgress > 0 && sectionProgress < 100) {
              status = "parsing";
            } else if (sectionProgress >= 100) {
              status = "completed";
            }
            
            return {
              ...section,
              progress: sectionProgress,
              status
            };
          })
        );
        
        if (currentProgress >= 100) {
          clearInterval(interval);
          setIsParsingFile(false);
          finalizeParsing();
        }
      }, 300);
      
      return () => clearInterval(interval);
    };
    
    const parsingTimeout = setTimeout(simulateParsingProgress, 1000);
    
    return () => clearTimeout(parsingTimeout);
  }, []);
  
  /**
   * Finalize parsing and generate section assignments
   */
  const finalizeParsing = useCallback(() => {
    // Generate mock section assignments based on parsed sections
    const mockAssignments: SectionAssignment[] = parsedSections.map((section, index) => ({
      id: `section-${index}`,
      title: section.title,
      description: `This section contains tasks related to ${section.title.toLowerCase()}.`,
      agentType: section.agentType,
      tasks: [
        `Implement ${section.title} feature 1`,
        `Design ${section.title} architecture`,
        `Test ${section.title} functionality`
      ]
    }));
    
    setSectionAssignments(mockAssignments);
    setCurrentStep(SetupWizardStep.REQUIREMENTS_UPLOADED);
  }, [parsedSections]);
  
  /**
   * Update section agent assignment
   */
  const updateSectionAssignment = useCallback((sectionId: string, newAgentType: AgentType) => {
    setSectionAssignments(prevAssignments =>
      prevAssignments.map(assignment => 
        assignment.id === sectionId 
          ? { ...assignment, agentType: newAgentType } 
          : assignment
      )
    );
  }, []);
  
  /**
   * Confirm section assignments and proceed to the next step
   */
  const confirmSectionAssignments = useCallback(() => {
    setCurrentStep(SetupWizardStep.GITHUB_SETUP);
  }, []);
  
  /**
   * Connect to GitHub
   */
  const connectToGitHub = useCallback(async (token: string): Promise<boolean> => {
    // Simulate GitHub API connection
    return new Promise((resolve) => {
      setTimeout(() => {
        setGitHubConnected(true);
        resolve(true);
      }, 2000);
    });
  }, []);
  
  /**
   * Handle repository creation
   */
  const handleRepoCreated = useCallback((repoUrl: string) => {
    setGitHubRepoUrl(repoUrl);
    setCurrentStep(SetupWizardStep.GITHUB_CONNECTED);
  }, []);
  
  /**
   * Add a UI component
   */
  const addUiComponent = useCallback((component: Partial<UIComponent>) => {
    setUiComponents(prev => [
      ...prev, 
      {
        id: `component-${Date.now()}`,
        name: component.name || 'Unnamed Component',
        type: component.type || 'custom',
        order: component.order || prev.length,
        mockupUrl: component.mockupUrl,
        codePreview: component.codePreview,
        isRequired: component.isRequired || false,
        description: component.description
      }
    ]);
  }, []);
  
  /**
   * Reorder UI components
   */
  const reorderUiComponents = useCallback((newComponents: UIComponent[]) => {
    setUiComponents(newComponents);
  }, []);
  
  /**
   * Remove a UI component
   */
  const removeUiComponent = useCallback((componentId: string) => {
    setUiComponents(prev => prev.filter(c => c.id !== componentId));
  }, []);
  
  /**
   * Proceed to the next step after UI components are added
   */
  const finishUiComponentSetup = useCallback(() => {
    setCurrentStep(SetupWizardStep.UI_COMPONENTS_ADDED);
    
    // Generate mock project phases for approval
    const mockPhases: ProjectPhase[] = [
      {
        id: 'phase-1',
        name: 'Frontend Development',
        description: 'Develop all frontend components and UI elements.',
        status: 'pending',
        estimatedDuration: 14,
        assignedAgents: [AgentType.FRONTEND, AgentType.UX],
        tasks: [
          {
            id: 'task-1-1',
            title: 'Implement responsive header',
            description: 'Create a responsive header component with navigation.',
            agentType: AgentType.FRONTEND
          },
          {
            id: 'task-1-2',
            title: 'Develop product listing page',
            description: 'Create the product catalog display with filtering.',
            agentType: AgentType.FRONTEND
          },
          {
            id: 'task-1-3',
            title: 'Design UI/UX for checkout flow',
            description: 'Design an intuitive checkout process.',
            agentType: AgentType.UX
          }
        ]
      },
      {
        id: 'phase-2',
        name: 'Backend API Development',
        description: 'Develop the backend API services and endpoints.',
        status: 'pending',
        estimatedDuration: 21,
        assignedAgents: [AgentType.BACKEND, AgentType.DATABASE],
        tasks: [
          {
            id: 'task-2-1',
            title: 'Implement authentication API',
            description: 'Create API endpoints for user authentication.',
            agentType: AgentType.BACKEND
          },
          {
            id: 'task-2-2',
            title: 'Create product catalog API',
            description: 'Develop endpoints for product management.',
            agentType: AgentType.BACKEND
          },
          {
            id: 'task-2-3',
            title: 'Design database schema',
            description: 'Design the database schema for products and users.',
            agentType: AgentType.DATABASE
          }
        ]
      },
      {
        id: 'phase-3',
        name: 'DevOps & Deployment',
        description: 'Set up CI/CD pipeline and deployment infrastructure.',
        status: 'pending',
        estimatedDuration: 7,
        assignedAgents: [AgentType.DEVOPS],
        tasks: [
          {
            id: 'task-3-1',
            title: 'Configure CI/CD pipeline',
            description: 'Set up automated testing and deployment.',
            agentType: AgentType.DEVOPS
          },
          {
            id: 'task-3-2',
            title: 'Set up cloud infrastructure',
            description: 'Configure cloud services for the application.',
            agentType: AgentType.DEVOPS
          }
        ]
      }
    ];
    
    setProjectPhases(mockPhases);
    setCurrentStep(SetupWizardStep.PROJECT_REVIEW);
  }, []);
  
  /**
   * Approve a specific project phase
   */
  const approvePhase = useCallback((phaseId: string, feedback?: string) => {
    setProjectPhases(prev => 
      prev.map(phase => 
        phase.id === phaseId 
          ? { ...phase, status: 'approved' } 
          : phase
      )
    );
  }, []);
  
  /**
   * Reject a specific project phase
   */
  const rejectPhase = useCallback((phaseId: string, feedback: string) => {
    setProjectPhases(prev => 
      prev.map(phase => 
        phase.id === phaseId 
          ? { ...phase, status: 'rejected' } 
          : phase
      )
    );
  }, []);
  
  /**
   * Approve all project phases
   */
  const approveAllPhases = useCallback(() => {
    setProjectPhases(prev => 
      prev.map(phase => ({ ...phase, status: 'approved' }))
    );
    setCurrentStep(SetupWizardStep.PROJECT_APPROVED);
  }, []);
  
  /**
   * Start project execution
   */
  const startProject = useCallback(() => {
    setCurrentStep(SetupWizardStep.PROJECT_IN_PROGRESS);
  }, []);
  
  return {
    currentStep,
    setCurrentStep,
    fileName,
    overallProgress,
    parsedSections,
    sectionAssignments,
    gitHubConnected,
    gitHubRepoUrl,
    uiComponents,
    projectPhases,
    isParsingFile,
    startFileParsing,
    updateSectionAssignment,
    confirmSectionAssignments,
    connectToGitHub,
    handleRepoCreated,
    addUiComponent,
    reorderUiComponents,
    removeUiComponent,
    finishUiComponentSetup,
    approvePhase,
    rejectPhase,
    approveAllPhases,
    startProject
  };
}

// Helper type to export SectionAssignment from AgentAssignmentPanel
export interface SectionAssignment {
  id: string;
  title: string;
  description?: string;
  agentType: AgentType;
  tasks: string[];
}