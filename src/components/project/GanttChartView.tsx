
import React, { useState, useEffect } from 'react';
import { Task, ProjectPhase } from '@/contexts/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Calendar as CalendarIcon, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, MoreHorizontal } from 'lucide-react';
import { format, addDays, differenceInDays, parseISO, isValid } from 'date-fns';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { AgentType } from '@/agents/AgentTypes';

interface GanttChartViewProps {
  phases: ProjectPhase[];
  onTaskClick?: (task: Task) => void;
}

// Helper function to get color based on priority
const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'bg-red-500';
    case 'medium':
      return 'bg-amber-500';
    case 'low':
      return 'bg-green-500';
    default:
      return 'bg-slate-500';
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

const GanttChartView: React.FC<GanttChartViewProps> = ({ phases, onTaskClick }) => {
  const [visiblePhases, setVisiblePhases] = useState<Record<string, boolean>>({});
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [timeScale, setTimeScale] = useState<'day' | 'week' | 'month'>('day');
  const [daysToShow, setDaysToShow] = useState<number>(14);
  
  // Initialize visible phases
  useEffect(() => {
    const initialVisibility: Record<string, boolean> = {};
    phases.forEach(phase => {
      initialVisibility[phase.id] = true;
    });
    setVisiblePhases(initialVisibility);
  }, [phases]);

  // Generate array of dates for the header
  const generateDateHeaders = () => {
    const headers = [];
    for (let i = 0; i < daysToShow; i++) {
      headers.push(addDays(startDate, i));
    }
    return headers;
  };

  // Calculate task position and width based on start/end dates
  const calculateTaskPosition = (task: Task) => {
    // Default values if dates aren't provided
    if (!task.startDate || !task.endDate) {
      return { left: 0, width: 100 };
    }

    try {
      const taskStart = parseISO(task.startDate);
      const taskEnd = parseISO(task.endDate);
      
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

  // Navigate timeline
  const navigateDays = (days: number) => {
    setStartDate(prevDate => addDays(prevDate, days));
  };

  // Toggle phase visibility
  const togglePhase = (phaseId: string) => {
    setVisiblePhases(prev => ({
      ...prev,
      [phaseId]: !prev[phaseId]
    }));
  };

  // Change time scale
  const handleTimeScaleChange = (scale: 'day' | 'week' | 'month') => {
    setTimeScale(scale);
    switch (scale) {
      case 'day':
        setDaysToShow(14);
        break;
      case 'week':
        setDaysToShow(28);
        break;
      case 'month':
        setDaysToShow(60);
        break;
    }
  };

  // Date header format based on time scale
  const getDateFormat = () => {
    switch (timeScale) {
      case 'day':
        return 'MMM d';
      case 'week':
        return 'MMM d';
      case 'month':
        return 'MMM';
    }
  };

  // Header dates
  const dateHeaders = generateDateHeaders();

  return (
    <Card className="w-full shadow-sm">
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Project Timeline</h3>
          <div className="flex items-center space-x-2">
            <TabsList>
              <TabsTrigger 
                value="day" 
                onClick={() => handleTimeScaleChange('day')}
                className={timeScale === 'day' ? 'bg-primary text-primary-foreground' : ''}
              >
                Day
              </TabsTrigger>
              <TabsTrigger 
                value="week" 
                onClick={() => handleTimeScaleChange('week')}
                className={timeScale === 'week' ? 'bg-primary text-primary-foreground' : ''}
              >
                Week
              </TabsTrigger>
              <TabsTrigger 
                value="month" 
                onClick={() => handleTimeScaleChange('month')}
                className={timeScale === 'month' ? 'bg-primary text-primary-foreground' : ''}
              >
                Month
              </TabsTrigger>
            </TabsList>
            <Button variant="outline" size="icon" onClick={() => navigateDays(-daysToShow / 2)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => navigateDays(daysToShow / 2)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Timeline header */}
            <div className="grid grid-cols-[200px_1fr] mb-2">
              <div className="px-2 py-1 font-medium">Tasks</div>
              <div className="grid" style={{ gridTemplateColumns: `repeat(${daysToShow}, 1fr)` }}>
                {dateHeaders.map((date, index) => (
                  <div 
                    key={index} 
                    className={cn(
                      "px-1 text-xs text-center border-l",
                      format(date, 'ccc') === 'Sat' || format(date, 'ccc') === 'Sun' 
                        ? 'bg-slate-50' 
                        : ''
                    )}
                  >
                    {format(date, getDateFormat())}
                  </div>
                ))}
              </div>
            </div>

            {/* Project phases and tasks */}
            <div className="space-y-1">
              {phases.map((phase) => (
                <div key={phase.id} className="mb-4">
                  {/* Phase header */}
                  <div 
                    className="grid grid-cols-[200px_1fr] items-center cursor-pointer hover:bg-slate-50 rounded"
                    onClick={() => togglePhase(phase.id)}
                  >
                    <div className="px-2 py-2 font-medium flex items-center">
                      {visiblePhases[phase.id] ? <ChevronDown className="h-4 w-4 mr-1" /> : <ChevronRight className="h-4 w-4 mr-1" />}
                      {phase.name}
                      <Badge className="ml-2" variant="outline">{phase.tasks.length}</Badge>
                    </div>
                    <div className="px-2 text-sm text-slate-500">
                      {phase.startDate && phase.endDate && (
                        <span className="flex items-center">
                          <CalendarIcon className="h-3 w-3 mr-1" />
                          {format(parseISO(phase.startDate), 'MMM d')} - {format(parseISO(phase.endDate), 'MMM d, yyyy')}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Phase tasks */}
                  {visiblePhases[phase.id] && phase.tasks.map((task) => {
                    const { left, width } = calculateTaskPosition(task);
                    
                    return width > 0 ? (
                      <div key={task.id} className="grid grid-cols-[200px_1fr] items-center hover:bg-slate-50 rounded">
                        <div className="px-2 py-1 text-sm truncate" onClick={() => onTaskClick?.(task)}>
                          <div className="flex items-center">
                            <div className={`w-2 h-2 rounded-full mr-2 ${getPriorityColor(task.priority)}`}></div>
                            <span className="truncate">{task.title}</span>
                          </div>
                          <div className="flex items-center mt-1 text-xs text-slate-500 space-x-2">
                            <Badge variant="outline" className={getAgentColor(task.assignedTo)}>
                              {task.assignedTo}
                            </Badge>
                            <Badge variant="outline" className={getStatusColor(task.status)}>
                              {task.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="relative h-8" style={{ gridColumn: `span ${daysToShow}` }}>
                          <div
                            className={cn(
                              "absolute top-1 h-6 rounded-md border text-xs flex items-center justify-center px-2 shadow-sm transition-all cursor-pointer hover:brightness-95",
                              task.milestone ? "bg-violet-200 border-violet-400" : "bg-blue-200 border-blue-400",
                              task.status === 'completed' ? "bg-green-200 border-green-400" : "",
                              task.status === 'in-progress' ? "bg-amber-200 border-amber-400" : ""
                            )}
                            style={{
                              left: `${left}%`,
                              width: `${width}%`,
                              minWidth: '30px'
                            }}
                            onClick={() => onTaskClick?.(task)}
                          >
                            <span className="truncate">{task.title}</span>
                            
                            {task.progress !== undefined && (
                              <div className="absolute bottom-0 left-0 h-1 bg-blue-500" style={{ width: `${task.progress}%` }}></div>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : null;
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GanttChartView;
