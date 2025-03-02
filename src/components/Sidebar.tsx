
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useChat } from "@/contexts/ChatContext";
import { useState } from "react";
import { KnowledgeBaseDialogPanel } from "@/components/knowledge/KnowledgeBaseDialogPanel";
import { UserButton, SignInButton, SignUpButton, useUser, useAuth } from "@clerk/clerk-react";

// Define user roles
export enum UserRole {
  GUEST = "guest",
  USER = "user",
  ADMIN = "admin"
}

export function Sidebar() {
  const { clearMessages } = useChat();
  const { toast } = useToast();
  const { isSignedIn, user } = useUser();
  const { signOut } = useAuth();
  
  const [knowledgeBaseOpen, setKnowledgeBaseOpen] = useState(false);
  
  // For this demo, we'll set the role based on email domain
  // In a real app, this would come from a backend or Clerk's metadata
  const getUserRole = (): UserRole => {
    if (!isSignedIn || !user) return UserRole.GUEST;
    
    const email = user.primaryEmailAddress?.emailAddress || "";
    if (email.endsWith("admin.com")) return UserRole.ADMIN;
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
  
  const handleSignOut = async () => {
    await signOut();
    clearMessages();
    toast({
      title: "Signed out",
      description: "You have been signed out successfully.",
    });
  };
  
  return (
    <aside className="hidden md:flex h-screen w-[52px] border-r bg-background flex-col justify-between overflow-hidden hover:w-[240px] hover:p-2 transition-all group">
      <div className="flex flex-col items-center group-hover:items-start space-y-2">
        {isSignedIn && (
          <div className="flex items-center justify-center group-hover:justify-start w-full py-2">
            <UserButton afterSignOutUrl="/" />
            <span className="hidden group-hover:inline-flex ml-2 text-sm font-medium">
              {user?.fullName || user?.username}
              {userRole === UserRole.ADMIN && (
                <span className="ml-1 text-xs bg-blue-100 text-blue-800 px-1 rounded">Admin</span>
              )}
            </span>
          </div>
        )}
        
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
        
        {isSignedIn ? (
          <Button
            variant="ghost"
            size="icon"
            className="group-hover:w-full group-hover:justify-start h-9 group-hover:px-2 group-hover:py-2 text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={handleSignOut}
          >
            <LogOut className="h-5 w-5 group-hover:mr-2" />
            <span className="hidden group-hover:inline-flex">Sign Out</span>
          </Button>
        ) : (
          <div className="flex flex-col items-center group-hover:items-start space-y-1 w-full">
            <SignInButton mode="modal">
              <Button
                variant="ghost"
                size="icon"
                className="group-hover:w-full group-hover:justify-start h-9 group-hover:px-2 group-hover:py-2 text-blue-500 hover:text-blue-600 hover:bg-blue-50"
              >
                <LogIn className="h-5 w-5 group-hover:mr-2" />
                <span className="hidden group-hover:inline-flex">Sign In</span>
              </Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button
                variant="ghost"
                size="icon"
                className="group-hover:w-full group-hover:justify-start h-9 group-hover:px-2 group-hover:py-2 text-green-500 hover:text-green-600 hover:bg-green-50"
              >
                <UserPlus className="h-5 w-5 group-hover:mr-2" />
                <span className="hidden group-hover:inline-flex">Sign Up</span>
              </Button>
            </SignUpButton>
          </div>
        )}
      </div>
      
      {/* Knowledge Base Dialog */}
      <KnowledgeBaseDialogPanel 
        open={knowledgeBaseOpen} 
        onOpenChange={setKnowledgeBaseOpen} 
      />
    </aside>
  );
}
