import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const script = localFont({
  src: '../fonts/Parisienne-Regular.ttf',
  variable: '--font-script', display: 'swap'
});
const serif = localFont({
  src: [
    { path: '../fonts/CormorantGaramond.ttf', style: 'normal' },
    { path: '../fonts/CormorantGaramond-Italic.ttf', style: 'italic' }
  ],
  variable: '--font-serif', display: 'swap'
});

export const metadata: Metadata = {
  title: 'Mazen & Nourhan — 5 August 2026',
  description: 'Together with our families, we invite you to celebrate our wedding at The Étoile Grand, King Mariout.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.MazenAndNourhan.com'),
  manifest: '/manifest.webmanifest',
  openGraph: {
    title: 'Mazen & Nourhan — Wedding Invitation',
    description: 'You are invited. 5 August 2026 · The Étoile Grand, King Mariout.',
    images: ['/invitation.png'], type: 'website'
  },
  icons: { icon: '/qr-code.png', apple: '/qr-code.png' }
};
export const viewport: Viewport = { themeColor: '#213A2A', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${script.variable} ${serif.variable}`}>
      <body>
        {children}
        <script dangerouslySetInnerHTML={{
          __html: `if('serviceWorker' in navigator){window.addEventListener('load',function(){navigator.serviceWorker.register('/sw.js').catch(function(){})})}`
        }} />
      </body>
    </html>
  );
}
