'use client'

import dynamic from 'next/dynamic'

const PortfolioApp = dynamic(() => import('../src/App'), {
  ssr: false,
  loading: () => (
    <main className="next-loading-shell" aria-label="Loading AmmarOS">
      <span>MA</span>
      <p>Preparing AmmarOS…</p>
    </main>
  ),
})

export default function ClientPortfolio() {
  return <PortfolioApp />
}
