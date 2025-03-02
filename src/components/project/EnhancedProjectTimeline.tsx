
import React, { useState } from 'react';
import { Task, ProjectPhase, Milestone, ProjectTimeline } from '@/contexts/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GanttChartView from './GanttChartView';
import TaskDetailView from './TaskDetailView';
import MilestoneTimeline from './MilestoneTimeline';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, BarChart } from 'lucide-react';

interface EnhancedProjectTimelineProps {
  phases: ProjectPhase[];
  milestones: Milestone[];
}

const EnhancedProjectTimeline: React.FC<EnhancedProjectTimelineProps> = ({ 
  phases, 
  milestones 
}) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskDetailOpen, setIsTaskDetailOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('gantt');
  
  // Get all tasks across all phases
  const getAllTasks = () => {
    return phases.flatMap(phase => phase.tasks);
  };
  
  const allTasks = getAllTasks();
  
  // Handle task selection
  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsTaskDetailOpen(true);
  };
  
  // Handle milestone selection
  const handleMilestoneClick = (milestone: Milestone) => {
    // Find a task related to this milestone
    if (milestone.relatedTasks && milestone.relatedTasks.length > 0) {
      const relatedTaskId = milestone.relatedTasks[0];
      const task = allTasks.find(t => t.id === relatedTaskId);
      if (task) {
        setSelectedTask(task);
        setIsTaskDetailOpen(true);
      }
    }
  };
  
  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-4 w-[400px]">
          <TabsTrigger value="gantt" className="flex items-center">
            <BarChart className="h-4 w-4 mr-2" />
            Gantt Chart
          </TabsTrigger>
          <TabsTrigger value="milestones" className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            Milestones
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="gantt" className="m-0">
          <GanttChartView phases={phases} onTaskClick={handleTaskClick} />
        </TabsContent>
        
        <TabsContent value="milestones" className="m-0">
          <MilestoneTimeline milestones={milestones} onMilestoneClick={handleMilestoneClick} />
        </TabsContent>
      </Tabs>
      
      {/* Task details sidebar */}
      <TaskDetailView 
        task={selectedTask} 
        open={isTaskDetailOpen} 
        onOpenChange={setIsTaskDetailOpen}
        allTasks={allTasks}
      />
    </div>
  );
};

export default EnhancedProjectTimeline;
