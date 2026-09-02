import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';

export function GameLoadingStatus() {
  return (
    <div
      role="status"
      className="bg-background absolute inset-0 z-10 grid place-items-center"
    >
      <div className="flex flex-col items-center gap-2">
        <Spinner className="size-6" />
        <span className="text-muted-foreground font-pixel text-sm">
          Loading FIG_404
        </span>
      </div>
    </div>
  );
}

export function NotFoundLoading({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'ring-border relative mx-auto aspect-4/3 w-full max-w-200 min-w-0 ring-2',
        className
      )}
    >
      <GameLoadingStatus />
    </div>
  );
}
