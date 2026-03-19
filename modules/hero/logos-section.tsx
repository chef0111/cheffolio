import { DecorIcon } from '@/components/ui/decor-icon';
import { FullWidthDivider } from '@/components/ui/full-width-divider';
import { LogoCloud } from './logo-cloud';

export function LogosSection() {
  return (
    <section>
      <h2 className="text-muted-foreground py-6 text-center text-lg font-medium tracking-tight md:text-xl">
        Trusted by <span className="text-foreground">experts</span>
      </h2>
      <div className="relative *:border-0">
        <DecorIcon className="size-4" position="top-left" />
        <DecorIcon className="size-4" position="top-right" />
        <DecorIcon className="size-4" position="bottom-left" />
        <DecorIcon className="size-4" position="bottom-right" />

        <FullWidthDivider className="-top-px" />
        <LogoCloud />
        <FullWidthDivider className="-bottom-px" />
      </div>
    </section>
  );
}
