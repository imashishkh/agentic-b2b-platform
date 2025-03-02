
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExtractedTask } from '@/utils/markdownParser';
import { 
  ArrowUp, 
  ArrowRight, 
  ArrowDown, 
  CheckCircle2, 
  Clock, 
  Tag,
  AlertCircle
} from 'lucide-react';

interface TaskPrioritizationProps {
  tasks: ExtractedTask[];
}

export function TaskPrioritization({ tasks }: TaskPrioritizationProps) {
  // Group tasks by priority
  const highPriorityTasks = tasks.filter(task => task.priority === 'high');
  const mediumPriorityTasks = tasks.filter(task => task.priority === 'medium');
  const lowPriorityTasks = tasks.filter(task => task.priority === 'low');
  
  // Get all tasks including subtasks
  const getAllTasks = () => {
    const allTasks: ExtractedTask[] = [];
    
    for (const task of tasks) {
      allTasks.push(task);
      
      for (const subtask of task.subtasks) {
        allTasks.push(subtask);
      }
    }
    
    return allTasks;
  };
  
  const allTasks = getAllTasks();
  
  // Calculate statistics
  const totalTasks = allTasks.length;
  const totalEffort = allTasks.reduce((sum, task) => sum + task.estimatedEffort, 0);
  const highPriorityEffort = allTasks
    .filter(task => task.priority === 'high')
    .reduce((sum, task) => sum + task.estimatedEffort, 0);
  
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <ArrowUp className="h-4 w-4 text-red-500" />;
      case 'medium': return <ArrowRight className="h-4 w-4 text-amber-500" />;
      case 'low': return <ArrowDown className="h-4 w-4 text-green-500" />;
      default: return <ArrowRight className="h-4 w-4 text-slate-500" />;
    }
  };
  
  const getCategoryBadge = (category: string) => {
    let color = '';
    
    switch (category.toLowerCase()) {
      case 'frontend': color = 'bg-blue-100 text-blue-800'; break;
      case 'backend': color = 'bg-green-100 text-green-800'; break;
      case 'database': color = 'bg-purple-100 text-purple-800'; break;
      case 'devops': color = 'bg-amber-100 text-amber-800'; break;
      case 'ux': color = 'bg-pink-100 text-pink-800'; break;
      default: color = 'bg-slate-100 text-slate-800'; break;
    }
    
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${color}`}>
        {category}
      </span>
    );
  };
  
  return (
    <Card className="bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Task Prioritization</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-red-50 p-3 rounded-md">
            <h3 className="flex items-center gap-1 text-sm font-medium text-red-700 mb-1">
              <ArrowUp className="h-4 w-4" />
              High Priority ({highPriorityTasks.length})
            </h3>
            <p className="text-xs text-red-600 mb-2">Critical tasks that block other work</p>
            <div className="max-h-40 overflow-y-auto">
              {highPriorityTasks.map(task => (
                <div key={task.id} className="bg-white p-2 rounded mb-1 text-sm shadow-sm">
                  <div className="flex items-start gap-1">
                    <ArrowUp className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-slate-800">{task.title}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {getCategoryBadge(task.category)}
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800">
                          <Clock className="h-3 w-3 mr-1" />
                          {task.estimatedEffort}h
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-amber-50 p-3 rounded-md">
            <h3 className="flex items-center gap-1 text-sm font-medium text-amber-700 mb-1">
              <ArrowRight className="h-4 w-4" />
              Medium Priority ({mediumPriorityTasks.length})
            </h3>
            <p className="text-xs text-amber-600 mb-2">Important but not blocking tasks</p>
            <div className="max-h-40 overflow-y-auto">
              {mediumPriorityTasks.map(task => (
                <div key={task.id} className="bg-white p-2 rounded mb-1 text-sm shadow-sm">
                  <div className="flex items-start gap-1">
                    <ArrowRight className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-slate-800">{task.title}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {getCategoryBadge(task.category)}
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800">
                          <Clock className="h-3 w-3 mr-1" />
                          {task.estimatedEffort}h
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-green-50 p-3 rounded-md">
            <h3 className="flex items-center gap-1 text-sm font-medium text-green-700 mb-1">
              <ArrowDown className="h-4 w-4" />
              Low Priority ({lowPriorityTasks.length})
            </h3>
            <p className="text-xs text-green-600 mb-2">Nice-to-have improvements</p>
            <div className="max-h-40 overflow-y-auto">
              {lowPriorityTasks.map(task => (
                <div key={task.id} className="bg-white p-2 rounded mb-1 text-sm shadow-sm">
                  <div className="flex items-start gap-1">
                    <ArrowDown className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-slate-800">{task.title}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {getCategoryBadge(task.category)}
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800">
                          <Clock className="h-3 w-3 mr-1" />
                          {task.estimatedEffort}h
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="bg-slate-50 p-4 rounded-md">
          <h3 className="text-sm font-medium text-slate-700 mb-2">Analysis & Recommendations</h3>
          
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
              <div>
                <p className="text-sm text-slate-700">
                  <strong>{Math.round((highPriorityTasks.length / tasks.length) * 100)}%</strong> of tasks are high priority
                </p>
                {highPriorityTasks.length > tasks.length * 0.4 && (
                  <p className="text-xs text-slate-500 mt-0.5">
                    Consider re-evaluating priorities as having too many high-priority tasks can be counterproductive.
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 text-blue-500 mt-0.5" />
              <div>
                <p className="text-sm text-slate-700">
                  Total estimated effort: <strong>{totalEffort} hours</strong>
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  High priority tasks: {highPriorityEffort} hours ({Math.round((highPriorityEffort / totalEffort) * 100)}% of total)
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5" />
              <div>
                <p className="text-sm text-slate-700">
                  <strong>Recommended Starting Point:</strong> High priority tasks with many dependents
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Focus on tasks that unblock other work to maximize team productivity.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <Tag className="h-4 w-4 text-purple-500 mt-0.5" />
              <div>
                <p className="text-sm text-slate-700">
                  Dominant task categories: {
                    Object.entries(
                      allTasks.reduce((acc: {[key: string]: number}, task) => {
                        acc[task.category] = (acc[task.category] || 0) + 1;
                        return acc;
                      }, {})
                    )
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 2)
                    .map(([category]) => category)
                    .join(', ')
                  }
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Ensure you have appropriate resources for these areas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
