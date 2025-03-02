
import React from "react";
import { Button } from "@/components/ui/button";
import { SuggestionOption } from "@/contexts/types";
import { 
  Layout, 
  BookOpen, 
  CheckCircle, 
  ListOrdered, 
  ArrowRight,
  BarChart, 
  Clock,
  Users,
  Shield,
  Code,
  FileCode,
  Database,
  Milestone,
  Calendar,
  GitBranch,
  Network,
  FileText,
  AlertTriangle,
  Tag
} from "lucide-react";
import { toast } from "sonner";

interface SuggestionBoxProps {
  title: string;
  description: string;
  options: SuggestionOption[];
  onSelect: (message: string) => void;
}

// Icon mapping to handle different icon names
const IconComponent = ({ name }: { name: string }) => {
  switch (name) {
    case "layout": return <Layout className="h-4 w-4" />;
    case "book-open": return <BookOpen className="h-4 w-4" />;
    case "check-circle": return <CheckCircle className="h-4 w-4" />;
    case "list-ordered": return <ListOrdered className="h-4 w-4" />;
    case "arrow-right": return <ArrowRight className="h-4 w-4" />;
    case "bar-chart": return <BarChart className="h-4 w-4" />;
    case "clock": return <Clock className="h-4 w-4" />;
    case "users": return <Users className="h-4 w-4" />;
    case "shield": return <Shield className="h-4 w-4" />;
    case "code": return <Code className="h-4 w-4" />;
    case "file-code": return <FileCode className="h-4 w-4" />;
    case "database": return <Database className="h-4 w-4" />;
    case "milestone": return <Milestone className="h-4 w-4" />;
    case "gantt": return <BarChart className="h-4 w-4" />; // Map to BarChart as fallback
    case "calendar": return <Calendar className="h-4 w-4" />;
    case "git-branch": return <GitBranch className="h-4 w-4" />;
    case "network": return <Network className="h-4 w-4" />;
    case "file-text": return <FileText className="h-4 w-4" />;
    case "alert-triangle": return <AlertTriangle className="h-4 w-4" />;
    case "tag": return <Tag className="h-4 w-4" />;
    default: return <ArrowRight className="h-4 w-4" />;
  }
};

export function SuggestionBox({ title, description, options, onSelect }: SuggestionBoxProps) {
  const handleSelectOption = (message: string) => {
    // Show a toast notification when an option is selected
    toast.info(`Processing: ${message.split('\n')[0]}...`);
    
    // Call the onSelect handler with the message
    onSelect(message);
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-md border border-slate-200">
      <h3 className="text-sm font-semibold mb-1 text-slate-800">{title}</h3>
      <p className="text-xs text-slate-600 mb-3">{description}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {options.map((option) => (
          <Button
            key={option.id || option.label}
            variant="outline"
            size="sm"
            className="justify-start bg-white hover:bg-slate-100 border-slate-200 transition-all text-left h-auto py-2"
            onClick={() => handleSelectOption(option.message)}
            title={option.description || option.label}
          >
            <IconComponent name={option.icon || "arrow-right"} />
            <span className="ml-2 truncate">{option.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
