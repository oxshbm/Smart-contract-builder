import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import { BackgroundEffects } from './components/background-effects';
import { PrismInitializer } from './components/PrismInitializer';

export const metadata: Metadata = {
  title: 'MultiversX Smart Contract Builder',
  description: 'Create, customize, and deploy secure smart contracts on MultiversX without writing code',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png'
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get current year for the copyright notice
  const currentYear = new Date().getFullYear();

  return (
    <html lang="en" className="dark">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-black text-white font-inter relative overflow-x-hidden">
        {/* Initialize Prism for code highlighting */}
        <PrismInitializer />
        
        {/* Background Effects - Client Component imported separately */}
        <BackgroundEffects />
        
        {/* Main content */}
        <main className="flex-grow relative z-10">
          {children}
        </main>
      </body>
    </html>
  );
}