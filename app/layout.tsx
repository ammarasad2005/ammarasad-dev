import type { Metadata, Viewport } from 'next'
import '../src/index.css'

export const metadata: Metadata = {
  title: 'Muhammad Ammar Asad — Full-Stack Developer',
  description: 'Muhammad Ammar Asad — full-stack web developer and Computer Science student at FAST-NUCES Islamabad.',
  icons: {
    icon: '/favicon.svg',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#090c12',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}
