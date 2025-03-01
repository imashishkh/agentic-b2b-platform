
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings } from "lucide-react";
import { toast } from "sonner";

interface ApiSettingsProps {
  onClose: () => void;
}

export function ApiSettings({ onClose }: ApiSettingsProps) {
  const [claudeApiKey, setClaudeApiKey] = useState("");
  const [searchApiKey, setSearchApiKey] = useState("");
  const [open, setOpen] = useState(false);

  // Load keys from localStorage on component mount
  useEffect(() => {
    const savedClaudeKey = localStorage.getItem("claudeApiKey");
    const savedSearchKey = localStorage.getItem("searchApiKey");
    
    if (savedClaudeKey) setClaudeApiKey(savedClaudeKey);
    if (savedSearchKey) setSearchApiKey(savedSearchKey);
  }, []);

  const saveApiKeys = () => {
    // Save keys to localStorage
    if (claudeApiKey) {
      localStorage.setItem("claudeApiKey", claudeApiKey);
    }
    
    if (searchApiKey) {
      localStorage.setItem("searchApiKey", searchApiKey);
    }
    
    toast.success("API keys saved successfully");
    setOpen(false);
    onClose();
  };

  const clearApiKeys = () => {
    // Clear keys from localStorage
    localStorage.removeItem("claudeApiKey");
    localStorage.removeItem("searchApiKey");
    
    // Clear state
    setClaudeApiKey("");
    setSearchApiKey("");
    
    toast.success("API keys cleared");
    setOpen(false);
    onClose();
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          <Settings className="h-4 w-4" />
          <span className="sr-only">Settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>API Settings</DialogTitle>
          <DialogDescription>
            Enter your API keys for Claude and search services.
            Keys are stored locally in your browser.
          </DialogDescription>
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
