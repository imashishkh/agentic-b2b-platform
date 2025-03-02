
import React, { useState } from 'react';
import { 
  extractRequirements, 
  extractTasksWithDependencies, 
  generateDependencyGraph,
  ExtractedTask
} from '@/utils/markdownParser';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, ArrowRightCircle } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface RequirementAnalyzerProps {
  markdownContent: string;
  onTasksGenerated: (tasks: ExtractedTask[], dependencyGraph: any) => void;
}

export function RequirementAnalyzer({ markdownContent, onTasksGenerated }: RequirementAnalyzerProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [extractedRequirements, setExtractedRequirements] = useState<string[]>([]);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  
  const handleAnalyzeRequirements = async () => {
    if (!markdownContent || markdownContent.trim() === '') {
      toast.error('No content to analyze. Please upload a requirements document first.');
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      // Extract requirements
      const requirements = extractRequirements(markdownContent);
      setExtractedRequirements(requirements);
      
      // Extract tasks with dependencies
      const tasks = extractTasksWithDependencies(markdownContent);
      
      // Generate dependency graph
      const dependencyGraph = generateDependencyGraph(tasks);
      
      // Notify parent component
      onTasksGenerated(tasks, dependencyGraph);
      
      // Update state
      setHasAnalyzed(true);
      
      toast.success(`Analyzed ${requirements.length} requirements and generated ${tasks.length} tasks`);
    } catch (error) {
      console.error('Error analyzing requirements:', error);
      toast.error('Failed to analyze requirements. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  return (
    <Card className="bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Requirements Analyzer</CardTitle>
      </CardHeader>
      <CardContent>
        {markdownContent ? (
          <>
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-2">
                This tool will analyze your requirements document and extract tasks, dependencies, and priorities.
              </p>
              
              {hasAnalyzed && extractedRequirements.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">Extracted Requirements ({extractedRequirements.length})</h3>
                  <div className="bg-slate-50 p-3 rounded-md max-h-40 overflow-y-auto">
                    {extractedRequirements.map((req, index) => (
                      <div key={index} className="flex items-start gap-2 mb-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                        <p className="text-sm text-slate-700">{req}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {hasAnalyzed && (
                <div className="mt-4">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                    <p className="text-sm text-slate-700">
                      Tasks have been generated and are now available in the project timeline.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-6">
            <div className="bg-slate-50 p-4 rounded-lg text-center">
              <AlertCircle className="h-6 w-6 text-amber-500 mx-auto mb-2" />
              <p className="text-sm text-slate-700">No requirements document loaded.</p>
              <p className="text-xs text-slate-500 mt-1">
                Upload a markdown document to analyze requirements.
              </p>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button
          variant={hasAnalyzed ? "outline" : "default"}
          size="sm"
          onClick={handleAnalyzeRequirements}
          disabled={isAnalyzing || !markdownContent}
        >
          {isAnalyzing ? (
            <>Analyzing...</>
          ) : hasAnalyzed ? (
            <>Re-analyze Requirements</>
          ) : (
            <>Analyze Requirements</>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
