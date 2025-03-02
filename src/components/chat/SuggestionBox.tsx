
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
  Database
} from "lucide-react";

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
    default: return <ArrowRight className="h-4 w-4" />;
  }
};

export function SuggestionBox({ title, description, options, onSelect }: SuggestionBoxProps) {
  return (
    <div className="bg-slate-50 rounded-lg p-4 mb-4 shadow-sm border border-slate-100">
      <h3 className="text-sm font-semibold mb-1 text-slate-800">{title}</h3>
      <p className="text-sm text-slate-600 mb-3">{description}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {options.map((option) => (
          <Button
            key={option.id}
            variant="outline"
            size="sm"
            className="justify-start bg-white hover:bg-slate-100 border-slate-200 transition-all"
            onClick={() => onSelect(option.message)}
            title={option.description || option.label}
          >
            <IconComponent name={option.icon} />
            <span className="ml-2 truncate">{option.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
