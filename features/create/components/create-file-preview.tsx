'use client';

import { useEffect, useState } from 'react';
import { type BundledLanguage, codeToHtml } from 'shiki/bundle/web';

const LANG_BY_EXT: Record<string, BundledLanguage> = {
  css: 'css',
  html: 'html',
  js: 'javascript',
  json: 'json',
  jsx: 'jsx',
  md: 'markdown',
  mdx: 'mdx',
  ts: 'typescript',
  tsx: 'tsx',
  yaml: 'yaml',
  yml: 'yaml',
};

const highlightCache = new Map<string, string>();

export function CreateFilePreview({
  file,
}: {
  file: { path: string; contents: string } | null;
}) {
  const path = file?.path;
  const contents = file?.contents;
  const lang = path ? langFromPath(path) : null;
  const cacheKey =
    lang && contents !== undefined ? `${lang}\0${contents}` : null;
  const [, setVersion] = useState(0);
  const html = cacheKey ? highlightCache.get(cacheKey) : undefined;

  useEffect(() => {
    if (!cacheKey || !lang || contents === undefined) {
      return;
    }
    if (highlightCache.has(cacheKey)) {
      return;
    }

    let cancelled = false;
    void codeToHtml(contents, {
      lang,
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      defaultColor: false,
    }).then((next) => {
      highlightCache.set(cacheKey, next);
      if (!cancelled) {
        setVersion((version) => version + 1);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [cacheKey, contents, lang]);

  if (!file) {
    return (
      <p className="text-muted-foreground px-4 py-3 text-sm">
        No file selected
      </p>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="text-muted-foreground border-b px-3 py-1.5 font-mono text-xs">
        {file.path}
      </div>
      {html ? (
        <div
          className="min-h-0 flex-1 overflow-auto [&_.line_span]:text-(--shiki-light) dark:[&_.line_span]:text-(--shiki-dark) [&_pre]:bg-transparent [&_pre]:p-4"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <pre className="min-h-0 flex-1 overflow-auto p-4 font-mono text-sm">
          <code>{file.contents}</code>
        </pre>
      )}
    </div>
  );
}

function langFromPath(path: string): BundledLanguage | null {
  const base = path.split('/').pop() ?? path;
  const dot = base.lastIndexOf('.');
  if (dot < 0) {
    return null;
  }
  const ext = base.slice(dot + 1);
  return LANG_BY_EXT[ext] ?? null;
}
