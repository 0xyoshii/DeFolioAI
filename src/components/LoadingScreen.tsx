'use client';

import { Card } from "./ui/card";

export function LoadingScreen() {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-background">
      <Card className="p-8 flex flex-col items-center bg-card/50 border-none">
        <p className="text-sm text-muted-foreground animate-pulse mb-4">
          Loading...
        </p>
        <div className="flex justify-center w-full gap-2">
          <div className="w-3 h-3 rounded-full bg-primary animate-bounce" />
          <div className="w-3 h-3 rounded-full bg-primary animate-bounce" />
          <div className="w-3 h-3 rounded-full bg-primary animate-bounce" />
        </div>
      </Card>
    </div>
  );
} 