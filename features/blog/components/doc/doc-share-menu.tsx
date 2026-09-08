'use client';

import { EllipsisIcon, LinkIcon, ShareIcon } from 'lucide-react';
import { toast } from 'sonner';

import { FacebookIcon, LinkedInIcon, XIcon } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { copyText } from '@/utils/copy';

export function DocShareMenu({ title, url }: { title: string; url: string }) {
  const absoluteUrl = url.startsWith('http')
    ? url
    : typeof window !== 'undefined'
      ? new URL(url, window.location.origin).toString()
      : url;

  const encodedUrl = encodeURIComponent(absoluteUrl);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            className="active:scale-none!"
            variant="secondary"
            size="icon-sm"
          >
            <ShareIcon />
          </Button>
        }
      />

      <DropdownMenuContent
        className="w-fit"
        align="end"
        alignOffset={-5}
        finalFocus={false}
      >
        <DropdownMenuItem
          onClick={() => {
            copyText(absoluteUrl);
            toast.success('Link copied');
          }}
        >
          <LinkIcon />
          Copy link
        </DropdownMenuItem>

        <DropdownMenuItem
          render={
            <a
              href={`https://x.com/intent/tweet?url=${encodedUrl}`}
              target="_blank"
              rel="noopener"
            >
              <XIcon />
              Share on X
            </a>
          }
        />

        <DropdownMenuItem
          render={
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
              target="_blank"
              rel="noopener"
            >
              <FacebookIcon />
              Share on Facebook
            </a>
          }
        />

        <DropdownMenuItem
          render={
            <a
              href={`https://www.linkedin.com/sharing/share-offsite?url=${encodedUrl}`}
              target="_blank"
              rel="noopener"
            >
              <LinkedInIcon />
              Share on LinkedIn
            </a>
          }
        />

        {typeof navigator !== 'undefined' && 'share' in navigator && (
          <DropdownMenuItem
            closeOnClick={false}
            onClick={() => {
              navigator.share({ title, url: absoluteUrl }).catch(() => {});
            }}
          >
            <EllipsisIcon />
            Other app
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
