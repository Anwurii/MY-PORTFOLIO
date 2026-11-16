import type { Metadata, Viewport } from 'next'
import { site } from '../data/site'
import { SITE_URL, buildJsonLd, hasRealDomain } from '../lib/seo'
import { themeScript } from '../lib/theme'
import { InlineScript } from '../components/InlineScript'
import { Cursor } from '../components/Cursor/Cursor'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: site.meta.title,
    template: `%s — ${site.name}`,
  },
  description: site.meta.description,
  applicationName: site.name,
  authors: [{ name: site.name }],
  creator: site.name,
  publisher: site.name,
  keywords: [
    site.name,
    'product designer',
    'portfolio',
    'UI design',
    'UX design',
    ...site.ticker.map((t) => t.toLowerCase()),
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'profile',
    url: '/',
    siteName: `${site.name} — ${site.role}`,
    title: site.meta.title,
    description: site.meta.description,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: site.meta.title,
    description: site.meta.description,
  },
  // Until a real domain is configured, keep the site out of the index rather
  // than let a preview URL get crawled and compete with the real one.
  robots: hasRealDomain
    ? {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-image-preview': 'large',
          'max-snippet': -1,
          'max-video-preview': -1,
        },
      }
    : { index: false, follow: false },
  category: 'design',
}

export const viewport: Viewport = {
  themeColor: '#000000',
  colorScheme: 'dark light',
  width: 'device-width',
  initialScale: 1,
}


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    /*
     * suppressHydrationWarning is needed on <html> for two reasons, and it
     * only covers this element's own attributes — not its descendants:
     *  1. the script above intentionally rewrites data-theme before React
     *     hydrates, so the attribute legitimately differs from the HTML;
     *  2. browser extensions commonly inject attributes here (webcrx,
     *     data-lt-installed, cz-shortcut-listen …) before React loads.
     */
    <html lang="en" dir="ltr" data-theme="dark" suppressHydrationWarning>
      <head>
        <InlineScript html={themeScript} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd()) }}
        />
      </head>
      <body id="top">
        <Cursor />
        {children}
      </body>
    </html>
  )
}
