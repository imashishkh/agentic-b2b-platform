
import React from 'react';
import { KnowledgeBaseResource } from '@/contexts/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Trash2, Calendar, Tag } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ResourceListProps {
  resources: KnowledgeBaseResource[];
  onDelete: (id: string) => void;
  onTagClick?: (tag: string) => void;
  onOpenResource?: (url: string) => void;
}

export const ResourceList: React.FC<ResourceListProps> = ({ 
  resources, 
  onDelete,
  onTagClick,
  onOpenResource
}) => {
  if (resources.length === 0) {
    return (
      <div className="text-center py-10 text-slate-500">
        <p>No resources found.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-2">
      {resources.map(resource => (
        <div 
          key={resource.id} 
          className="border rounded-md p-3 hover:bg-slate-50 transition-colors group"
        >
          <div className="flex justify-between">
            <div>
              <h3 className="font-medium">{resource.title}</h3>
              <p className="text-sm text-slate-600 mt-1">{resource.description}</p>
              
              <div className="flex flex-wrap mt-2 space-x-2">
                <Badge variant="outline">{resource.category}</Badge>
                
                {resource.tags && resource.tags.length > 0 && (
                  <div className="flex items-center space-x-1">
                    <span className="text-xs text-slate-500 flex items-center">
                      <Tag className="h-3 w-3 mr-1" />
                    </span>
                    {resource.tags.map(tag => (
                      <Badge 
                        key={tag} 
                        variant="secondary" 
                        className="text-xs cursor-pointer hover:bg-secondary/80"
                        onClick={() => onTagClick?.(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex items-center text-xs text-slate-500 mt-2">
                <Calendar className="h-3 w-3 mr-1" />
                Added {formatDistanceToNow(new Date(resource.dateAdded))} ago
              </div>
            </div>
            
            <div className="flex space-x-1">
              <Button 
                variant="outline" 
                size="sm" 
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => onOpenResource?.(resource.url)}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete this resource from your knowledge base.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onDelete(resource.id)}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
