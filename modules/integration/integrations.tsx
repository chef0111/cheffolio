import { cn } from '@/lib/utils';
import { FullWidthDivider } from '@/components/ui/full-width-divider';
import { DecorIcon } from '../../components/ui/decor-icon';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

type LogoType = {
  src: string;
  alt: string;
};

type TileData = {
  row: number;
  col: number;
  logo?: LogoType;
};

export function Integrations() {
  return (
    <div className="relative mx-auto grid max-w-4xl grid-cols-1 gap-12 md:grid-cols-2 md:items-center">
      <DecorIcon className="size-4" position="top-left" />
      <DecorIcon className="size-4" position="top-right" />
      <DecorIcon className="size-4" position="bottom-left" />
      <DecorIcon className="size-4" position="bottom-right" />

      <FullWidthDivider className="-top-px" />

      {/* Left Content */}
      <div className="p-4 md:p-6">
        <div className="space-y-4">
          <h2 className="text-foreground text-3xl font-medium tracking-tight sm:text-4xl">
            Connect with your favorite tools
          </h2>
          <p className="text-muted-foreground text-sm md:text-base">
            Connect your favorite tools with our growing library of
            integrations.
          </p>
          <Button size="sm">Explore integrations</Button>
        </div>
      </div>

      {/* Right Content - Visual */}
      <div className="place-items-end">
        <div className="relative size-80">
          {/* Grid Background */}
          <div
            className={cn(
              'absolute inset-0 size-full',
              'bg-[linear-gradient(to_right,theme(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,theme(--color-border)_1px,transparent_1px)]',
              'bg-size-[64px_64px]',
              'mask-[radial-gradient(ellipse_at_center,black,black,transparent)]'
            )}
          />

          {tiles.map((tile) => (
            <IntegrationCard key={`${tile.row}_${tile.col}`} {...tile} />
          ))}
        </div>
      </div>

      <FullWidthDivider className="-bottom-px" />
    </div>
  );
}

function IntegrationCard({ row, col, logo }: TileData) {
  return (
    <div
      className={cn(
        'absolute flex size-16 items-center justify-center',
        logo ? 'bg-secondary/40' : '' // Styling for empty tiles
      )}
      style={{
        left: col * 64, // 64px cell
        top: row * 64,
      }}
    >
      {logo && (
        <Image
          alt={logo.alt}
          className={cn(
            'pointer-events-none size-8 object-contain p-1 select-none dark:invert'
          )}
          height={40}
          src={logo.src}
          width={40}
        />
      )}
    </div>
  );
}

// Coordinate mapping to approximate the "scattered" look in the image.
// Grid 6x5.
const tiles: TileData[] = [
  // Row 0
  {
    row: 0,
    col: 1,
    logo: {
      src: 'https://storage.efferd.com/logo/vercel.svg',
      alt: 'Vercel Logo',
    },
  },
  {
    row: 0,
    col: 3,
    logo: {
      src: 'https://storage.efferd.com/logo/openai.svg',
      alt: 'OpenAI Logo',
    },
  },

  // Row 1
  { row: 1, col: 0 }, // Empty
  {
    row: 1,
    col: 2,
    logo: {
      src: 'https://storage.efferd.com/logo/cursor.svg',
      alt: 'Cursor Logo',
    },
  },
  {
    row: 1,
    col: 4,
    logo: {
      src: 'https://storage.efferd.com/logo/v0.svg',
      alt: 'V0 Logo',
    },
  },

  // Row 2
  {
    row: 2,
    col: 1,
    logo: {
      src: 'https://storage.efferd.com/logo/planetscale.svg',
      alt: 'Planetscale Logo',
    },
  },
  { row: 2, col: 3 }, // Empty

  // Row 3

  { row: 3, col: 0 }, // Empty
  {
    row: 3,
    col: 2,
    logo: {
      src: 'https://storage.efferd.com/logo/base-ui.svg',
      alt: 'Base UI Logo',
    },
  },
  {
    row: 3,
    col: 4,
    logo: {
      src: 'https://storage.efferd.com/logo/copilot.svg',
      alt: 'Copilot Logo',
    },
  },

  // Row 4
  {
    row: 4,
    col: 1,
    logo: {
      src: 'https://storage.efferd.com/logo/github.svg',
      alt: 'GitHub Logo',
    },
  },
  {
    row: 4,
    col: 3,
    logo: {
      src: 'https://storage.efferd.com/logo/dub.svg',
      alt: 'Dub Logo',
    },
  },
];
