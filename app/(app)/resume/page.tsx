import { ArrowLeftIcon } from 'lucide-react';
import type { Metadata } from 'next';
import { cacheLife } from 'next/cache';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { simpleOgImageUrl } from '@/app/og/params';
import { MDCopyButtonGroup } from '@/components/cheffolio/page-actions';
import { Panel } from '@/components/cheffolio/panel';
import { ShareMenu } from '@/components/cheffolio/share-menu';
import { StripeSeparator } from '@/components/cheffolio/stripe-separator';
import { jsonLdBreadcrumbList, JsonLdScript } from '@/components/json-ld';
import { Button } from '@/components/ui/button';
import { X_PROFILE } from '@/config/site';
import {
  DocContainer,
  DocContentCol,
  DocGrid,
  DocLeftCol,
  DocRightCol,
} from '@/features/blog/components/doc/doc-layout';
import { DocPageRoot } from '@/features/blog/components/doc/doc-page-root';
import { DownloadResumeButton } from '@/features/resume/components/download-resume-button';
import {
  ResumeViewer,
  ResumeViewerPages,
  ResumeViewerToolbar,
  ResumeViewerViewport,
} from '@/features/resume/components/viewer/resume-viewer';
import {
  RESUME_MD_PATH,
  RESUME_PATH,
  RESUME_PDF_PATH,
} from '@/features/resume/lib/constants';
import { getResumeDoc } from '@/lib/document';

export async function generateMetadata(): Promise<Metadata> {
  'use cache';
  cacheLife('max');

  const doc = getResumeDoc();

  if (!doc) return notFound();

  const { title, description } = doc.metadata;
  const ogImage = simpleOgImageUrl(title, description);

  return {
    title,
    description,
    alternates: {
      canonical: RESUME_PATH,
    },
    openGraph: {
      url: RESUME_PATH,
      type: 'profile',
      images: {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: title,
      },
    },
    twitter: {
      card: 'summary_large_image',
      site: X_PROFILE,
      creator: X_PROFILE,
      images: [ogImage],
    },
  };
}

export default async function ResumePage() {
  'use cache';
  cacheLife('max');

  const doc = getResumeDoc();

  if (!doc) return notFound();

  const { title, description } = doc.metadata;

  return (
    <>
      <JsonLdScript
        data={jsonLdBreadcrumbList([
          { name: 'Home', href: '/' },
          { name: title, href: RESUME_PATH },
        ])}
      />

      <DocPageRoot className="flex flex-1 flex-col">
        <div className="mx-auto h-26 w-full max-w-4xl border-x" />
        <DocContainer>
          <Panel className="decor-t screen-line-bottom-none flex items-center justify-between p-2">
            <Button
              size="sm"
              variant="ghost"
              nativeButton={false}
              className="text-muted-foreground gap-1.5 text-base tracking-wider"
              render={<Link href="/" />}
            >
              <ArrowLeftIcon data-icon="inline-start" className="size-4" />
              Home
            </Button>

            <div className="flex items-center gap-2">
              <DownloadResumeButton />
              <MDCopyButtonGroup markdownUrl={RESUME_MD_PATH} />
              <ShareMenu title={title} url={RESUME_PATH} />
            </div>
          </Panel>

          <StripeSeparator />

          <h1
            data-slot="doc-title"
            className="border-x px-4 py-1 text-4xl font-medium tracking-tight text-balance"
          >
            {title}
          </h1>
        </DocContainer>

        <DocGrid className="flex-1 grid-rows-1">
          <DocLeftCol />

          <DocContentCol className="flex h-full flex-col">
            <Panel className="decor-t screen-line-bottom-none flex flex-1 flex-col p-0">
              <p className="text-muted-foreground screen-line-bottom px-4 py-3 text-balance">
                {description}
              </p>

              <ResumeViewer src={RESUME_PDF_PATH}>
                <ResumeViewerToolbar className="screen-line-bottom" />
                <ResumeViewerViewport>
                  <ResumeViewerPages />
                </ResumeViewerViewport>
              </ResumeViewer>
            </Panel>
          </DocContentCol>

          <DocRightCol />
        </DocGrid>
      </DocPageRoot>

      <StripeSeparator />
    </>
  );
}
