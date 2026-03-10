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
    <html lang="en" className="h-full overflow-hidden">
      <body
        className="h-full overflow-hidden bg-[#050010] text-white antialiased font-sans"
      >
        {children}
      </body>
    </html>
  );
}
