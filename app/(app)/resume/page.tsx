import type { Metadata } from 'next';

import { simpleOgImageUrl } from '@/app/og/params';
import { MDCopyButtonGroup } from '@/components/cheffolio/page-actions';
import {
  PageHeading,
  PageHeadingDescription,
  PageHeadingTitle,
} from '@/components/cheffolio/page-heading';
import { Panel } from '@/components/cheffolio/panel';
import { ShareMenu } from '@/components/cheffolio/share-menu';
import { StripeSeparator } from '@/components/cheffolio/stripe-separator';
import { jsonLdBreadcrumbList, JsonLdScript } from '@/components/json-ld';
import { RESUME_MD_PATH, RESUME_PATH, RESUME_PDF_PATH } from '@/config/resume';
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

const title = 'Resume';
const description = 'View and download my professional resume';
const ogImage = simpleOgImageUrl(title, description);

export function generateMetadata(): Metadata {
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

export default function ResumePage() {
  return (
    <>
      <JsonLdScript
        data={jsonLdBreadcrumbList([
          { name: 'Home', href: '/' },
          { name: 'Resume', href: '/resume' },
        ])}
      />

      <div className="mx-auto flex w-full flex-1 flex-col md:max-w-4xl">
        <PageHeading className="pt-26">
          <PageHeadingTitle className="decor-t screen-line-bottom-none pt-2 pb-0">
            {title}
          </PageHeadingTitle>
          <PageHeadingDescription className="pt-0 pb-2">
            {description}
          </PageHeadingDescription>
        </PageHeading>

        <DocPageRoot className="flex flex-1 flex-col">
          <ResumeViewer src={RESUME_PDF_PATH}>
            <DocContainer>
              <Panel className="decor-t screen-line-bottom-none flex items-center justify-between p-2">
                <ResumeViewerToolbar className="[@media(max-width:360px)]:hidden" />

                <div className="ml-auto flex items-center gap-2">
                  <MDCopyButtonGroup markdownUrl={RESUME_MD_PATH} />
                  <ShareMenu title={title} url={RESUME_PATH} />
                  <DownloadResumeButton />
                </div>
              </Panel>

              <StripeSeparator />
            </DocContainer>

            <DocGrid className="flex-1 grid-rows-1">
              <DocLeftCol />

              <DocContentCol className="flex h-full flex-col">
                <Panel className="decor-t screen-line-bottom-none screen-line-top-none flex flex-1 flex-col py-4">
                  <ResumeViewerViewport className="border-y">
                    <ResumeViewerPages />
                  </ResumeViewerViewport>
                </Panel>
              </DocContentCol>

              <DocRightCol />
            </DocGrid>
          </ResumeViewer>
        </DocPageRoot>
      </div>
      <StripeSeparator />
    </>
  );
}
