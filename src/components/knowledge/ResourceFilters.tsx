
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

interface SortOption {
  value: string;
  label: string;
}

interface ResourceFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sort: string;
  setSort: (sort: any) => void;
  sortOptions?: SortOption[];
}

export const ResourceFilters: React.FC<ResourceFiltersProps> = ({ 
  searchTerm, 
  setSearchTerm, 
  sort, 
  setSort,
  sortOptions = [
    { value: 'newest', label: 'Newest' },
    { value: 'oldest', label: 'Oldest' },
    { value: 'category', label: 'Category' }
  ]
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
      <div className="relative w-full md:w-64">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search resources..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8"
        />
      </div>
      
      <div className="w-full md:w-40">
        <Select 
          value={sort} 
          onValueChange={setSort}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
