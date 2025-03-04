
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { X } from "lucide-react";

interface ApiSettingsProps {
  onClose: () => void;
}

export function ApiSettings({ onClose }: ApiSettingsProps) {
  const [claudeApiKey, setClaudeApiKey] = useState("");
  const [searchApiKey, setSearchApiKey] = useState("");
  const [open, setOpen] = useState(true);

  // Load keys from localStorage on component mount
  useEffect(() => {
    const savedClaudeKey = localStorage.getItem("claude_api_key") || localStorage.getItem("claudeApiKey");
    const savedSearchKey = localStorage.getItem("searchApiKey");
    
    if (savedClaudeKey) setClaudeApiKey(savedClaudeKey);
    if (savedSearchKey) setSearchApiKey(savedSearchKey);
  }, []);

  const saveApiKeys = () => {
    // Save keys to localStorage
    if (claudeApiKey) {
      localStorage.setItem("claude_api_key", claudeApiKey);
      // Maintain backward compatibility
      localStorage.setItem("claudeApiKey", claudeApiKey);
    }
    
    if (searchApiKey) {
      localStorage.setItem("searchApiKey", searchApiKey);
    }
    
    toast.success("API keys saved successfully");
    handleClose();
  };

  const clearApiKeys = () => {
    // Clear keys from localStorage
    localStorage.removeItem("claude_api_key");
    localStorage.removeItem("claudeApiKey");
    localStorage.removeItem("searchApiKey");
    
    // Clear state
    setClaudeApiKey("");
    setSearchApiKey("");
    
    toast.success("API keys cleared");
    handleClose();
  };

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      setOpen(newOpen);
      if (!newOpen) onClose();
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>API Settings</DialogTitle>
          <DialogDescription>
            Enter your API keys for Claude and search services.
            Keys are stored locally in your browser.
          </DialogDescription>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleClose}
            className="absolute right-4 top-4"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="claude-api" className="text-right">
              Claude API Key
            </Label>
            <Input
              id="claude-api"
              type="password"
              value={claudeApiKey}
              onChange={(e) => setClaudeApiKey(e.target.value)}
              className="col-span-3"
              placeholder="Enter Claude API key"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="search-api" className="text-right">
              Search API Key
            </Label>
            <Input
              id="search-api"
              type="password"
              value={searchApiKey}
              onChange={(e) => setSearchApiKey(e.target.value)}
              className="col-span-3"
              placeholder="Enter Search API key"
            />
          </div>
        </div>
        <DialogFooter className="flex justify-between">
          <Button variant="destructive" onClick={clearApiKeys}>
            Clear Keys
          </Button>
          <Button onClick={saveApiKeys}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
