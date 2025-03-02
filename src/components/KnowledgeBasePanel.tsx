
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { KnowledgeResourcesList } from "@/components/knowledge/KnowledgeResourcesList";
import { useChat } from "@/contexts/ChatContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { EnhancedKnowledgeBase } from "./knowledge/EnhancedKnowledgeBase";

export function KnowledgeBasePanel() {
  const { knowledgeBase, addKnowledgeResource } = useChat();
  const [resourceUrl, setResourceUrl] = useState("");
  const [resourceTitle, setResourceTitle] = useState("");
  const [resourceType, setResourceType] = useState("documentation");

  const handleAddResource = () => {
    if (resourceUrl && resourceTitle) {
      addKnowledgeResource({
        id: crypto.randomUUID(),
        title: resourceTitle,
        url: resourceUrl,
        category: resourceType,
        description: "",
        dateAdded: new Date(),
        tags: [],
        priority: "medium",
        isIndexed: false
      });
      setResourceUrl("");
      setResourceTitle("");
    }
  };

  return (
    <Card className="h-full overflow-hidden flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex justify-between items-center">
          Knowledge Base
        </CardTitle>
        <CardDescription>
          Add external resources to enhance the AI's knowledge
        </CardDescription>
      </CardHeader>
      <Tabs defaultValue="resources" className="flex-1 overflow-hidden flex flex-col">
        <TabsList className="px-6">
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="enhance">Enhanced View</TabsTrigger>
        </TabsList>
        <TabsContent value="resources" className="flex-1 overflow-hidden flex flex-col">
          <CardContent className="pt-3 flex-1 overflow-hidden flex flex-col">
            <div className="space-y-2 mb-4">
              <Input
                placeholder="Resource Title"
                value={resourceTitle}
                onChange={(e) => setResourceTitle(e.target.value)}
              />
              <Input
                placeholder="URL (https://...)"
                value={resourceUrl}
                onChange={(e) => setResourceUrl(e.target.value)}
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  className="w-auto flex items-center gap-1 flex-1"
                  onClick={handleAddResource}
                >
                  <Plus className="h-4 w-4" /> Add Resource
                </Button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto pr-2">
              {/* Pass the knowledgeBase as resources prop to KnowledgeResourcesList */}
              <KnowledgeResourcesList resources={knowledgeBase} />
            </div>
          </CardContent>
        </TabsContent>
        <TabsContent value="enhance" className="flex-1 overflow-auto">
          <EnhancedKnowledgeBase />
        </TabsContent>
      </Tabs>
    </Card>
  );
}
