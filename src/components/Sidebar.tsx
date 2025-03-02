
import React, { useState } from "react";
import { useChat } from "@/contexts/ChatContext";
import { SayHaloLogo } from "./SayHaloLogo";
import { Book, BookOpen, List, LayoutDashboard, Zap, Users, Settings, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { KnowledgeBasePanel } from "./KnowledgeBasePanel";
import { useMobile } from "@/hooks/use-mobile";

/**
 * Props for the sidebar component
 */
interface SidebarProps {
  className?: string;
}

/**
 * Enum for different sidebar tabs
 */
enum SidebarTab {
  CHAT = "chat",
  KNOWLEDGE_BASE = "knowledge-base",
  PROJECT = "project"
}

/**
 * Sidebar component for navigation and additional functionality
 */
export function Sidebar({ className }: SidebarProps) {
  const { knowledgeBase } = useChat();
  const isMobile = useMobile();
  const [activeTab, setActiveTab] = useState<SidebarTab>(SidebarTab.CHAT);
  const [isOpen, setIsOpen] = useState(!isMobile);

  const renderTabContent = () => {
    switch (activeTab) {
      case SidebarTab.KNOWLEDGE_BASE:
        return <KnowledgeBasePanel />;
      case SidebarTab.PROJECT:
        return (
          <div className="p-4">
            <h2 className="font-semibold mb-2">Project Structure</h2>
            <p className="text-sm text-gray-500">Coming soon...</p>
          </div>
        );
      default:
        return null;
    }
  };

  // Mobile sidebar uses Sheet component
  if (isMobile) {
    return (
      <>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50">
              <Menu size={20} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 max-w-[280px]">
            <SidebarContent 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
              knowledgeBaseCount={knowledgeBase.length}
            />
            {renderTabContent()}
          </SheetContent>
        </Sheet>
      </>
    );
  }

  // Desktop sidebar
  return (
    <div className={cn(
      "h-screen transition-all duration-300 border-r bg-white overflow-hidden",
      isOpen ? "w-[280px]" : "w-[70px]",
      className
    )}>
      <div className="flex flex-col h-full">
        <SidebarContent 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          isCollapsed={!isOpen}
          toggleCollapse={() => setIsOpen(!isOpen)}
          knowledgeBaseCount={knowledgeBase.length}
        />
        
        {isOpen && renderTabContent()}
      </div>
    </div>
  );
}

/**
 * Props for the sidebar content component
 */
interface SidebarContentProps {
  activeTab: SidebarTab;
  setActiveTab: (tab: SidebarTab) => void;
  isCollapsed?: boolean;
  toggleCollapse?: () => void;
  knowledgeBaseCount: number;
}

/**
 * Sidebar content with navigation items
 */
function SidebarContent({ 
  activeTab, 
  setActiveTab, 
  isCollapsed = false,
  toggleCollapse,
  knowledgeBaseCount
}: SidebarContentProps) {
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <SayHaloLogo size={isCollapsed ? 24 : 20} />
          {!isCollapsed && <span className="font-semibold text-sayhalo-dark">DevManager</span>}
        </div>
        
        {toggleCollapse && (
          <button 
            onClick={toggleCollapse} 
            className="text-gray-500 hover:text-gray-700"
          >
            {isCollapsed ? <Menu size={18} /> : <X size={18} />}
          </button>
        )}
      </div>
      
      <div className="flex flex-col gap-1 p-2">
        <SidebarItem
          icon={<Zap size={isCollapsed ? 20 : 18} />}
          label="Chat"
          isActive={activeTab === SidebarTab.CHAT}
          onClick={() => setActiveTab(SidebarTab.CHAT)}
          isCollapsed={isCollapsed}
        />
        
        <SidebarItem
          icon={<BookOpen size={isCollapsed ? 20 : 18} />}
          label="Knowledge Base"
          isActive={activeTab === SidebarTab.KNOWLEDGE_BASE}
          onClick={() => setActiveTab(SidebarTab.KNOWLEDGE_BASE)}
          isCollapsed={isCollapsed}
          badge={knowledgeBaseCount > 0 ? knowledgeBaseCount.toString() : undefined}
        />
        
        <SidebarItem
          icon={<LayoutDashboard size={isCollapsed ? 20 : 18} />}
          label="Project"
          isActive={activeTab === SidebarTab.PROJECT}
          onClick={() => setActiveTab(SidebarTab.PROJECT)}
          isCollapsed={isCollapsed}
        />
      </div>
    </div>
  );
}

/**
 * Props for individual sidebar item
 */
interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
  isCollapsed?: boolean;
  badge?: string;
}

/**
 * Individual sidebar navigation item
 */
function SidebarItem({ icon, label, isActive, onClick, isCollapsed = false, badge }: SidebarItemProps) {
  return (
    <button
      className={cn(
        "flex items-center gap-3 py-2 px-3 rounded-md transition-colors",
        isActive 
          ? "bg-sayhalo-coral/10 text-sayhalo-coral" 
          : "text-gray-700 hover:bg-gray-100"
      )}
      onClick={onClick}
    >
      <div className={cn(
        "flex items-center justify-center",
        isCollapsed && "mx-auto"
      )}>
        {icon}
      </div>
      
      {!isCollapsed && (
        <div className="flex items-center justify-between flex-1">
          <span>{label}</span>
          {badge && (
            <span className="bg-sayhalo-coral text-white text-xs px-2 py-0.5 rounded-full">
              {badge}
            </span>
          )}
        </div>
      )}
      
      {isCollapsed && badge && (
        <span className="absolute top-0 right-0 bg-sayhalo-coral text-white text-xs px-1.5 rounded-full">
          {badge}
        </span>
      )}
    </button>
  );
}
