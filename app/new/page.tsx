export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'New Launches',
  description: 'Freshly launched DEX tokens — discover new pairs before they go viral.',
}

import { getLatestPairs, fmtUsd, fmtPrice, fmtPct, chainLabel, chainColor, timeAgo } from '@/lib/dexscreener'
import { Rocket, ExternalLink, TrendingUp, TrendingDown } from 'lucide-react'
import Link from 'next/link'

export default async function NewPage() {
  const pairs = await getLatestPairs()

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Rocket className="w-5 h-5 text-[#f97316]" />
        <div>
          <h1 className="text-xl font-black">New Launches</h1>
          <p className="text-sm text-[#4b5563]">Recently created DEX pairs · last 48h</p>
        </div>
        <span className="ml-auto text-xs text-[#4b5563]">{pairs.length} pairs found</span>
      </div>

      <div className="bg-[#0a0d14] border border-[#111827] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-[#4b5563] text-xs border-b border-[#111827]">
                <th className="px-4 py-3 text-left font-medium">Token</th>
                <th className="px-3 py-3 text-right font-medium">Chain</th>
                <th className="px-3 py-3 text-right font-medium">Age</th>
                <th className="px-3 py-3 text-right font-medium">Price</th>
                <th className="px-3 py-3 text-right font-medium">5m %</th>
                <th className="px-3 py-3 text-right font-medium hidden md:table-cell">Liquidity</th>
                <th className="px-3 py-3 text-right font-medium hidden lg:table-cell">Vol 24h</th>
                <th className="px-3 py-3 text-right font-medium hidden xl:table-cell">Txns</th>
                <th className="px-3 py-3 text-center font-medium hidden xl:table-cell">DEX</th>
              </tr>
            </thead>
            <tbody>
              {pairs.map(p => {
                const color = chainColor(p.chainId)
                const chg = p.priceChange?.m5 ?? 0
                const pos = chg >= 0
                return (
                  <tr key={p.pairAddress} className="border-b border-[#0d1117] pair-row transition-colors">
                    <td className="px-4 py-3">
                      <Link href={`/token/${p.chainId}/${p.baseToken.address}`} className="flex items-center gap-2.5 group">
                        {p.info?.imageUrl
                          ? <img src={p.info.imageUrl} alt="" className="w-8 h-8 rounded-full object-cover shrink-0 bg-[#111827]" />
                          : <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold"
                              style={{ background: `${color}33`, color }}>{p.baseToken.symbol.slice(0, 2)}</div>
                        }
                        <div className="min-w-0">
                          <p className="text-sm font-bold truncate group-hover:text-[#f97316] transition-colors">{p.baseToken.symbol}</p>
                          <p className="text-[10px] text-[#4b5563] truncate">{p.baseToken.name}</p>
                        </div>
                      </Link>
                    </td>
                    <td className="px-3 py-3 text-right">
                      <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded font-medium"
                        style={{ background: `${color}22`, color }}>
                        {chainLabel(p.chainId)}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right text-xs text-[#4b5563]">
                      {p.pairCreatedAt ? timeAgo(p.pairCreatedAt) : '—'}
                    </td>
                    <td className="px-3 py-3 text-right font-mono text-sm font-semibold">
                      {fmtPrice(p.priceUsd)}
                    </td>
                    <td className="px-3 py-3 text-right">
                      <span className={`flex items-center justify-end gap-0.5 text-xs font-semibold ${pos ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
                        {pos ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {fmtPct(chg)}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right text-sm text-[#9ca3af] font-mono hidden md:table-cell">
                      {fmtUsd(p.liquidity?.usd)}
                    </td>
                    <td className="px-3 py-3 text-right text-sm text-[#9ca3af] font-mono hidden lg:table-cell">
                      {fmtUsd(p.volume?.h24)}
                    </td>
                    <td className="px-3 py-3 text-right hidden xl:table-cell">
                      <div className="flex items-center justify-end gap-1 text-[10px]">
                        <span className="text-[#22c55e]">B:{p.txns?.h24?.buys ?? 0}</span>
                        <span className="text-[#4b5563]">/</span>
                        <span className="text-[#ef4444]">S:{p.txns?.h24?.sells ?? 0}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-center hidden xl:table-cell">
                      <a href={p.url} target="_blank" rel="noopener noreferrer"
                        className="text-[#4b5563] hover:text-[#f97316] transition-colors">
                        <ExternalLink className="w-3.5 h-3.5 inline" />
                      </a>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {pairs.length === 0 && (
          <div className="p-12 text-center text-[#4b5563] text-sm">No new pairs found. Try refreshing.</div>
        )}
      </div>
    </div>
  )
}
