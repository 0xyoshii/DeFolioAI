import { supabase } from './supabase';

export async function createUserWallet() {
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError || !session) {
    throw new Error('No session found');
  }

  const response = await fetch('/api/user/wallet', {
    method: 'POST',
    headers: {
      'Authorization': JSON.stringify(session),
      'Content-Type': 'application/json'
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create wallet');
  }

  return response.json();
} 