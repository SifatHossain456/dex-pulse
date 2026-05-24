const BASE = 'https://api.dexscreener.com'

export interface Pair {
  chainId: string
  dexId: string
  url: string
  pairAddress: string
  baseToken: { address: string; name: string; symbol: string }
  quoteToken: { address: string; name: string; symbol: string }
  priceNative: string
  priceUsd?: string
  txns: {
    m5: { buys: number; sells: number }
    h1: { buys: number; sells: number }
    h6: { buys: number; sells: number }
    h24: { buys: number; sells: number }
  }
  volume: { h24: number; h6: number; h1: number; m5: number }
  priceChange: { m5: number; h1: number; h6: number; h24: number }
  liquidity?: { usd?: number; base: number; quote: number }
  fdv?: number
  marketCap?: number
  pairCreatedAt?: number
  info?: {
    imageUrl?: string
    websites?: { url: string }[]
    socials?: { type: string; url: string }[]
  }
  boosts?: { active: number }
}

export interface TokenProfile {
  url: string
  chainId: string
  tokenAddress: string
  icon?: string
  header?: string
  description?: string
  links?: { type: string; label: string; url: string }[]
}

export interface TokenBoost extends TokenProfile {
  amount: number
  totalAmount: number
}

async function fetcher<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${BASE}${path}`, { next: { revalidate: 30 } })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export async function getTopBoosted(): Promise<TokenBoost[]> {
  const data = await fetcher<TokenBoost[]>('/token-boosts/top/v1')
  return data ?? []
}

export async function getLatestProfiles(): Promise<TokenProfile[]> {
  const data = await fetcher<TokenProfile[]>('/token-profiles/latest/v1')
  return data ?? []
}

export async function searchPairs(query: string): Promise<Pair[]> {
  const data = await fetcher<{ pairs: Pair[] }>(`/latest/dex/search?q=${encodeURIComponent(query)}`)
  return data?.pairs ?? []
}

export async function getTokenPairs(chain: string, address: string): Promise<Pair[]> {
  const data = await fetcher<{ pairs: Pair[] }>(`/latest/dex/tokens/${address}`)
  return (data?.pairs ?? []).filter(p => p.chainId === chain)
}

export async function getPair(chain: string, pairAddress: string): Promise<Pair | null> {
  const data = await fetcher<{ pairs: Pair[] }>(`/latest/dex/pairs/${chain}/${pairAddress}`)
  return data?.pairs?.[0] ?? null
}

export async function getLatestPairs(): Promise<Pair[]> {
  const data = await fetcher<{ pairs: Pair[] }>('/latest/dex/search?q=0x')
  const pairs = data?.pairs ?? []
  return pairs
    .filter(p => p.pairCreatedAt && Date.now() - p.pairCreatedAt < 48 * 3600 * 1000)
    .sort((a, b) => (b.pairCreatedAt ?? 0) - (a.pairCreatedAt ?? 0))
    .slice(0, 50)
}

export function fmtUsd(n: number | undefined | null): string {
  if (!n && n !== 0) return '—'
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`
  if (n >= 1e3) return `$${(n / 1e3).toFixed(1)}K`
  if (n >= 1) return `$${n.toFixed(2)}`
  return `$${n.toFixed(6)}`
}

export function fmtPrice(s: string | undefined): string {
  if (!s) return '—'
  const n = parseFloat(s)
  if (isNaN(n)) return '—'
  if (n >= 1) return `$${n.toFixed(4)}`
  if (n >= 0.01) return `$${n.toFixed(6)}`
  return `$${n.toExponential(3)}`
}

export function fmtPct(n: number | undefined): string {
  if (n === undefined || n === null) return '—'
  const sign = n >= 0 ? '+' : ''
  return `${sign}${n.toFixed(2)}%`
}

export function shortAddr(addr: string): string {
  if (!addr || addr.length < 10) return addr
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`
}

export const CHAIN_LABELS: Record<string, string> = {
  ethereum: 'Ethereum',
  bsc: 'BNB Chain',
  polygon: 'Polygon',
  arbitrum: 'Arbitrum',
  base: 'Base',
  optimism: 'Optimism',
  avalanche: 'Avalanche',
  solana: 'Solana',
  sui: 'Sui',
  aptos: 'Aptos',
  blast: 'Blast',
  linea: 'Linea',
  scroll: 'Scroll',
  zksync: 'zkSync',
  mantle: 'Mantle',
}

export const CHAIN_COLORS: Record<string, string> = {
  ethereum: '#627eea',
  bsc: '#f0b90b',
  polygon: '#8247e5',
  arbitrum: '#12aaff',
  base: '#0052ff',
  optimism: '#ff0420',
  avalanche: '#e84142',
  solana: '#9945ff',
  sui: '#4da2ff',
  aptos: '#00c2ff',
  blast: '#fcfc03',
  linea: '#61dfff',
  scroll: '#eeb165',
  zksync: '#1e69ff',
  mantle: '#60cf69',
}

export function chainColor(chainId: string): string {
  return CHAIN_COLORS[chainId] ?? '#6b7280'
}

export function chainLabel(chainId: string): string {
  return CHAIN_LABELS[chainId] ?? chainId.charAt(0).toUpperCase() + chainId.slice(1)
}

const CHAIN_EXPLORERS: Record<string, string> = {
  ethereum:  'https://etherscan.io',
  bsc:       'https://bscscan.com',
  polygon:   'https://polygonscan.com',
  arbitrum:  'https://arbiscan.io',
  base:      'https://basescan.org',
  optimism:  'https://optimistic.etherscan.io',
  avalanche: 'https://snowtrace.io',
  solana:    'https://solscan.io',
  sui:       'https://suiscan.xyz',
  aptos:     'https://aptoscan.com',
  blast:     'https://blastscan.io',
  linea:     'https://lineascan.build',
  scroll:    'https://scrollscan.com',
  zksync:    'https://explorer.zksync.io',
  mantle:    'https://explorer.mantle.xyz',
}

export function chainExplorerUrl(chainId: string, address: string): string {
  const base = CHAIN_EXPLORERS[chainId] ?? 'https://etherscan.io'
  const path = chainId === 'solana' || chainId === 'sui' || chainId === 'aptos'
    ? 'account'
    : 'address'
  return `${base}/${path}/${address}`
}

export function timeAgo(ms: number): string {
  const diff = Date.now() - ms
  const s = Math.floor(diff / 1000)
  if (s < 60) return `${s}s ago`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}
