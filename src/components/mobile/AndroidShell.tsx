'use client'

import NextImage from 'next/image'
import { useEffect, useState } from 'react'
import { BatteryCharging, Braces, CircleUserRound, FileText, FolderGit2, Github, Grid3X3, Mail, Search, ShieldCheck, Signal, Sparkles, TerminalSquare, VolumeX, Wifi, X } from 'lucide-react'
import { MobileAppContent, type MobileAppId } from './MobileAppContent'

type AndroidShellProps = { onRestart: () => void }

const apps: { id: MobileAppId; label: string; icon: typeof FolderGit2; tone: string }[] = [
  { id: 'profile', label: 'About', icon: CircleUserRound, tone: 'blue' },
  { id: 'projects', label: 'Projects', icon: FolderGit2, tone: 'amber' },
  { id: 'skills', label: 'Skills', icon: Braces, tone: 'violet' },
  { id: 'resume', label: 'Resume', icon: FileText, tone: 'rose' },
  { id: 'contact', label: 'Contact', icon: Mail, tone: 'cyan' },
  { id: 'terminal', label: 'Terminal', icon: TerminalSquare, tone: 'dark' },
]

export function AndroidShell({ onRestart }: AndroidShellProps) {
  const [activeApp, setActiveApp] = useState<MobileAppId | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [shadeOpen, setShadeOpen] = useState(false)
  const [focusMode, setFocusMode] = useState(false)
  const [noiseShield, setNoiseShield] = useState(true)
  const [resilience, setResilience] = useState(91)
  const [now, setNow] = useState(new Date())
  useEffect(() => { const timer = window.setInterval(() => setNow(new Date()), 30000); return () => window.clearInterval(timer) }, [])
  function openApp(app: MobileAppId) { setActiveApp(app); setDrawerOpen(false); setShadeOpen(false) }

  return <main className="mobile-os-root android-shell">
    <NextImage className="mobile-os-wallpaper" src="/mobile/android-wallpaper.webp" fill priority sizes="100vw" alt="" />
    <button className="android-status-bar" onClick={() => setShadeOpen(true)} aria-label="Open Android notification shade"><span>{now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span><div><Signal /><Wifi /><BatteryCharging /><small>{resilience}%</small></div></button>

    <div className="android-home">
      <section className="android-at-glance"><div><span>{now.toLocaleDateString([], { weekday: 'long' })}</span><strong>{now.toLocaleDateString([], { month: 'long', day: 'numeric' })}</strong></div><small>Islamabad · AmmarOS Android</small></section>
      <button className="android-profile-widget" onClick={() => openApp('profile')}><span><NextImage src="/ammar-avatar.png" width={100} height={100} alt="Ammar account" /></span><div><small>GOOD {now.getHours() < 12 ? 'MORNING' : now.getHours() < 18 ? 'AFTERNOON' : 'EVENING'}</small><strong>Muhammad Ammar</strong><p>Full-stack developer · open to internships</p></div></button>
      <button className="android-search-pill" onClick={() => setDrawerOpen(true)}><Search /><span>Search AmmarOS</span><Grid3X3 /></button>
      <section className="android-project-widget" onClick={() => openApp('projects')}><header><span>Featured build</span><small>01 / 04</small></header><strong>FAST Isb Utilities</strong><p>12+ campus tools in one Next.js workspace.</p><div><i />Next.js <i />Supabase <i />TypeScript</div></section>
      <div className="android-home-apps">{apps.slice(0, 4).map(({ id, label, icon: Icon, tone }) => <button key={id} onClick={() => openApp(id)}><span className={`mobile-app-icon tone-${tone}`}><Icon /></span><small>{label}</small></button>)}</div>
    </div>

    <nav className="android-dock" aria-label="Android favorites"><button onClick={() => openApp('profile')}><CircleUserRound /></button><button onClick={() => openApp('projects')}><FolderGit2 /></button><button onClick={() => openApp('contact')}><Mail /></button><button onClick={() => setDrawerOpen(true)}><Grid3X3 /></button></nav>
    <div className="android-navigation"><button aria-label="Back" onClick={() => { if (activeApp) setActiveApp(null); else if (drawerOpen) setDrawerOpen(false) }}>‹</button><button aria-label="Home" onClick={() => { setActiveApp(null); setDrawerOpen(false); setShadeOpen(false) }}>●</button><button aria-label="Recent applications">▢</button></div>

    {drawerOpen && <section className="android-app-drawer"><header><label><Search /><input autoFocus placeholder="Search apps" /></label><button onClick={() => setDrawerOpen(false)}><X /></button></header><span>ALL APPS</span><div>{apps.map(({ id, label, icon: Icon, tone }) => <button key={id} onClick={() => openApp(id)}><span className={`mobile-app-icon tone-${tone}`}><Icon /></span><small>{label}</small></button>)}<button onClick={onRestart}><span className="mobile-app-icon tone-dark"><Sparkles /></span><small>Bootloader</small></button></div></section>}

    {shadeOpen && <section className="android-shade"><header><div><strong>{now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong><span>{now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}</span></div><button onClick={() => setShadeOpen(false)}><X /></button></header><div className="android-quick-grid"><button className="active"><Wifi /><span>Builder network<small>GitHub connected</small></span></button><button className={focusMode ? 'active' : ''} onClick={() => setFocusMode((value) => !value)}><Sparkles /><span>Focus zone<small>{focusMode ? 'Build mode active' : 'Ready'}</small></span></button><button className={noiseShield ? 'active' : ''} onClick={() => setNoiseShield((value) => !value)}><VolumeX /><span>Noise shield<small>{noiseShield ? 'Disruptions blocked' : 'Open'}</small></span></button><button onClick={() => setResilience(100)}><ShieldCheck /><span>Resilience<small>{resilience}% charged</small></span></button></div><div className="android-brightness"><span>☀</span><i><b style={{ width: '78%' }} /></i></div><section className="android-notification"><span><NextImage src="/ammar-avatar.png" width={72} height={72} alt="Ammar" /></span><div><strong>Portfolio workspace ready</strong><p>4 projects, 12+ campus tools, and a full-stack story to explore.</p></div><small>now</small></section><footer><Github /> Android experience · Material You</footer></section>}

    {activeApp && <MobileAppContent app={activeApp} os="android" onBack={() => setActiveApp(null)} onOpenApp={openApp} />}
  </main>
}
