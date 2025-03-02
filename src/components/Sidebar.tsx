
import React, { useState } from "react";
import { SayHaloLogo } from "./SayHaloLogo";
import { Code, ChevronLeft, ChevronRight, Upload, Settings, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AgentType } from "@/agents/AgentTypes";

interface SidebarProps {
  className?: string;
  currentAgentType: AgentType;
  setCurrentAgentType: (type: AgentType) => void;
  onToggleSettings: () => void;
}

export function Sidebar({ 
  className, 
  currentAgentType, 
  setCurrentAgentType, 
  onToggleSettings 
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  // Helper function to get agent info based on agent type
  const getAgentInfo = (type: AgentType) => {
    switch (type) {
      case AgentType.FRONTEND:
        return {
          name: "FrontendDev",
          title: "Frontend Developer",
          color: "bg-blue-600 hover:bg-blue-700",
          textColor: "text-blue-600"
        };
      case AgentType.BACKEND:
        return {
          name: "BackendDev",
          title: "Backend Developer",
          color: "bg-green-600 hover:bg-green-700",
          textColor: "text-green-600"
        };
      case AgentType.DATABASE:
        return {
          name: "DataArchitect",
          title: "Database Architect",
          color: "bg-purple-600 hover:bg-purple-700",
          textColor: "text-purple-600"
        };
      case AgentType.DEVOPS:
        return {
          name: "DevOpsEng",
          title: "DevOps Engineer",
          color: "bg-orange-600 hover:bg-orange-700",
          textColor: "text-orange-600"
        };
      case AgentType.UX:
        return {
          name: "UXDesigner",
          title: "UX Designer",
          color: "bg-pink-600 hover:bg-pink-700",
          textColor: "text-pink-600"
        };
      case AgentType.MANAGER:
      default:
        return {
          name: "DevManager",
          title: "Development Manager",
          color: "bg-sayhalo-dark hover:bg-sayhalo-dark/90",
          textColor: "text-sayhalo-dark"
        };
    }
  };

  return (
    <div className={cn(
      "flex flex-col border-r border-gray-200 bg-white transition-all duration-300 ease-in-out h-screen",
      collapsed ? "w-16" : "w-64",
      className
    )}>
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <SayHaloLogo size={24} />
            <h1 className="text-lg font-semibold text-sayhalo-dark">DevManager</h1>
          </div>
        )}
        {collapsed && <SayHaloLogo size={24} className="mx-auto" />}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Main Sidebar Content */}
      <div className="flex-1 overflow-y-auto py-4">
        {/* Agent Selection Section */}
        <div className="px-3 mb-6">
          {!collapsed && <h2 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2 px-2">Agents</h2>}
          
          <div className="space-y-1">
            {Object.values(AgentType).map((type) => {
              const agentInfo = getAgentInfo(type);
              return (
                <button
                  key={type}
                  onClick={() => setCurrentAgentType(type)}
                  className={cn(
                    "w-full flex items-center gap-2 rounded-md p-2 transition-colors",
                    currentAgentType === type
                      ? `${agentInfo.color} text-white`
                      : "hover:bg-gray-100 text-gray-700",
                    collapsed && "justify-center"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center",
                    currentAgentType === type ? "bg-white/20" : agentInfo.color
                  )}>
                    <Code size={16} className={currentAgentType === type ? "text-white" : "text-white"} />
                  </div>
                  {!collapsed && (
                    <div className="text-left overflow-hidden">
                      <p className="text-sm font-medium truncate">{agentInfo.name}</p>
                      {currentAgentType === type && <p className="text-xs opacity-80 truncate">{agentInfo.title}</p>}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Actions Section */}
        {!collapsed && (
          <div className="px-3 mb-6">
            <h2 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2 px-2">Actions</h2>
            <div className="space-y-1">
              <button className="w-full flex items-center gap-2 rounded-md p-2 hover:bg-gray-100 text-gray-700">
                <Upload size={16} />
                <span className="text-sm">Upload Requirements</span>
              </button>
              <button className="w-full flex items-center gap-2 rounded-md p-2 hover:bg-gray-100 text-gray-700">
                <MessageSquare size={16} />
                <span className="text-sm">New Conversation</span>
              </button>
            </div>
          </div>
        )}

        {/* Collapsed Actions */}
        {collapsed && (
          <div className="px-3 flex flex-col items-center space-y-4 mt-4">
            <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
              <Upload size={18} />
            </button>
            <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
              <MessageSquare size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Sidebar Footer */}
      <div className="border-t border-gray-200 p-4">
        <Button
          onClick={onToggleSettings}
          variant="outline"
          className={cn(
            "w-full justify-start gap-2", 
            collapsed && "justify-center p-2"
          )}
        >
          <Settings size={16} />
          {!collapsed && <span>API Settings</span>}
        </Button>
      </div>
    </div>
  );
}
