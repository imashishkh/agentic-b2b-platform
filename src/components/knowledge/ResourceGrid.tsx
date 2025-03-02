
import React from 'react';
import { KnowledgeBaseResource } from '@/contexts/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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

interface ResourceGridProps {
  resources: KnowledgeBaseResource[];
  onDelete: (id: string) => void;
  onTagClick?: (tag: string) => void;
  onOpenResource?: (url: string) => void;
}

export const ResourceGrid: React.FC<ResourceGridProps> = ({ 
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {resources.map(resource => (
        <Card key={resource.id} className="overflow-hidden hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex flex-col h-full">
              <div>
                <div className="flex justify-between items-start">
                  <h3 className="font-medium truncate mb-1">{resource.title}</h3>
                  <Badge variant="outline" className="ml-2">
                    {resource.category}
                  </Badge>
                </div>
                <p className="text-sm text-slate-600 line-clamp-2 mb-2">
                  {resource.description}
                </p>
              </div>
              
              <div className="mt-auto">
                {/* Tags */}
                {resource.tags && resource.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
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
                
                <div className="flex items-center text-xs text-slate-500 mt-2">
                  <Calendar className="h-3 w-3 mr-1" />
                  Added {formatDistanceToNow(new Date(resource.dateAdded))} ago
                </div>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="p-2 bg-slate-50 flex justify-between">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs"
              onClick={() => onOpenResource?.(resource.url)}
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Visit
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-xs text-red-500">
                  <Trash2 className="h-3 w-3 mr-1" />
                  Remove
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
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
