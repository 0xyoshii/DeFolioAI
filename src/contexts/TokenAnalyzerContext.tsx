'use client';

import React, { createContext, useContext, useState } from 'react';

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

interface TokenAnalyzerContextType {
  address: string;
  setAddress: (address: string) => void;
  tokenInfo: TokenInfo | null;
  setTokenInfo: (info: TokenInfo | null) => void;
  error: string | null;
  setError: (error: string | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const TokenAnalyzerContext = createContext<TokenAnalyzerContextType | undefined>(undefined);

export function TokenAnalyzerProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState('');
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <TokenAnalyzerContext.Provider
      value={{
        address,
        setAddress,
        tokenInfo,
        setTokenInfo,
        error,
        setError,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </TokenAnalyzerContext.Provider>
  );
}

export function useTokenAnalyzer() {
  const context = useContext(TokenAnalyzerContext);
  if (context === undefined) {
    throw new Error('useTokenAnalyzer must be used within a TokenAnalyzerProvider');
  }
  return context;
} 