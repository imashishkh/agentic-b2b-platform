
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Key, Check, AlertCircle, Info } from "lucide-react";
import { toast } from "sonner";

// Local storage key for the API key
const API_KEY_STORAGE_KEY = "claude_api_key";

interface ApiSettingsDialogProps {
  onOpenChange: (open: boolean) => void;
}

export function ApiSettingsDialog({ onOpenChange }: ApiSettingsDialogProps) {
  const [apiKey, setApiKey] = useState<string>(
    localStorage.getItem(API_KEY_STORAGE_KEY) || ""
  );
  const [validationMessage, setValidationMessage] = useState<string>("");

  // Check if API key is set on mount and show a notification if not
  useEffect(() => {
    const savedKey = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (!savedKey) {
      // Only show this once when the component mounts
      const hasShownNotification = sessionStorage.getItem("api_key_notification_shown");
      if (!hasShownNotification) {
        setTimeout(() => {
          toast.info("Claude API Key Not Set", {
            description: "Set your Claude API key in settings for enhanced AI responses.",
            duration: 6000,
            action: {
              label: "Settings",
              onClick: () => onOpenChange(true)
            }
          });
          sessionStorage.setItem("api_key_notification_shown", "true");
        }, 3000); // Show after 3 seconds
      }
    }
  }, [onOpenChange]);

  const saveApiKey = () => {
    localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
    toast.success("Claude API key saved successfully", {
      description: "Your API key has been securely stored in your browser."
    });
    onOpenChange(false);
  };

  const validateApiKey = (key: string) => {
    if (!key || key.trim() === "") {
      setValidationMessage("Please enter a valid Claude API key");
      return false;
    }
    
    if (!key.startsWith("sk-")) {
      setValidationMessage("Claude API keys typically start with 'sk-'");
      return false;
    }
    
    if (key.length < 20) {
      setValidationMessage("The API key appears to be too short");
      return false;
    }
    
    setValidationMessage("");
    return true;
  };

  const validateAndSave = () => {
    if (validateApiKey(apiKey)) {
      saveApiKey();
    } else {
      toast.warning("API Key Validation", {
        description: validationMessage || "Please check your API key and try again."
      });
    }
  };

  const clearApiKey = () => {
    setApiKey("");
    localStorage.removeItem(API_KEY_STORAGE_KEY);
    toast.info("API Key Removed", {
      description: "Your Claude API key has been removed from local storage."
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={true} onOpenChange={onOpenChange}>
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
              onChange={(e) => {
                setApiKey(e.target.value);
                validateApiKey(e.target.value);
              }}
              className="font-mono"
            />
            {validationMessage && (
              <div className="flex items-start mt-2 text-xs text-red-600 bg-red-50 p-2 rounded border border-red-200">
                <Info className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
                <p>{validationMessage}</p>
              </div>
            )}
            <div className="flex items-start mt-2 text-xs text-amber-600 bg-amber-50 p-2 rounded border border-amber-200">
              <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
              <p>
                Your API key is stored locally in your browser and never sent to our servers. 
                Using your own API key ensures that your conversations are private and secure.
              </p>
            </div>
            <div className="flex items-start mt-2 text-xs text-blue-600 bg-blue-50 p-2 rounded border border-blue-200">
              <Info className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
              <p>
                To get a Claude API key, visit the <a href="https://console.anthropic.com/" target="_blank" rel="noopener noreferrer" className="underline">Anthropic Console</a> and create an account.
                New users typically receive free credits to get started.
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
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
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
