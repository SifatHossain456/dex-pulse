import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4" style={{ background: '#07090d' }}>
      <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mx-auto mb-6">
        <span className="text-3xl">⚡</span>
      </div>
      <div className="text-7xl font-black text-[#f97316] mb-4">404</div>
      <h1 className="text-2xl font-bold text-white mb-3">Token not found</h1>
      <p className="text-gray-400 mb-8 max-w-sm text-sm leading-relaxed">
        This token or page doesn&apos;t exist. Search for a token or browse hot pairs.
      </p>
      <div className="flex gap-3">
        <Link
          href="/"
          className="px-6 py-3 rounded-xl font-semibold text-sm bg-[#f97316] text-white hover:bg-orange-400 transition-colors"
        >
          Browse Hot Pairs
        </Link>
        <Link
          href="/trending"
          className="px-6 py-3 rounded-xl font-semibold text-sm border border-[#1a2535] text-gray-400 hover:text-white hover:border-[#f97316]/30 transition-colors"
        >
          Trending
        </Link>
      </div>
    </div>
  )
}
