'use client'

import dynamic from 'next/dynamic'

const PortfolioApp = dynamic(() => import('../src/App'), {
  ssr: false,
  loading: () => <main className="preboot-shell" aria-label="Initializing AmmarOS bootloader" />,
})

export default function ClientPortfolio() {
  return <PortfolioApp />
}
