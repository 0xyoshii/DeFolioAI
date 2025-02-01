import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { AVATAR_IMAGES } from '@/lib/constants';

export function LoadingMessage() {
  return (
    <div className="flex items-start gap-2">
      <Avatar className="h-7 w-7 bg-primary text-primary-foreground">
        <img 
          src={AVATAR_IMAGES.bot} 
          alt="AI"
          className="h-full w-full object-cover"
        />
      </Avatar>
      <Card className="px-3 py-2 bg-muted">
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 bg-foreground/50 rounded-full animate-bounce [animation-delay:-0.3s]" />
          <div className="w-1.5 h-1.5 bg-foreground/50 rounded-full animate-bounce [animation-delay:-0.15s]" />
          <div className="w-1.5 h-1.5 bg-foreground/50 rounded-full animate-bounce" />
        </div>
      </Card>
    </div>
  );
} 