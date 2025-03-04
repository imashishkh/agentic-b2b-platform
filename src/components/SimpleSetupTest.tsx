import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function SimpleSetupTest() {
  return (
    <div className="w-full max-w-3xl mx-auto py-6 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Simple Setup Test</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center space-x-4">
            <Button>Upload File</Button>
            <Button>Connect GitHub</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}