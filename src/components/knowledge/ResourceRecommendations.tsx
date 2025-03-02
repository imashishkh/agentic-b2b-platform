
import React from 'react';
import { KnowledgeBaseResource } from "@/contexts/types";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bookmark, ExternalLink } from "lucide-react";
import { findRelevantResources, trackResourceUsage } from "@/utils/knowledgeRelevance";

interface ResourceRecommendationsProps {
  knowledgeBase: KnowledgeBaseResource[];
  contextQuery: string;
  onOpenResource: (url: string) => void;
  onResourceUsed?: (resource: KnowledgeBaseResource) => void;
}

export const ResourceRecommendations: React.FC<ResourceRecommendationsProps> = ({
  knowledgeBase,
  contextQuery,
  onOpenResource,
  onResourceUsed
}) => {
  if (!contextQuery || !knowledgeBase.length) {
    return null;
  }
  
  const relevantResources = findRelevantResources(knowledgeBase, contextQuery, 3);
  
  if (relevantResources.length === 0) {
    return null;
  }
  
  const handleResourceUsed = (resource: KnowledgeBaseResource) => {
    const updatedResource = trackResourceUsage(resource);
    if (onResourceUsed) {
      onResourceUsed(updatedResource);
    }
  };
  
  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center">
          <Bookmark className="h-4 w-4 mr-2" />
          Relevant Knowledge Resources
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          {relevantResources.map(resource => (
            <div key={resource.id} className="p-2 border rounded-md bg-slate-50">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-sm">{resource.title}</h4>
                  <p className="text-xs text-slate-500 line-clamp-2">{resource.description}</p>
                </div>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-7"
                  onClick={() => {
                    onOpenResource(resource.url);
                    handleResourceUsed(resource);
                  }}
                >
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-1 mt-1">
                <Badge variant="outline" className="text-xs px-1 h-5">
                  {resource.category}
                </Badge>
                {resource.tags?.slice(0, 2).map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs px-1 h-5">
                    {tag}
                  </Badge>
                ))}
                {(resource.tags?.length || 0) > 2 && (
                  <Badge variant="secondary" className="text-xs px-1 h-5">
                    +{(resource.tags?.length || 0) - 2} more
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <p className="text-xs text-slate-500">Resources suggested based on current context</p>
      </CardFooter>
    </Card>
  );
};
