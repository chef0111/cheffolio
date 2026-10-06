'use client';

import { useSelectedLayoutSegments } from 'next/navigation';

export function LayoutState() {
  const [section, detail] = useSelectedLayoutSegments();

  return (
    <span
      hidden
      data-slot="layout-state"
      data-layout-wide={section === 'create' || undefined}
      data-doc-page={(section === 'blog' && detail !== undefined) || undefined}
    />
  );
}
