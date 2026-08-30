import { resolveAudioAssetUrl } from '@/lib/audio-assets';

export async function GET(
  _request: Request,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  const url = resolveAudioAssetUrl(path);
  if (!url) {
    return new Response(null, { status: 404 });
  }

  const upstream = await fetch(url, {
    headers: { accept: 'audio/*,*/*' },
  });

  if (!upstream.ok || !upstream.body) {
    return new Response(null, { status: upstream.status === 404 ? 404 : 502 });
  }

  return new Response(upstream.body, {
    status: 200,
    headers: {
      'content-type':
        upstream.headers.get('content-type') ?? 'application/octet-stream',
      'cache-control': 'public, max-age=86400, immutable',
    },
  });
}
