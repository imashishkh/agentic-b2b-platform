
import React from "react";
import { useChat } from "@/contexts/ChatContext";
import { ArchitectureProposal } from "@/contexts/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { toast } from "sonner";

export function ArchitectureVisualizer() {
  const { architectureProposals, updateArchitectureProposal } = useChat();
  
  const handleApproveProposal = (id: string) => {
    updateArchitectureProposal(id, { approved: true });
    toast.success("Architecture proposal approved");
  };
  
  const handleRejectProposal = (id: string) => {
    updateArchitectureProposal(id, { approved: false });
    toast.info("Architecture proposal rejected");
  };
  
  if (architectureProposals.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        <p>No architecture proposals yet.</p>
        <p className="text-sm mt-2">Ask DevManager to propose system architecture.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4 p-2">
      {architectureProposals.map(proposal => (
        <Card key={proposal.id} className="p-4">
          <div className="flex justify-between items-start">
            <h3 className="font-medium">{proposal.title}</h3>
            {proposal.approved !== undefined && (
              <Badge 
                className={proposal.approved ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
              >
                {proposal.approved ? "Approved" : "Rejected"}
              </Badge>
            )}
          </div>
          
          <p className="text-sm text-gray-600 mt-2">{proposal.description}</p>
          
          {proposal.components && proposal.components.length > 0 && (
            <div className="mt-3">
              <h4 className="text-sm font-medium mb-2">Components:</h4>
              <div className="space-y-2">
                {proposal.components.map((component, index) => (
                  <div key={index} className="text-sm bg-gray-50 p-2 rounded">
                    <div className="font-medium">{component.name}</div>
                    <div className="text-xs text-gray-600">{component.type}</div>
                    <div className="text-xs mt-1">{component.description}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {proposal.approved === undefined && (
            <div className="flex justify-end gap-2 mt-3">
              <Button 
                size="sm" 
                variant="outline" 
                className="text-red-500"
                onClick={() => handleRejectProposal(proposal.id)}
              >
                <X className="h-4 w-4 mr-1" />
                Reject
              </Button>
              <Button 
                size="sm"
                className="bg-green-500 hover:bg-green-600"
                onClick={() => handleApproveProposal(proposal.id)}
              >
                <Check className="h-4 w-4 mr-1" />
                Approve
              </Button>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
