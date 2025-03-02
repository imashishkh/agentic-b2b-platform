
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Key, Check, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";

// Local storage key for the API key
const API_KEY_STORAGE_KEY = "claude_api_key";

export function ApiSettingsDialog() {
  const { toast: uiToast } = useToast();
  const [apiKey, setApiKey] = useState<string>(
    localStorage.getItem(API_KEY_STORAGE_KEY) || ""
  );
  const [open, setOpen] = useState(false);

  const saveApiKey = () => {
    localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
    toast.success("Claude API key saved successfully", {
      description: "Your API key has been securely stored in your browser."
    });
    setOpen(false);
  };

  const validateAndSave = () => {
    if (!apiKey || apiKey.trim() === "") {
      toast.error("API Key Required", {
        description: "Please enter a valid Claude API key"
      });
      return;
    }
    
    if (apiKey.length < 20) {
      toast.warning("API Key Validation", {
        description: "The API key appears to be too short. Please check it and try again."
      });
      return;
    }
    
    saveApiKey();
  };

  const clearApiKey = () => {
    setApiKey("");
    localStorage.removeItem(API_KEY_STORAGE_KEY);
    toast.info("API Key Removed", {
      description: "Your Claude API key has been removed from local storage."
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700" title="API Settings">
          <Settings className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Claude API Settings
          </DialogTitle>
          <DialogDescription>
            Enter your Claude API key to enable enhanced AI responses with Claude's capabilities
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
              className="font-mono"
            />
            <div className="flex items-start mt-2 text-xs text-amber-600 bg-amber-50 p-2 rounded border border-amber-200">
              <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
              <p>
                Your API key is stored locally in your browser and never sent to our servers. 
                Using your own API key ensures that your conversations are private and secure.
              </p>
            </div>
          </div>
        </div>
        <DialogFooter className="flex justify-between sm:justify-between">
          <Button 
            variant="outline" 
            onClick={clearApiKey}
            className="text-destructive hover:text-destructive"
          >
            Clear Key
          </Button>
          <div className="flex gap-2">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={validateAndSave} className="gap-1">
              <Check className="h-4 w-4" />
              Save
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
