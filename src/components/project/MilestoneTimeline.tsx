
import React from 'react';
import { Milestone, Task } from '@/contexts/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle, Calendar, AlertCircle } from 'lucide-react';
import { format, parseISO, isPast, isFuture } from 'date-fns';

interface MilestoneTimelineProps {
  milestones: Milestone[];
  onMilestoneClick?: (milestone: Milestone) => void;
}

const MilestoneTimeline: React.FC<MilestoneTimelineProps> = ({ 
  milestones,
  onMilestoneClick
}) => {
  // Sort milestones by date
  const sortedMilestones = [...milestones].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  return (
    <Card className="w-full shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          Project Milestones
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative pb-4">
          {/* The vertical timeline line */}
          <div className="absolute left-3.5 top-0 bottom-0 w-0.5 bg-gray-200" />
          
          <div className="space-y-4">
            {sortedMilestones.map((milestone, index) => {
              const milestoneDate = parseISO(milestone.date);
              const isPastDue = isPast(milestoneDate) && !milestone.completed;
              const isUpcoming = isFuture(milestoneDate) && !milestone.completed;
              
              return (
                <div 
                  key={milestone.id} 
                  className="relative pl-10 transition-all hover:bg-slate-50 rounded p-2 cursor-pointer"
                  onClick={() => onMilestoneClick?.(milestone)}
                >
                  {/* Status circle */}
                  <div className="absolute left-0 top-1">
                    {milestone.completed ? (
                      <CheckCircle2 className="h-7 w-7 text-green-500 bg-white rounded-full" />
                    ) : isPastDue ? (
                      <AlertCircle className="h-7 w-7 text-red-500 bg-white rounded-full" />
                    ) : (
                      <Circle className="h-7 w-7 text-blue-500 bg-white rounded-full" />
                    )}
                  </div>
                  
                  {/* Milestone content */}
                  <div>
                    <div className="flex items-center">
                      <h4 className="font-medium">{milestone.title}</h4>
                      <div className="ml-auto flex space-x-2">
                        {milestone.completed ? (
                          <Badge className="bg-green-100 text-green-800 border-green-300">Completed</Badge>
                        ) : isPastDue ? (
                          <Badge className="bg-red-100 text-red-800 border-red-300">Past due</Badge>
                        ) : isUpcoming ? (
                          <Badge className="bg-blue-100 text-blue-800 border-blue-300">Upcoming</Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-800 border-gray-300">In progress</Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {milestone.description}
                    </p>
                    <div className="flex items-center mt-2 text-xs text-gray-500">
                      <Calendar className="h-3 w-3 mr-1" />
                      {format(milestoneDate, 'MMMM d, yyyy')}
                    </div>
                    
                    {/* Related tasks count */}
                    {milestone.relatedTasks && milestone.relatedTasks.length > 0 && (
                      <div className="text-xs text-gray-500 mt-1">
                        {milestone.relatedTasks.length} related task{milestone.relatedTasks.length !== 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MilestoneTimeline;
