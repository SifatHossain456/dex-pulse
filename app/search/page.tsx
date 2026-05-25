export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Search Tokens',
  description: 'Search for any token across all DEX chains — live pairs, price, volume and liquidity.',
}

import { searchPairs } from '@/lib/dexscreener'
import { PairRow, PairTableHeader } from '@/components/PairCard'
import { Search } from 'lucide-react'

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams
  const query = q?.trim() ?? ''
  const pairs = query ? await searchPairs(query) : []

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Search className="w-5 h-5 text-[#f97316]" />
        <div>
          <h1 className="text-xl font-black">
            {query ? `Results for "${query}"` : 'Search'}
          </h1>
          <p className="text-sm text-[#4b5563]">
            {pairs.length > 0 ? `${pairs.length} pairs found` : query ? 'No results' : 'Enter a token name, symbol or address'}
          </p>
        </div>
      </div>

      {pairs.length > 0 && (
        <div className="bg-[#0a0d14] border border-[#111827] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><PairTableHeader showRank={false} /></thead>
              <tbody>
                {pairs.slice(0, 50).map(p => <PairRow key={p.pairAddress} pair={p} />)}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!query && (
        <div className="bg-[#0a0d14] border border-[#111827] rounded-xl p-12 text-center">
          <Search className="w-10 h-10 text-[#1a2535] mx-auto mb-3" />
          <p className="text-[#4b5563] text-sm">Search for any token, memecoin, or DeFi protocol</p>
          <div className="flex flex-wrap gap-2 justify-center mt-4">
            {['PEPE', 'WIF', 'BONK', 'DOGE', 'SHIB', 'ARB', 'UNI', 'AAVE'].map(s => (
              <a key={s} href={`/search?q=${s}`}
                className="px-3 py-1.5 bg-[#111827] rounded-lg text-sm text-[#9ca3af] hover:text-[#f97316] hover:border-[#f97316] border border-[#1a2535] transition-colors">
                {s}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
