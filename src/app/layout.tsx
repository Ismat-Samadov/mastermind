import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Mastermind — Crack the Code',
  icons: { icon: '/favicon.svg', shortcut: '/favicon.svg' },
  description:
    'A neon-cyberpunk Mastermind code-breaking game. Challenge the AI, crack codes, and chase the high score.',
  keywords: ['mastermind', 'game', 'code-breaking', 'puzzle', 'browser game', 'neon'],
  openGraph: {
    title: 'Mastermind — Crack the Code',
    description: 'A neon-cyberpunk Mastermind code-breaking game.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#050010',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" style={{ backgroundColor: '#050010', color: '#e0e0ff', height: '100%', overflow: 'hidden' }}>
      {/* Inline critical CSS — loaded before any external stylesheet so the
          page is never briefly unstyled. This guarantees dark-bg + light-text
          regardless of Tailwind class loading order or browser quirks. */}
      <head>
        <style dangerouslySetInnerHTML={{ __html: `
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          html, body {
            height: 100%;
            overflow: hidden;
            background-color: #050010;
            color: #e0e0ff;
          }
          #__next, [data-nextjs-root-layout] {
            height: 100%;
            background-color: #050010;
            color: #e0e0ff;
          }
        `}} />
      </head>
      <body
        style={{ backgroundColor: '#050010', color: '#e0e0ff', height: '100%', overflow: 'hidden' }}
        className="antialiased"
      >
        {children}
      </body>
    </html>
  );
}
