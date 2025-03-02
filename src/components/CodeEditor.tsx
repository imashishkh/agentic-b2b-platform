import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Download, Check } from "lucide-react";
import { toast } from "sonner";

interface CodeEditorProps {
  code: string;
  language: string;
  fileName?: string;
  readOnly?: boolean;
}

export function CodeEditor({ code, language, fileName, readOnly = true }: CodeEditorProps) {
  const [copied, setCopied] = useState(false);
  
  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Code copied to clipboard");
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  
  const handleDownloadCode = () => {
    const element = document.createElement("a");
    const file = new Blob([code], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = fileName || `code-snippet.${getFileExtension(language)}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success(`Code downloaded as ${element.download}`);
  };
  
  const getFileExtension = (lang: string): string => {
    const extensions: Record<string, string> = {
      javascript: 'js',
      typescript: 'ts',
      react: 'tsx',
      jsx: 'jsx',
      tsx: 'tsx',
      html: 'html',
      css: 'css',
      python: 'py',
      java: 'java',
      sql: 'sql',
      json: 'json',
    };
    
    // Handle composite language identifiers
    if (lang.includes('/')) {
      const parts = lang.toLowerCase().split('/');
      if (parts.includes('react') && parts.includes('typescript')) {
        return 'tsx';
      }
      if (parts.includes('react')) {
        return 'jsx';
      }
    }
    
    return extensions[lang.toLowerCase()] || 'txt';
  };
  
  return (
    <Card className="w-full overflow-hidden">
      <div className="bg-muted p-2 flex justify-between items-center border-b">
        <span className="text-sm font-medium">
          {fileName || `Generated ${language} Code`}
        </span>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopyCode}
            title="Copy code"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDownloadCode}
            title="Download code"
          >
            <Download size={16} />
          </Button>
        </div>
      </div>
      <Tabs defaultValue="code" className="w-full">
        <TabsList className="px-4 bg-muted border-b">
          <TabsTrigger value="code">Code</TabsTrigger>
          <TabsTrigger value="preview" disabled={!['html', 'css', 'jsx', 'tsx'].includes(getFileExtension(language))}>
            Preview
          </TabsTrigger>
        </TabsList>
        <TabsContent value="code" className="p-0 m-0">
          <pre className="overflow-auto p-4 text-sm font-mono bg-black text-white max-h-[500px]">
            <code>{code}</code>
          </pre>
        </TabsContent>
        <TabsContent value="preview" className="p-4">
          <div className="border rounded p-4">
            <p className="text-muted-foreground text-sm">
              Preview not available for this code type.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}