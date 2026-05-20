export const dynamic = 'force-dynamic'

import { getTokenPairs, fmtUsd, fmtPrice, fmtPct, chainLabel, chainColor, shortAddr, timeAgo, type Pair } from '@/lib/dexscreener'
import { notFound } from 'next/navigation'
import { ExternalLink, Globe, AtSign, TrendingUp, TrendingDown, ArrowLeft, Activity, Droplets, BarChart2, ShoppingCart } from 'lucide-react'
import Link from 'next/link'

function StatCard({ label, value, sub, icon: Icon, chg }: {
  label: string; value: string; sub?: string; icon: React.ElementType; chg?: number
}) {
  return (
    <div className="bg-[#0a0d14] border border-[#111827] rounded-xl p-4">
      <div className="flex items-center gap-1.5 mb-2">
        <Icon className="w-3.5 h-3.5 text-[#f97316]" />
        <p className="text-[10px] text-[#4b5563] uppercase tracking-wide">{label}</p>
      </div>
      <p className="text-base font-bold font-mono">{value}</p>
      {chg !== undefined ? (
        <span className={`flex items-center gap-0.5 text-xs font-semibold mt-0.5 ${chg >= 0 ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
          {chg >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {fmtPct(chg)}
        </span>
      ) : sub ? (
        <p className="text-[10px] text-[#4b5563] mt-0.5">{sub}</p>
      ) : null}
    </div>
  )
}

function TxBar({ pair }: { pair: Pair }) {
  const buys = pair.txns?.h24?.buys ?? 0
  const sells = pair.txns?.h24?.sells ?? 0
  const total = buys + sells
  const buyPct = total > 0 ? (buys / total) * 100 : 50

  return (
    <div className="bg-[#0a0d14] border border-[#111827] rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#f97316]" />
          <span className="text-sm font-bold">Buy / Sell Pressure</span>
        </div>
        <span className="text-xs text-[#4b5563]">24h · {total.toLocaleString()} txns</span>
      </div>
      <div className="h-3 rounded-full overflow-hidden flex">
        <div className="bg-[#22c55e] transition-all" style={{ width: `${buyPct}%` }} />
        <div className="bg-[#ef4444] flex-1" />
      </div>
      <div className="flex justify-between mt-2 text-xs">
        <span className="text-[#22c55e] font-semibold">Buys: {buys.toLocaleString()} ({buyPct.toFixed(0)}%)</span>
        <span className="text-[#ef4444] font-semibold">Sells: {sells.toLocaleString()} ({(100 - buyPct).toFixed(0)}%)</span>
      </div>
    </div>
  )
}

export default async function TokenPage({ params }: { params: Promise<{ chain: string; address: string }> }) {
  const { chain, address } = await params
  const pairs = await getTokenPairs(chain, address)

  if (!pairs.length) notFound()

  const best = pairs.sort((a, b) => (b.liquidity?.usd ?? 0) - (a.liquidity?.usd ?? 0))[0]
  const color = chainColor(chain)

  const stats = [
    { label: 'Price', value: fmtPrice(best.priceUsd), icon: TrendingUp, chg: best.priceChange?.h24 },
    { label: 'Market Cap', value: fmtUsd(best.marketCap ?? best.fdv), sub: 'FDV', icon: BarChart2 },
    { label: 'Vol 24h', value: fmtUsd(best.volume?.h24), sub: `1h: ${fmtUsd(best.volume?.h1)}`, icon: Activity },
    { label: 'Liquidity', value: fmtUsd(best.liquidity?.usd), icon: Droplets },
    { label: 'Txns 24h', value: ((best.txns?.h24?.buys ?? 0) + (best.txns?.h24?.sells ?? 0)).toLocaleString(), icon: ShoppingCart },
    { label: '5m Change', value: fmtPct(best.priceChange?.m5), icon: TrendingUp, chg: best.priceChange?.m5 },
  ]

  const socials = best.info?.socials ?? []
  const websites = best.info?.websites ?? []

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <Link href="/" className="flex items-center gap-2 text-[#4b5563] hover:text-white text-sm transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back
      </Link>

      {/* Header */}
      <div className="bg-[#0a0d14] border border-[#111827] rounded-2xl p-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            {best.info?.imageUrl ? (
              <img src={best.info.imageUrl} alt={best.baseToken.symbol}
                className="w-14 h-14 rounded-2xl object-cover bg-[#111827]" />
            ) : (
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl font-black"
                style={{ background: `${color}33`, color }}>
                {best.baseToken.symbol.slice(0, 2)}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-black">{best.baseToken.name}</h1>
                <span className="text-sm text-[#4b5563] font-mono bg-[#111827] px-2 py-0.5 rounded">
                  ${best.baseToken.symbol}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded font-semibold"
                  style={{ background: `${color}22`, color }}>
                  {chainLabel(chain)}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <p className="text-2xl font-bold font-mono">{fmtPrice(best.priceUsd)}</p>
                <span className={`text-sm font-bold ${(best.priceChange?.h24 ?? 0) >= 0 ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
                  {fmtPct(best.priceChange?.h24)} (24h)
                </span>
              </div>
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                {best.pairCreatedAt && (
                  <span className="text-xs text-[#4b5563]">Created {timeAgo(best.pairCreatedAt)}</span>
                )}
                <a href={`https://etherscan.io/address/${address}`} target="_blank" rel="noopener noreferrer"
                  className="text-xs font-mono text-[#4b5563] hover:text-[#f97316] flex items-center gap-1 transition-colors">
                  {shortAddr(address)} <ExternalLink className="w-3 h-3" />
                </a>
                {socials.map(s => (
                  <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer"
                    className="text-[#4b5563] hover:text-[#f97316] transition-colors">
                    {s.type === 'twitter' ? <AtSign className="w-3.5 h-3.5" /> : <Globe className="w-3.5 h-3.5" />}
                  </a>
                ))}
                {websites.map(w => (
                  <a key={w.url} href={w.url} target="_blank" rel="noopener noreferrer"
                    className="text-[#4b5563] hover:text-[#f97316] transition-colors">
                    <Globe className="w-3.5 h-3.5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <a href={best.url} target="_blank" rel="noopener noreferrer"
              className="px-4 py-2 bg-[#f97316] text-white text-sm font-bold rounded-lg hover:bg-[#ea6c0a] transition-colors flex items-center gap-1.5">
              Trade <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a href={`https://dexscreener.com/${chain}/${address}`} target="_blank" rel="noopener noreferrer"
              className="px-4 py-2 bg-[#111827] text-white text-sm rounded-lg hover:bg-[#1a2535] transition-colors flex items-center gap-1.5">
              Chart <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {stats.map(({ label, value, sub, icon, chg }) => (
          <StatCard key={label} label={label} value={value} sub={sub} icon={icon} chg={chg} />
        ))}
      </div>

      {/* Price changes */}
      <div className="bg-[#0a0d14] border border-[#111827] rounded-xl p-4">
        <p className="text-sm font-bold mb-3">Price Changes</p>
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: '5 Min', v: best.priceChange?.m5 },
            { label: '1 Hour', v: best.priceChange?.h1 },
            { label: '6 Hours', v: best.priceChange?.h6 },
            { label: '24 Hours', v: best.priceChange?.h24 },
          ].map(({ label, v }) => {
            const pos = (v ?? 0) >= 0
            return (
              <div key={label} className="text-center">
                <p className="text-[10px] text-[#4b5563] mb-1">{label}</p>
                <p className={`text-sm font-bold ${pos ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>{fmtPct(v)}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Buy/Sell bar */}
      <TxBar pair={best} />

      {/* All pairs */}
      {pairs.length > 1 && (
        <div className="bg-[#0a0d14] border border-[#111827] rounded-xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-[#111827]">
            <p className="font-bold text-sm">{pairs.length} Trading Pairs</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-[#4b5563] text-xs border-b border-[#111827]">
                  <th className="px-4 py-3 text-left font-medium">Pair</th>
                  <th className="px-3 py-3 text-left font-medium">DEX</th>
                  <th className="px-3 py-3 text-right font-medium">Price</th>
                  <th className="px-3 py-3 text-right font-medium">Liquidity</th>
                  <th className="px-3 py-3 text-right font-medium">Vol 24h</th>
                  <th className="px-3 py-3 text-center font-medium">Link</th>
                </tr>
              </thead>
              <tbody>
                {pairs.map(p => (
                  <tr key={p.pairAddress} className="border-b border-[#0d1117] pair-row transition-colors">
                    <td className="px-4 py-3 text-sm font-mono">{p.baseToken.symbol}/{p.quoteToken.symbol}</td>
                    <td className="px-3 py-3 text-sm text-[#4b5563]">{p.dexId}</td>
                    <td className="px-3 py-3 text-right font-mono text-sm">{fmtPrice(p.priceUsd)}</td>
                    <td className="px-3 py-3 text-right text-sm font-mono text-[#9ca3af]">{fmtUsd(p.liquidity?.usd)}</td>
                    <td className="px-3 py-3 text-right text-sm font-mono text-[#9ca3af]">{fmtUsd(p.volume?.h24)}</td>
                    <td className="px-3 py-3 text-center">
                      <a href={p.url} target="_blank" rel="noopener noreferrer"
                        className="text-[#4b5563] hover:text-[#f97316] transition-colors">
                        <ExternalLink className="w-3.5 h-3.5 inline" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
