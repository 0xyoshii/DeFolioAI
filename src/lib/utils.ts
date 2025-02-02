import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatMessageWithTxLinks(message: string): string {
  return message.replace(
    /Transaction: (0x[a-fA-F0-9]{64})/g,
    'Transaction: [View on Basescan](https://basescan.org/tx/$1)'
  );
}
