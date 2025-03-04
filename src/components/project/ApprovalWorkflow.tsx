import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { AgentType } from "@/agents/AgentTypes";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Calendar,
  UserCheck,
  Code,
  Database,
  Layout,
  Server,
  PenTool,
  HardDrive,
  ThumbsUp,
  ThumbsDown,
  MessageSquare
} from "lucide-react";

export interface ProjectPhase {
  id: string;
  name: string;
  description: string;
  status: "pending" | "in_progress" | "approved" | "rejected";
  estimatedDuration: number; // in days
  assignedAgents: AgentType[];
  tasks: ProjectTask[];
}

export interface ProjectTask {
  id: string;
  title: string;
  description: string;
  agentType: AgentType;
}

interface ApprovalWorkflowProps {
  projectName: string;
  projectDescription: string;
  phases: ProjectPhase[];
  onApprove: (phaseId: string, feedback?: string) => void;
  onReject: (phaseId: string, feedback: string) => void;
  onApproveAll: () => void;
}

export function ApprovalWorkflow({
  projectName,
  projectDescription,
  phases,
  onApprove,
  onReject,
  onApproveAll
}: ApprovalWorkflowProps) {
  const [feedback, setFeedback] = useState<Record<string, string>>({});
  const [expandedView, setExpandedView] = useState<string | null>(null);
  
  const handleApprove = (phaseId: string) => {
    onApprove(phaseId, feedback[phaseId]);
    const newFeedback = { ...feedback };
    delete newFeedback[phaseId];
    setFeedback(newFeedback);
  };
  
  const handleReject = (phaseId: string) => {
    if (!feedback[phaseId]?.trim()) {
      // Ensure feedback is provided for rejection
      setFeedback({
        ...feedback,
        [phaseId]: "Please provide feedback for rejection"
      });
      return;
    }
    
    onReject(phaseId, feedback[phaseId]);
    const newFeedback = { ...feedback };
    delete newFeedback[phaseId];
    setFeedback(newFeedback);
  };
  
  const totalPhases = phases.length;
  const approvedPhases = phases.filter(p => p.status === "approved").length;
  const approvalProgress = totalPhases > 0 ? (approvedPhases / totalPhases) * 100 : 0;
  
  const getAgentIcon = (agentType: AgentType) => {
    switch (agentType) {
      case AgentType.FRONTEND:
        return <Layout className="h-4 w-4" />;
      case AgentType.BACKEND:
        return <Server className="h-4 w-4" />;
      case AgentType.DATABASE:
        return <Database className="h-4 w-4" />;
      case AgentType.DEVOPS:
        return <HardDrive className="h-4 w-4" />;
      case AgentType.UX:
        return <PenTool className="h-4 w-4" />;
      case AgentType.MANAGER:
        return <UserCheck className="h-4 w-4" />;
      case AgentType.ECOMMERCE:
        return <Code className="h-4 w-4" />;
      default:
        return <Code className="h-4 w-4" />;
    }
  };
  
  const getStatusIcon = (status: ProjectPhase["status"]) => {
    switch (status) {
      case "approved":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "in_progress":
        return <Clock className="h-5 w-5 text-blue-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
    }
  };
  
  const getStatusClass = (status: ProjectPhase["status"]) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "in_progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-amber-100 text-amber-800 border-amber-200";
    }
  };
  
  const getTotalEstimatedDays = () => {
    return phases.reduce((total, phase) => total + phase.estimatedDuration, 0);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Project Approval Workflow</span>
            {approvalProgress === 100 ? (
              <Badge className="bg-green-100 text-green-800 border-green-200">
                All Phases Approved
              </Badge>
            ) : (
              <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                Approval In Progress
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <h3 className="font-medium">{projectName}</h3>
                <span className="text-gray-500">
                  {approvedPhases} of {totalPhases} phases approved
                </span>
              </div>
              <Progress value={approvalProgress} className="h-2" />
            </div>
            
            <div className="rounded-lg border p-4 space-y-3">
              <h3 className="text-sm font-medium">Project Overview</h3>
              <p className="text-sm text-gray-600">{projectDescription}</p>
              
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>Estimated: {getTotalEstimatedDays()} days</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  <UserCheck className="h-4 w-4" />
                  <span>{phases.reduce((total, phase) => total + phase.assignedAgents.length, 0)} agents</span>
                </div>
              </div>
            </div>
            
            <div className="grid gap-4">
              {phases.map(phase => (
                <Card key={phase.id} className="overflow-hidden">
                  <div 
                    className={`p-4 flex items-center justify-between ${
                      phase.status === "approved" ? "bg-green-50" : 
                      phase.status === "rejected" ? "bg-red-50" : 
                      phase.status === "in_progress" ? "bg-blue-50" : 
                      "bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {getStatusIcon(phase.status)}
                      <div>
                        <h3 className="font-medium">{phase.name}</h3>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{phase.estimatedDuration} days</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="flex -space-x-2">
                              {phase.assignedAgents.map((agent, i) => (
                                <div 
                                  key={i} 
                                  className="h-5 w-5 rounded-full bg-gray-200 border border-white flex items-center justify-center"
                                  title={agent}
                                >
                                  {getAgentIcon(agent)}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <Badge variant="outline" className={getStatusClass(phase.status)}>
                      {phase.status === "pending" ? "Pending Approval" : 
                       phase.status === "in_progress" ? "In Progress" : 
                       phase.status === "approved" ? "Approved" : "Rejected"}
                    </Badge>
                  </div>
                  
                  {/* Expandable Phase Details */}
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value={phase.id}>
                      <AccordionTrigger className="px-4 py-2 text-sm">
                        Phase Details
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4 space-y-4">
                        <p className="text-sm text-gray-600">{phase.description}</p>
                        
                        {/* Tasks in this phase */}
                        <div className="space-y-2">
                          <h4 className="text-xs font-medium text-gray-500">TASKS</h4>
                          <div className="space-y-2">
                            {phase.tasks.map(task => (
                              <div key={task.id} className="rounded-md border p-2">
                                <div className="flex justify-between items-start">
                                  <h5 className="text-sm font-medium">{task.title}</h5>
                                  <Badge 
                                    variant="outline" 
                                    className="bg-gray-100 text-gray-800 border-gray-200 flex items-center gap-1"
                                  >
                                    {getAgentIcon(task.agentType)}
                                    <span>{task.agentType}</span>
                                  </Badge>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">{task.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Feedback and approval controls */}
                        {phase.status !== "approved" && (
                          <div className="space-y-3 pt-2">
                            <Textarea
                              placeholder="Provide feedback or comments on this phase..."
                              value={feedback[phase.id] || ""}
                              onChange={(e) => setFeedback({...feedback, [phase.id]: e.target.value})}
                              rows={3}
                              className="w-full resize-none"
                            />
                            
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleReject(phase.id)}
                                className="text-red-600 hover:bg-red-50"
                              >
                                <ThumbsDown className="h-4 w-4 mr-2" />
                                Reject
                              </Button>
                              
                              <Button 
                                size="sm"
                                onClick={() => handleApprove(phase.id)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <ThumbsUp className="h-4 w-4 mr-2" />
                                Approve
                              </Button>
                            </div>
                          </div>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </Card>
              ))}
            </div>
            
            <div className="flex justify-end pt-4">
              <Button 
                onClick={onApproveAll}
                className="bg-green-600 hover:bg-green-700"
                disabled={approvalProgress === 100}
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Approve All Phases
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}