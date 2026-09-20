'use client';

import { useSelectedLayoutSegment } from 'next/navigation';

export function LayoutGroup({ children }: { children: React.ReactNode }) {
  const segment = useSelectedLayoutSegment();

  return (
    <div
      className="group/layout relative isolate flex min-h-dvh flex-col overflow-x-clip"
      data-layout={segment === 'create' ? 'wide' : undefined}
    >
      {children}
    </div>
  );
}
