import type { Abi } from "abitype";

export const AVATAR_IMAGES = {
  bot: "https://api.dicebear.com/7.x/bottts/svg?seed=1",
  user: "https://api.dicebear.com/7.x/avataaars/svg?seed=2"
} as const;

// Network and Contract Addresses
export const NETWORK_CONSTANTS = {
  WETH_ADDRESS: '0x4200000000000000000000000000000000000006', // Base WETH
  UNISWAP_V3_ROUTER: '0x2626664c2603336E57B271c5C0b26F421741e481', // Base Uniswap V3 Router
  UNISWAP_V3_FACTORY: '0x33128a8fC17869897dcE68Ed026d694621f6FDfD', // Base Uniswap V3 Factory
  UNISWAP_V3_QUOTER: '0x28aF629a9F3ECE3c8D9F0b7cCf6349708CeC8cFb', // Base Quoter V2
  POOL_FEE_TIERS: [100, 500, 3000, 10000], // Common fee tiers: 0.01%, 0.05%, 0.3%, 1%
}

// ABI Fragments
export const UNISWAP_ROUTER_ABI = [
  'function exactInputSingle(tuple(address tokenIn, address tokenOut, uint24 fee, address recipient, uint256 deadline, uint256 amountIn, uint256 amountOutMinimum, uint160 sqrtPriceLimitX96) params) external payable returns (uint256 amountOut)',
  'function exactOutputSingle(tuple(address tokenIn, address tokenOut, uint24 fee, address recipient, uint256 deadline, uint256 amountOut, uint256 amountInMaximum, uint160 sqrtPriceLimitX96) params) external payable returns (uint256 amountIn)',
  'function refundETH() external payable',
];

export const ERC20_ABI = [
  'function approve(address spender, uint256 amount) external returns (bool)',
  'function allowance(address owner, address spender) external view returns (uint256)',
];

// Other Constants
export const SWAP_CONSTANTS = {
  SLIPPAGE_TOLERANCE: 0.05, // 5%
  DEADLINE_MINUTES: 20,
  PRICE_IMPACT_HIGH: 0.05, // 5%
  MIN_ETH_RESERVE: '0.001', // Keep 0.01 ETH for gas
};

export const QUOTER_ABI = [
  'function quoteExactInputSingle(address tokenIn, address tokenOut, uint24 fee, uint256 amountIn, uint160 sqrtPriceLimitX96) external returns (uint256 amountOut)',
  'function quoteExactOutputSingle(address tokenIn, address tokenOut, uint24 fee, uint256 amountOut, uint160 sqrtPriceLimitX96) external returns (uint256 amountIn)',
];

export const CDP_ROUTER_ABI: Abi = [
  {
    inputs: [
      {
        components: [
          { internalType: "address", name: "tokenIn", type: "address" },
          { internalType: "address", name: "tokenOut", type: "address" },
          { internalType: "uint24", name: "fee", type: "uint24" },
          { internalType: "address", name: "recipient", type: "address" },
          { internalType: "uint256", name: "deadline", type: "uint256" },
          { internalType: "uint256", name: "amountIn", type: "uint256" },
          { internalType: "uint256", name: "amountOutMinimum", type: "uint256" },
          { internalType: "uint160", name: "sqrtPriceLimitX96", type: "uint160" }
        ],
        internalType: "struct ISwapRouter.ExactInputSingleParams",
        name: "params",
        type: "tuple"
      }
    ],
    name: "exactInputSingle",
    outputs: [
      {
        internalType: "uint256",
        name: "amountOut",
        type: "uint256"
      }
    ],
    stateMutability: "payable",
    type: "function"
  }
];

export const CDP_ERC20_ABI: Abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256"
      }
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  }
];

export const CDP_QUOTER_ABI: Abi = [{"inputs":[{"internalType":"address","name":"_factory","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"poolAddress","type":"address"},{"internalType":"bool","name":"zeroForOne","type":"bool"},{"internalType":"int256","name":"amountSpecified","type":"int256"},{"internalType":"uint160","name":"sqrtPriceLimitX96","type":"uint160"}],"name":"quote","outputs":[{"internalType":"int256","name":"amount0","type":"int256"},{"internalType":"int256","name":"amount1","type":"int256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes","name":"path","type":"bytes"},{"internalType":"uint256","name":"amountIn","type":"uint256"}],"name":"quoteExactInput","outputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"tokenIn","type":"address"},{"internalType":"address","name":"tokenOut","type":"address"},{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint24","name":"fee","type":"uint24"},{"internalType":"uint160","name":"sqrtPriceLimitX96","type":"uint160"}],"internalType":"struct IUniswapV3StaticQuoter.QuoteExactInputSingleParams","name":"params","type":"tuple"}],"name":"quoteExactInputSingle","outputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"}],"stateMutability":"view","type":"function"}]

export const CDP_ERC20_DECIMALS_ABI: Abi = [
  {
    type: "function",
    name: "decimals",
    inputs: [],
    outputs: [
      {
        type: "uint8",
        name: "",
        internalType: "uint8"
      }
    ],
    stateMutability: "view"
  }
]; 