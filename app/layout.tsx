import './globals.css';

import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono as GeistMono } from 'next/font/google';
import type { WebSite, WithContext } from 'schema-dts';
import { META_THEME_COLORS, SITE_INFO, X_USERNAME } from '@/config/site';

import { USER } from '@/modules/portfolio/data/user';
import { ThemeProvider } from '@/context/theme-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ScrollToTop } from '@/components/cheffolio/scroll-to-top';
import { Toaster } from '@/components/ui/sonner';
import Script from 'next/script';

function getWebSiteJsonLd(): WithContext<WebSite> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_INFO.name,
    url: SITE_INFO.url,
    alternateName: [USER.username],
  };
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_INFO.url),
  title: {
    template: `%s – ${SITE_INFO.name}`,
    default: `${SITE_INFO.name}`,
  },
  description: SITE_INFO.description,
  keywords: SITE_INFO.keywords,
  authors: [
    {
      name: 'ncdai',
      url: SITE_INFO.url,
    },
  ],
  creator: 'ncdai',
  openGraph: {
    siteName: SITE_INFO.name,
    url: '/',
    type: 'profile',
    locale: 'en_US',
    firstName: USER.firstName,
    lastName: USER.lastName,
    username: USER.username,
    gender: USER.gender,
    images: [
      {
        url: SITE_INFO.ogImage,
        width: 1200,
        height: 630,
        alt: SITE_INFO.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: X_USERNAME,
    creator: X_USERNAME,
    images: [SITE_INFO.ogImage],
  },
  icons: {
    icon: [
      {
        url: 'https://res.cloudinary.com/dpuqj2n2q/image/upload/cheffolio.favicon.ico',
        sizes: 'any',
      },
      {
        url: 'https://res.cloudinary.com/dpuqj2n2q/image/upload/cheffolio.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: {
      url: 'https://res.cloudinary.com/dpuqj2n2q/image/upload/apple-touch-icon.png',
      type: 'image/png',
      sizes: '180x180',
    },
  },
};

const darkModeScript = String.raw`
  try {
    if (localStorage.theme === 'dark' || ((!('theme' in localStorage) || localStorage.theme === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.querySelector('meta[name="theme-color"]').setAttribute('content', '${META_THEME_COLORS.dark}')
    }
  } catch (_) {}

  try {
    if (/(Mac|iPhone|iPod|iPad)/i.test(navigator.platform)) {
      document.documentElement.classList.add('os-macos')
    }
  } catch (_) {}
`;

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: META_THEME_COLORS.light,
};

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = GeistMono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {darkModeScript}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getWebSiteJsonLd()).replace(/</g, '\\u003c'),
          }}
        />
      </head>
      <body className="flex min-h-full flex-col overflow-x-hidden">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            {children}
            <ScrollToTop />
          </TooltipProvider>
          <Toaster closeButton position="bottom-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
