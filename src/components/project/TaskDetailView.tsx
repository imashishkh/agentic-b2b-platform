
import React from 'react';
import { Task } from '@/contexts/types';
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle 
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, AlertCircle, CheckCircle2, User, Link2, ChevronRight } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Progress } from '@/components/ui/progress';
import { AgentType } from '@/agents/AgentTypes';

interface TaskDetailViewProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  allTasks?: Task[];
}

// Helper function to get color based on priority
const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'bg-red-500 text-white';
    case 'medium':
      return 'bg-amber-500 text-white';
    case 'low':
      return 'bg-green-500 text-white';
    default:
      return 'bg-slate-500 text-white';
  }
};

// Helper function to get color based on agent type
const getAgentColor = (agentType: AgentType) => {
  switch (agentType) {
    case AgentType.FRONTEND:
      return 'bg-blue-200 text-blue-800';
    case AgentType.BACKEND:
      return 'bg-green-200 text-green-800';
    case AgentType.DATABASE:
      return 'bg-purple-200 text-purple-800';
    case AgentType.DEVOPS:
      return 'bg-orange-200 text-orange-800';
    case AgentType.UX:
      return 'bg-pink-200 text-pink-800';
    case AgentType.MANAGER:
      return 'bg-gray-200 text-gray-800';
    default:
      return 'bg-slate-200 text-slate-800';
  }
};

// Helper function to get color based on status
const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800 border-green-300';
    case 'in-progress':
      return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'pending':
      return 'bg-gray-100 text-gray-800 border-gray-300';
    case 'approved':
      return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    case 'rejected':
      return 'bg-red-100 text-red-800 border-red-300';
    default:
      return 'bg-slate-100 text-slate-800 border-slate-300';
  }
};

const TaskDetailView: React.FC<TaskDetailViewProps> = ({ 
  task, 
  open, 
  onOpenChange, 
  allTasks = [] 
}) => {
  // Get dependent tasks
  const getDependentTasks = () => {
    if (!task || !task.dependencies || task.dependencies.length === 0) return [];
    return allTasks.filter(t => task.dependencies?.includes(t.id));
  };

  // Get subtasks
  const getSubtasks = () => {
    if (!task || !task.subtasks || task.subtasks.length === 0) return [];
    return task.subtasks;
  };

  if (!task) return null;

  const dependentTasks = getDependentTasks();
  const subtasks = getSubtasks();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Task Details</SheetTitle>
          <SheetDescription>
            View and manage task details
          </SheetDescription>
        </SheetHeader>
        
        <div className="py-4">
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">{task.title}</h3>
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge className={getPriorityColor(task.priority)}>
                {task.priority} priority
              </Badge>
              <Badge className={getAgentColor(task.assignedTo)}>
                {task.assignedTo}
              </Badge>
              <Badge className={getStatusColor(task.status)}>
                {task.status}
              </Badge>
              {task.milestone && (
                <Badge variant="outline" className="bg-violet-100 text-violet-800 border-violet-300">
                  Milestone
                </Badge>
              )}
            </div>
            
            <p className="text-sm text-gray-600 whitespace-pre-line">
              {task.description}
            </p>
          </div>
          
          <div className="space-y-4">
            {/* Dates */}
            <div className="flex flex-col space-y-2">
              {task.startDate && (
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="font-medium mr-1">Start Date:</span>
                  {format(parseISO(task.startDate), 'MMMM d, yyyy')}
                </div>
              )}
              
              {task.endDate && (
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="font-medium mr-1">End Date:</span>
                  {format(parseISO(task.endDate), 'MMMM d, yyyy')}
                </div>
              )}
              
              {task.duration !== undefined && (
                <div className="flex items-center text-sm">
                  <Clock className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="font-medium mr-1">Duration:</span>
                  {task.duration} day{task.duration !== 1 ? 's' : ''}
                </div>
              )}
            </div>
            
            {/* Progress */}
            {task.progress !== undefined && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Progress</span>
                  <span>{task.progress}%</span>
                </div>
                <Progress value={task.progress} className="h-2" />
              </div>
            )}
            
            {/* Dependencies */}
            {dependentTasks.length > 0 && (
              <div className="space-y-1">
                <h4 className="font-medium mb-2 flex items-center">
                  <Link2 className="h-4 w-4 mr-1" /> Dependencies
                </h4>
                <div className="space-y-1 ml-6">
                  {dependentTasks.map(depTask => (
                    <div key={depTask.id} className="flex items-center justify-between text-sm p-1 rounded hover:bg-gray-50">
                      <span>{depTask.title}</span>
                      <Badge variant="outline" className={getStatusColor(depTask.status)}>
                        {depTask.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Subtasks */}
            {subtasks.length > 0 && (
              <div className="space-y-1">
                <h4 className="font-medium mb-2 flex items-center">
                  <ChevronRight className="h-4 w-4 mr-1" /> Subtasks
                </h4>
                <div className="space-y-1 ml-6">
                  {subtasks.map(subtask => (
                    <div key={subtask.id} className="flex items-center justify-between text-sm p-1 rounded hover:bg-gray-50">
                      <span>{subtask.title}</span>
                      <Badge variant="outline" className={getStatusColor(subtask.status)}>
                        {subtask.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default TaskDetailView;
