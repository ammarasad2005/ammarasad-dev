'use client'

import { motion } from 'framer-motion'
import NextImage from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { Airplay, BatteryCharging, Bell, Bluetooth, Braces, Calculator, Camera, CircleUserRound, FileText, Flashlight, FolderGit2, Github, Home, Linkedin, LockKeyhole, Mail, Moon, Plane, Power, RotateCw, Search, Signal, Sparkles, Sun, Timer, Volume2, VolumeX, Wifi, X } from 'lucide-react'
import { MobileAppContent, type MobileAppId } from './MobileAppContent'

type IOSShellProps = { onRestart: () => void; onLock: () => void }

type GestureStart = { x: number; y: number; width: number; height: number }

const pageOneApps: { id: MobileAppId; label: string; icon: typeof FolderGit2; tone: string }[] = [
  { id: 'projects', label: 'Files', icon: FolderGit2, tone: 'blue' },
  { id: 'skills', label: 'Developer', icon: Braces, tone: 'violet' },
  { id: 'resume', label: 'Preview', icon: FileText, tone: 'rose' },
  { id: 'contact', label: 'Mail', icon: Mail, tone: 'cyan' },
]

const pageTwoApps: { id: MobileAppId; label: string; icon: typeof FolderGit2; tone: string }[] = [
  { id: 'github', label: 'GitHub', icon: Github, tone: 'dark' },
  { id: 'linkedin', label: 'LinkedIn', icon: Linkedin, tone: 'linkedin' },
  { id: 'profile', label: 'Profile', icon: CircleUserRound, tone: 'blue' },
]

const allApps = [...pageOneApps, ...pageTwoApps]

