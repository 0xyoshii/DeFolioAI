'use client';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google'
    });
  };

  return (
    <div className="h-screen flex items-center justify-center bg-background">
      <Card className="p-8 max-w-sm w-full space-y-4">
        <h1 className="text-2xl font-bold text-center">Welcome</h1>
        <p className="text-center text-muted-foreground">Sign in to continue</p>
        <Button 
          className="w-full" 
          onClick={handleLogin}
          size="lg"
        >
          Sign in with Google
        </Button>
      </Card>
    </div>
  );
} 