import { NextResponse } from 'next/server';
import { ethers } from 'ethers';

interface TokenInfo {
  name: string;
  symbol: string;
  address: string;
}

interface Social {
  platform: string;
  handle: string;
}

interface Website {
  url: string;
}

export async function POST(req: Request) {
  try {
    const { address } = await req.json();

    if (!ethers.isAddress(address)) {
      return NextResponse.json(
        { error: 'Invalid address' },
        { status: 400 }
      );
    }

    const dexScreenerResponse = await fetch(`https://api.dexscreener.com/tokens/v1/base/${address}`);
    const dexData = await dexScreenerResponse.json();
    const tokenData = dexData?.[0];

    if (!tokenData) {
      return NextResponse.json(
        { error: 'Token not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      baseToken: tokenData.baseToken || {},
      quoteToken: tokenData.quoteToken || {},
      
      priceUsd: tokenData.priceUsd || 'N/A',
      priceNative: tokenData.priceNative || 'N/A',
      marketCap: tokenData.marketCap || 'N/A',
      fdv: tokenData.fdv || 'N/A', 
      
      liquidity: tokenData.liquidity || {
        usd: 'N/A',
        base: 'N/A',
        quote: 'N/A'
      },
      
      dexId: tokenData.dexId || 'N/A',
      pairAddress: tokenData.pairAddress || 'N/A',
      pairCreatedAt: tokenData.pairCreatedAt || 'N/A',
      
      chainId: tokenData.chainId || 'N/A',
      labels: tokenData.labels || [],
      
      info: {
        imageUrl: tokenData.info?.imageUrl || null,
        websites: tokenData.info?.websites || [],
        socials: tokenData.info?.socials || []
      },
      
      url: tokenData.url || null
    });
  } catch (error) {
    console.error('Token analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze token' },
      { status: 500 }
    );
  }
} 