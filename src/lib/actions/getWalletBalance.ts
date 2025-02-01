import { z } from "zod";
import { ethers } from "ethers";


export const GET_BALANCE_PROMPT = `
This tool will retrieve the balance of a given wallet address
`;

const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);


export const GetBalanceInput = z
  .object({
    address: z.string().describe("The address to check the balance of"),
  })
  .strip()
  .describe("Instructions for checking a wallet balance");


export async function getWalletBalance(
  args: z.infer<typeof GetBalanceInput>,
): Promise<string> {
  const balance = await provider.getBalance(args.address);
  return `The balance of ${args.address} is ${Number(Number(ethers.formatEther(balance)).toFixed(5))}`;
}
