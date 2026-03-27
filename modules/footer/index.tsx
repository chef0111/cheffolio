import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { GithubIcon, XIcon, LinkedinIcon } from '@/components/icons';
import { Brand } from '@/components/cheffolio/brand';
import { Suspense } from 'react';
import { FooterCopyright } from './copyright';
import { FullWidthDivider } from '@/components/cheffolio/full-width-divider';
import { Separator } from '@/components/ui/separator';
import { addQueryParams } from '@/utils/url';
import { UTM_PARAMS } from '@/config/site';

export function Footer() {
  return (
    <footer className="relative">
      <div className={cn('border-line mx-auto max-w-4xl border-x px-4')}>
        <div className="flex flex-col gap-4 pt-4">
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center gap-2">
              <Brand className="mr-2 h-4" />
              {socialLinks.map(({ href, label, icon }) => (
                <Button
                  asChild
                  key={label}
                  size="icon-sm"
                  variant="ghost"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <a
                    aria-label={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {icon}
                  </a>
                </Button>
              ))}
            </div>
            <p className="text-muted-foreground text-center font-mono text-sm text-balance">
              Source code available on{' '}
              <a
                href={addQueryParams(
                  'https://github.com/chef0111/cheffolio',
                  UTM_PARAMS
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground underline underline-offset-4"
              >
                GitHub
              </a>
            </p>
          </div>

          <nav className="screen-line-top mx-auto">
            <ul className="text-muted-foreground flex flex-wrap gap-1.5 text-sm font-medium sm:gap-3">
              {slogan.map((word) => (
                <li key={word.key}>
                  <span className="hover:text-foreground flex items-center gap-1.5 font-mono select-none sm:gap-3 sm:font-semibold">
                    <Separator
                      className="border-line h-6 sm:h-8"
                      orientation="vertical"
                    />
                    {word.label}
                  </span>
                </li>
              ))}
              <Separator
                className="border-line h-6 sm:h-8"
                orientation="vertical"
              />
            </ul>
          </nav>
        </div>

        <FullWidthDivider />
        <div className="flex max-w-4xl flex-col justify-between gap-2 py-4">
          <Suspense>
            <FooterCopyright />
          </Suspense>
        </div>
      </div>
    </footer>
  );
}

const slogan = [
  { key: 0, label: 'C' },
  { key: 1, label: 'O' },
  { key: 2, label: 'D' },
  { key: 3, label: 'I' },
  { key: 4, label: 'N' },
  { key: 5, label: 'G' },
  { key: 6, label: '•' },
  { key: 7, label: 'A' },
  { key: 8, label: 'S' },
  { key: 9, label: '•' },
  { key: 10, label: 'C' },
  { key: 11, label: 'H' },
  { key: 12, label: 'E' },
  { key: 13, label: 'F' },
];

const socialLinks = [
  {
    href: addQueryParams('https://x.com/cheff0111', UTM_PARAMS),
    label: 'X',
    icon: <XIcon />,
  },
  {
    href: addQueryParams('https://github.com/chef0111', UTM_PARAMS),
    label: 'Github',
    icon: <GithubIcon />,
  },
  {
    href: addQueryParams('https://www.linkedin.com/in/chef0111', UTM_PARAMS),
    label: 'Linkedin',
    icon: <LinkedinIcon />,
  },
];
