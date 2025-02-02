import { Message } from '@/types/chat';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { cn, formatMessageWithTxLinks } from '@/lib/utils';
import { AVATAR_IMAGES } from '@/lib/constants';
import ReactMarkdown from 'react-markdown';
import React from 'react';

export default function ChatMessage({ message, logs }: { message: Message; logs?: any[] }) {
  const formattedContent = formatMessageWithTxLinks(message.content);

  React.useEffect(() => {
    if (logs?.length) {
      console.log('Swap execution logs:', logs);
    }
  }, [logs]);

  return (
    <div className={cn(
      "flex items-start gap-2",
      message.role === 'user' ? "flex-row-reverse" : "flex-row"
    )}>
      <Avatar className={cn(
        "h-7 w-7",
        message.role === 'assistant' 
          ? "bg-primary text-primary-foreground" 
          : "bg-muted"
      )}>
        <img 
          src={message.role === 'assistant' ? AVATAR_IMAGES.bot : AVATAR_IMAGES.user} 
          alt={message.role === 'assistant' ? 'AI' : 'User'}
          className="h-full w-full object-cover"
        />
      </Avatar>
      <Card className={cn(
        "max-w-[80%] px-3 py-2 text-sm",
        message.role === 'user'
          ? "bg-primary text-primary-foreground"
          : "bg-muted"
      )}>
        <ReactMarkdown
          className="leading-relaxed break-words"
          components={{
            a: ({ node, ...props }) => (
              <a 
                {...props} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              />
            ),
          }}
        >
          {formattedContent}
        </ReactMarkdown>
      </Card>
    </div>
  );
} 