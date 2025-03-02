
import React from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, ArrowUpDown } from "lucide-react";

interface ResourceFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sort: 'newest' | 'oldest' | 'category';
  setSort: (sort: 'newest' | 'oldest' | 'category') => void;
}

export const ResourceFilters: React.FC<ResourceFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  sort,
  setSort
}) => {
  return (
    <div className="flex space-x-2">
      <div className="relative flex-1">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search resources..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <Select 
        value={sort} 
        onValueChange={(value: 'newest' | 'oldest' | 'category') => setSort(value)}
      >
        <SelectTrigger className="w-[180px]">
          <div className="flex items-center">
            <ArrowUpDown className="mr-2 h-4 w-4" />
            <span>Sort By</span>
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest First</SelectItem>
          <SelectItem value="oldest">Oldest First</SelectItem>
          <SelectItem value="category">By Category</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
