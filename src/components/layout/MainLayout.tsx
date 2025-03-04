
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  MessageSquare,
  Settings,
  User,
  Search,
  Bell,
  HelpCircle
} from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r bg-slate-50 dark:bg-slate-950 dark:border-slate-800">
        <div className="p-6">
          <h1 className="text-2xl font-bold">B2B Platform</h1>
        </div>
        
        <nav className="flex-1 space-y-1 px-4 py-2">
          <Link to="/dashboard">
            <Button 
              variant={isActive('/dashboard') || isActive('/') ? "default" : "ghost"} 
              className="w-full justify-start"
            >
              <LayoutDashboard className="mr-2 h-5 w-5" />
              Dashboard
            </Button>
          </Link>
          
          <Link to="/products">
            <Button 
              variant={isActive('/products') ? "default" : "ghost"} 
              className="w-full justify-start"
            >
              <Package className="mr-2 h-5 w-5" />
              Products
            </Button>
          </Link>
          
          <Link to="/orders">
            <Button 
              variant="ghost" 
              className="w-full justify-start"
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Orders
            </Button>
          </Link>
          
          <Link to="/messages">
            <Button 
              variant="ghost" 
              className="w-full justify-start"
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              Messages
            </Button>
          </Link>
          
          <Link to="/settings">
            <Button 
              variant="ghost" 
              className="w-full justify-start"
            >
              <Settings className="mr-2 h-5 w-5" />
              Settings
            </Button>
          </Link>
        </nav>
        
        <div className="p-4 border-t dark:border-slate-800">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gray-200"></div>
            <div className="ml-3">
              <p className="font-medium">TechFabrics Ltd</p>
              <p className="text-xs text-gray-500">Manufacturer</p>
            </div>
          </div>
        </div>
      </aside>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b flex items-center justify-between px-6 dark:border-slate-800">
          <div className="flex items-center">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full h-9 pl-8 pr-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-800 dark:border-slate-700"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <HelpCircle className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </header>
        
        <main className="flex-1 overflow-auto p-6 bg-white dark:bg-slate-950">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
