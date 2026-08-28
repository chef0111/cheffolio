import { cn } from '@/lib/utils';

export function Spinner({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      fill="currentColor"
      className={cn('*:animate-spinner-opacity size-4', className)}
      {...props}
    >
      <rect
        x="11.84"
        y="7.25"
        width="4"
        height="1.5"
        rx="0.75"
        style={{ animationDelay: '-900ms' }}
      />
      <rect
        x="11.84"
        y="7.25"
        width="4"
        height="1.5"
        rx="0.75"
        transform="rotate(36 8 8)"
        style={{ animationDelay: '-800ms' }}
      />
      <rect
        x="11.84"
        y="7.25"
        width="4"
        height="1.5"
        rx="0.75"
        transform="rotate(72 8 8)"
        style={{ animationDelay: '-700ms' }}
      />
      <rect
        x="11.84"
        y="7.25"
        width="4"
        height="1.5"
        rx="0.75"
        transform="rotate(108 8 8)"
        style={{ animationDelay: '-600ms' }}
      />
      <rect
        x="11.84"
        y="7.25"
        width="4"
        height="1.5"
        rx="0.75"
        transform="rotate(144 8 8)"
        style={{ animationDelay: '-500ms' }}
      />
      <rect
        x="11.84"
        y="7.25"
        width="4"
        height="1.5"
        rx="0.75"
        transform="rotate(180 8 8)"
        style={{ animationDelay: '-400ms' }}
      />
      <rect
        x="11.84"
        y="7.25"
        width="4"
        height="1.5"
        rx="0.75"
        transform="rotate(216 8 8)"
        style={{ animationDelay: '-300ms' }}
      />
      <rect
        x="11.84"
        y="7.25"
        width="4"
        height="1.5"
        rx="0.75"
        transform="rotate(252 8 8)"
        style={{ animationDelay: '-200ms' }}
      />
      <rect
        x="11.84"
        y="7.25"
        width="4"
        height="1.5"
        rx="0.75"
        transform="rotate(288 8 8)"
        style={{ animationDelay: '-100ms' }}
      />
      <rect
        x="11.84"
        y="7.25"
        width="4"
        height="1.5"
        rx="0.75"
        transform="rotate(324 8 8)"
      />
    </svg>
  );
}
