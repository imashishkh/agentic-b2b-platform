import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { CodeEditor } from "@/components/CodeEditor";
import { toast } from "sonner";
import { AgentType } from "@/agents/AgentTypes";
import { createAgent } from "@/agents/AgentFactory";
import { EcommerceAgent } from "@/agents/EcommerceAgent";

export function AgentIntegration() {
  const [prompt, setPrompt] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [generatedCode, setGeneratedCode] = useState<string>("");
  const [language, setLanguage] = useState<string>("typescript");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  
  const handleSubmit = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Create an EcommerceAgent instance
      const agent = createAgent(AgentType.ECOMMERCE) as EcommerceAgent;
      
      // Generate response using the agent
      const agentResponse = await agent.generateResponse(prompt);
      setResponse(agentResponse);
      
      // Extract code if present in the response
      extractCodeFromResponse(agentResponse);
      
    } catch (error) {
      console.error("Error generating response:", error);
      toast.error("Failed to generate response");
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Extract code blocks from markdown response
  const extractCodeFromResponse = (responseText: string) => {
    const codeBlockRegex = /```(?:(\w+))?\s*([\s\S]*?)```/g;
    let match;
    let foundCode = false;
    
    while ((match = codeBlockRegex.exec(responseText)) !== null) {
      if (!foundCode) {
        const [, lang, code] = match;
        setGeneratedCode(code);
        setLanguage(lang || "typescript");
        foundCode = true;
      }
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>E-commerce Agent</CardTitle>
        <CardDescription>
          Ask for e-commerce code generation, architecture advice, or implementation guidance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">What would you like to build?</label>
            <Textarea
              placeholder="E.g., Generate a shopping cart component with add/remove functionality"
              rows={5}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>
          
          <Button
            onClick={handleSubmit}
            disabled={isGenerating || !prompt.trim()}
            className="w-full"
          >
            {isGenerating ? "Generating..." : "Ask E-commerce Agent"}
          </Button>
          
          {response && (
            <div className="space-y-4 pt-4 border-t">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: markdownToHtml(response) }} />
              </div>
              
              {generatedCode && (
                <CodeEditor
                  code={generatedCode}
                  language={language}
                  fileName={`generated.${getExtension(language)}`}
                />
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Convert markdown to HTML (simplified version)
function markdownToHtml(markdown: string): string {
  // This is a very simplified markdown converter
  // In a real app, you'd use a proper markdown library
  
  // Process code blocks differently - replace them with placeholders
  const codeBlocks: string[] = [];
  const withoutCode = markdown.replace(/```(?:\w+)?\s*([\s\S]*?)```/g, (match) => {
    const placeholder = `__CODE_BLOCK_${codeBlocks.length}__`;
    codeBlocks.push(match);
    return placeholder;
  });
  
  // Process basic markdown
  let html = withoutCode
    // Headers
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^#### (.*$)/gim, '<h4>$1</h4>')
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Lists
    .replace(/^\s*- (.*$)/gim, '<ul><li>$1</li></ul>')
    // Links
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    // Paragraphs
    .replace(/^\s*(\n)?([^\n]+)/gim, function(match, newline, line) {
      return '<p>' + line + '</p>';
    });
  
  // Fix nested lists
  html = html.replace(/<\/ul>\s*<ul>/g, '');
  
  // Put code blocks back
  codeBlocks.forEach((block, i) => {
    const placeholder = `__CODE_BLOCK_${i}__`;
    // Don't render code blocks in HTML - we're handling them separately with the CodeEditor
    html = html.replace(placeholder, '<div class="code-placeholder">[Code block shown below]</div>');
  });
  
  return html;
}

// Get file extension from language
function getExtension(language: string): string {
  const extensions: Record<string, string> = {
    typescript: 'ts',
    javascript: 'js',
    jsx: 'jsx',
    tsx: 'tsx',
    python: 'py',
    java: 'java',
    html: 'html',
    css: 'css',
    sql: 'sql',
    json: 'json',
  };
  
  return extensions[language.toLowerCase()] || 'txt';
}