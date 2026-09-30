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

const PANEL_DECOR_POSITIONS = [
  { top: 41, left: 41 },
  { top: 41, right: 41 },
  { bottom: 41, left: 41 },
  { bottom: 41, right: 41 },
] as const;

const BRAND_MARK_PATH =
  'M40 0h120v40H40ZM0 40h40v120H0ZM80 80h80v80H120v-40H80ZM40 160h80v40H40ZM200 0h120v40H240v40h80v40H240v40h80v40H200ZM320 40h40v40H320ZM320 120h40v40H320ZM331 53 331 56 328 56 328 59 325 59 325 62 328 62 328 65 331 65 331 68 334 68 334 65 331 65 331 62 328 62 328 59 331 59 331 56 334 56 334 53ZM340 51 337 70 339 70 342 51ZM346 53 346 56 349 56 349 59 352 59 352 62 349 62 349 65 346 65 346 68 349 68 349 65 352 65 352 62 355 62 355 59 352 59 352 56 349 56 349 53ZM327 131 327 135 331 135 331 139 335 139 335 143 331 143 331 147 327 147 327 151 331 151 331 147 335 147 335 143 339 143 339 139 335 139 335 135 331 135 331 131ZM343 147h12v4H343Z';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const title = clampParam(searchParams.get('title'), 160);
  const description = clampParam(searchParams.get('description'), 320);

  return new ImageResponse(
    <div
      tw="flex h-full w-full bg-[#09090b] text-white"
      style={{ fontFamily: 'Geist Sans', backgroundColor: '#09090b' }}
    >
      <div tw="flex border absolute border-stone-700 border-dashed inset-y-0 left-16 w-[1px]" />
      <div tw="flex border absolute border-stone-700 border-dashed inset-y-0 right-16 w-[1px]" />
      <div tw="flex border absolute border-stone-700 inset-x-0 h-[1px] top-16" />
      <div tw="flex border absolute border-stone-700 inset-x-0 h-[1px] bottom-16" />

      {PANEL_DECOR_POSITIONS.map((position, index) => (
        <div
          key={index}
          tw="absolute flex items-center justify-center"
          style={{ ...position, width: 48, height: 48 }}
        >
          <svg
            width={48}
            height={48}
            viewBox="0 0 24 24"
            fill="none"
            stroke="#09090b"
            strokeWidth={5}
            strokeLinecap="round"
            style={{ position: 'absolute' }}
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          <svg
            width={30}
            height={30}
            viewBox="0 0 24 24"
            fill="none"
            stroke="#a9a9a9"
            strokeOpacity={0.3}
            strokeWidth={2.5}
            strokeLinecap="round"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
        </div>
      ))}

      <div tw="flex absolute flex-row bottom-24 right-24 text-white">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 360 200"
          width={72}
          height={40}
        >
          <path fill="currentColor" fillRule="evenodd" d={BRAND_MARK_PATH} />
        </svg>
      </div>

      <div tw="flex flex-col absolute w-[896px] justify-center inset-32">
        <div
          tw="tracking-tight flex-grow-1 flex flex-col justify-center leading-[1.1]"
          style={{
            textWrap: 'balance',
            fontWeight: 600,
            fontSize: title && title.length > 20 ? 64 : 80,
            letterSpacing: '-0.04em',
          }}
        >
          {title}
        </div>
        <div
          tw="text-[40px] leading-[1.5] flex-grow-1 text-stone-400"
          style={{
            fontWeight: 500,
            textWrap: 'balance',
          }}
        >
          {description}
        </div>
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
