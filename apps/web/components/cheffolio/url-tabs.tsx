'use client';

import { parseAsString, useQueryState } from 'nuqs';
import { type ComponentProps, useEffect } from 'react';

import { Tabs } from '@/components/ui/tabs';

type UrlTabsProps = Omit<
  ComponentProps<typeof Tabs>,
  'value' | 'defaultValue' | 'onValueChange'
> & {
  defaultValue: string;
  values: readonly string[];
  paramKey?: string;
};

export function UrlTabs({
  defaultValue,
  values,
  paramKey = 'tab',
  ...props
}: UrlTabsProps) {
  const [tab, setTab] = useQueryState(paramKey, parseAsString);
  const activeTab = tab && values.includes(tab) ? tab : defaultValue;

  useEffect(() => {
    if (tab === null) {
      return;
    }
    if (tab === defaultValue || !values.includes(tab)) {
      void setTab(null);
    }
  }, [defaultValue, setTab, tab, values]);

  return (
    <Tabs
      {...props}
      value={activeTab}
      onValueChange={(value) => {
        if (typeof value !== 'string' || !values.includes(value)) {
          return;
        }
        void setTab(value === defaultValue ? null : value);
      }}
    />
  );
}
