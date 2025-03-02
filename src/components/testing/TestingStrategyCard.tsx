import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Settings2, XCircle } from "lucide-react";
import { TestingStrategy } from "@/contexts/types";

// Extended testing strategy interface for internal use
export interface ExtendedTestingStrategy extends Omit<TestingStrategy, 'approaches'> {
  approaches?: {
    name: string;
    type?: string;
    framework?: string;
    description?: string;
    coverageGoal?: string;
    tools: string[];
  }[];
  dateCreated?: string;
}

interface TestingStrategyCardProps {
  strategy: ExtendedTestingStrategy;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onConfigure?: (id: string) => void;
}

export const TestingStrategyCard: React.FC<TestingStrategyCardProps> = ({
  strategy,
  onApprove,
  onReject,
  onConfigure
}) => {
  // Format date if available
  const formattedDate = strategy.dateCreated 
    ? new Date(strategy.dateCreated).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : undefined;

  return (
    <Card className={`overflow-hidden ${strategy.approved ? 'border-green-200' : ''}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{strategy.title || strategy.name}</CardTitle>
        {formattedDate && <span className="text-sm text-slate-500">Created: {formattedDate}</span>}
      </CardHeader>
      <CardContent>
        <p className="text-sm text-slate-600 mb-4">{strategy.description}</p>
        
        {/* Testing Approaches */}
        {strategy.approaches && strategy.approaches.length > 0 && (
          <div className="mb-4">
            <h4 className="font-medium text-sm mb-2">Testing Approaches</h4>
            <div className="space-y-2">
              {strategy.approaches.map((approach, index) => (
                <div key={index} className="p-2 bg-slate-50 rounded border">
                  <div className="flex justify-between">
                    <span className="font-medium text-sm">{approach.name}</span>
                    {approach.type && (
                      <Badge variant="outline">{approach.type}</Badge>
                    )}
                  </div>
                  {approach.description && (
                    <p className="text-xs text-slate-600 mt-1">{approach.description}</p>
                  )}
                  {approach.framework && (
                    <div className="mt-1">
                      <span className="text-xs text-slate-500">Framework: </span>
                      <span className="text-xs">{approach.framework}</span>
                    </div>
                  )}
                  {approach.coverageGoal && (
                    <div className="mt-1">
                      <span className="text-xs text-slate-500">Coverage Goal: </span>
                      <span className="text-xs">{approach.coverageGoal}</span>
                    </div>
                  )}
                  {approach.tools && approach.tools.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {approach.tools.map((tool, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {tool}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Simple approach list if not using extended format */}
        {!strategy.approaches && strategy.testingLevels && strategy.testingLevels.length > 0 && (
          <div className="mb-4">
            <h4 className="font-medium text-sm mb-2">Testing Levels</h4>
            <div className="flex flex-wrap gap-1">
              {strategy.testingLevels.map((level: any, index: number) => (
                <Badge key={index} variant="outline">{level.name || level}</Badge>
              ))}
            </div>
          </div>
        )}
        
        {/* Tooling */}
        {strategy.tooling && (
          <div className="mb-2">
            <h4 className="font-medium text-sm mb-1">Tooling</h4>
            <div className="flex flex-wrap gap-1">
              {typeof strategy.tooling === 'string' 
                ? <span className="text-sm">{strategy.tooling}</span>
                : strategy.tooling.map((tool, index) => (
                    <Badge key={index} variant="secondary">
                      {tool}
                    </Badge>
                  ))
              }
            </div>
          </div>
        )}
        
        {/* Status indicator */}
        <div className="mt-4">
          {strategy.approved ? (
            <Badge className="bg-green-100 text-green-800 border-green-300" variant="secondary">Approved</Badge>
          ) : (
            <Badge variant="outline">Proposed</Badge>
          )}
        </div>
      </CardContent>
      
      {/* Action buttons */}
      {!strategy.approved && (onApprove || onReject || onConfigure) && (
        <CardFooter className="border-t pt-4 flex gap-2 justify-end">
          {onConfigure && (
            <Button size="sm" variant="outline" onClick={() => onConfigure(strategy.id)}>
              <Settings2 className="h-4 w-4 mr-1" />
              Configure
            </Button>
          )}
          {onReject && (
            <Button size="sm" variant="outline" className="text-red-600 hover:text-red-600" onClick={() => onReject(strategy.id)}>
              <XCircle className="h-4 w-4 mr-1" />
              Reject
            </Button>
          )}
          {onApprove && (
            <Button size="sm" variant="default" className="bg-green-600 hover:bg-green-700" onClick={() => onApprove(strategy.id)}>
              <CheckCircle className="h-4 w-4 mr-1" />
              Approve
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
};
