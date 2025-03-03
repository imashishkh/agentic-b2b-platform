import React from "react";
import {
  LayoutDashboard,
  Settings,
  HelpCircle,
  MessageSquare,
  Users,
  Database,
  LogOut,
  LogIn,
  UserPlus,
  Shield,
  BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useChat } from "@/contexts/ChatContext";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { KnowledgeBasePanel } from "@/components/KnowledgeBasePanel";
import { useUser } from "@/components/UserProvider";

// Define user roles
export enum UserRole {
  GUEST = "guest",
  USER = "user",
  ADMIN = "admin"
}

export function Sidebar() {
  const { clearMessages } = useChat();
  const { toast } = useToast();
  const { user } = useUser();
  const [knowledgeBaseOpen, setKnowledgeBaseOpen] = useState(false);
  
  // Always return USER role - authentication removed
  const getUserRole = (): UserRole => {
    return UserRole.USER;
  };
  
  const userRole = getUserRole();
  
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
        <div className="flex items-center justify-center group-hover:justify-start w-full py-2">
          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            {user.imageUrl ? (
              <img src={user.imageUrl} alt={user.fullName || "User"} className="h-full w-full object-cover" />
            ) : (
              <span className="text-sm font-semibold">{(user.fullName || user.username || "U").charAt(0)}</span>
            )}
          </div>
          <span className="hidden group-hover:inline-flex ml-2 text-sm font-medium">
            {user.fullName || user.username}
            {userRole === UserRole.ADMIN && (
              <span className="ml-1 text-xs bg-blue-100 text-blue-800 px-1 rounded">Admin</span>
            )}
          </span>
        </div>
        
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
        
        {userRole === UserRole.ADMIN && (
          <Button
            variant="ghost"
            size="icon"
            className="group-hover:w-full group-hover:justify-start h-9 group-hover:px-2 group-hover:py-2"
          >
            <Shield className="h-5 w-5 group-hover:mr-2" />
            <span className="hidden group-hover:inline-flex">Admin Panel</span>
          </Button>
        )}
      </div>

      <div className="flex flex-col items-center group-hover:items-start space-y-2">
        <Button
          variant="ghost"
          size="icon"
          className="group-hover:w-full group-hover:justify-start h-9 group-hover:px-2 group-hover:py-2"
          onClick={() => setKnowledgeBaseOpen(true)}
          aria-label="Knowledge Hub"
        >
          <Database className="h-5 w-5 group-hover:mr-2" />
          <span className="hidden group-hover:inline-flex">Knowledge Hub</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="group-hover:w-full group-hover:justify-start h-9 group-hover:px-2 group-hover:py-2"
        >
          <BookOpen className="h-5 w-5 group-hover:mr-2" />
          <span className="hidden group-hover:inline-flex">E-commerce Docs</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="group-hover:w-full group-hover:justify-start h-9 group-hover:px-2 group-hover:py-2"
          onClick={() => {
            const dialogRoot = document.createElement('div');
            document.body.appendChild(dialogRoot);
            
            // Create a new react root and render the ApiSettingsDialog
            import('react-dom/client').then(({ createRoot }) => {
              const root = createRoot(dialogRoot);
              import('@/components/ApiSettingsDialog').then(({ ApiSettingsDialog }) => {
                root.render(
                  <ApiSettingsDialog 
                    onOpenChange={(open) => {
                      if (!open) {
                        root.unmount();
                        document.body.removeChild(dialogRoot);
                      }
                    }} 
                  />
                );
              });
            });
          }}
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
      
      {/* Knowledge Hub Dialog - Using our enhanced KnowledgeBasePanel */}
      <Dialog open={knowledgeBaseOpen} onOpenChange={setKnowledgeBaseOpen}>
        <DialogContent className="max-w-[900px] max-h-[90vh] overflow-y-auto">
          <KnowledgeBasePanel />
        </DialogContent>
      </Dialog>
    </aside>
  );
}
