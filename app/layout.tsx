import type { Metadata } from 'next'
import './globals.css'
import Providers from './providers'
import Navbar from '@/components/Navbar'

export const metadata: Metadata = {
  title: { default: 'DexPulse — Real-Time DEX Token Tracker', template: '%s — DexPulse' },
  description: 'Track trending tokens, new launches, and live DEX pairs across every chain. Powered by DexScreener.',
  keywords: ['DEX', 'token tracker', 'trending tokens', 'DeFi', 'crypto', 'DexScreener', 'new launches'],
  openGraph: {
    title: 'DexPulse — Real-Time DEX Token Tracker',
    description: 'Track trending tokens, new launches, and live DEX pairs across every chain.',
    type: 'website',
    siteName: 'DexPulse',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DexPulse — Real-Time DEX Token Tracker',
    description: 'Track trending tokens, new launches, and live DEX pairs across every chain.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          <main className="max-w-7xl mx-auto px-4 py-6">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
}
