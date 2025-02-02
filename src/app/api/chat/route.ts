import { CdpAgentkit } from "@coinbase/cdp-agentkit-core";
import { CdpToolkit, CdpTool } from "@coinbase/cdp-langchain";
import { HumanMessage } from "@langchain/core/messages";
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import { NextResponse } from "next/server";
import { getWalletBalance, GetBalanceInput, GET_BALANCE_PROMPT } from "@/lib/actions/getWalletBalance";
import { getTokenInfo, GetTokenInfoInput, GET_TOKEN_INFO_PROMPT } from "@/lib/actions/getTokenInfo";
import { executeUniswapV3Swap, UniswapV3SwapInput, UNISWAP_V3_SWAP_PROMPT } from "@/lib/actions/uniswapV3swap";
import { supabase } from '@/lib/supabase';

const modifier = `
  You are a helpful agent that can interact onchain using the Coinbase Developer Platform AgentKit. You are 
  empowered to interact onchain using your tools. If you ever need funds, you can request them from the 
  faucet if you are on network ID 'base-sepolia'. If not, you can provide your wallet details and request 
  funds from the user. Before executing your first action, get the wallet details to see what network 
  you're on. If there is a 5XX (internal) HTTP error code, ask the user to try again later. If someone 
  asks you to do something you can't do with your currently available tools, you must say so, and 
  encourage them to implement it themselves using the CDP SDK + Agentkit, recommend they go to 
  docs.cdp.coinbase.com for more information. Be concise and helpful with your responses.
`;

let agent: any;
let config: any;

function validateEnvironment() {
  const requiredVars = ["OPENAI_API_KEY", "CDP_API_KEY_NAME", "CDP_API_KEY_PRIVATE_KEY"];
  const missing = requiredVars.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

async function initialize(walletData: string) {
  if (agent) return { agent, config };

  validateEnvironment();

  const llm = new ChatOpenAI({
    model: "gpt-4o",
  });

  const agentConfig = {
    cdpWalletData: walletData,
    networkId: "base-mainnet",
  };

  const agentkit = await CdpAgentkit.configureWithWallet(agentConfig);
  const cdpToolkit = new CdpToolkit(agentkit);

  const uniswapV3SwapTool = new CdpTool(
    {
      name: "uniswap_v3_swap",
      description: UNISWAP_V3_SWAP_PROMPT,
      argsSchema: UniswapV3SwapInput,
      func: executeUniswapV3Swap,
    },
    agentkit,
  );

  const getWalletBalanceTool = new CdpTool(
    {
      name: "get_wallet_balance",
      description: GET_BALANCE_PROMPT,
      argsSchema: GetBalanceInput,
      func: getWalletBalance,
    },
    agentkit,
  );

  const getTokenInfoTool = new CdpTool(
    {
      name: "get_token_info",
      description: GET_TOKEN_INFO_PROMPT,
      argsSchema: GetTokenInfoInput,
      func: getTokenInfo,
    },
    agentkit,
  );

  const tools = cdpToolkit.getTools();
  tools.push(getWalletBalanceTool);
  tools.push(getTokenInfoTool);
  tools.push(uniswapV3SwapTool);
  const memory = new MemorySaver();

  config = { configurable: { thread_id: "CDP AgentKit Chatbot Example!" } };

  agent = createReactAgent({
    llm,
    tools,
    checkpointSaver: memory,
    messageModifier: modifier,
  });

  return { agent, config };
}

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'No auth token provided' }, { status: 401 });
    }

    const session = JSON.parse(authHeader);
    
    await supabase.auth.setSession({
      access_token: session.access_token,
      refresh_token: session.refresh_token,
    });

    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized', details: error }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('wallet_data')
      .eq('id', user.id)
      .single();

    if (!profile?.wallet_data) {
      return NextResponse.json({ error: 'Wallet not found' }, { status: 400 });
    }

    const { message } = await req.json();
    const { agent, config } = await initialize(profile.wallet_data);

    const stream = await agent.stream(
      { messages: [new HumanMessage(message)] },
      config
    );

    let response = '';
    let logs: any[] = [];

    for await (const chunk of stream) {
      if ("agent" in chunk) {
        response = chunk.agent.messages[0].content;
        if (chunk.agent.log) {
          logs.push(chunk.agent.log);
        }
      }
    }

    return NextResponse.json({ 
      response,
      logs,
    });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message', details: error },
      { status: 500 }
    );
  }
} 