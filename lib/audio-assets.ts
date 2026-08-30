export const ASSETS_ORIGIN = 'https://assets.giabao.dev';
export const AUDIO_PROXY_PREFIX = '/api/audio';

const AUDIO_EXTENSIONS = new Set([
  'mp3',
  'wav',
  'ogg',
  'oga',
  'm4a',
  'aac',
  'webm',
]);

export function toSameOriginAudioUrl(url: string) {
  if (!url.startsWith(ASSETS_ORIGIN)) return url;
  return `${AUDIO_PROXY_PREFIX}${url.slice(ASSETS_ORIGIN.length)}`;
}

export function resolveAudioAssetUrl(segments: string[]): string | null {
  if (segments.length === 0) return null;

  for (const segment of segments) {
    if (!segment || segment === '.' || segment === '..') return null;
    if (
      segment.includes('/') ||
      segment.includes('\\') ||
      segment.includes('\0')
    ) {
      return null;
    }
  }

  const last = segments[segments.length - 1];
  const dot = last.lastIndexOf('.');
  if (dot < 1) return null;

  const ext = last.slice(dot + 1).toLowerCase();
  if (!AUDIO_EXTENSIONS.has(ext)) return null;

  return `${ASSETS_ORIGIN}/${segments.map(encodeURIComponent).join('/')}`;
}
