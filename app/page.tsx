export const dynamic = 'force-dynamic'

import { getTopBoosted, getLatestProfiles, fmtUsd, fmtPrice, fmtPct, chainLabel, chainColor, type TokenBoost, type TokenProfile } from '@/lib/dexscreener'
import { searchPairs } from '@/lib/dexscreener'
import { PairRow, PairTableHeader } from '@/components/PairCard'
import { Flame, Rocket, TrendingUp, TrendingDown, ExternalLink, Zap } from 'lucide-react'
import Link from 'next/link'

async function HotPairs() {
  const pairs = await searchPairs('WETH')
  const top = pairs
    .filter(p => (p.liquidity?.usd ?? 0) > 50000 && (p.volume?.h24 ?? 0) > 10000)
    .sort((a, b) => (b.volume?.h24 ?? 0) - (a.volume?.h24 ?? 0))
    .slice(0, 20)

  return (
    <div className="bg-[#0a0d14] border border-[#111827] rounded-xl overflow-hidden">
      <div className="px-5 py-3.5 border-b border-[#111827] flex items-center gap-2">
        <Flame className="w-4 h-4 text-[#f97316]" />
        <h2 className="font-bold text-sm">Hot Pairs</h2>
        <span className="w-1.5 h-1.5 rounded-full bg-[#f97316] live-dot ml-auto" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead><PairTableHeader /></thead>
          <tbody>
            {top.map((p, i) => <PairRow key={p.pairAddress} pair={p} rank={i + 1} />)}
          </tbody>
        </table>
      </div>
    </div>
  )
}

async function BoostedTokens() {
  const boosted = await getTopBoosted()
  const top = boosted.slice(0, 8)
  return (
    <div className="bg-[#0a0d14] border border-[#111827] rounded-xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <Rocket className="w-4 h-4 text-[#f97316]" />
        <h2 className="font-bold text-sm">Boosted</h2>
        <span className="text-[10px] text-[#4b5563] ml-auto">Promoted tokens</span>
      </div>
      <div className="space-y-2.5">
        {top.map(t => {
          const color = chainColor(t.chainId)
          return (
            <a key={t.tokenAddress} href={t.url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2.5 group">
              {t.icon ? (
                <img src={t.icon} alt="" className="w-8 h-8 rounded-full object-cover shrink-0 bg-[#111827]" />
              ) : (
                <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold"
                  style={{ background: `${color}33`, color }}>{t.chainId.slice(0, 2).toUpperCase()}</div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold truncate group-hover:text-[#f97316] transition-colors">
                  {t.description?.split(' ').slice(0, 4).join(' ') ?? t.tokenAddress.slice(0, 12) + '…'}
                </p>
                <span className="text-[9px] px-1 py-0.5 rounded font-medium" style={{ background: `${color}22`, color }}>
                  {chainLabel(t.chainId)}
                </span>
              </div>
              <div className="flex items-center gap-1 text-[#4b5563] shrink-0">
                <Zap className="w-3 h-3 text-[#f97316]" />
                <span className="text-[10px] text-[#f97316] font-semibold">{t.amount}</span>
              </div>
            </a>
          )
        })}
      </div>
    </div>
  )
}

async function GainerLosers() {
  const pairs = await searchPairs('USD')
  const filtered = pairs.filter(p => (p.liquidity?.usd ?? 0) > 10000 && p.priceChange?.h24 !== undefined)
  const gainers = [...filtered].sort((a, b) => (b.priceChange?.h24 ?? 0) - (a.priceChange?.h24 ?? 0)).slice(0, 5)
  const losers = [...filtered].sort((a, b) => (a.priceChange?.h24 ?? 0) - (b.priceChange?.h24 ?? 0)).slice(0, 5)

  const List = ({ items, label, up }: { items: typeof gainers; label: string; up: boolean }) => (
    <div className="bg-[#0a0d14] border border-[#111827] rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        {up ? <TrendingUp className="w-4 h-4 text-[#22c55e]" /> : <TrendingDown className="w-4 h-4 text-[#ef4444]" />}
        <h3 className="font-bold text-sm">{label}</h3>
      </div>
      <div className="space-y-2">
        {items.map(p => {
          const color = chainColor(p.chainId)
          const chg = p.priceChange?.h24 ?? 0
          return (
            <Link key={p.pairAddress} href={`/token/${p.chainId}/${p.baseToken.address}`}
              className="flex items-center gap-2 group">
              {p.info?.imageUrl
                ? <img src={p.info.imageUrl} alt={p.baseToken.symbol} className="w-7 h-7 rounded-full shrink-0 bg-[#111827] object-cover" />
                : <div className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold"
                    style={{ background: `${color}33`, color }}>{p.baseToken.symbol.slice(0, 2)}</div>
              }
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold truncate group-hover:text-[#f97316] transition-colors">{p.baseToken.symbol}</p>
                <p className="text-[9px] text-[#4b5563]">{fmtPrice(p.priceUsd)}</p>
              </div>
              <span className={`text-xs font-bold ${chg >= 0 ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
                {fmtPct(chg)}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )

  return (
    <div className="grid grid-cols-2 gap-3">
      <List items={gainers} label="Top Gainers" up={true} />
      <List items={losers} label="Top Losers" up={false} />
    </div>
  )
}

export default async function HomePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black">DexPulse</h1>
          <p className="text-sm text-[#4b5563] mt-0.5">Real-time DEX data across every chain</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#4b5563]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] live-dot" />
          Live · DexScreener
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
        <div className="xl:col-span-3 space-y-4">
          <HotPairs />
        </div>
        <div className="space-y-4">
          <BoostedTokens />
        </div>
      </div>

      <GainerLosers />
    </div>
  )
}
