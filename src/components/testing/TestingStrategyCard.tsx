
import React from 'react';
import { Check, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { TestingStrategy } from '@/contexts/types';

// Define extended type for TestingStrategy
export interface ExtendedTestingStrategy extends Omit<TestingStrategy, 'approaches'> {
  approaches?: Array<{
    name: string;
    type?: string;
    framework?: string;
    description?: string;
    coverageGoal?: string;
    tools: string[];
  }>;
}

interface TestingStrategyCardProps {
  strategy: ExtendedTestingStrategy;
  onApprove?: (id: string) => void;
}

export const TestingStrategyCard: React.FC<TestingStrategyCardProps> = ({ 
  strategy, 
  onApprove = () => {} // Default empty function if not provided
}) => {
  // Format date if it exists
  const formattedDate = strategy.dateCreated 
    ? typeof strategy.dateCreated === 'string' 
      ? strategy.dateCreated 
      : format(new Date(strategy.dateCreated), 'MMM d, yyyy')
    : 'N/A';
  
  return (
    <Card className={`transition-all duration-200 ${strategy.approved ? 'border-green-200 bg-green-50/40' : ''}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{strategy.name}</CardTitle>
            <CardDescription className="mt-1">
              {strategy.description}
            </CardDescription>
          </div>
          {strategy.approved && (
            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
              <Check className="h-3 w-3 mr-1" /> Approved
            </Badge>
          )}
        </div>
        <div className="flex items-center text-xs text-gray-500 mt-2">
          <Clock className="h-3 w-3 mr-1" />
          <span>Created: {formattedDate}</span>
        </div>
      </CardHeader>
      
      <CardContent>
        {strategy.approaches && strategy.approaches.length > 0 ? (
          <div className="space-y-3">
            {strategy.approaches.map((approach, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded-md">
                <div className="flex items-center mb-2">
                  <h4 className="font-medium text-sm">{approach.name || 'Approach'}</h4>
                  {approach.type && approach.framework && (
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {approach.type}: {approach.framework}
                    </Badge>
                  )}
                </div>
                {approach.description && (
                  <p className="text-sm text-gray-600 mb-2">{approach.description}</p>
                )}
                {approach.coverageGoal && (
                  <div className="flex items-center text-xs text-gray-500 mb-2">
                    <span>Coverage Goal: {approach.coverageGoal}</span>
                  </div>
                )}
                <div className="flex flex-wrap gap-1 mt-2">
                  {approach.tools.map((tool, toolIndex) => (
                    <Badge key={toolIndex} variant="outline" className="text-xs">
                      {tool}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No specific testing approaches defined.</p>
        )}
      </CardContent>
      
      <CardFooter className="pt-2">
        {!strategy.approved && (
          <Button 
            size="sm" 
            onClick={() => onApprove(strategy.id)}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            Approve Strategy
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
