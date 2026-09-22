import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { ImageResponse } from 'next/og';

import { clampParam } from '../params';

const geistSemiBold = readFileSync(
  join(process.cwd(), 'assets/fonts/Geist-SemiBold.ttf')
);

const geistMonoRegular = readFileSync(
  join(process.cwd(), 'assets/fonts/GeistMono-Regular.ttf')
);

const BRAND_MARK_PATH =
  'M40 0h120v40H40ZM0 40h40v120H0ZM80 80h80v80H120v-40H80ZM40 160h80v40H40ZM200 0h120v40H240v40h80v40H240v40h80v40H200ZM320 40h40v40H320ZM320 120h40v40H320ZM331 53 331 56 328 56 328 59 325 59 325 62 328 62 328 65 331 65 331 68 334 68 334 65 331 65 331 62 328 62 328 59 331 59 331 56 334 56 334 53ZM340 51 337 70 339 70 342 51ZM346 53 346 56 349 56 349 59 352 59 352 62 349 62 349 65 346 65 346 68 349 68 349 65 352 65 352 62 355 62 355 59 352 59 352 56 349 56 349 53ZM327 131 327 135 331 135 331 139 335 139 335 143 331 143 331 147 327 147 327 151 331 151 331 147 335 147 335 143 339 143 339 139 335 139 335 135 331 135 331 131ZM343 147h12v4H343Z';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const title = clampParam(searchParams.get('title'), 160);
  const description = clampParam(searchParams.get('description'), 320);

  return new ImageResponse(
    <div tw="flex h-full w-full bg-black text-zinc-50">
      <div tw="absolute inset-y-0 left-12 flex w-px border border-zinc-800" />
      <div tw="absolute inset-y-0 right-12 flex w-px border border-zinc-800" />
      <div tw="absolute inset-x-0 top-12 flex h-px border border-zinc-800" />
      <div tw="absolute inset-x-0 bottom-12 flex h-px border border-zinc-800" />

      <div tw="absolute top-18 left-18 flex">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 360 200"
          width={144}
          height={80}
        >
          <path fill="currentColor" fillRule="evenodd" d={BRAND_MARK_PATH} />
        </svg>
      </div>

      <div tw="absolute inset-x-0 top-40 bottom-24 flex flex-col justify-end border-t-2 border-zinc-800">
        <div
          tw="border-t-2 border-b-2 border-zinc-800 px-18"
          style={{
            fontFamily: 'GeistSans',
            fontWeight: 600,
            fontSize: 64,
            lineHeight: 1,
            textWrap: 'balance',
            letterSpacing: '-0.025em',
          }}
        >
          {title}
        </div>

        {description && (
          <div tw="flex flex-col">
            <div
              tw="border-b-2 border-zinc-800 px-18 py-8 text-zinc-400"
              style={{
                fontFamily: 'GeistMono',
                fontWeight: 400,
                fontSize: 32,
                lineHeight: 1.25,
                textWrap: 'balance',
              }}
            >
              {description}
            </div>
          </div>
        )}
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'GeistSans',
          data: geistSemiBold,
          weight: 600,
        },
        {
          name: 'GeistMono',
          data: geistMonoRegular,
          weight: 400,
        },
      ],
      headers: {
        'Cache-Control': 'public, max-age=3600, s-maxage=31536000, immutable',
      },
    }
  );
}
