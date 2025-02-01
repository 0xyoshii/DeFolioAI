'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PageLayout } from '@/components/PageLayout';
import { useAuth } from '@/components/auth/AuthProvider';
import { Search, AlertCircle, Globe, Twitter, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ethers } from 'ethers';
import { cn } from '@/lib/utils';
import { useTokenAnalyzer } from '@/contexts/TokenAnalyzerContext';

interface TokenInfo {
  baseToken: {
    name: string;
    symbol: string;
    address: string;
  };
  quoteToken: {
    name: string;
    symbol: string;
    address: string;
  };
  priceUsd: string;
  priceNative: string;
  marketCap: string;
  fdv: string;
  liquidity: {
    usd: string;
    base: string;
    quote: string;
  };
  dexId: string;
  pairAddress: string;
  pairCreatedAt: string;
  chainId: string;
  labels: string[];
  info: {
    imageUrl: string | null;
    websites: { url: string }[];
    socials: { platform: string; handle: string }[];
  };
  url: string | null;
}

function formatNumber(value: string | number, isPrice: boolean = false): string {
  if (value === 'N/A') return value;
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isPrice) {
    return num.toFixed(num < 0.01 ? 8 : 6);
  }
  
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
}

export default function AnalyzerPage() {
  const { user, loading } = useAuth();
  const {
    address,
    setAddress,
    tokenInfo,
    setTokenInfo,
    error,
    setError,
    isLoading,
    setIsLoading,
  } = useTokenAnalyzer();

  const handleAnalyze = async () => {
    if (!ethers.isAddress(address)) {
      setError('Please enter a valid token address');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/analyze-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze token');
      }

      const data = await response.json();
      setTokenInfo(data);
    } catch (error) {
      setError('Failed to analyze token. Please try again.');
      console.error('Token analysis error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageLayout loading={loading} isAuthenticated={!!user}>
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Token Analyzer</h1>

        <Card className="p-6">
          <div className="flex gap-4">
            <Input
              placeholder="Enter token address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={handleAnalyze} 
              disabled={isLoading || !address}
            >
              {isLoading ? (
                "Analyzing..."
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Analyze
                </>
              )}
            </Button>
          </div>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {tokenInfo && (
            <div className="mt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4 md:col-span-2">
                  <div className="flex items-center gap-4">
                    {tokenInfo.info.imageUrl && (
                      <img 
                        src={tokenInfo.info.imageUrl} 
                        alt={tokenInfo.baseToken.name} 
                        className="w-12 h-12 rounded-full"
                      />
                    )}
                    <div>
                      <h2 className="text-2xl font-bold">{tokenInfo.baseToken.name}</h2>
                      <p className="text-muted-foreground">{tokenInfo.baseToken.symbol}</p>
                    </div>
                    <div className="ml-auto flex gap-2">
                      {tokenInfo.info.websites?.[0] && (
                        <a 
                          href={tokenInfo.info.websites[0].url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 hover:bg-accent rounded-full"
                        >
                          <Globe className="w-5 h-5" />
                        </a>
                      )}
                      {tokenInfo.url && (
                        <a 
                          href={tokenInfo.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 hover:bg-accent rounded-full"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  </div>
                  {tokenInfo.labels.length > 0 && (
                    <div className="flex gap-2 mt-4">
                      {tokenInfo.labels.map((label, i) => (
                        <span 
                          key={i}
                          className="px-2 py-1 bg-accent rounded-full text-xs"
                        >
                          {label}
                        </span>
                      ))}
                    </div>
                  )}
                </Card>

                <Card className="p-4">
                  <h3 className="text-sm font-medium text-muted-foreground">Price (USD)</h3>
                  <p className="text-lg font-semibold mt-1">
                    ${tokenInfo.priceUsd}
                  </p>
                </Card>

                <Card className="p-4">
                  <h3 className="text-sm font-medium text-muted-foreground">Price (ETH)</h3>
                  <p className="text-lg font-semibold mt-1">
                    {tokenInfo.priceNative} ETH
                  </p>
                </Card>

                <Card className="p-4">
                  <h3 className="text-sm font-medium text-muted-foreground">Market Cap</h3>
                  <p className="text-lg font-semibold mt-1">
                    ${formatNumber(tokenInfo.marketCap)}
                  </p>
                </Card>

                <Card className="p-4">
                  <h3 className="text-sm font-medium text-muted-foreground">FDV</h3>
                  <p className="text-lg font-semibold mt-1">
                    ${formatNumber(tokenInfo.fdv)}
                  </p>
                </Card>

                <Card className="p-4">
                  <h3 className="text-sm font-medium text-muted-foreground">Liquidity (USD)</h3>
                  <p className="text-lg font-semibold mt-1">
                    ${formatNumber(tokenInfo.liquidity.usd)}
                  </p>
                </Card>

                <Card className="p-4">
                  <h3 className="text-sm font-medium text-muted-foreground">DEX</h3>
                  <p className="text-lg font-semibold mt-1 capitalize">{tokenInfo.dexId.replace('-', ' ')}</p>
                </Card>

                <Card className="p-4 md:col-span-2">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Pair Info</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Pair Address:</span> {tokenInfo.pairAddress}</p>
                    <p><span className="font-medium">Created:</span> {new Date(tokenInfo.pairCreatedAt).toLocaleDateString()}</p>
                    <p><span className="font-medium">Chain ID:</span> {tokenInfo.chainId}</p>
                  </div>
                </Card>
              </div>
            </div>
          )}
        </Card>
      </div>
    </PageLayout>
  );
} 