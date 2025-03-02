
// Fix the status values in the sample phases
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
        status: "in progress",
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
        status: "open",
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
        status: "open",
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
        status: "open",
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
        status: "open",
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
        status: "open",
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
