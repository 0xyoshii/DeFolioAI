import { NextResponse } from 'next/server';
import { CdpAgentkit } from "@coinbase/cdp-agentkit-core";
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
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

    const config = {
      cdpWalletData: undefined,
      networkId: "base-mainnet",
    };
    const agentkit = await CdpAgentkit.configureWithWallet(config);
    const exportedWallet = await agentkit.exportWallet();

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ wallet_data: exportedWallet })
      .eq('id', user.id);

    if (updateError) {
      console.error('Update error:', updateError);
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error creating wallet:', error);
    return NextResponse.json(
      { error: 'Failed to create wallet' },
      { status: 500 }
    );
  }
} 