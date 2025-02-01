import { FormEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  isLoading?: boolean;
}

export default function ChatInput({ onSend, disabled, isLoading }: ChatInputProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSend(input);
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <Input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message..."
        disabled={disabled || isLoading}
        className="flex-1 bg-background shadow-sm text-base h-12 px-4"
      />
      <Button 
        type="submit" 
        disabled={disabled || isLoading || !input.trim()}
        className="shadow-sm h-12 px-6"
        size="lg"
      >
        {isLoading ? "Sending..." : "Send"}
      </Button>
    </form>
  );
} 