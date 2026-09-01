import { Suspense } from 'react';

import { Brand } from '@/components/cheffolio/brand';
import { PanelContent } from '@/components/cheffolio/panel';
import { GitHubIcon, LinkedinIcon, XIcon } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { FOOTER_SLOGAN, GITHUB_REPO_URL, UTM_PARAMS } from '@/config/site';
import { USER } from '@/features/portfolio/data/user';
import { addQueryParams } from '@/utils/url';

import { ChainOfSlogan } from './chain-of-slogan';
import { FooterCopyright } from './copyright';

export function SiteFooter() {
  return (
    <footer className="relative w-full min-w-0 px-2" aria-label="Site footer">
      <div className="border-border screen-line-bottom mx-auto border-x group-has-data-[slot=layout-wide]/layout:container md:max-w-4xl">
        <div className="flex flex-col gap-4 pt-4">
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center gap-2">
              <Brand className="mr-2 h-4" />
              {socialLinks.map(({ href, label, icon }) => (
                <Button
                  key={label}
                  size="icon-sm"
                  variant="ghost"
                  aria-label={label}
                  className="text-muted-foreground hover:text-foreground"
                  render={
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                    />
                  }
                  nativeButton={false}
                >
                  {icon}
                  <span className="sr-only">{label}</span>
                </Button>
              ))}
            </div>
            <p className="text-muted-foreground text-center font-mono text-sm text-balance">
              Source code available on{' '}
              <a
                href={addQueryParams(GITHUB_REPO_URL, UTM_PARAMS)}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline text-foreground font-medium"
              >
                GitHub
              </a>
            </p>
          </div>

          <PanelContent className="screen-line-bottom screen-line-top decor-all flex w-full justify-center p-0">
            <ChainOfSlogan
              className="mx-auto"
              itemClassName="font-pixel"
              slogan={FOOTER_SLOGAN}
            />
          </PanelContent>
        </div>

        <div className="flex max-w-4xl flex-col justify-between gap-2 py-4">
          <Suspense
            fallback={
              <p className="text-muted-foreground font-pixel-square text-center text-sm">
                &copy; 2026 giabao.dev, built by chef0111
              </p>
            }
          >
            <FooterCopyright />
          </Suspense>
        </div>
      </div>

      <div className="pb-[env(safe-area-inset-bottom,0px)] sm:hidden">
        <div className="flex h-23" />
      </div>
    </footer>
  );
}

const socialLinks = [
  {
    href: addQueryParams(USER.socialLinks.x, UTM_PARAMS),
    label: 'X',
    icon: <XIcon />,
  },
  {
    href: addQueryParams(USER.socialLinks.github, UTM_PARAMS),
    label: 'Github',
    icon: <GitHubIcon />,
  },
  {
    href: addQueryParams(USER.socialLinks.linkedin, UTM_PARAMS),
    label: 'Linkedin',
    icon: <LinkedinIcon />,
  },
];
