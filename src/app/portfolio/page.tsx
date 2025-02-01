'use client';

import { useAuth } from '@/components/auth/AuthProvider';
import { Card } from '@/components/ui/card';
import { Sidebar } from '@/components/Sidebar';
import { LoadingScreen } from '@/components/LoadingScreen';
import LoginPage from '@/components/auth/LoginPage';
import { WalletRequiredModal } from '@/components/WalletRequiredModal';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { getWalletInfo } from '@/lib/wallet-info';
import { ethers } from 'ethers';
import Image from 'next/image';
import { PageLayout } from '@/components/PageLayout';

interface WalletInfo {
  address: string;
  balance: number;
  txCount: number;
  network: string;
  chainId: string;
}

interface WalletData {
  walletId: string;
  seed: string;
  networkId: string;
  defaultAddressId: string;
}

export default function PortfolioPage() {
  const { user, loading } = useAuth();
  const [hasWallet, setHasWallet] = useState<boolean | null>(null);
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkWallet() {
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('wallet_data')
          .eq('id', user.id)
          .single();
        
        setHasWallet(!!profile?.wallet_data);

        if (profile?.wallet_data) {
          try {
            const walletData: WalletData = JSON.parse(profile.wallet_data);
            const address = walletData.defaultAddressId;
            
            const info = await getWalletInfo(address);
            setWalletInfo(info);
          } catch (error) {
            console.error('Error getting wallet info:', error);
          }
        }
        setIsLoading(false);
      }
    }

    checkWallet();
  }, [user]);

  const renderContent = () => {
    if (loading || isLoading) {
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
        <h1 className="text-3xl font-bold">Portfolio</h1>
        
        {!hasWallet && <WalletRequiredModal />}

        {walletInfo && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Wallet Address</h2>
                <Image 
                  src="/icons/base.svg" 
                  alt="Base" 
                  width={24} 
                  height={24}
                />
              </div>
              <p className="font-mono text-sm break-all">{walletInfo.address}</p>
            </Card>

            <Card className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Balance</h2>
                <Image 
                  src="/icons/eth.svg" 
                  alt="ETH" 
                  width={24} 
                  height={24}
                />
              </div>
              <p className="text-2xl font-bold">
                {walletInfo.balance.toFixed(4)} ETH
              </p>
            </Card>

            <Card className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Network</h2>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-sm text-muted-foreground">Live</span>
                </div>
              </div>
              <div>
                <p className="text-lg font-medium">{walletInfo.network}</p>
                <p className="text-sm text-muted-foreground">Chain ID: {walletInfo.chainId}</p>
              </div>
            </Card>

            <Card className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Transactions</h2>
                <span className="text-sm text-muted-foreground">Total</span>
              </div>
              <p className="text-2xl font-bold">{walletInfo.txCount}</p>
            </Card>
          </div>
        )}
      </div>
    );
  };

  return (
    <PageLayout loading={loading || isLoading} isAuthenticated={!!user}>
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Portfolio</h1>
        
        {!hasWallet && <WalletRequiredModal />}

        {walletInfo && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Wallet Address</h2>
                <Image 
                  src="/icons/base.svg" 
                  alt="Base" 
                  width={24} 
                  height={24}
                />
              </div>
              <p className="font-mono text-sm break-all">{walletInfo.address}</p>
            </Card>

            <Card className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Balance</h2>
                <Image 
                  src="/icons/eth.svg" 
                  alt="ETH" 
                  width={24} 
                  height={24}
                />
              </div>
              <p className="text-2xl font-bold">
                {walletInfo.balance.toFixed(4)} ETH
              </p>
            </Card>

            <Card className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Network</h2>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-sm text-muted-foreground">Live</span>
                </div>
              </div>
              <div>
                <p className="text-lg font-medium">{walletInfo.network}</p>
                <p className="text-sm text-muted-foreground">Chain ID: {walletInfo.chainId}</p>
              </div>
            </Card>

            <Card className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Transactions</h2>
                <span className="text-sm text-muted-foreground">Total</span>
              </div>
              <p className="text-2xl font-bold">{walletInfo.txCount}</p>
            </Card>
          </div>
        )}
      </div>
    </PageLayout>
  );
} 