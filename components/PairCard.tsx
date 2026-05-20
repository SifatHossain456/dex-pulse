import Link from 'next/link'
import { TrendingUp, TrendingDown, ExternalLink } from 'lucide-react'
import { type Pair, fmtUsd, fmtPrice, fmtPct, chainLabel, chainColor, shortAddr } from '@/lib/dexscreener'

function Chg({ v }: { v: number | undefined }) {
  const val = v ?? 0
  const pos = val >= 0
  return (
    <span className={`flex items-center gap-0.5 text-xs font-semibold ${pos ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
      {pos ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
      {fmtPct(val)}
    </span>
  )
}

export function PairRow({ pair, rank }: { pair: Pair; rank?: number }) {
  const color = chainColor(pair.chainId)
  const href = `/token/${pair.chainId}/${pair.baseToken.address}`
  return (
    <tr className="border-b border-[#0d1117] pair-row transition-colors cursor-pointer">
      {rank !== undefined && <td className="px-4 py-3 text-[#4b5563] text-sm">{rank}</td>}
      <td className="px-3 py-3">
        <Link href={href} className="flex items-center gap-2.5">
          {pair.info?.imageUrl ? (
            <img src={pair.info.imageUrl} alt={pair.baseToken.symbol}
              className="w-8 h-8 rounded-full object-cover shrink-0 bg-[#111827]" />
          ) : (
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
              style={{ background: color }}>
              {pair.baseToken.symbol.slice(0, 2)}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-bold truncate hover:text-[#f97316] transition-colors">{pair.baseToken.symbol}</p>
            <p className="text-[10px] text-[#4b5563] truncate">{pair.baseToken.name}</p>
          </div>
        </Link>
      </td>
      <td className="px-3 py-3 text-right">
        <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded font-medium"
          style={{ background: `${color}22`, color }}>
          {chainLabel(pair.chainId)}
        </span>
      </td>
      <td className="px-3 py-3 text-right font-mono text-sm font-semibold">
        {fmtPrice(pair.priceUsd)}
      </td>
      <td className="px-3 py-3 text-right"><Chg v={pair.priceChange?.h24} /></td>
      <td className="px-3 py-3 text-right text-sm text-[#9ca3af] font-mono hidden md:table-cell">
        {fmtUsd(pair.volume?.h24)}
      </td>
      <td className="px-3 py-3 text-right text-sm text-[#9ca3af] font-mono hidden lg:table-cell">
        {fmtUsd(pair.liquidity?.usd)}
      </td>
      <td className="px-3 py-3 text-right text-sm text-[#9ca3af] hidden xl:table-cell">
        <div className="flex items-center justify-end gap-1 text-[10px]">
          <span className="text-[#22c55e]">B:{pair.txns?.h24?.buys ?? 0}</span>
          <span className="text-[#4b5563]">/</span>
          <span className="text-[#ef4444]">S:{pair.txns?.h24?.sells ?? 0}</span>
        </div>
      </td>
      <td className="px-3 py-3 text-center hidden xl:table-cell">
        <a href={pair.url} target="_blank" rel="noopener noreferrer"
          className="text-[#4b5563] hover:text-[#f97316] transition-colors" onClick={e => e.stopPropagation()}>
          <ExternalLink className="w-3.5 h-3.5 inline" />
        </a>
      </td>
    </tr>
  )
}

export function PairTableHeader({ showRank = true }: { showRank?: boolean }) {
  return (
    <tr className="text-[#4b5563] text-xs border-b border-[#111827]">
      {showRank && <th className="px-4 py-3 text-left font-medium">#</th>}
      <th className="px-3 py-3 text-left font-medium">Token</th>
      <th className="px-3 py-3 text-right font-medium">Chain</th>
      <th className="px-3 py-3 text-right font-medium">Price</th>
      <th className="px-3 py-3 text-right font-medium">24h %</th>
      <th className="px-3 py-3 text-right font-medium hidden md:table-cell">Vol 24h</th>
      <th className="px-3 py-3 text-right font-medium hidden lg:table-cell">Liquidity</th>
      <th className="px-3 py-3 text-right font-medium hidden xl:table-cell">Txns 24h</th>
      <th className="px-3 py-3 text-center font-medium hidden xl:table-cell">DEX</th>
    </tr>
  )
}
