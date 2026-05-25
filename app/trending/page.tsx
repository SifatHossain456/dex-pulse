export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Trending Tokens',
  description: 'Top trending DEX tokens right now — live volume, liquidity, and price changes across every chain.',
}

import { searchPairs } from '@/lib/dexscreener'
import { PairRow, PairTableHeader } from '@/components/PairCard'
import { TrendingUp } from 'lucide-react'

export default async function TrendingPage() {
  const pairs = await searchPairs('PEPE DOGE SHIB FLOKI WIF BONK')
  const top = pairs
    .filter(p => (p.liquidity?.usd ?? 0) > 20000)
    .sort((a, b) => (b.priceChange?.h24 ?? 0) - (a.priceChange?.h24 ?? 0))
    .slice(0, 50)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <TrendingUp className="w-5 h-5 text-[#f97316]" />
        <div>
          <h1 className="text-xl font-black">Trending</h1>
          <p className="text-sm text-[#4b5563]">Top gainers across all chains (24h)</p>
        </div>
      </div>

      <div className="bg-[#0a0d14] border border-[#111827] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><PairTableHeader /></thead>
            <tbody>
              {top.map((p, i) => <PairRow key={p.pairAddress} pair={p} rank={i + 1} />)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
