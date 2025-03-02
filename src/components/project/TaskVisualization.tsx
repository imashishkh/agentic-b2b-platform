
import React from "react";
import { useChat } from "@/contexts/ChatContext";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AgentType } from "@/agents/AgentTypes";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed" | "blocked";
  assignedTo: AgentType;
  dependencies: string[];
  priority: "low" | "medium" | "high";
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  tasks: string[];
  dueDate?: Date;
  status: "pending" | "in-progress" | "completed";
}

interface TaskVisualizationProps {
  showDetails?: boolean;
}

export function TaskVisualization({ showDetails = true }: TaskVisualizationProps) {
  const { projectPhases } = useChat();
  
  // Extract tasks and milestones from project phases
  const tasks: Task[] = [];
  const milestones: Milestone[] = [];
  
  projectPhases.forEach(phase => {
    if (phase.tasks) {
      phase.tasks.forEach((task: Task) => {
        tasks.push(task);
      });
    }
    
    if (phase.milestones) {
      phase.milestones.forEach((milestone: Milestone) => {
        milestones.push(milestone);
      });
    }
  });
  
  if (tasks.length === 0 && milestones.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        <p>No tasks or milestones defined yet.</p>
        <p className="text-sm mt-2">Upload a project requirements file to get started.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {milestones.length > 0 && (
        <div>
          <h3 className="font-medium mb-2">Milestones</h3>
          <div className="space-y-2">
            {milestones.map(milestone => (
              <Card key={milestone.id} className="p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{milestone.title}</h4>
                    {showDetails && <p className="text-sm text-gray-600">{milestone.description}</p>}
                  </div>
                  <Badge 
                    className={`
                      ${milestone.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                      ${milestone.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : ''}
                      ${milestone.status === 'pending' ? 'bg-gray-100 text-gray-800' : ''}
                    `}
                  >
                    {milestone.status}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      {tasks.length > 0 && showDetails && (
        <div>
          <h3 className="font-medium mb-2">Tasks</h3>
          <div className="space-y-2">
            {tasks.map(task => (
              <Card key={task.id} className="p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{task.title}</h4>
                    <p className="text-sm text-gray-600">{task.description}</p>
                    <div className="mt-1">
                      <Badge className="mr-1 bg-purple-100 text-purple-800">
                        {task.assignedTo}
                      </Badge>
                      <Badge className={`
                        ${task.priority === 'high' ? 'bg-red-100 text-red-800' : ''}
                        ${task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : ''}
                        ${task.priority === 'low' ? 'bg-green-100 text-green-800' : ''}
                      `}>
                        {task.priority}
                      </Badge>
                    </div>
                  </div>
                  <Badge 
                    className={`
                      ${task.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                      ${task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : ''}
                      ${task.status === 'pending' ? 'bg-gray-100 text-gray-800' : ''}
                      ${task.status === 'blocked' ? 'bg-red-100 text-red-800' : ''}
                    `}
                  >
                    {task.status}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
