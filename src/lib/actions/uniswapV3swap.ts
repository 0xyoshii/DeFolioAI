import { readContract, Wallet } from "@coinbase/coinbase-sdk";
import { 
  NETWORK_CONSTANTS,
  SWAP_CONSTANTS,
  CDP_ROUTER_ABI,
  CDP_ERC20_ABI,
  CDP_QUOTER_ABI,
  CDP_ERC20_DECIMALS_ABI
} from '@/lib/constants';
import { z } from 'zod';

interface PoolInfo {
  address: string;
  feeTier: number;
}

interface SwapQuote {
  amountIn: bigint;
  amountOut: bigint;
  error: string | null;
}

export const UNISWAP_V3_SWAP_PROMPT = `
This tool will perform a Uniswap V3 swap on the Base network.
If the message starts with swap x *token address* for eth, it means that isReverse=true.
If the message starts with swap eth for x *token address*, it means that isReverse=false.
If the amount of eth is not specified, it means that isReverse=false.
If the amount of tokens is not specified, it means that isReverse=true.
`;


export const UniswapV3SwapInput = z.object({
  tokenAddress: z.string().describe("Token address to buy or sell"),
  amountIn: z.string().describe("Amount in ETH or tokens"),
  isReverse: z.boolean().describe("true = sell tokens for ETH, false = buy tokens with ETH"),
});

async function getTokenDecimals(tokenAddress: string): Promise<number> {
  try {
    const result = await readContract({
      networkId: 'base-mainnet',
      contractAddress: tokenAddress as `0x${string}`,
      method: 'decimals',
      abi: CDP_ERC20_DECIMALS_ABI,
      args: {}
    });
    return Number(result);
  } catch (error) {
    console.error('Error getting decimals:', error);
    return 18;
  }
}

async function getPoolInfo(tokenAddress: string): Promise<PoolInfo | null> {
  try {
    const response = await fetch(`https://api.dexscreener.com/tokens/v1/base/${tokenAddress}`);
    const data = await response.json();
    const pair = data?.[0];
    
    if (!pair?.pairAddress) return null;

    return {
      address: pair.pairAddress,
      feeTier: 3000
    };
  } catch (error) {
    console.error('Pool fetch error:', error);
    return null;
  }
}

async function getSwapQuote(
  wallet: Wallet,
  tokenIn: string,
  tokenOut: string,
  amountIn: bigint,
  feeTier: number
): Promise<SwapQuote> {
  try {
    console.log({
      tokenIn,
      tokenOut,
      fee: feeTier.toString(),
      amountIn: amountIn.toString(),
      sqrtPriceLimitX96: '0'
    });

    const params = [
      tokenIn,
      tokenOut,
      amountIn.toString(),
      '0'
    ];
    const result = await readContract({
      networkId: 'base-mainnet',
      contractAddress: NETWORK_CONSTANTS.UNISWAP_V3_QUOTER as `0x${string}`,
      method: 'quoteExactInputSingle',
      abi: CDP_QUOTER_ABI,
      args: params,
    });

    
    return {
      amountIn,
      amountOut: BigInt(result),
      error: null
    };
  } catch (error) {
    console.error('Quote error:', error);
    return {
      amountIn,
      amountOut: BigInt(0),
      error: 'Failed to get quote'
    };
  }
}

// Main swap function
export async function executeUniswapV3Swap(
  wallet: Wallet,
  args: z.infer<typeof UniswapV3SwapInput>
): Promise<string> {
  try {
    const poolInfo = await getPoolInfo(args.tokenAddress);
    if (!poolInfo) return 'Failed to find a suitable pool';

    const deadline = Math.floor(Date.now() / 1000) + SWAP_CONSTANTS.DEADLINE_MINUTES * 60;
    const amountIn = args.isReverse
      ? BigInt(Math.floor(Number(args.amountIn) * 10 ** await getTokenDecimals(args.tokenAddress)))
      : BigInt(Math.floor(Number(args.amountIn) * 10 ** 18));

    const quote = await getSwapQuote(
      wallet,
      args.isReverse ? args.tokenAddress : NETWORK_CONSTANTS.WETH_ADDRESS,
      args.isReverse ? NETWORK_CONSTANTS.WETH_ADDRESS : args.tokenAddress,
      amountIn,
      poolInfo.feeTier
    );
    
    if (quote.error) return quote.error;
    
    const minOutput = (quote.amountOut * BigInt(Math.floor((1 - SWAP_CONSTANTS.SLIPPAGE_TOLERANCE) * 1000))) / BigInt(1000);

    if (args.isReverse) {
      await wallet.invokeContract({
        abi: CDP_ERC20_ABI,
        contractAddress: args.tokenAddress,
        method: 'approve',
        args: {
          spender: NETWORK_CONSTANTS.UNISWAP_V3_ROUTER,
          amount: amountIn.toString()
        }
      });
    }

    const tx = await wallet.invokeContract({
      abi: CDP_ROUTER_ABI,
      contractAddress: NETWORK_CONSTANTS.UNISWAP_V3_ROUTER,
      method: 'exactInputSingle',
      args: {
        params: {
          tokenIn: args.isReverse ? args.tokenAddress : NETWORK_CONSTANTS.WETH_ADDRESS,
          tokenOut: args.isReverse ? NETWORK_CONSTANTS.WETH_ADDRESS : args.tokenAddress,
          fee: poolInfo.feeTier,
          recipient: (await wallet.getDefaultAddress()).getId(),
          deadline,
          amountIn: amountIn.toString(),
          amountOutMinimum: minOutput.toString(),
          sqrtPriceLimitX96: '0'
        }
      },
      ...(args.isReverse ? {} : { amount: Number(amountIn.toString()), assetId: 'wei' })
    });

    return `Successfully swapped ${args.isReverse ? 'tokens for ETH' : 'ETH for tokens'}. Transaction: ${tx.getTransactionHash()}`;
  } catch (error: any) {
    console.error('Swap error:', error);
    return `Failed to execute swap: ${error.message}`;
  }
}
