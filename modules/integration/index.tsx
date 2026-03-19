import { DecorIcon } from '../../components/ui/decor-icon';
import { Integrations } from './integrations';
import { cn } from '@/lib/utils';

export default function IntegrationsSection() {
  return (
    <section className="mb-12">
      <div className="relative mx-auto flex h-32 items-center justify-center">
        <div className="relative">
          <DecorIcon
            className="stroke-border size-6 stroke-2"
            position="top-left"
          />
          <DecorIcon
            className="stroke-border size-6 stroke-2"
            position="top-right"
          />
          <DecorIcon
            className="stroke-border size-6 stroke-2"
            position="bottom-left"
          />
          <DecorIcon
            className="stroke-border size-6 stroke-2"
            position="bottom-right"
          />

          <DashedLine className="-top-[1.5px] right-3 left-3" />
          <DashedLine className="top-3 -right-[1.5px] bottom-3" />
          <DashedLine className="top-3 bottom-3 -left-[1.5px]" />
          <DashedLine className="right-3 -bottom-[1.5px] left-3" />
          <h2 className="text-muted-foreground p-4 text-center text-xl font-semibold md:text-3xl">
            Seamless <span className="text-foreground">Integration</span>
          </h2>
        </div>
        <div className="via-border to-border absolute inset-y-0 left-4 w-px bg-linear-to-b from-transparent md:left-8" />
        <div className="via-border to-border absolute inset-y-0 right-4 w-px bg-linear-to-b from-transparent md:right-8" />
        <div className="via-border/50 to-border/50 absolute inset-y-0 left-8 w-px bg-linear-to-b from-transparent md:left-12" />
        <div className="via-border/50 to-border/50 absolute inset-y-0 right-8 w-px bg-linear-to-b from-transparent md:right-12" />
      </div>
      <Integrations />
    </section>
  );
}

function DashedLine({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('absolute border-collapse border border-dashed', className)}
      {...props}
    />
  );
}
