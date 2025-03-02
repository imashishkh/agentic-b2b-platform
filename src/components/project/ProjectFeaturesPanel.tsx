
import React, { useState, useEffect } from 'react';
import { useChat } from '@/contexts/ChatContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { EnhancedKnowledgeBase } from '@/components/knowledge/EnhancedKnowledgeBase';
import { GitHubIntegration } from '@/components/github/GitHubIntegration';
import { ArrowDownToLine, BookOpen, Database, FolderKanban, Github, Lightbulb, Milestone, TestTube2 } from 'lucide-react';
import { ArchitectureVisualizer } from '@/components/architecture/ArchitectureVisualizer';
import { TestingStrategyCard, ExtendedTestingStrategy } from '@/components/testing/TestingStrategyCard';
import EnhancedProjectTimeline from './EnhancedProjectTimeline';
import { Milestone as MilestoneType, ProjectPhase } from '@/contexts/types';
import { format, addDays } from 'date-fns';
import { AgentType } from '@/agents/AgentTypes';

export const ProjectFeaturesPanel = () => {
  const { 
    knowledgeBase, 
    architectureProposals, 
    testingStrategies, 
    gitHubRepository, 
    projectPhases 
  } = useChat();
  
  const [sampleMilestones, setSampleMilestones] = useState<MilestoneType[]>([]);
  const [formattedPhases, setFormattedPhases] = useState<ProjectPhase[]>([]);
  
  // Convert testingStrategies to ExtendedTestingStrategy format
  const formattedTestingStrategies: ExtendedTestingStrategy[] = testingStrategies.map(strategy => {
    // Format approaches from string[] to the required structure
    const formattedApproaches = strategy.approaches ? 
      strategy.approaches.map(approach => {
        // If it's already in the correct format
        if (typeof approach === 'object' && approach !== null) {
          return approach;
        }
        // If it's a string, convert to the required format
        return {
          name: approach,
          tools: ['Jest', 'React Testing Library'] // Default tools
        };
      }) : [];
      
    return {
      ...strategy,
      approaches: formattedApproaches
    };
  });

  useEffect(() => {
    // Process project phases to ensure they have all required properties
    if (projectPhases && projectPhases.length > 0) {
      // Create a base date for our timeline (today)
      const baseDate = new Date();
      let currentDate = baseDate;
      
      // Process phases to ensure they have start/end dates
      const processedPhases = projectPhases.map((phase, phaseIndex) => {
        // Set phase dates if not available
        const phaseStartDate = phase.startDate ? phase.startDate : format(currentDate, 'yyyy-MM-dd');
        
        // Process tasks to ensure they have all needed properties
        const processedTasks = phase.tasks.map((task, taskIndex) => {
          const taskStartDate = task.startDate ? task.startDate : format(currentDate, 'yyyy-MM-dd');
          const duration = task.duration || Math.floor(Math.random() * 5) + 1; // Random 1-5 days if not specified
          const taskEndDate = task.endDate ? task.endDate : format(addDays(new Date(taskStartDate), duration), 'yyyy-MM-dd');
          
          // Update current date for next task
          currentDate = addDays(new Date(taskEndDate), 1);
          
          return {
            ...task,
            startDate: taskStartDate,
            endDate: taskEndDate,
            duration: duration,
            progress: task.progress !== undefined ? task.progress : Math.floor(Math.random() * 100), // Random progress if not specified
            milestone: task.milestone || false
          };
        });
        
        // Set phase end date based on last task if not available
        const phaseEndDate = phase.endDate ? phase.endDate : 
          (processedTasks.length > 0 ? 
            processedTasks[processedTasks.length - 1].endDate : 
            format(addDays(currentDate, 7), 'yyyy-MM-dd'));
        
        return {
          ...phase,
          startDate: phaseStartDate,
          endDate: phaseEndDate,
          tasks: processedTasks
        };
      });
      
      setFormattedPhases(processedPhases);
      
      // Generate sample milestones from high priority tasks
      const milestones: MilestoneType[] = [];
      let milestoneId = 1;
      
      processedPhases.forEach(phase => {
        // Find a high priority task to create a milestone
        const highPriorityTasks = phase.tasks.filter(task => 
          task.priority === 'high' || task.milestone
        );
        
        if (highPriorityTasks.length > 0) {
          highPriorityTasks.forEach(task => {
            milestones.push({
              id: `milestone-${milestoneId++}`,
              title: `${task.title} Milestone`,
              date: task.endDate || format(new Date(), 'yyyy-MM-dd'),
              description: `Complete all requirements for ${task.title}`,
              completed: task.status === 'completed',
              relatedTasks: [task.id]
            });
          });
        }
      });
      
      // Add some sample milestones for the project phases
      processedPhases.forEach(phase => {
        milestones.push({
          id: `milestone-${milestoneId++}`,
          title: `${phase.name} Completed`,
          date: phase.endDate || format(addDays(new Date(), 30), 'yyyy-MM-dd'),
          description: `Complete all tasks in the ${phase.name} phase`,
          completed: phase.status === 'completed',
          relatedTasks: phase.tasks.map(task => task.id)
        });
      });
      
      setSampleMilestones(milestones);
    } else {
      // Generate sample data if no project phases exist
      const today = new Date();
      
      // Sample phases
      const samplePhases: ProjectPhase[] = [
        {
          id: "phase-1",
          name: "Planning Phase",
          description: "Initial project planning and requirements gathering",
          status: "completed",
          startDate: format(today, 'yyyy-MM-dd'),
          endDate: format(addDays(today, 14), 'yyyy-MM-dd'),
          tasks: [
            {
              id: "task-1",
              title: "Requirements Analysis",
              description: "Gather and analyze project requirements",
              priority: "high",
              status: "completed",
              assignedTo: AgentType.MANAGER,
              startDate: format(today, 'yyyy-MM-dd'),
              endDate: format(addDays(today, 5), 'yyyy-MM-dd'),
              duration: 5,
              progress: 100
            },
            {
              id: "task-2",
              title: "Architecture Planning",
              description: "Design the system architecture",
              priority: "high",
              status: "completed",
              assignedTo: AgentType.BACKEND,
              dependencies: ["task-1"],
              startDate: format(addDays(today, 6), 'yyyy-MM-dd'),
              endDate: format(addDays(today, 10), 'yyyy-MM-dd'),
              duration: 5,
              progress: 100
            }
          ]
        },
        {
          id: "phase-2",
          name: "Development Phase",
          description: "Core development activities",
          status: "in-progress",
          startDate: format(addDays(today, 15), 'yyyy-MM-dd'),
          endDate: format(addDays(today, 45), 'yyyy-MM-dd'),
          tasks: [
            {
              id: "task-3",
              title: "Database Implementation",
              description: "Set up database and models",
              priority: "medium",
              status: "in-progress",
              assignedTo: AgentType.DATABASE,
              startDate: format(addDays(today, 15), 'yyyy-MM-dd'),
              endDate: format(addDays(today, 20), 'yyyy-MM-dd'),
              duration: 6,
              progress: 50
            },
            {
              id: "task-4",
              title: "Backend API Development",
              description: "Develop core API endpoints",
              priority: "high",
              status: "pending",
              assignedTo: AgentType.BACKEND,
              dependencies: ["task-3"],
              startDate: format(addDays(today, 21), 'yyyy-MM-dd'),
              endDate: format(addDays(today, 30), 'yyyy-MM-dd'),
              duration: 10,
              progress: 0,
              milestone: true
            },
            {
              id: "task-5",
              title: "Frontend Implementation",
              description: "Develop UI components",
              priority: "medium",
              status: "pending",
              assignedTo: AgentType.FRONTEND,
              dependencies: ["task-4"],
              startDate: format(addDays(today, 31), 'yyyy-MM-dd'),
              endDate: format(addDays(today, 45), 'yyyy-MM-dd'),
              duration: 15,
              progress: 0
            }
          ]
        },
        {
          id: "phase-3",
          name: "Testing & Deployment",
          description: "Testing and preparation for deployment",
          status: "planned",
          startDate: format(addDays(today, 46), 'yyyy-MM-dd'),
          endDate: format(addDays(today, 60), 'yyyy-MM-dd'),
          tasks: [
            {
              id: "task-6",
              title: "Integration Testing",
              description: "Test all system components together",
              priority: "high",
              status: "pending",
              assignedTo: AgentType.DEVOPS,
              dependencies: ["task-4", "task-5"],
              startDate: format(addDays(today, 46), 'yyyy-MM-dd'),
              endDate: format(addDays(today, 50), 'yyyy-MM-dd'),
              duration: 5,
              progress: 0
            },
            {
              id: "task-7",
              title: "Deployment Setup",
              description: "Prepare deployment environment",
              priority: "medium",
              status: "pending",
              assignedTo: AgentType.DEVOPS,
              startDate: format(addDays(today, 51), 'yyyy-MM-dd'),
              endDate: format(addDays(today, 55), 'yyyy-MM-dd'),
              duration: 5,
              progress: 0
            },
            {
              id: "task-8",
              title: "User Acceptance Testing",
              description: "Final user testing before launch",
              priority: "high",
              status: "pending",
              assignedTo: AgentType.UX,
              dependencies: ["task-6", "task-7"],
              startDate: format(addDays(today, 56), 'yyyy-MM-dd'),
              endDate: format(addDays(today, 60), 'yyyy-MM-dd'),
              duration: 5,
              progress: 0,
              milestone: true
            }
          ]
        }
      ];
      
      setFormattedPhases(samplePhases);
      
      // Sample milestones
      const sampleMilestones: MilestoneType[] = [
        {
          id: "milestone-1",
          title: "Project Planning Completed",
          date: format(addDays(today, 14), 'yyyy-MM-dd'),
          description: "All planning activities completed",
          completed: true,
          relatedTasks: ["task-1", "task-2"]
        },
        {
          id: "milestone-2",
          title: "Core API Development",
          date: format(addDays(today, 30), 'yyyy-MM-dd'),
          description: "Backend APIs fully implemented",
          completed: false,
          relatedTasks: ["task-4"]
        },
        {
          id: "milestone-3",
          title: "User Interface Complete",
          date: format(addDays(today, 45), 'yyyy-MM-dd'),
          description: "All frontend components implemented",
          completed: false,
          relatedTasks: ["task-5"]
        },
        {
          id: "milestone-4",
          title: "Ready for Production",
          date: format(addDays(today, 60), 'yyyy-MM-dd'),
          description: "Product ready for production deployment",
          completed: false,
          relatedTasks: ["task-8"]
        }
      ];
      
      setSampleMilestones(sampleMilestones);
    }
  }, [projectPhases]);
  
  return (
    <div className="h-full flex flex-col">
      <Tabs defaultValue="project" className="w-full">
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger value="project" className="flex items-center text-xs">
            <FolderKanban className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Project</span>
          </TabsTrigger>
          <TabsTrigger value="architecture" className="flex items-center text-xs">
            <Database className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Architecture</span>
          </TabsTrigger>
          <TabsTrigger value="testing" className="flex items-center text-xs">
            <TestTube2 className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Testing</span>
          </TabsTrigger>
          <TabsTrigger value="knowledge" className="flex items-center text-xs">
            <BookOpen className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Knowledge</span>
          </TabsTrigger>
          <TabsTrigger value="github" className="flex items-center text-xs">
            <Github className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">GitHub</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="project" className="m-0 flex-grow">
          <div className="h-full overflow-auto pb-20">
            {formattedPhases.length > 0 ? (
              <EnhancedProjectTimeline 
                phases={formattedPhases} 
                milestones={sampleMilestones}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-[300px] text-center p-4">
                <Milestone className="h-10 w-10 text-slate-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">No Project Timeline Yet</h3>
                <p className="text-sm text-slate-500 max-w-[300px]">
                  Upload a requirements document to generate a project timeline with tasks and milestones.
                </p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="architecture" className="m-0 space-y-4 flex-grow">
          <div className="h-full overflow-auto pb-20">
            {architectureProposals.length > 0 ? (
              <ArchitectureVisualizer proposals={architectureProposals} />
            ) : (
              <div className="flex flex-col items-center justify-center h-[300px] text-center p-4">
                <Database className="h-10 w-10 text-slate-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">No Architecture Proposals Yet</h3>
                <p className="text-sm text-slate-500 max-w-[300px]">
                  Ask the DevManager to create an architecture proposal for your project.
                </p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="testing" className="m-0 space-y-4 flex-grow">
          <div className="h-full overflow-auto pb-20">
            {formattedTestingStrategies.length > 0 ? (
              formattedTestingStrategies.map(strategy => (
                <TestingStrategyCard 
                  key={strategy.id} 
                  strategy={strategy} 
                  onApprove={() => {}} // Add your onApprove handler here if needed
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-[300px] text-center p-4">
                <TestTube2 className="h-10 w-10 text-slate-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">No Testing Strategies Yet</h3>
                <p className="text-sm text-slate-500 max-w-[300px]">
                  Ask the DevManager to create a testing strategy for your project.
                </p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="knowledge" className="m-0 flex-grow">
          <div className="h-full overflow-auto pb-20">
            <EnhancedKnowledgeBase />
          </div>
        </TabsContent>
        
        <TabsContent value="github" className="m-0 flex-grow">
          <div className="h-full overflow-auto pb-20">
            <GitHubIntegration />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
