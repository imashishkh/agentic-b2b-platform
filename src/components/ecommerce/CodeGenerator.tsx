import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CodeEditor } from "@/components/CodeEditor";
import { toast } from "sonner";
import { generateCode, generateEcommerceComponent, generateDatabaseSchema } from "@/utils/aiServices";
import { githubService } from "@/services/GitHubService";

interface CodeGeneratorProps {
  repoOwner?: string;
  repoName?: string;
}

export function CodeGenerator({ repoOwner, repoName }: CodeGeneratorProps) {
  const [codeType, setCodeType] = useState<string>("component");
  const [language, setLanguage] = useState<string>("typescript/react");
  const [prompt, setPrompt] = useState<string>("");
  const [requirements, setRequirements] = useState<string>("");
  const [generatedCode, setGeneratedCode] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>("");
  
  const handleGenerateCode = async () => {
    if (!prompt) {
      toast.error("Please enter a prompt");
      return;
    }
    
    setIsGenerating(true);
    
    try {
      let code = "";
      
      if (codeType === "component") {
        const componentType = prompt.split(" ")[0] || "Product";
        code = await generateEcommerceComponent(
          componentType,
          requirements || prompt,
          language.includes("react") ? "React with Tailwind CSS" : language
        );
      } else if (codeType === "database") {
        const entityType = prompt.split(" ")[0] || "Product";
        code = await generateDatabaseSchema(
          entityType,
          requirements || prompt,
          language
        );
      } else {
        code = await generateCode(
          prompt,
          language,
          codeType,
          requirements
        );
      }
      
      setGeneratedCode(code);
      
      // Generate a default file name if not provided
      if (!fileName) {
        let extension = ".js";
        
        if (language.includes("typescript")) {
          extension = ".ts";
        }
        if (language.includes("react")) {
          extension = language.includes("typescript") ? ".tsx" : ".jsx";
        }
        if (language === "python") {
          extension = ".py";
        }
        if (language === "java") {
          extension = ".java";
        }
        if (language === "sql" || language === "postgresql" || language === "mysql") {
          extension = ".sql";
        }
        
        // Generate a file name based on the prompt
        const baseName = prompt.split(" ")
          .filter(word => word.length > 2)
          .map((word, index) => 
            index === 0 
              ? word.charAt(0).toLowerCase() + word.slice(1) 
              : word.charAt(0).toUpperCase() + word.slice(1)
          )
          .join("")
          .replace(/[^a-zA-Z0-9]/g, "");
        
        setFileName(baseName + extension);
      }
      
      toast.success("Code generated successfully");
      
    } catch (error) {
      console.error("Error generating code:", error);
      toast.error(error instanceof Error ? error.message : "Failed to generate code");
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleSaveToGitHub = async () => {
    if (!generatedCode) {
      toast.error("No code to save");
      return;
    }
    
    if (!repoOwner || !repoName) {
      toast.error("No GitHub repository selected");
      return;
    }
    
    if (!fileName) {
      toast.error("Please enter a file name");
      return;
    }
    
    try {
      const filePath = fileName.startsWith("/") ? fileName.slice(1) : fileName;
      const commitMessage = `Add ${codeType}: ${filePath}`;
      
      const success = await githubService.addGeneratedCode(
        repoOwner,
        repoName,
        filePath,
        generatedCode,
        commitMessage
      );
      
      if (success) {
        toast.success(`Saved to ${repoOwner}/${repoName}/${filePath}`);
      }
    } catch (error) {
      console.error("Error saving to GitHub:", error);
      toast.error(error instanceof Error ? error.message : "Failed to save to GitHub");
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>E-commerce Code Generator</CardTitle>
        <CardDescription>
          Generate code for your e-commerce project
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="generate" className="w-full">
          <TabsList>
            <TabsTrigger value="generate">Generate Code</TabsTrigger>
            <TabsTrigger value="result" disabled={!generatedCode}>
              Result
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="generate" className="space-y-4">
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Code Type</label>
                  <Select 
                    value={codeType} 
                    onValueChange={setCodeType}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select code type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="component">UI Component</SelectItem>
                      <SelectItem value="hook">React Hook</SelectItem>
                      <SelectItem value="api">API Endpoint</SelectItem>
                      <SelectItem value="database">Database Schema</SelectItem>
                      <SelectItem value="utility">Utility Function</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Language</label>
                  <Select 
                    value={language} 
                    onValueChange={setLanguage}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="typescript/react">TypeScript + React</SelectItem>
                      <SelectItem value="javascript/react">JavaScript + React</SelectItem>
                      <SelectItem value="typescript">TypeScript</SelectItem>
                      <SelectItem value="javascript">JavaScript</SelectItem>
                      <SelectItem value="python">Python</SelectItem>
                      <SelectItem value="java">Java</SelectItem>
                      <SelectItem value="postgresql">PostgreSQL</SelectItem>
                      <SelectItem value="mongodb">MongoDB</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Brief Description</label>
                <Input
                  placeholder={`e.g., "Product card component with add to cart button"`}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Detailed Requirements (Optional)</label>
                <Textarea
                  placeholder="Enter specific requirements, features, or functionality..."
                  rows={5}
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">File Name (Optional)</label>
                <Input
                  placeholder="e.g., src/components/ProductCard.tsx"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                />
              </div>
              
              <Button
                onClick={handleGenerateCode}
                disabled={isGenerating || !prompt}
                className="w-full"
              >
                {isGenerating ? "Generating..." : "Generate Code"}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="result">
            {generatedCode && (
              <div className="space-y-4">
                <CodeEditor
                  code={generatedCode}
                  language={language}
                  fileName={fileName}
                />
                
                {repoOwner && repoName && (
                  <Button
                    onClick={handleSaveToGitHub}
                    className="w-full"
                  >
                    Save to GitHub Repository
                  </Button>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}