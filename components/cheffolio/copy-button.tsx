'use client';

import * as React from 'react';
import { type VariantProps } from 'class-variance-authority';
import { AnimatePresence, motion } from 'motion/react';
import { CheckIcon, CopyIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useControlledState } from '@/hooks/use-controlled-state';
import { Button, buttonVariants } from '@/components/ui/button';

type CopyButtonBaseProps = Omit<
  React.ComponentPropsWithoutRef<typeof Button>,
  'children'
> &
  VariantProps<typeof buttonVariants> & {
    copied?: boolean;
    onCopiedChange?: (copied: boolean, content?: string) => void;
    delay?: number;
  };

type TextCopyProps = CopyButtonBaseProps & {
  copyType?: 'text';
  content: string;
};

type ImageCopyProps = CopyButtonBaseProps & {
  copyType: 'image';
  content: string; // data URL or blob URL
};

type CopyButtonProps = TextCopyProps | ImageCopyProps;

async function copyTextToClipboard(text: string): Promise<void> {
  await navigator.clipboard.writeText(text);
}

async function copyImageToClipboard(dataUrl: string): Promise<void> {
  const response = await fetch(dataUrl);
  const blob = await response.blob();

  // Ensure we're copying as PNG for maximum compatibility
  const pngBlob =
    blob.type === 'image/png' ? blob : await convertToPngBlob(blob);

  await navigator.clipboard.write([
    new ClipboardItem({ 'image/png': pngBlob }),
  ]);
}

async function convertToPngBlob(blob: Blob): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((pngBlob) => {
        if (pngBlob) resolve(pngBlob);
        else reject(new Error('Failed to convert to PNG'));
      }, 'image/png');
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(blob);
  });
}

function CopyButton({
  className,
  content,
  copied,
  onCopiedChange,
  onClick,
  variant,
  size,
  delay = 3000,
  copyType = 'text',
  ...props
}: CopyButtonProps) {
  const [isCopied, setIsCopied] = useControlledState({
    value: copied,
    onChange: onCopiedChange,
  });

  const handleCopy = React.useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);
      if (isCopied || !content) return;

      try {
        if (copyType === 'image') {
          await copyImageToClipboard(content);
        } else {
          await copyTextToClipboard(content);
        }

        setIsCopied(true);
        onCopiedChange?.(true, content);
        setTimeout(() => {
          setIsCopied(false);
          onCopiedChange?.(false);
        }, delay);
      } catch (error) {
        console.error(`Error copying ${copyType}:`, error);
      }
    },
    [onClick, isCopied, content, copyType, setIsCopied, onCopiedChange, delay]
  );

  const Icon = isCopied ? CheckIcon : CopyIcon;

  return (
    <Button
      data-slot="copy-button"
      className={cn(buttonVariants({ variant, size, className }))}
      onClick={handleCopy}
      aria-label={isCopied ? 'Copied' : 'Copy to clipboard'}
      aria-pressed={isCopied}
      {...props}
    >
      <span className="sr-only">Copy button</span>
      <AnimatePresence mode="popLayout">
        <motion.span
          key={isCopied ? 'check' : 'copy'}
          data-slot="copy-button-icon"
          initial={{ scale: 0, opacity: 0.4, filter: 'blur(4px)' }}
          animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
          exit={{ scale: 0, opacity: 0.4, filter: 'blur(4px)' }}
          transition={{ duration: 0.25 }}
        >
          <Icon className="text-foreground" />
        </motion.span>
      </AnimatePresence>
    </Button>
  );
}

export { CopyButton, buttonVariants, type CopyButtonProps };
