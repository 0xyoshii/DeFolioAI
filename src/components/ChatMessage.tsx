import { Message } from '@/types/chat';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { AVATAR_IMAGES } from '@/lib/constants';

export default function ChatMessage({ message }: { message: Message }) {
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
        <p className="leading-relaxed break-words">{message.content}</p>
      </Card>
    </div>
  );
} 