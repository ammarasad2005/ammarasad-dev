'use client'

import NextImage from 'next/image'
import { useEffect, useState } from 'react'
import { BatteryCharging, Braces, CircleUserRound, FileText, FolderGit2, Github, Grid3X3, Mail, Search, Signal, Sparkles, TerminalSquare, VolumeX, Wifi, X } from 'lucide-react'
import { MobileAppContent, type MobileAppId } from './MobileAppContent'

type IOSShellProps = { onRestart: () => void }

const apps: { id: MobileAppId; label: string; icon: typeof FolderGit2; tone: string }[] = [
  { id: 'projects', label: 'Files', icon: FolderGit2, tone: 'blue' },
  { id: 'skills', label: 'Developer', icon: Braces, tone: 'violet' },
  { id: 'resume', label: 'Preview', icon: FileText, tone: 'rose' },
  { id: 'contact', label: 'Mail', icon: Mail, tone: 'cyan' },
  { id: 'profile', label: 'Profile', icon: CircleUserRound, tone: 'dark' },
  { id: 'terminal', label: 'Terminal', icon: TerminalSquare, tone: 'dark' },
]

export function IOSShell({ onRestart }: IOSShellProps) {
  const [activeApp, setActiveApp] = useState<MobileAppId | null>(null)
  const [controlCenter, setControlCenter] = useState(false)
  const [spotlight, setSpotlight] = useState(false)
  const [focusMode, setFocusMode] = useState(false)
  const [noiseShield, setNoiseShield] = useState(true)
  const [resilience, setResilience] = useState(92)
  const [now, setNow] = useState(new Date())
  useEffect(() => { const timer = window.setInterval(() => setNow(new Date()), 30000); return () => window.clearInterval(timer) }, [])
  function openApp(app: MobileAppId) { setActiveApp(app); setSpotlight(false); setControlCenter(false) }

  return <main className="mobile-os-root ios-shell">
    <NextImage className="mobile-os-wallpaper" src="/mobile/ios-wallpaper.webp" fill priority sizes="100vw" alt="" />
    <button className="ios-status-bar" onClick={() => setControlCenter(true)} aria-label="Open iOS Control Center"><span>{now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span><i className="ios-dynamic-island"><b /></i><div><Signal /><Wifi /><BatteryCharging /></div></button>

    <div className="ios-home">
      <section className="ios-widget-stack"><button className="ios-profile-widget" onClick={() => openApp('profile')}><span><NextImage src="/ammar-avatar.png" width={110} height={110} alt="Ammar account" /></span><div><small>PORTFOLIO</small><strong>Muhammad Ammar</strong><p>Full-stack developer</p></div><i>Open</i></button><div className="ios-small-widgets"><button onClick={() => openApp('projects')}><small>SHIPPED</small><strong>04</strong><span>projects</span></button><button onClick={() => openApp('skills')}><small>CURRENT</small><strong>06</strong><span>semester</span></button></div></section>
      <div className="ios-app-grid">{apps.map(({ id, label, icon: Icon, tone }) => <button key={id} onClick={() => openApp(id)}><span className={`mobile-app-icon ios-app-icon tone-${tone}`}><Icon /></span><small>{label}</small></button>)}</div>
      <button className="ios-search-pill" onClick={() => setSpotlight(true)}><Search /> Search</button><div className="ios-page-dots"><i className="active" /><i /></div>
    </div>

    <nav className="ios-dock" aria-label="iOS Dock"><button onClick={() => openApp('profile')}><CircleUserRound /></button><button onClick={() => openApp('projects')}><FolderGit2 /></button><button onClick={() => openApp('contact')}><Mail /></button><button onClick={() => openApp('terminal')}><TerminalSquare /></button></nav>

    {controlCenter && <section className="ios-control-center"><header><span>AmmarOS Control Center</span><button onClick={() => setControlCenter(false)}><X /></button></header><div className="ios-control-grid"><section className="ios-connectivity"><button className="active"><Wifi /><small>Builder Network</small></button><button className="active"><Signal /><small>Cloud connected</small></button></section><button className={focusMode ? 'active' : ''} onClick={() => setFocusMode((value) => !value)}><Sparkles /><small>{focusMode ? 'Focus On' : 'Focus'}</small></button><button className={noiseShield ? 'active' : ''} onClick={() => setNoiseShield((value) => !value)}><VolumeX /><small>Noise shield</small></button><section className="ios-slider"><span>☀</span><i><b style={{ height: '74%' }} /></i></section><section className="ios-slider"><span>◖</span><i><b style={{ height: noiseShield ? '12%' : '55%' }} /></i></section><button onClick={() => setResilience(100)}><BatteryCharging /><small>Resilience {resilience}%</small></button><button onClick={onRestart}><Grid3X3 /><small>Boot options</small></button></div><section className="ios-now-playing"><span><NextImage src="/ammar-avatar.png" width={72} height={72} alt="Ammar" /></span><div><strong>Building useful things</strong><small>TypeScript · Next.js · Node.js</small></div><button>•••</button></section><footer><Github /> iOS experience · native glass</footer></section>}

    {spotlight && <section className="ios-spotlight"><header><label><Search /><input autoFocus placeholder="Search AmmarOS" /></label><button onClick={() => setSpotlight(false)}>Cancel</button></header><span>SUGGESTIONS</span><div>{apps.map(({ id, label, icon: Icon, tone }) => <button key={id} onClick={() => openApp(id)}><span className={`mobile-app-icon ios-app-icon tone-${tone}`}><Icon /></span><small>{label}</small></button>)}</div><section><strong>Quick actions</strong><button onClick={() => openApp('projects')}><FolderGit2 /> Browse shipped projects</button><button onClick={() => openApp('contact')}><Mail /> Contact Ammar</button></section></section>}

    {activeApp && <MobileAppContent app={activeApp} os="ios" onBack={() => setActiveApp(null)} onOpenApp={openApp} />}
    <div className="ios-home-indicator" onClick={() => { setActiveApp(null); setSpotlight(false); setControlCenter(false) }}><i /></div>
  </main>
}
