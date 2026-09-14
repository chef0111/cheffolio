'use no memo';
// Takumi runs these outside React's renderer, without the compiler runtime.

import { pointToCssPixel } from '@/lib/pdfcn/pdf-primitives';

type PdfIconProps = {
  /** Icon box in points; converted to CSS px for Takumi. */
  size?: number;
  color?: string;
};

type StrokeIconProps = PdfIconProps & { paths: string[] };

/**
 * Takumi embeds inline `<svg>` as vectors. Colors are set explicitly because
 * `currentColor` does not resolve inside the PDF serializer.
 */
function StrokeIcon({ size = 8, color = '#000000', paths }: StrokeIconProps) {
  const px = pointToCssPixel(size);

  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}

export function GlobePdfIcon(props: PdfIconProps) {
  return (
    <StrokeIcon
      {...props}
      paths={[
        'M12 2a10 10 0 1 0 0 20 10 10 0 1 0 0-20z',
        'M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20',
        'M2 12h20',
      ]}
    />
  );
}

export function MapPinPdfIcon(props: PdfIconProps) {
  return (
    <StrokeIcon
      {...props}
      paths={[
        'M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0',
        'M12 13a3 3 0 1 0 0-6 3 3 0 1 0 0 6z',
      ]}
    />
  );
}

export function ExternalLinkPdfIcon(props: PdfIconProps) {
  return (
    <StrokeIcon
      {...props}
      paths={[
        'M15 3h6v6',
        'M10 14 21 3',
        'M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6',
      ]}
    />
  );
}

export function GitHubPdfIcon({ size = 8, color = '#000000' }: PdfIconProps) {
  const px = pointToCssPixel(size);

  return (
    <svg width={px} height={px} viewBox="0 0 16 16" fill={color}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z"
      />
    </svg>
  );
}

export function LinkedInPdfIcon({ size = 8, color = '#000000' }: PdfIconProps) {
  const px = pointToCssPixel(size);

  return (
    <svg width={px} height={px} viewBox="0 0 24 24" fill={color}>
      <path d="M21.418 1H2.584C1.634 1 1 1.628 1 2.572v18.855C1 22.373 1.792 23 2.583 23h18.834c.95 0 1.583-.628 1.583-1.572V2.573C23.001 1.627 22.367 1 21.418 1ZM7.49 19.7H4.166V9.172h3.323L7.49 19.7ZM5.906 7.757c-1.108 0-1.898-.785-1.898-1.885S4.8 3.985 5.906 3.985c1.11 0 1.9.787 1.9 1.887s-.95 1.885-1.9 1.885ZM19.836 19.7h-3.324v-5.028c0-1.257 0-2.83-1.742-2.83-1.74 0-1.9 1.258-1.9 2.673V19.7H9.548V9.172h3.166v1.413c.633-1.1 1.9-1.728 3.165-1.728 3.325 0 3.957 2.2 3.957 5.028V19.7Z" />
    </svg>
  );
}
