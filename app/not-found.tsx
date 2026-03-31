import { FullWidthDivider } from '@/components/cheffolio/full-width-divider';
import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty';
import { HomeIcon } from 'lucide-react';
import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <div className="flex w-full items-center justify-center overflow-hidden">
      <div className="flex h-screen items-center border-x">
        <div>
          <FullWidthDivider />
          <Empty>
            <EmptyHeader>
              <EmptyTitle className="mask-b-from-20% mask-b-to-80% text-9xl font-extrabold">
                404
              </EmptyTitle>
              <EmptyDescription className="text-foreground/80 -mt-8 text-nowrap">
                The page you&apos;re looking for might have been <br />
                moved or doesn&apos;t exist.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button asChild>
                <Link href="/">
                  <HomeIcon data-icon="inline-start" />
                  Go Home
                </Link>
              </Button>
            </EmptyContent>
          </Empty>
          <FullWidthDivider />
        </div>
      </div>
    </div>
  );
}
