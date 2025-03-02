
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { TestingStrategy } from "@/contexts/ChatContext";
import { CheckCircle, FileDown, FileText } from "lucide-react";

interface TestingStrategyCardProps {
  strategy: TestingStrategy;
  onApprove: (id: string) => void;
}

export const TestingStrategyCard: React.FC<TestingStrategyCardProps> = ({ 
  strategy,
  onApprove
}) => {
  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{strategy.title}</CardTitle>
          {strategy.approved && (
            <span className="flex items-center text-sm text-green-600">
              <CheckCircle className="h-4 w-4 mr-1" />
              Approved
            </span>
          )}
        </div>
        <CardDescription>
          {new Date(strategy.dateCreated).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-3">{strategy.description}</p>
        <h4 className="text-sm font-medium mb-2">Testing Approaches:</h4>
        <ul className="text-sm space-y-1">
          {strategy.approaches.slice(0, 3).map((approach, index) => (
            <li key={index} className="flex items-start">
              <span className="mr-2">•</span>
              <span><span className="font-medium">{approach.type}</span> using {approach.framework}</span>
            </li>
          ))}
          {strategy.approaches.length > 3 && (
            <li className="text-xs text-muted-foreground">+ {strategy.approaches.length - 3} more approaches</li>
          )}
        </ul>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              View Details
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{strategy.title}</DialogTitle>
              <DialogDescription>
                Created on {new Date(strategy.dateCreated).toLocaleDateString()}
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Description</h4>
                <p className="text-sm">{strategy.description}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Testing Approaches</h4>
                <div className="space-y-3">
                  {strategy.approaches.map((approach, index) => (
                    <div key={index} className="p-3 border rounded-md">
                      <h5 className="font-medium text-sm">{approach.type} <span className="font-normal text-xs text-gray-500">({approach.framework})</span></h5>
                      <p className="text-sm mt-1">{approach.description}</p>
                      {approach.coverageGoal && (
                        <div className="mt-2">
                          <span className="text-xs text-gray-500">Coverage Goal: </span>
                          <span className="text-xs">{approach.coverageGoal}%</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              {!strategy.approved && (
                <Button onClick={() => onApprove(strategy.id)} className="mr-2">
                  Approve Strategy
                </Button>
              )}
              <Button variant="outline">
                <FileDown className="h-4 w-4 mr-2" />
                Export as PDF
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        
        {!strategy.approved && (
          <Button onClick={() => onApprove(strategy.id)}>
            Approve
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
