'use client'

import { useEffect } from 'react'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('[DexPulse] Error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4" style={{ background: '#07090d' }}>
      <div className="text-5xl mb-6">⚠️</div>
      <h1 className="text-2xl font-bold text-white mb-3">Something went wrong</h1>
      <p className="text-gray-400 mb-6 max-w-sm text-sm">
        {error.message || 'Failed to load DEX data. The API may be temporarily unavailable.'}
      </p>
      {error.digest && (
        <p className="text-xs font-mono text-gray-600 mb-6">ID: {error.digest}</p>
      )}
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="px-6 py-3 rounded-xl font-semibold text-sm bg-[#f97316] text-white hover:bg-orange-400 transition-colors"
        >
          Try again
        </button>
        <a
          href="/"
          className="px-6 py-3 rounded-xl font-semibold text-sm border border-[#1a2535] text-gray-400 hover:text-white transition-colors"
        >
          Go home
        </a>
      </div>
    </div>
  )
}