export function IOSShell({ onRestart, onLock }: IOSShellProps) {
  const [activeApp, setActiveApp] = useState<MobileAppId | null>(null)
  const [controlCenter, setControlCenter] = useState(false)
  const [notificationCenter, setNotificationCenter] = useState(false)
  const [spotlight, setSpotlight] = useState(false)
  const [assistiveOpen, setAssistiveOpen] = useState(false)
  const [assistiveDevice, setAssistiveDevice] = useState(false)
  const [islandExpanded, setIslandExpanded] = useState(false)
  const [page, setPage] = useState(0)
  const [focusMode, setFocusMode] = useState(false)
  const [noiseShield, setNoiseShield] = useState(true)
  const [wifi, setWifi] = useState(true)
  const [bluetooth, setBluetooth] = useState(true)
  const [airplaneMode, setAirplaneMode] = useState(false)
  const [screenMirroring, setScreenMirroring] = useState(false)
  const [rotationLock, setRotationLock] = useState(true)
  const [playing, setPlaying] = useState(false)
  const [notificationsVisible, setNotificationsVisible] = useState(true)
  const [activeUtility, setActiveUtility] = useState<string | null>(null)
  const [resilience, setResilience] = useState(92)
  const [screenshotToast, setScreenshotToast] = useState(false)
  const [now, setNow] = useState(new Date())
  const gestureStartRef = useRef<GestureStart | null>(null)

  useEffect(() => { const timer = window.setInterval(() => setNow(new Date()), 30000); return () => window.clearInterval(timer) }, [])
  function closeOverlays() { setSpotlight(false); setControlCenter(false); setNotificationCenter(false); setAssistiveOpen(false); setAssistiveDevice(false); setIslandExpanded(false) }
  function openApp(app: MobileAppId) { setActiveApp(app); closeOverlays() }
  function goHome() { setActiveApp(null); closeOverlays() }
  function showScreenshotToast() { setScreenshotToast(true); setAssistiveOpen(false); setAssistiveDevice(false); window.setTimeout(() => setScreenshotToast(false), 1600) }

  function handleTouchStart(event: React.TouchEvent) {
    const touch = event.touches[0]
    gestureStartRef.current = { x: touch.clientX, y: touch.clientY, width: window.innerWidth, height: window.innerHeight }
  }
  function handleTouchEnd(event: React.TouchEvent) {
    const start = gestureStartRef.current
    if (!start) return
    const touch = event.changedTouches[0]
    const dx = touch.clientX - start.x
    const dy = touch.clientY - start.y
    if (start.y < 52 && dy > 55) {
      if (start.x > start.width * .56) setControlCenter(true)
      else setNotificationCenter(true)
    } else if (start.y > start.height - 95 && dy < -48) {
      goHome()
    } else if (!activeApp && Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy)) {
      setPage(dx < 0 ? 1 : 0)
    }
    gestureStartRef.current = null
  }

  const currentApps = page === 0 ? pageOneApps : pageTwoApps

  return <main className="mobile-os-root ios-shell ios-shell-native" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
    <NextImage className="mobile-os-wallpaper" src="/mobile/ios-wallpaper.webp" fill priority sizes="100vw" alt="" />
    <div className="ios-status-bar" aria-label="iOS status bar"><button onClick={() => setNotificationCenter(true)}>{now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</button><button className={`ios-dynamic-island ${islandExpanded ? 'expanded' : ''}`} onClick={() => setIslandExpanded((value) => !value)} aria-label="Dynamic Island"><b />{islandExpanded && <span><NextImage src="/ammar-avatar.png" width={48} height={48} alt="Ammar" /><i><strong>Portfolio live</strong><small>Available for internships</small></i></span>}</button><button onClick={() => setControlCenter(true)}><Signal /><Wifi /><BatteryCharging /></button></div>

    <div className={`ios-home ios-home-page-${page}`}>
      {page === 0 ? <section className="ios-widget-stack ios-smart-stack"><button className="ios-profile-widget" onClick={() => openApp('profile')}><span><NextImage src="/ammar-avatar.png" width={110} height={110} alt="Ammar account" /></span><div><small>PORTFOLIO</small><strong>Muhammad Ammar</strong><p>Full-stack developer · Islamabad</p></div><i>Open</i></button><div className="ios-context-widgets"><button className="ios-project-activity" onClick={() => openApp('projects')}><span>PROJECT ACTIVITY</span><strong>4 shipped</strong><p>FAST Utilities · WayFinder · GCR Fetch · DramaGhar</p><i><b style={{ width: '82%' }} /></i></button><button className="ios-availability-widget" onClick={() => openApp('contact')}><span>AVAILABILITY</span><i /><strong>Open to work</strong><small>Full-stack internships</small></button></div></section> : <section className="ios-social-widget"><header><span><NextImage src="/ammar-avatar.png" width={96} height={96} alt="Ammar" /></span><div><small>PROFESSIONAL NETWORK</small><strong>Build in public.</strong><p>Code, projects, education and the work behind them.</p></div></header><div><button onClick={() => openApp('github')}><Github /><span><strong>GitHub</strong><small>4 featured repositories</small></span></button><button onClick={() => openApp('linkedin')}><Linkedin /><span><strong>LinkedIn</strong><small>Professional profile</small></span></button></div></section>}
      <div className="ios-app-grid ios-native-app-grid">{currentApps.map(({ id, label, icon: Icon, tone }) => <button key={id} onClick={() => openApp(id)}><span className={`mobile-app-icon ios-app-icon tone-${tone}`}><Icon /></span><small>{label}</small></button>)}</div>
      <button className="ios-search-pill" onClick={() => setSpotlight(true)}><Search /> Search</button><div className="ios-page-dots"><i className={page === 0 ? 'active' : ''} /><i className={page === 1 ? 'active' : ''} /></div>
    </div>

    <nav className="ios-dock" aria-label="iOS Dock"><button onClick={() => openApp('contact')}><Mail /></button><button onClick={() => openApp('projects')}><FolderGit2 /></button><button onClick={() => openApp('github')}><Github /></button><button onClick={() => openApp('profile')}><CircleUserRound /></button></nav>

    {controlCenter && <section className="ios-control-center ios-control-center-native"><header><span>{now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}</span><button onClick={() => setControlCenter(false)}><X /></button></header><div className="ios-cc-layout"><section className="ios-cc-connectivity"><button className={airplaneMode ? 'active airplane' : ''} onClick={() => { setAirplaneMode((value) => !value); setWifi(false) }}><Plane /><small>Airplane</small></button><button className={wifi ? 'active' : ''} onClick={() => { setWifi((value) => !value); setAirplaneMode(false) }}><Wifi /><small>Wi-Fi</small></button><button className={bluetooth ? 'active' : ''} onClick={() => setBluetooth((value) => !value)}><Bluetooth /><small>Bluetooth</small></button><button className="active"><Signal /><small>Cloud</small></button></section><section className="ios-cc-media"><small>NOW BUILDING</small><strong>AmmarOS Portfolio</strong><span>Next.js · TypeScript</span><div><button>‹</button><button onClick={() => setPlaying((value) => !value)}>{playing ? 'Ⅱ' : '▶'}</button><button>›</button></div></section><button className={`ios-cc-focus ${focusMode ? 'active' : ''}`} onClick={() => setFocusMode((value) => !value)}><Moon /><span><strong>Focus</strong><small>{focusMode ? 'Build mode on' : 'Off'}</small></span></button><button className={`ios-cc-mirror ${screenMirroring ? 'active' : ''}`} onClick={() => setScreenMirroring((value) => !value)}><Airplay /><span>{screenMirroring ? 'Mirroring On' : 'Screen Mirroring'}</span></button><section className="ios-cc-slider"><Sun /><i><b style={{ height: '76%' }} /></i></section><section className="ios-cc-slider"><Volume2 /><i><b style={{ height: noiseShield ? '14%' : '54%' }} /></i><button onClick={() => setNoiseShield((value) => !value)}><VolumeX /></button></section><button className="ios-cc-resilience" onClick={() => setResilience(100)}><BatteryCharging /><span><strong>{resilience}%</strong><small>Resilience</small></span></button><button className={`ios-cc-rotation ${rotationLock ? 'active' : ''}`} onClick={() => setRotationLock((value) => !value)}><RotateCw /><small>{rotationLock ? 'Portrait Locked' : 'Rotation Free'}</small></button></div><div className="ios-cc-utilities"><button className={activeUtility === 'flashlight' ? 'active' : ''} onClick={() => setActiveUtility((value) => value === 'flashlight' ? null : 'flashlight')}><Flashlight /></button><button className={activeUtility === 'timer' ? 'active' : ''} onClick={() => setActiveUtility('timer')}><Timer /></button><button className={activeUtility === 'calculator' ? 'active' : ''} onClick={() => setActiveUtility('calculator')}><Calculator /></button><button onClick={showScreenshotToast}><Camera /></button></div><footer><span>AmmarOS iOS · Control Center</span><button onClick={onRestart}><Power /> Boot options</button></footer></section>}

    {notificationCenter && <section className="ios-notification-center"><header><button onClick={() => setNotificationCenter(false)}>Close</button><div><span>{now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}</span><strong>{now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong></div><button onClick={() => setNotificationsVisible(false)}>Clear</button></header><section>{notificationsVisible ? <><div className="ios-notification-group"><span><NextImage src="/ammar-avatar.png" width={64} height={64} alt="Ammar" /></span><div><strong>Portfolio</strong><small>now</small><p>The mobile experience is ready to explore.</p></div></div><div className="ios-notification-group"><Github /><div><strong>GitHub</strong><small>2m ago</small><p>Four featured repositories are available.</p></div></div><div className="ios-notification-group"><Sparkles /><div><strong>Developer Focus</strong><small>today</small><p>Open to full-stack internship opportunities.</p></div></div></> : <p className="ios-no-notifications">No Older Notifications</p>}</section></section>}

    {spotlight && <section className="ios-spotlight ios-spotlight-native"><header><label><Search /><input autoFocus placeholder="Search AmmarOS" /></label><button onClick={() => setSpotlight(false)}>Cancel</button></header><span>SUGGESTIONS</span><div>{allApps.map(({ id, label, icon: Icon, tone }) => <button key={id} onClick={() => openApp(id)}><span className={`mobile-app-icon ios-app-icon tone-${tone}`}><Icon /></span><small>{label}</small></button>)}</div><section><strong>Siri Suggestions</strong><button onClick={() => openApp('projects')}><FolderGit2 /> Browse recent projects</button><button onClick={() => openApp('github')}><Github /> Open GitHub profile</button><button onClick={() => openApp('linkedin')}><Linkedin /> View professional profile</button></section></section>}

    <motion.button className="ios-assistive-touch" drag dragMomentum={false} dragConstraints={{ top: -520, bottom: 220, left: -330, right: 0 }} onTouchStart={(event) => event.stopPropagation()} onTouchEnd={(event) => event.stopPropagation()} onClick={() => { setAssistiveOpen((value) => !value); setAssistiveDevice(false) }} aria-label="AssistiveTouch"><i><b /></i></motion.button>
    {assistiveOpen && <section className="ios-assistive-menu"><header><span>AssistiveTouch</span><button onClick={() => setAssistiveOpen(false)}><X /></button></header>{assistiveDevice ? <div className="ios-assistive-grid"><button onClick={onLock}><LockKeyhole /><small>Lock Screen</small></button><button onClick={showScreenshotToast}><Camera /><small>Screenshot</small></button><button onClick={() => { setRotationLock((value) => !value); setAssistiveDevice(false) }}><RotateCw /><small>{rotationLock ? 'Unlock Rotation' : 'Lock Rotation'}</small></button><button onClick={onRestart}><Power /><small>Restart</small></button><button onClick={() => setAssistiveDevice(false)}><Home /><small>Back</small></button></div> : <div className="ios-assistive-grid"><button onClick={goHome}><Home /><small>Home</small></button><button onClick={() => { setControlCenter(true); setAssistiveOpen(false) }}><Sparkles /><small>Control Center</small></button><button onClick={() => { setNotificationCenter(true); setAssistiveOpen(false) }}><Bell /><small>Notifications</small></button><button onClick={() => setAssistiveDevice(true)}><SmartphoneIcon /><small>Device</small></button><button onClick={() => { setSpotlight(true); setAssistiveOpen(false) }}><Search /><small>Spotlight</small></button><button onClick={() => openApp('profile')}><CircleUserRound /><small>Profile</small></button></div>}</section>}

    {islandExpanded && <button className="ios-island-dismiss" onClick={() => setIslandExpanded(false)} aria-label="Dismiss Dynamic Island" />}
    {screenshotToast && <div className="ios-screenshot-toast"><CheckmarkIcon /><span><strong>Screenshot captured</strong><small>Saved to portfolio previews</small></span></div>}
    {activeApp && <MobileAppContent app={activeApp} os="ios" onBack={() => setActiveApp(null)} onOpenApp={openApp} />}
    <div className="ios-home-indicator" onClick={goHome}><i /></div>
  </main>
}

function SmartphoneIcon() { return <span className="ios-device-glyph">▯</span> }
function CheckmarkIcon() { return <span className="ios-check-glyph">✓</span> }
