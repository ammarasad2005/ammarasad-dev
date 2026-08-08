'use client'

import NextImage from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { BatteryCharging, Bluetooth, Braces, CircleUserRound, FileText, Flashlight, FolderGit2, Github, Linkedin, Mail, Moon, RotateCw, Search, Settings, ShieldCheck, Signal, Sparkles, Sun, Wifi, X } from 'lucide-react'
import { MobileAppContent, type MobileAppId } from './MobileAppContent'

type AndroidShellProps = { onRestart: () => void }
type GestureStart = { x: number; y: number; width: number; height: number }

const pageOneApps: { id: MobileAppId; label: string; icon: typeof FolderGit2; tone: string }[] = [
  { id: 'profile', label: 'About', icon: CircleUserRound, tone: 'blue' },
  { id: 'projects', label: 'Projects', icon: FolderGit2, tone: 'amber' },
  { id: 'skills', label: 'Skills', icon: Braces, tone: 'violet' },
  { id: 'resume', label: 'Resume', icon: FileText, tone: 'rose' },
]
const pageTwoApps: { id: MobileAppId; label: string; icon: typeof FolderGit2; tone: string }[] = [
  { id: 'contact', label: 'Contact', icon: Mail, tone: 'cyan' },
  { id: 'github', label: 'GitHub', icon: Github, tone: 'dark' },
  { id: 'linkedin', label: 'LinkedIn', icon: Linkedin, tone: 'linkedin' },
]
const allApps = [...pageOneApps, ...pageTwoApps]

