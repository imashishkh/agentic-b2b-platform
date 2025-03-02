
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArchitectureProposal } from "@/contexts/types";
import { CheckCircle, FileDown, FileText } from "lucide-react";

interface ArchitectureProposalCardProps {
  proposal: ArchitectureProposal;
  onApprove: (id: string) => void;
}

export const ArchitectureProposalCard: React.FC<ArchitectureProposalCardProps> = ({ 
  proposal,
  onApprove
}) => {
  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{proposal.title}</CardTitle>
          {proposal.approved && (
            <span className="flex items-center text-sm text-green-600">
              <CheckCircle className="h-4 w-4 mr-1" />
              Approved
            </span>
          )}
        </div>
        <CardDescription>
          {new Date(proposal.dateCreated).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-3">{proposal.description}</p>
        <h4 className="text-sm font-medium mb-2">Components:</h4>
        <ul className="text-sm space-y-1">
          {proposal.components.slice(0, 3).map((component, index) => (
            <li key={index} className="flex items-start">
              <span className="mr-2">•</span>
              <span><span className="font-medium">{component.name}</span> ({component.type})</span>
            </li>
          ))}
          {proposal.components.length > 3 && (
            <li className="text-xs text-muted-foreground">+ {proposal.components.length - 3} more components</li>
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
              <DialogTitle>{proposal.title}</DialogTitle>
              <DialogDescription>
                Created on {new Date(proposal.dateCreated).toLocaleDateString()}
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Description</h4>
                <p className="text-sm">{proposal.description}</p>
              </div>
              
              {proposal.diagram && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Architecture Diagram</h4>
                  <div className="border rounded-md p-2 bg-gray-50">
                    <img src={proposal.diagram} alt="Architecture Diagram" className="w-full" />
                  </div>
                </div>
              )}
              
              <div>
                <h4 className="text-sm font-medium mb-2">Components</h4>
                <div className="space-y-3">
                  {proposal.components.map((component, index) => (
                    <div key={index} className="p-3 border rounded-md">
                      <h5 className="font-medium text-sm">{component.name} <span className="font-normal text-xs text-gray-500">({component.type})</span></h5>
                      <p className="text-sm mt-1">{component.description}</p>
                      {component.dependencies && component.dependencies.length > 0 && (
                        <div className="mt-2">
                          <span className="text-xs text-gray-500">Dependencies: </span>
                          <span className="text-xs">{component.dependencies.join(', ')}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              {!proposal.approved && (
                <Button onClick={() => onApprove(proposal.id)} className="mr-2">
                  Approve Proposal
                </Button>
              )}
              <Button variant="outline">
                <FileDown className="h-4 w-4 mr-2" />
                Export as PDF
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        
        {!proposal.approved && (
          <Button onClick={() => onApprove(proposal.id)}>
            Approve
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
