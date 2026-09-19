import type { Metadata } from 'next';
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { TopNav } from '@/components/dashboard/TopNav';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'PAYTM AUTOPILOT — Autonomous Customer Operations',
  description:
    'Paytm Autopilot — Autonomous AI Customer Operations OS. Understands. Investigates. Decides. Acts. Verifies.',
  icons: {
    icon: '/paytm-logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} dark`}
    >
      <body className="min-h-screen bg-[#040814] text-slate-100 font-sans antialiased selection:bg-[#00BAF2]/30 selection:text-[#00BAF2]">
        <TopNav />
        {children}
      </body>
    </html>
  );
}

