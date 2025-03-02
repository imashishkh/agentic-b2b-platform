
import React from 'react';
import { format, addDays } from 'date-fns';
import { AgentType } from '@/agents/AgentTypes';
import { ProjectPhase, ProjectTask } from '@/contexts/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Get current date
const today = new Date();

// Sample phases with corrected status values
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

// Function to get badge color based on status
const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800";
    case "in-progress":
    case "in progress":
      return "bg-blue-100 text-blue-800";
    case "planned":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Function to get badge color based on priority
const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-800";
    case "medium":
      return "bg-yellow-100 text-yellow-800";
    case "low":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export function ProjectFeaturesPanel() {
  return (
    <div className="p-4">
      <Tabs defaultValue="phases">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="phases">Phases</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>
        
        <TabsContent value="phases" className="space-y-4">
          {samplePhases.map((phase) => (
            <Card key={phase.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">{phase.name}</CardTitle>
                  <Badge className={getStatusColor(phase.status || '')}>
                    {phase.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500">{phase.description}</p>
                <div className="flex gap-2 text-xs text-gray-500">
                  <span>{phase.startDate} - {phase.endDate}</span>
                  <span>•</span>
                  <span>{phase.tasks.length} tasks</span>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-sm font-medium mt-2 mb-1">Tasks:</div>
                <div className="space-y-2">
                  {phase.tasks.map((task) => (
                    <div key={task.id} className="p-2 bg-gray-50 rounded-md">
                      <div className="flex justify-between">
                        <div>{task.title}</div>
                        <Badge variant="outline" className={getPriorityColor(task.priority || '')}>
                          {task.priority}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{task.description}</div>
                      <div className="flex justify-between mt-2">
                        <div className="text-xs">Progress: {task.progress}%</div>
                        <Badge className={getStatusColor(task.status)}>
                          {task.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="tasks">
          <Card>
            <CardHeader>
              <CardTitle>All Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {samplePhases.flatMap(phase => phase.tasks).map((task) => (
                  <div key={task.id} className="p-3 border rounded-md">
                    <div className="flex justify-between">
                      <div className="font-medium">{task.title}</div>
                      <Badge variant="outline" className={getPriorityColor(task.priority || '')}>
                        {task.priority}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">{task.description}</div>
                    <div className="flex justify-between items-center mt-2">
                      <div className="text-xs text-gray-500">
                        {task.startDate} - {task.endDate}
                      </div>
                      <Badge className={getStatusColor(task.status)}>
                        {task.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle>Project Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-500 mb-4">
                Simple timeline visualization. This would be replaced with a proper Gantt chart in a production environment.
              </div>
              <div className="space-y-4">
                {samplePhases.map((phase) => (
                  <div key={phase.id}>
                    <div className="flex gap-2 items-center mb-2">
                      <div className={`h-3 w-3 rounded-full ${
                        phase.status === "completed" ? "bg-green-500" :
                        phase.status === "in-progress" ? "bg-blue-500" : "bg-purple-500"
                      }`}></div>
                      <div className="font-medium">{phase.name}</div>
                      <div className="text-xs text-gray-500">
                        {phase.startDate} - {phase.endDate}
                      </div>
                    </div>
                    <div className="pl-6 border-l-2 border-gray-200 ml-1 space-y-2">
                      {phase.tasks.map((task) => (
                        <div key={task.id} className="pb-2">
                          <div className="flex gap-2 items-center">
                            <div className={`h-2 w-2 rounded-full ${
                              task.status === "completed" ? "bg-green-500" :
                              task.status === "in progress" ? "bg-blue-500" : "bg-gray-400"
                            }`}></div>
                            <div className="text-sm">{task.title}</div>
                            {task.milestone && (
                              <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-800">
                                Milestone
                              </Badge>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 ml-4">
                            {task.startDate} - {task.endDate}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
