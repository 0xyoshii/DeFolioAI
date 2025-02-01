'use client';

import { useAuth } from '@/components/auth/AuthProvider';
import { Card } from '@/components/ui/card';
import { Sidebar } from '@/components/Sidebar';
import { LoadingScreen } from '@/components/LoadingScreen';
import LoginPage from '@/components/auth/LoginPage';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { createUserWallet } from '@/lib/user';
import { Wallet, User, Mail, LogOut, UserCircle } from 'lucide-react';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { PageLayout } from '@/components/PageLayout';

export default function SettingsPage() {
  const { user, loading } = useAuth();
  const [hasWallet, setHasWallet] = useState<boolean | null>(null);
  const [isCreatingWallet, setIsCreatingWallet] = useState(false);

  useEffect(() => {
    async function checkWallet() {
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('wallet_data')
          .eq('id', user.id)
          .single();
        
        setHasWallet(!!profile?.wallet_data);
      }
    }

    checkWallet();
  }, [user]);

  const handleCreateWallet = async () => {
    try {
      setIsCreatingWallet(true);
      await createUserWallet();
      setHasWallet(true);
    } catch (error) {
      console.error('Failed to create wallet:', error);
    } finally {
      setIsCreatingWallet(false);
    }
  };

  const handleSignOut = () => {
    supabase.auth.signOut();
  };

  const renderContent = () => {
    if (loading || hasWallet === null) {
      return (
        <div className="flex-1 flex items-center justify-center">
          <LoadingScreen />
        </div>
      );
    }

    if (!user) {
      return <LoginPage />;
    }

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="p-6">
          <div className="flex items-start space-x-4">
            {user.user_metadata.avatar_url ? (
              <div className="relative w-20 h-20 rounded-full overflow-hidden bg-muted">
                <Image
                  src={user.user_metadata.avatar_url}
                  alt={user.user_metadata.full_name}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                <UserCircle className="w-12 h-12 text-muted-foreground" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <h2 className="text-xl font-semibold">{user.user_metadata.full_name}</h2>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <p>{user.email}</p>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Wallet className="w-4 h-4 text-muted-foreground" />
                      <h3 className="font-medium">DeFi Wallet</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {hasWallet 
                        ? "Your wallet is ready to use"
                        : "Create a wallet to interact with DeFi protocols"
                      }
                    </p>
                  </div>
                  <Button 
                    onClick={handleCreateWallet}
                    disabled={hasWallet || isCreatingWallet}
                    className="min-w-[140px]"
                  >
                    {isCreatingWallet ? (
                      "Creating..."
                    ) : hasWallet ? (
                      <>
                        <Wallet className="w-4 h-4 mr-2" />
                        Wallet Ready
                      </>
                    ) : (
                      <>
                        <Wallet className="w-4 h-4 mr-2" />
                        Create Wallet
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Connected Services</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted">
              <Image 
                src="/icons/base.svg" 
                alt="Base" 
                width={20} 
                height={20}
              />
              <span className="font-medium">Base Network</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted">
              <Image 
                src="/icons/eth.svg" 
                alt="Ethereum" 
                width={20} 
                height={20}
              />
              <span className="font-medium">Ethereum</span>
            </div>
          </div>
        </Card>
      </div>
    );
  };

  return (
    <PageLayout loading={loading || hasWallet === null} isAuthenticated={!!user}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Settings</h1>
          <Button 
            variant="ghost" 
            onClick={handleSignOut}
            className="text-muted-foreground hover:text-foreground"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>

        {renderContent()}
      </div>
    </PageLayout>
  );
} 