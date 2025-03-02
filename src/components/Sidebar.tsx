
import React from "react";
import {
  LayoutDashboard,
  Settings,
  HelpCircle,
  MessageSquare,
  Users,
  Database,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useChat } from "@/contexts/ChatContext";
import { useState } from "react";
import { KnowledgeBaseDialogPanel } from "@/components/knowledge/KnowledgeBaseDialogPanel";

export function Sidebar() {
  const { clearMessages } = useChat();
  const { toast } = useToast();
  
  const [knowledgeBaseOpen, setKnowledgeBaseOpen] = useState(false);
  
  const handleClearChat = () => {
    clearMessages();
    toast({
      title: "Chat cleared",
      description: "The chat history has been cleared.",
    });
  };
  
  return (
    <aside className="hidden md:flex h-screen w-[52px] border-r bg-background flex-col justify-between overflow-hidden hover:w-[240px] hover:p-2 transition-all group">
      <div className="flex flex-col items-center group-hover:items-start space-y-2">
        <Button
          variant="ghost"
          size="icon"
          className="group-hover:w-full group-hover:justify-start h-9 group-hover:px-2 group-hover:py-2"
        >
          <LayoutDashboard className="h-5 w-5 group-hover:mr-2" />
          <span className="hidden group-hover:inline-flex">Dashboard</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="group-hover:w-full group-hover:justify-start h-9 group-hover:px-2 group-hover:py-2"
        >
          <MessageSquare className="h-5 w-5 group-hover:mr-2" />
          <span className="hidden group-hover:inline-flex">Chat</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="group-hover:w-full group-hover:justify-start h-9 group-hover:px-2 group-hover:py-2"
        >
          <Users className="h-5 w-5 group-hover:mr-2" />
          <span className="hidden group-hover:inline-flex">Team</span>
        </Button>
      </div>

      <div className="flex flex-col items-center group-hover:items-start space-y-2">
        <Button
          variant="ghost"
          size="icon"
          className="group-hover:w-full group-hover:justify-start h-9 group-hover:px-2 group-hover:py-2"
          onClick={() => setKnowledgeBaseOpen(true)}
        >
          <Database className="h-5 w-5 group-hover:mr-2" />
          <span className="hidden group-hover:inline-flex">Knowledge Base</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="group-hover:w-full group-hover:justify-start h-9 group-hover:px-2 group-hover:py-2"
        >
          <Settings className="h-5 w-5 group-hover:mr-2" />
          <span className="hidden group-hover:inline-flex">Settings</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="group-hover:w-full group-hover:justify-start h-9 group-hover:px-2 group-hover:py-2"
        >
          <HelpCircle className="h-5 w-5 group-hover:mr-2" />
          <span className="hidden group-hover:inline-flex">Help</span>
        </Button>
      </div>
      
      {/* Knowledge Base Dialog */}
      <KnowledgeBaseDialogPanel 
        open={knowledgeBaseOpen} 
        onOpenChange={setKnowledgeBaseOpen} 
      />
    </aside>
  );
}
