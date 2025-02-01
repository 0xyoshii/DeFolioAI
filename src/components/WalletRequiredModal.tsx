'use client';

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { Wallet } from "lucide-react";

export function WalletRequiredModal() {
  const router = useRouter();

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Wallet Required
          </DialogTitle>
          <DialogDescription>
            To use the chat feature, you need to create a wallet first. Head to settings to set up your wallet.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end">
          <Button onClick={() => router.push('/settings')}>
            Go to Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 