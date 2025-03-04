import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AgentType } from "@/agents/AgentTypes";
import { TaskAssignment } from "@/contexts/types";
import { 
  CheckCircle,
  Edit,
  AlertCircle,
  Save,
  X,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface SectionAssignment {
  id: string;
  title: string;
  description?: string;
  agentType: AgentType;
  tasks: string[];
}

interface AgentAssignmentPanelProps {
  assignments: SectionAssignment[];
  onAssignmentChange: (id: string, newAgentType: AgentType) => void;
  onAssignmentsConfirm: () => void;
}

export function AgentAssignmentPanel({
  assignments,
  onAssignmentChange,
  onAssignmentsConfirm
}: AgentAssignmentPanelProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempAgentType, setTempAgentType] = useState<AgentType | null>(null);
  
  const agentCounts = assignments.reduce((acc, assignment) => {
    acc[assignment.agentType] = (acc[assignment.agentType] || 0) + 1;
    return acc;
  }, {} as Record<AgentType, number>);

  const startEditing = (id: string, currentAgentType: AgentType) => {
    setEditingId(id);
    setTempAgentType(currentAgentType);
  };

  const saveAssignment = (id: string) => {
    if (tempAgentType) {
      onAssignmentChange(id, tempAgentType);
    }
    setEditingId(null);
    setTempAgentType(null);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setTempAgentType(null);
  };
  
  const getAgentColorClass = (agentType: AgentType) => {
    switch (agentType) {
      case AgentType.FRONTEND:
        return "bg-blue-100 text-blue-800 border-blue-200";
      case AgentType.BACKEND:
        return "bg-green-100 text-green-800 border-green-200";
      case AgentType.DATABASE:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case AgentType.DEVOPS:
        return "bg-purple-100 text-purple-800 border-purple-200";
      case AgentType.UX:
        return "bg-pink-100 text-pink-800 border-pink-200";
      case AgentType.MANAGER:
        return "bg-gray-100 text-gray-800 border-gray-200";
      case AgentType.ECOMMERCE:
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex justify-between items-center">
          <span>Section Agent Assignments</span>
          <Button
            onClick={onAssignmentsConfirm}
            size="sm"
            className="bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Confirm Assignments
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="bySection">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="bySection" className="flex-1">By Section</TabsTrigger>
            <TabsTrigger value="byAgent" className="flex-1">By Agent</TabsTrigger>
          </TabsList>
          
          <TabsContent value="bySection" className="space-y-4">
            {assignments.map(assignment => (
              <Card key={assignment.id} className="overflow-hidden">
                <div className="p-4 flex items-center justify-between border-b">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium">{assignment.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {assignment.tasks.length} tasks
                    </p>
                  </div>
                  
                  {editingId === assignment.id ? (
                    <div className="flex items-center gap-2">
                      <Select 
                        defaultValue={tempAgentType || assignment.agentType} 
                        onValueChange={(value) => setTempAgentType(value as AgentType)}
                      >
                        <SelectTrigger className="w-36">
                          <SelectValue placeholder="Select agent" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(AgentType).map(type => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      <Button 
                        size="icon" 
                        variant="outline" 
                        className="h-8 w-8 text-green-600"
                        onClick={() => saveAssignment(assignment.id)}
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                      
                      <Button 
                        size="icon" 
                        variant="outline" 
                        className="h-8 w-8 text-red-600"
                        onClick={cancelEditing}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={getAgentColorClass(assignment.agentType)}>
                        {assignment.agentType}
                      </Badge>
                      
                      <Button 
                        size="icon" 
                        variant="outline" 
                        className="h-8 w-8"
                        onClick={() => startEditing(assignment.id, assignment.agentType)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
                
                <AccordionItem value={assignment.id} className="border-0">
                  <AccordionTrigger className="px-4 py-2 hover:bg-gray-50 text-sm">
                    View tasks
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <ul className="space-y-1">
                      {assignment.tasks.map((task, index) => (
                        <li key={index} className="text-sm pl-2 border-l-2 border-gray-200">
                          {task}
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Card>
            ))}
          </TabsContent>
          
          <TabsContent value="byAgent">
            {Object.values(AgentType).map(agentType => {
              const agentAssignments = assignments.filter(a => a.agentType === agentType);
              if (agentAssignments.length === 0) return null;
              
              return (
                <Card key={agentType} className="mb-4 overflow-hidden">
                  <div className="p-4 border-b flex justify-between items-center">
                    <div>
                      <h3 className="flex items-center gap-2">
                        <Badge variant="outline" className={getAgentColorClass(agentType)}>
                          {agentType}
                        </Badge>
                        <span className="font-medium">{agentAssignments.length} sections</span>
                      </h3>
                    </div>
                  </div>
                  
                  <div className="divide-y">
                    {agentAssignments.map(assignment => (
                      <div key={assignment.id} className="p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-start">
                          <h4 className="text-sm font-medium">{assignment.title}</h4>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-7 px-2 text-xs"
                            onClick={() => startEditing(assignment.id, assignment.agentType)}
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Reassign
                          </Button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {assignment.tasks.length} tasks
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>
              );
            })}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}