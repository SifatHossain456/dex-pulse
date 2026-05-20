'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useState } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Search, Zap } from 'lucide-react'

export default function Navbar() {
  const [q, setQ] = useState('')
  const router = useRouter()
  const path = usePathname()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (q.trim()) { router.push(`/search?q=${encodeURIComponent(q.trim())}`); setQ('') }
  }

  const links = [
    { href: '/', label: 'Hot' },
    { href: '/trending', label: 'Trending' },
    { href: '/new', label: 'New' },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-[#07090d]/95 backdrop-blur border-b border-[#111827]">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-[#f97316] flex items-center justify-center">
            <Zap className="w-4 h-4 text-white fill-white" />
          </div>
          <span className="font-black text-base hidden sm:block tracking-tight">DexPulse</span>
        </Link>

        <div className="flex items-center gap-1">
          {links.map(l => (
            <Link key={l.href} href={l.href}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${path === l.href ? 'bg-[#111827] text-white' : 'text-[#6b7280] hover:text-white'}`}>
              {l.label}
            </Link>
          ))}
        </div>

        <form onSubmit={handleSearch} className="flex-1 max-w-xs relative ml-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#4b5563]" />
          <input value={q} onChange={e => setQ(e.target.value)}
            placeholder="Token, symbol or address…"
            className="w-full bg-[#0d1117] border border-[#1a2535] rounded-lg pl-8 pr-3 py-1.5 text-sm focus:border-[#f97316] transition-colors" />
        </form>

        <div className="ml-auto">
          <ConnectButton showBalance={false} chainStatus="icon" accountStatus={{ smallScreen: 'avatar', largeScreen: 'full' }} />
        </div>
      </div>
    </nav>
  )
}
