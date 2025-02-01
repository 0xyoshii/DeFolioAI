import { ethers } from 'ethers';

const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);

export async function getWalletInfo(address: string) {
  const [balance, txCount] = await Promise.all([
    provider.getBalance(address),
    provider.getTransactionCount(address),
  ]);

  return {
    address,
    balance: Number(ethers.formatEther(balance)),
    txCount,
    network: 'Base Mainnet',
    chainId: (await provider.getNetwork()).chainId.toString(),
  };
} 