# DexPulse — Real-Time DEX Token Tracker

Track trending tokens, new launches, and live DEX trading pairs across every chain. Powered by the DexScreener API — no API key required.

## Features

- **Hot Pairs** — Highest-volume trading pairs in the last 24h across all chains
- **Trending** — Tokens with the biggest price momentum, ranked by 24h change
- **New Listings** — Recently added tokens sorted by creation time
- **Token Detail** — Per-token page with price chart, liquidity, 24h volume, and pair breakdown
- **Search** — Find any token by name, symbol, or contract address
- **WalletConnect** — Connect any EVM wallet via RainbowKit

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 App Router |
| Styling | Tailwind CSS v4 |
| Web3 | wagmi v2 + RainbowKit |
| Data | DexScreener API (free, no key) |

## Getting Started

```bash
git clone https://github.com/SifatHossain456/dex-pulse.git
cd dex-pulse
npm install
cp .env.example .env.local
npm run dev
```

## Environment Variables

```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
```

Get a free WalletConnect project ID at [cloud.walletconnect.com](https://cloud.walletconnect.com).

## Project Structure

```
app/
├── page.tsx           # Hot pairs home
├── trending/          # Trending tokens
├── new/               # New listings
├── search/            # Search results
└── token/[chain]/[address]/  # Token detail page
```

## License

MIT
