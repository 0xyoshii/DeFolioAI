import { z } from "zod";

export const GET_TOKEN_INFO_PROMPT = `
This tool will retrieve the info such as marketcap, price, liquidity, symbol, name, etc. of a given token address
`;

export const GetTokenInfoInput = z
  .object({
    address: z.string().describe("The address to check the token info of"),
  })
  .strip()
  .describe("Instructions for checking a token info");


export async function getTokenInfo(
  args: z.infer<typeof GetTokenInfoInput>,
): Promise<string> {
  try {
    const info = await fetch(`https://api.dexscreener.com/tokens/v1/base/${args.address}`)
    const data = await info.json()
    return `{
    "marketcap": ${data[0].marketCap},
    "price": ${data[0].priceUsd},
    "liquidity": ${data[0].liquidity.usd},
    "symbol": ${data[0].baseToken.symbol},
    "name": ${data[0].baseToken.name},
  }`;
  } catch (error) {
    return `Error fetching token info: ${error}`;
  }
}
