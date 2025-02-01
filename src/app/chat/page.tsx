'use client';

import { useState, useRef, useEffect } from 'react';
import ChatMessage from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';
import { Message } from '@/types/chat';
import { Card } from '@/components/ui/card';
import { Sidebar } from '@/components/Sidebar';
import { LoadingMessage } from '@/components/LoadingMessage';
import { useAuth } from '@/components/auth/AuthProvider';
import LoginPage from '@/components/auth/LoginPage';
import { LoadingScreen } from '@/components/LoadingScreen';
import { WalletRequiredModal } from '@/components/WalletRequiredModal';
import { supabase } from '@/lib/supabase';

export default function ChatPage() {
  const { user, loading } = useAuth();
  const [hasWallet, setHasWallet] = useState<boolean | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! Im your personal DeFi assistant. What would you like to do?',
      role: 'assistant',
      timestamp: new Date(),
    },
  ]);
  
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!isScrolled) {
      scrollToBottom();
    }
  }, [messages, isScrolled]);

  useEffect(() => {
    async function checkWallet() {
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('wallet_data')
          .eq('id', user.id)
          .single();
        
        setHasWallet(!!profile?.wallet_data);
      }
    }

    checkWallet();
  }, [user]);

  if (loading || hasWallet === null) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <LoginPage />;
  }

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const isAtBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 10;
    setIsScrolled(!isAtBottom);
  };

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsScrolled(false);
    setIsLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No session found');

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': JSON.stringify(session),
        },
        body: JSON.stringify({ message: content }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsScrolled(false);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error. Please try again.',
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 flex flex-col p-6 gap-6">
        {!hasWallet && <WalletRequiredModal />}
        <Card className="flex-1 overflow-hidden border-none shadow-sm bg-card">
          <div 
            ref={chatContainerRef}
            className="h-full overflow-y-auto px-6"
            onScroll={handleScroll}
          >
            <div className="max-w-3xl mx-auto py-6 space-y-6">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {isLoading && <LoadingMessage />}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </Card>
        <div className="max-w-3xl mx-auto w-full">
          <Card className="border-none shadow-sm bg-card">
            <div className="p-4">
              <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
} 