export function AndroidShell({ onRestart }: AndroidShellProps) {
  const [activeApp, setActiveApp] = useState<MobileAppId | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [shadeOpen, setShadeOpen] = useState(false)
  const [recentsOpen, setRecentsOpen] = useState(false)
  const [page, setPage] = useState(0)
  const [query, setQuery] = useState('')
  const [focusMode, setFocusMode] = useState(false)
  const [doNotDisturb, setDoNotDisturb] = useState(true)
  const [internet, setInternet] = useState(true)
  const [bluetooth, setBluetooth] = useState(true)
  const [flashlight, setFlashlight] = useState(false)
  const [rotation, setRotation] = useState(true)
  const [resilience, setResilience] = useState(91)
  const [notificationsVisible, setNotificationsVisible] = useState(true)
  const [now, setNow] = useState(new Date())
  const gestureStartRef = useRef<GestureStart | null>(null)

  useEffect(() => { const timer = window.setInterval(() => setNow(new Date()), 30000); return () => window.clearInterval(timer) }, [])
  function closeOverlays() { setDrawerOpen(false); setShadeOpen(false); setRecentsOpen(false) }
  function openApp(app: MobileAppId) { setActiveApp(app); closeOverlays() }
  function goHome() { setActiveApp(null); closeOverlays() }
  function goBack() { if (activeApp) setActiveApp(null); else if (drawerOpen || shadeOpen || recentsOpen) closeOverlays(); else if (page === 1) setPage(0) }

  function handleTouchStart(event: React.TouchEvent) { const touch = event.touches[0]; gestureStartRef.current = { x: touch.clientX, y: touch.clientY, width: window.innerWidth, height: window.innerHeight } }
  function handleTouchEnd(event: React.TouchEvent) {
    const start = gestureStartRef.current
    if (!start) return
    const touch = event.changedTouches[0]
    const dx = touch.clientX - start.x
    const dy = touch.clientY - start.y
    if (start.y < 55 && dy > 50) setShadeOpen(true)
    else if (start.x < 20 && dx > 52) goBack()
    else if (start.y > start.height - 85 && dy < -55) {
      if (activeApp) goHome()
      else if (dy < -120) setRecentsOpen(true)
      else setDrawerOpen(true)
    } else if (!activeApp && Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy)) setPage(dx < 0 ? 1 : 0)
    gestureStartRef.current = null
  }

  const visibleApps = allApps.filter((app) => app.label.toLowerCase().includes(query.toLowerCase()))
  const currentApps = page === 0 ? pageOneApps : pageTwoApps

  return <main className={`mobile-os-root android-shell android-shell-native page-${page}`} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
    <NextImage className="mobile-os-wallpaper" src="/mobile/android-wallpaper.webp" fill priority sizes="100vw" alt="" />
    <button className="android-status-bar" onClick={() => setShadeOpen(true)} aria-label="Open Android notification shade"><span>{now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span><div>{doNotDisturb && <Moon />}<Signal /><Wifi /><BatteryCharging /><small>{resilience}%</small></div></button>

    <div className="android-home android-home-native">
      <section className="android-at-glance"><div><span>{now.toLocaleDateString([], { weekday: 'long' })}</span><strong>{now.toLocaleDateString([], { month: 'long', day: 'numeric' })}</strong></div><small>Islamabad · {focusMode ? 'Focus active' : 'Portfolio ready'}</small></section>
      <button className="android-search-pill" onClick={() => setDrawerOpen(true)}><Search /><span>Search your phone</span><i>G</i></button>
      {page === 0 ? <><button className="android-profile-widget" onClick={() => openApp('profile')}><span><NextImage src="/ammar-avatar.png" width={100} height={100} alt="Ammar account" /></span><div><small>GOOD {now.getHours() < 12 ? 'MORNING' : now.getHours() < 18 ? 'AFTERNOON' : 'EVENING'}</small><strong>Muhammad Ammar</strong><p>Full-stack developer · open to internships</p></div></button><section className="android-project-widget" onClick={() => openApp('projects')}><header><span>Project activity</span><small>4 shipped</small></header><strong>FAST Isb Utilities</strong><p>12+ campus tools in one Next.js workspace.</p><div><i />Next.js <i />Supabase <i />TypeScript</div></section></> : <section className="android-social-dashboard"><header><span><NextImage src="/ammar-avatar.png" width={86} height={86} alt="Ammar" /></span><div><small>PROFESSIONAL</small><strong>Build. Share. Connect.</strong><p>Code and career, presented natively.</p></div></header><div><button onClick={() => openApp('github')}><Github /><span><strong>GitHub</strong><small>4 featured repositories</small></span></button><button onClick={() => openApp('linkedin')}><Linkedin /><span><strong>LinkedIn</strong><small>Open to work</small></span></button></div><footer><span>Portfolio completion</span><i><b style={{ width: '94%' }} /></i><strong>94%</strong></footer></section>}
      <div className="android-home-apps android-native-apps">{currentApps.map(({ id, label, icon: Icon, tone }) => <button key={id} onClick={() => openApp(id)}><span className={`mobile-app-icon tone-${tone}`}><Icon /></span><small>{label}</small></button>)}</div><div className="android-page-dots"><i className={page === 0 ? 'active' : ''} /><i className={page === 1 ? 'active' : ''} /></div>
    </div>

    <nav className="android-dock android-dock-native" aria-label="Android favorites"><button onClick={() => openApp('profile')}><CircleUserRound /></button><button onClick={() => openApp('projects')}><FolderGit2 /></button><button onClick={() => openApp('contact')}><Mail /></button><button onClick={() => setDrawerOpen(true)}><span className="android-drawer-glyph"><i /><i /><i /><i /><i /><i /><i /><i /><i /></span></button></nav>
    <button className="android-gesture-pill" onClick={() => activeApp ? goHome() : setRecentsOpen(true)} aria-label="Android gesture navigation"><i /></button>

    {drawerOpen && <section className="android-app-drawer android-drawer-native"><header><label><Search /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search apps" /></label><button onClick={() => setDrawerOpen(false)}><X /></button></header><span>ALL APPS</span><div>{visibleApps.map(({ id, label, icon: Icon, tone }) => <button key={id} onClick={() => openApp(id)}><span className={`mobile-app-icon tone-${tone}`}><Icon /></span><small>{label}</small></button>)}</div><footer><button onClick={onRestart}><Settings /> Boot & system options</button></footer></section>}

    {shadeOpen && <section className="android-shade android-shade-native"><header><div><strong>{now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong><span>{now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}</span></div><div><button onClick={onRestart}><Settings /></button><button onClick={() => setShadeOpen(false)}><X /></button></div></header><section className="android-qs-primary"><button className={internet ? 'active' : ''} onClick={() => setInternet((value) => !value)}><Wifi /><span><strong>Internet</strong><small>{internet ? 'Builder Network' : 'Off'}</small></span></button><button className={bluetooth ? 'active' : ''} onClick={() => setBluetooth((value) => !value)}><Bluetooth /><span><strong>Bluetooth</strong><small>{bluetooth ? 'AmmarBook' : 'Off'}</small></span></button></section><section className="android-qs-circles"><button className={focusMode ? 'active' : ''} onClick={() => setFocusMode((value) => !value)}><Sparkles /><small>Focus</small></button><button className={doNotDisturb ? 'active' : ''} onClick={() => setDoNotDisturb((value) => !value)}><Moon /><small>Do Not Disturb</small></button><button className={flashlight ? 'active' : ''} onClick={() => setFlashlight((value) => !value)}><Flashlight /><small>Flashlight</small></button><button className={rotation ? 'active' : ''} onClick={() => setRotation((value) => !value)}><RotateCw /><small>Auto-rotate</small></button></section><div className="android-brightness"><Sun /><i><b style={{ width: '78%' }} /></i><button onClick={() => setResilience(100)}><ShieldCheck />{resilience}%</button></div><section className="android-media-player"><span><NextImage src="/ammar-avatar.png" width={64} height={64} alt="Ammar" /></span><div><small>NOW BUILDING</small><strong>AmmarOS Portfolio</strong><p>Next.js · TypeScript</p></div><button>▶</button></section><section className="android-notifications"><header><strong>Notifications</strong><button onClick={() => setNotificationsVisible(false)}>Clear all</button></header>{notificationsVisible ? <><button onClick={() => openApp('projects')}><FolderGit2 /><span><strong>Projects ready</strong><small>4 deployed builds are available to explore.</small></span><i>now</i></button><button onClick={() => openApp('github')}><Github /><span><strong>GitHub</strong><small>Repository activity and source links.</small></span><i>2m</i></button><button onClick={() => openApp('contact')}><Mail /><span><strong>Open to opportunities</strong><small>Full-stack internship availability is active.</small></span><i>today</i></button></> : <p>No notifications</p>}</section><footer>Android 15 · Material You · AmmarPhone</footer></section>}

    {recentsOpen && <section className="android-recents"><header><span>Recent apps</span><button onClick={() => setRecentsOpen(false)}><X /></button></header><div><button onClick={() => openApp('projects')}><span><FolderGit2 /> Projects</span><section><strong>Project Library</strong><p>FAST Utilities, WayFinder, GCR Fetch, DramaGhar</p></section></button><button onClick={() => openApp('github')}><span><Github /> GitHub</span><section><strong>@ammarasad2005</strong><p>Four featured repositories</p></section></button><button onClick={() => openApp('contact')}><span><Mail /> Contact</span><section><strong>New message</strong><p>Open to full-stack internships</p></section></button></div><footer><button onClick={() => setRecentsOpen(false)}>Screenshot</button><button onClick={() => { setRecentsOpen(false); setActiveApp(null) }}>Select</button></footer></section>}

    {activeApp && <MobileAppContent app={activeApp} os="android" onBack={goBack} onOpenApp={openApp} />}
  </main>
}
