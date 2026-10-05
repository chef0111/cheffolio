import type { CSSProperties, ReactNode } from 'react';

import { usePdfcnTheme } from '@/components/pdf/theme-provider';
import { flatten, Text, View } from '@/lib/pdfcn/pdf-primitives';
import type { ResumeMetadata } from '@/types/document';

import {
  GitHubPdfIcon,
  GlobePdfIcon,
  LinkedInPdfIcon,
  MapPinPdfIcon,
} from './icons';

type ResumeHeaderProps = Pick<ResumeMetadata, 'name' | 'location' | 'links'>;

function stripProtocol(url: string) {
  return url.replace(/^https?:\/\//, '').replace(/\/$/, '');
}

function ContactItem({
  icon,
  href,
  children,
}: {
  icon: ReactNode;
  href?: string;
  children: ReactNode;
}) {
  const theme = usePdfcnTheme();

  const label = (
    <Text
      style={{
        fontSize: theme.typography.body.fontSize,
        color: theme.colors.foreground,
        textDecoration: 'none',
      }}
      href={href}
    >
      {children}
    </Text>
  );

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
      }}
    >
      {icon}
      {label}
    </View>
  );
}

function ContactSeparator() {
  const theme = usePdfcnTheme();

  return (
    <Text
      style={{
        fontSize: theme.typography.body.fontSize,
        color: theme.colors.mutedForeground,
        marginLeft: 6,
        marginRight: 6,
      }}
    >
      |
    </Text>
  );
}

/** Identity block: declared in the frontmatter. */
export function ResumeHeader({ name, location, links }: ResumeHeaderProps) {
  const theme = usePdfcnTheme();
  const { heading } = theme.typography;

  return (
    <View style={{ alignItems: 'center', marginBottom: 0 }}>
      <h1
        style={
          flatten({
            fontFamily: heading.fontFamily,
            fontSize: heading.fontSize.h1,
            fontWeight: heading.fontWeight,
            lineHeight: heading.lineHeight,
            color: theme.colors.foreground,
            margin: 0,
            letterSpacing: 0.5,
          }) as CSSProperties
        }
      >
        {name}
      </h1>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}
      >
        <ContactItem icon={<GlobePdfIcon />} href={links.website}>
          {stripProtocol(links.website)}
        </ContactItem>
        <ContactSeparator />
        <ContactItem icon={<GitHubPdfIcon />} href={links.github}>
          {stripProtocol(links.github).replace(/^github\.com\//, '')}
        </ContactItem>
        <ContactSeparator />
        <ContactItem icon={<LinkedInPdfIcon />} href={links.linkedin}>
          {stripProtocol(links.linkedin).replace(/^linkedin\.com\/in\//, '')}
        </ContactItem>
        <ContactSeparator />
        <ContactItem icon={<MapPinPdfIcon />}>{location}</ContactItem>
      </View>
    </View>
  );
}
