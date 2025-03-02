
import React, { useState } from 'react';
import { format, parseISO, isValid, addDays, differenceInDays } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Task, ProjectTask } from '@/contexts/types';

interface GanttChartViewProps {
  phases: any[];
  startDate: Date;
  daysToShow?: number;
  onTaskClick?: (task: any) => void;
}

export const GanttChartView: React.FC<GanttChartViewProps> = ({
  phases,
  startDate,
  daysToShow = 30,
  onTaskClick
}) => {
  const [expandedPhases, setExpandedPhases] = useState<Record<string, boolean>>({});

  // Toggle phase expansion
  const togglePhase = (phaseId: string) => {
    setExpandedPhases(prev => ({
      ...prev,
      [phaseId]: !prev[phaseId]
    }));
  };

  // Calculate task position on the timeline
  const calculateTaskPosition = (task: Task) => {
    // Default values if dates aren't provided
    if (!task.startDate || !task.endDate) {
      return { left: 0, width: 100 };
    }

    try {
      const taskStart = typeof task.startDate === 'string' ? parseISO(task.startDate) : task.startDate;
      const taskEnd = typeof task.endDate === 'string' ? parseISO(task.endDate) : task.endDate;
      
      if (!isValid(taskStart) || !isValid(taskEnd)) {
        return { left: 0, width: 100 };
      }

      // Calculate days from the start of the visible range
      const offsetDays = Math.max(0, differenceInDays(taskStart, startDate));
      // Calculate task duration in days
      const durationDays = Math.max(1, differenceInDays(taskEnd, taskStart) + 1);
      
      // Convert to percentages for positioning
      const left = (offsetDays / daysToShow) * 100;
      const width = (durationDays / daysToShow) * 100;
      
      // Ensure the task is at least partially visible
      if (left > 100 || left + width < 0) {
        return { left: 0, width: 0 }; // Hide the task
      }
      
      // Adjust width if it extends beyond the visible range
      const adjustedWidth = Math.min(width, 100 - left);
      
      return { left, width: adjustedWidth };
    } catch (error) {
      console.error("Error calculating task position:", error);
      return { left: 0, width: 100 };
    }
  };

  // Generate time scale
  const timeScale = Array.from({ length: daysToShow }, (_, i) => {
    const date = addDays(startDate, i);
    return format(date, 'MMM d');
  });

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[800px]">
        {/* Timeline header */}
        <div className="flex border-b mb-2">
          <div className="w-64 flex-shrink-0 p-2 font-medium text-slate-700">
            Phase / Task
          </div>
          <div className="flex-1 flex">
            {timeScale.map((date, index) => (
              <div 
                key={index} 
                className={cn(
                  "flex-1 text-center py-1 text-xs border-r last:border-r-0",
                  index % 2 === 0 ? "bg-slate-50" : "bg-white"
                )}
              >
                {date}
              </div>
            ))}
          </div>
        </div>
        
        {/* Phases and tasks */}
        <div className="space-y-1">
          {phases.map((phase) => (
            <div key={phase.id} className="mb-4">
              {/* Phase header */}
              <div 
                className="flex items-center cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => togglePhase(phase.id)}
              >
                <div className="w-64 flex-shrink-0 p-2 font-medium">
                  <div className="flex items-center justify-between">
                    <span>{phase.name}</span>
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded-full",
                      phase.status === 'completed' ? "bg-green-100 text-green-800" : 
                      phase.status === 'in-progress' ? "bg-amber-100 text-amber-800" : 
                      "bg-slate-100 text-slate-800"
                    )}>
                      {phase.status}
                    </span>
                  </div>
                  <div className="px-2 text-sm text-slate-500">
                    {phase.startDate && phase.endDate && (
                      <span className="flex items-center">
                        <CalendarIcon className="h-3 w-3 mr-1" />
                        {typeof phase.startDate === 'string' ? format(parseISO(phase.startDate), 'MMM d') : format(phase.startDate, 'MMM d')} - 
                        {typeof phase.endDate === 'string' ? format(parseISO(phase.endDate), 'MMM d, yyyy') : format(phase.endDate, 'MMM d, yyyy')}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex-1 relative h-8">
                  {/* Phase timeline bar */}
                  <div className="absolute top-3 left-0 right-0 h-2 bg-slate-200 rounded"></div>
                </div>
              </div>
              
              {/* Task list */}
              {expandedPhases[phase.id] && phase.tasks && (
                <div className="ml-6 space-y-1 mt-1">
                  {phase.tasks.map((task: ProjectTask) => {
                    const { left, width } = calculateTaskPosition(task as Task);
                    
                    return (
                      <div key={task.id} className="flex items-center">
                        <div className="w-58 flex-shrink-0 p-2">
                          <div className="text-sm font-medium">{task.title}</div>
                          <div className="flex items-center text-xs text-slate-500 space-x-2">
                            <span className={cn(
                              "px-1.5 py-0.5 rounded-full",
                              task.status === 'completed' ? "bg-green-100 text-green-800" : 
                              task.status === 'in progress' ? "bg-amber-100 text-amber-800" : 
                              "bg-slate-100 text-slate-800"
                            )}>
                              {task.status}
                            </span>
                            
                            {task.priority && (
                              <span className={cn(
                                "px-1.5 py-0.5 rounded-full",
                                task.priority === 'high' ? "bg-red-100 text-red-800" : 
                                task.priority === 'medium' ? "bg-orange-100 text-orange-800" : 
                                "bg-blue-100 text-blue-800"
                              )}>
                                {task.priority}
                              </span>
                            )}
                            
                            {task.assignedTo && (
                              <span className="flex items-center">
                                <span className="bg-violet-100 text-violet-800 px-1.5 py-0.5 rounded-full">
                                  {task.assignedTo}
                                </span>
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex-1 relative h-10">
                          {/* Task bar */}
                          <div
                            className={cn(
                              "absolute top-1 h-6 rounded-md border text-xs flex items-center justify-center px-2 shadow-sm transition-all cursor-pointer hover:brightness-95",
                              task.milestone ? "bg-violet-200 border-violet-400" : "bg-blue-200 border-blue-400",
                              task.status === 'completed' ? "bg-green-200 border-green-400" : "",
                              task.status === 'in progress' ? "bg-amber-200 border-amber-400" : ""
                            )}
                            style={{
                              left: `${left}%`,
                              width: `${width}%`,
                              minWidth: '30px'
                            }}
                            onClick={() => onTaskClick?.(task)}
                          >
                            {width > 10 && (
                              <>
                                {task.title}
                                {task.progress !== undefined && (
                                  <span className="ml-1 text-xs font-medium">{task.progress}%</span>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
