import * as React from "react";
import { Button } from "./ui/button";
import { MessageCircle, Settings, Briefcase, LogOut, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "./auth/AuthProvider";
import { supabase } from "@/lib/supabase";
import { Avatar } from "./ui/avatar";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

interface NavItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  path: string;
}

export function Sidebar() {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  
  const mainNav: NavItem[] = [
    { 
      id: 'chat', 
      title: 'Chat', 
      icon: <MessageCircle className="w-4 h-4 mr-2" />, 
      path: '/chat'
    },
    { 
      id: 'analyzer', 
      title: 'Token Analyzer', 
      icon: <Search className="w-4 h-4 mr-2" />, 
      path: '/analyzer'
    },
    { 
      id: 'portfolio', 
      title: 'Portfolio', 
      icon: <Briefcase className="w-4 h-4 mr-2" />, 
      path: '/portfolio'
    },
    { 
      id: 'settings', 
      title: 'Settings', 
      icon: <Settings className="w-4 h-4 mr-2" />, 
      path: '/settings'
    },
  ];

  const handleSignOut = () => {
    supabase.auth.signOut();
  };

  return (
    <aside className="w-64 border-r bg-card/50 flex flex-col">
      <div className="flex-1 p-2">
        <div className="space-y-1">
          {mainNav.map((item) => (
            <Button
              key={item.id}
              variant={pathname === item.path ? "default" : "ghost"}
              className={cn(
                "w-full justify-start",
                pathname !== item.path && "hover:bg-accent"
              )}
              onClick={() => router.push(item.path)}
            >
              {item.icon}
              {item.title}
            </Button>
          ))}
        </div>
      </div>
      {user && (
        <div className="p-2 border-t">
          <div className="flex items-center gap-2 p-2">
            <Avatar className="h-8 w-8">
              <img src={user.user_metadata.avatar_url} alt={user.user_metadata.full_name} />
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.user_metadata.full_name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </aside>
  );
} 