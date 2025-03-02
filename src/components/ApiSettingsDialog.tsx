
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Local storage key for the API key
const API_KEY_STORAGE_KEY = "claude_api_key";

export function ApiSettingsDialog() {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState<string>(
    localStorage.getItem(API_KEY_STORAGE_KEY) || ""
  );

  const saveApiKey = () => {
    localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
    toast({
      title: "API Key Saved",
      description: "Your Claude API key has been saved successfully.",
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="mr-2" title="API Settings">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Claude API Settings</DialogTitle>
          <DialogDescription>
            Enter your Claude API key to enable enhanced AI responses
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="claude-api-key">Claude API Key</Label>
            <Input
              id="claude-api-key"
              type="password"
              placeholder="Enter your Claude API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <p className="text-xs text-gray-500">
              The API key is stored locally in your browser and never sent to our servers
            </p>
          </div>
        </div>
        <div className="flex justify-end">
          <DialogClose asChild>
            <Button variant="outline" className="mr-2">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button onClick={saveApiKey}>Save</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
