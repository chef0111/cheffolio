'use client';

import { AppProgressProvider } from '@bprogress/next';

export function ProgressProvider({
  children,
  ...props
}: React.ComponentProps<typeof AppProgressProvider>) {
  return <AppProgressProvider {...props}>{children}</AppProgressProvider>;
}
