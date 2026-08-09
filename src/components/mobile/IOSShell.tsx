'use client'

import { motion } from 'framer-motion'
import NextImage from 'next/image'
import { useRef, useState } from 'react'
import { Airplay, BatteryCharging, Bell, Bluetooth, Braces, Bug, Calculator, Camera, CircleUserRound, Cloud, FileText, Flashlight, FolderGit2, Github, GraduationCap, Hammer, Home, Linkedin, LockKeyhole, Mail, Moon, Pause, Plane, Play, Power, RotateCw, Search, Signal, SkipBack, SkipForward, Sparkles, Sun, SunDim, Timer, Volume2, VolumeX, Wifi, X } from 'lucide-react'
import { MobileAppContent, type MobileAppId } from './MobileAppContent'
import { builderRhythm, greetingFor, intentCopy, screenDim, sessionIntents, useClock, useFocusSession, useNowPlaying, useSliderValue, type SessionIntent } from './mobileSystem'

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

/** Apple calls them Focus modes; here they are the same Build / Learn / Debug sessions the desktop runs. */
const intentIcon: Record<SessionIntent, typeof Hammer> = { Build: Hammer, Learn: GraduationCap, Debug: Bug }

const siriSuggestions: { id: MobileAppId; label: string; icon: typeof FolderGit2 }[] = [
  { id: 'projects', label: 'Browse recent projects', icon: FolderGit2 },
  { id: 'github', label: 'Open GitHub profile', icon: Github },
  { id: 'linkedin', label: 'View professional profile', icon: Linkedin },
]

export function IOSShell({ onRestart, onLock }: IOSShellProps) {
  const [activeApp, setActiveApp] = useState<MobileAppId | null>(null)
  const [controlCenter, setControlCenter] = useState(false)
  const [notificationCenter, setNotificationCenter] = useState(false)
  const [spotlight, setSpotlight] = useState(false)
  const [spotlightQuery, setSpotlightQuery] = useState('')
  const [assistiveOpen, setAssistiveOpen] = useState(false)
  const [assistiveDevice, setAssistiveDevice] = useState(false)
  const [islandExpanded, setIslandExpanded] = useState(false)
  const [page, setPage] = useState(0)
  const [wifi, setWifi] = useState(true)
  const [bluetooth, setBluetooth] = useState(true)
  const [airplaneMode, setAirplaneMode] = useState(false)
  const [deploysLive, setDeploysLive] = useState(true)
  const [screenMirroring, setScreenMirroring] = useState(false)
  const [rotationLock, setRotationLock] = useState(true)
  const [notificationsVisible, setNotificationsVisible] = useState(true)
  const [activeUtility, setActiveUtility] = useState<string | null>(null)
  const [resilience, setResilience] = useState(92)
  const [screenshotToast, setScreenshotToast] = useState(false)
  const gestureStartRef = useRef<GestureStart | null>(null)
  const appBackRef = useRef<(() => boolean) | null>(null)

  const now = useClock()
  const focus = useFocusSession()
  const media = useNowPlaying()
  const brightness = useSliderValue(76)
  const volume = useSliderValue(14)
  const focusMode = focus.intent !== null
  const focusCopy = focus.intent ? intentCopy[focus.intent] : null
  const focusLabel = focus.intent ? `${focus.intent} ${focus.minutes}m` : null
  const noiseShield = volume.value <= 25
  const online = wifi && !airplaneMode
  const rhythm = builderRhythm[now.getMinutes() % builderRhythm.length]

  function closeOverlays() { setSpotlight(false); setControlCenter(false); setNotificationCenter(false); setAssistiveOpen(false); setAssistiveDevice(false); setIslandExpanded(false) }
  function openApp(app: MobileAppId) { setActiveApp(app); setSpotlightQuery(''); closeOverlays() }
  function goHome() { setActiveApp(null); closeOverlays() }
  function goBack() { if (activeApp && appBackRef.current?.()) return; setActiveApp(null) }
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
  const spotlightMatches = allApps.filter((app) => app.label.toLowerCase().includes(spotlightQuery.trim().toLowerCase()))
  const suggestionMatches = siriSuggestions.filter((item) => item.label.toLowerCase().includes(spotlightQuery.trim().toLowerCase()))

  /** The Dynamic Island runs whatever is actually live: a build session, the media session, or availability. */
  const liveActivity = media.playing
    ? { title: media.track.title, detail: `Now building · ${media.track.subtitle}` }
    : focusCopy
      ? { title: focusCopy.headline, detail: `${focus.minutes}m in · ${focusCopy.detail}` }
      : { title: 'Portfolio live', detail: `${greetingFor(now)} — available for internships` }

  return <main className="mobile-os-root ios-shell ios-shell-native" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
    <NextImage className="mobile-os-wallpaper" src="/mobile/ios-wallpaper.webp" fill priority sizes="100vw" alt="" />
    <div className="ios-status-bar" aria-label="iOS status bar"><button onClick={() => setNotificationCenter(true)}>{now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</button><button className={`ios-dynamic-island ${islandExpanded ? 'expanded' : ''}`} onClick={() => setIslandExpanded((value) => !value)} aria-label="Dynamic Island"><b />{islandExpanded && <span><NextImage src="/ammar-avatar.png" width={48} height={48} alt="Ammar" /><i><strong>{liveActivity.title}</strong><small>{liveActivity.detail}</small></i></span>}</button><button onClick={() => setControlCenter(true)}>{focusMode && <Moon />}<Signal />{online && <Wifi />}<BatteryCharging /></button></div>

    <div className={`ios-home ios-home-page-${page}`}>
      {page === 0 ? <section className="ios-widget-stack ios-smart-stack"><button className="ios-profile-widget" onClick={() => openApp('profile')}><span><NextImage src="/ammar-avatar.png" width={110} height={110} alt="Ammar account" /></span><div><small>{greetingFor(now).toUpperCase()}</small><strong>Muhammad Ammar</strong><p>Full-stack developer · Islamabad</p></div><i>Open</i></button><div className="ios-context-widgets"><button className="ios-project-activity" onClick={() => openApp('projects')}><span>PROJECT ACTIVITY</span><strong>4 shipped</strong><p>FAST Utilities · WayFinder · GCR Fetch · DramaGhar</p><i><b style={{ width: '82%' }} /></i></button><button className="ios-availability-widget" onClick={() => openApp('contact')}><span>{focusMode ? 'FOCUS' : 'AVAILABILITY'}</span><i /><strong>{focusCopy ? focusCopy.headline : 'Open to work'}</strong><small>{focusCopy ? `${focus.minutes}m · ${focusCopy.detail}` : 'Full-stack internships'}</small></button></div></section> : <section className="ios-social-widget"><header><span><NextImage src="/ammar-avatar.png" width={96} height={96} alt="Ammar" /></span><div><small>PROFESSIONAL NETWORK</small><strong>Build in public.</strong><p>Code, projects, education and the work behind them.</p></div></header><div><button onClick={() => openApp('github')}><Github /><span><strong>GitHub</strong><small>4 featured repositories</small></span></button><button onClick={() => openApp('linkedin')}><Linkedin /><span><strong>LinkedIn</strong><small>Professional profile</small></span></button></div></section>}
      <div className="ios-app-grid ios-native-app-grid">{currentApps.map(({ id, label, icon: Icon, tone }) => <button key={id} onClick={() => openApp(id)}><span className={`mobile-app-icon ios-app-icon tone-${tone}`}><Icon /></span><small>{label}</small></button>)}</div>
      <button className="ios-search-pill" onClick={() => setSpotlight(true)}><Search /> Search</button><div className="ios-page-dots"><i className={page === 0 ? 'active' : ''} /><i className={page === 1 ? 'active' : ''} /></div>
    </div>

    <nav className="ios-dock" aria-label="iOS Dock"><button onClick={() => openApp('contact')} aria-label="Mail"><Mail /></button><button onClick={() => openApp('projects')} aria-label="Files"><FolderGit2 /></button><button onClick={() => openApp('github')} aria-label="GitHub"><Github /></button><button onClick={() => openApp('profile')} aria-label="Profile"><CircleUserRound /></button></nav>

    {controlCenter && <section className="ios-control-center ios-control-center-native"><header><span>{now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}</span><button onClick={() => setControlCenter(false)} aria-label="Close Control Center"><X /></button></header>
      <div className="ios-cc-layout">
        <section className="ios-cc-connectivity"><button className={airplaneMode ? 'active airplane' : ''} onClick={() => { setAirplaneMode((value) => !value); setWifi(false) }} aria-label="Airplane mode"><Plane /><small>Airplane</small></button><button className={wifi ? 'active' : ''} onClick={() => { setWifi((value) => !value); setAirplaneMode(false) }} aria-label="Wi-Fi"><Wifi /><small>{wifi ? 'Builder Net' : 'Wi-Fi'}</small></button><button className={bluetooth ? 'active' : ''} onClick={() => setBluetooth((value) => !value)} aria-label="Bluetooth"><Bluetooth /><small>{bluetooth ? 'AmmarBook' : 'Bluetooth'}</small></button><button className={deploysLive ? 'active' : ''} onClick={() => setDeploysLive((value) => !value)} aria-label="Deployments"><Cloud /><small>{deploysLive ? 'Deploys' : 'Paused'}</small></button></section>
        <section className="ios-cc-media"><small>{media.playing ? 'NOW BUILDING' : 'BUILD QUEUE'}</small><strong>{media.track.title}</strong><span>{media.track.subtitle}</span><i className="ios-cc-media-progress"><b style={{ width: `${Math.min(100, media.progress)}%` }} /></i><div><button onClick={media.previous} aria-label="Previous build"><SkipBack /></button><button className="play" onClick={media.toggle} aria-label={media.playing ? 'Pause the build' : 'Resume the build'}>{media.playing ? <Pause /> : <Play />}</button><button onClick={media.next} aria-label="Next build"><SkipForward /></button></div></section>
        <button className={`ios-cc-focus ${focusMode ? 'active' : ''}`} onClick={() => focus.toggle('Build')}><Moon /><span><strong>Focus</strong><small>{focusCopy ? `${focusCopy.headline} · ${focus.minutes}m` : 'Off'}</small></span></button>
        <button className={`ios-cc-mirror ${screenMirroring ? 'active' : ''}`} onClick={() => setScreenMirroring((value) => !value)}><Airplay /><span>{screenMirroring ? 'Mirroring to AmmarBook' : 'Screen Mirroring'}</span></button>
        <section className="ios-cc-slider"><Sun /><i {...brightness.bind(true)} role="slider" aria-label="Screen brightness" aria-valuenow={brightness.value} aria-valuemin={0} aria-valuemax={100} tabIndex={0}><b style={{ height: `${brightness.value}%` }} /></i><button onClick={() => brightness.setValue(brightness.value > 40 ? 22 : 88)} aria-label={brightness.value > 40 ? 'Dim for a late-night build' : 'Back to daylight brightness'}><SunDim /></button></section>
        <section className="ios-cc-slider">{noiseShield ? <VolumeX /> : <Volume2 />}<i {...volume.bind(true)} role="slider" aria-label="External noise" aria-valuenow={volume.value} aria-valuemin={0} aria-valuemax={100} tabIndex={0}><b style={{ height: `${volume.value}%` }} /></i><button onClick={() => volume.setValue(noiseShield ? 54 : 12)} aria-label={noiseShield ? 'Let ambient noise in' : 'Shield external noise'}><VolumeX /></button></section>
        <button className="ios-cc-resilience" onClick={() => setResilience(100)}><BatteryCharging /><span><strong>{resilience}%</strong><small>Resilience</small></span></button>
        <button className={`ios-cc-rotation ${rotationLock ? 'active' : ''}`} onClick={() => setRotationLock((value) => !value)}><RotateCw /><small>{rotationLock ? 'Portrait Locked' : 'Rotation Free'}</small></button>
      </div>
      {focusMode && <div className="ios-focus-modes">{sessionIntents.map((intent) => { const Icon = intentIcon[intent]; return <button key={intent} className={focus.intent === intent ? 'active' : ''} onClick={() => focus.start(intent)}><Icon /><span>{intent}</span></button> })}</div>}
      <div className="ios-cc-utilities"><button className={activeUtility === 'flashlight' ? 'active' : ''} onClick={() => setActiveUtility((value) => value === 'flashlight' ? null : 'flashlight')} aria-label="Flashlight"><Flashlight /></button><button className={activeUtility === 'timer' ? 'active' : ''} onClick={() => setActiveUtility('timer')} aria-label="Timer"><Timer /></button><button className={activeUtility === 'calculator' ? 'active' : ''} onClick={() => setActiveUtility('calculator')} aria-label="Calculator"><Calculator /></button><button onClick={showScreenshotToast} aria-label="Screenshot"><Camera /></button></div>
      <footer><span>AmmarOS iOS · {noiseShield ? 'external noise shielded' : 'ambient noise on'} · {rhythm.label.toLowerCase()}</span><button onClick={onRestart}><Power /> Boot options</button></footer></section>}

    {notificationCenter && <section className="ios-notification-center"><header><button onClick={() => setNotificationCenter(false)}>Close</button><div><span>{now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}</span><strong>{now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong></div><button onClick={() => setNotificationsVisible(false)}>Clear</button></header><section>{notificationsVisible ? <><div className="ios-notification-group"><span><NextImage src="/ammar-avatar.png" width={64} height={64} alt="Ammar" /></span><div><strong>Portfolio</strong><small>now</small><p>The mobile experience is ready to explore.</p></div></div><div className="ios-notification-group"><Github /><div><strong>GitHub</strong><small>2m ago</small><p>Four featured repositories are available.</p></div></div><div className="ios-notification-group"><Sparkles /><div><strong>Developer Focus</strong><small>today</small><p>{focusCopy ? `${focusCopy.headline} — ${focus.minutes}m of deliberate work so far.` : 'Open to full-stack internship opportunities.'}</p></div></div></> : <p className="ios-no-notifications">No Older Notifications</p>}</section></section>}

    {spotlight && <section className="ios-spotlight ios-spotlight-native"><header><label><Search /><input autoFocus value={spotlightQuery} onChange={(event) => setSpotlightQuery(event.target.value)} placeholder="Search AmmarOS" /></label><button onClick={() => { setSpotlight(false); setSpotlightQuery('') }}>Cancel</button></header><span>{spotlightQuery.trim() ? `RESULTS FOR “${spotlightQuery.trim()}”` : 'SUGGESTIONS'}</span><div>{spotlightMatches.map(({ id, label, icon: Icon, tone }) => <button key={id} onClick={() => openApp(id)}><span className={`mobile-app-icon ios-app-icon tone-${tone}`}><Icon /></span><small>{label}</small></button>)}</div>{!spotlightMatches.length && !suggestionMatches.length && <p className="ios-spotlight-empty">No results. Try “files”, “mail” or “github”.</p>}{suggestionMatches.length > 0 && <section><strong>Siri Suggestions</strong>{suggestionMatches.map(({ id, label, icon: Icon }) => <button key={label} onClick={() => openApp(id)}><Icon /> {label}</button>)}</section>}</section>}

    <motion.button className="ios-assistive-touch" drag dragMomentum={false} dragConstraints={{ top: -520, bottom: 220, left: -330, right: 0 }} onTouchStart={(event) => event.stopPropagation()} onTouchEnd={(event) => event.stopPropagation()} onClick={() => { setAssistiveOpen((value) => !value); setAssistiveDevice(false) }} aria-label="AssistiveTouch"><i><b /></i></motion.button>
    {assistiveOpen && <section className="ios-assistive-menu"><header><span>AssistiveTouch</span><button onClick={() => setAssistiveOpen(false)} aria-label="Close AssistiveTouch"><X /></button></header>{assistiveDevice ? <div className="ios-assistive-grid"><button onClick={onLock}><LockKeyhole /><small>Lock Screen</small></button><button onClick={showScreenshotToast}><Camera /><small>Screenshot</small></button><button onClick={() => { setRotationLock((value) => !value); setAssistiveDevice(false) }}><RotateCw /><small>{rotationLock ? 'Unlock Rotation' : 'Lock Rotation'}</small></button><button onClick={onRestart}><Power /><small>Restart</small></button><button onClick={() => setAssistiveDevice(false)}><Home /><small>Back</small></button></div> : <div className="ios-assistive-grid"><button onClick={goHome}><Home /><small>Home</small></button><button onClick={() => { setControlCenter(true); setAssistiveOpen(false) }}><Sparkles /><small>Control Center</small></button><button onClick={() => { setNotificationCenter(true); setAssistiveOpen(false) }}><Bell /><small>Notifications</small></button><button onClick={() => setAssistiveDevice(true)}><SmartphoneIcon /><small>Device</small></button><button onClick={() => { setSpotlight(true); setAssistiveOpen(false) }}><Search /><small>Spotlight</small></button><button onClick={() => openApp('profile')}><CircleUserRound /><small>Profile</small></button></div>}</section>}

    {islandExpanded && <button className="ios-island-dismiss" onClick={() => setIslandExpanded(false)} aria-label="Dismiss Dynamic Island" />}
    {screenshotToast && <div className="ios-screenshot-toast"><CheckmarkIcon /><span><strong>Screenshot captured</strong><small>Saved to portfolio previews</small></span></div>}
    {activeApp && <MobileAppContent key={activeApp} app={activeApp} os="ios" now={now} resilience={resilience} focusLabel={focusLabel} online={online} onBack={goBack} onOpenApp={openApp} backRef={appBackRef} />}
    <div className="ios-home-indicator" onClick={goHome}><i /></div>
    {brightness.value < 72 && <div className="mobile-screen-dim" style={{ opacity: screenDim(brightness.value) }} />}
  </main>
}

function SmartphoneIcon() { return <span className="ios-device-glyph">▯</span> }
function CheckmarkIcon() { return <span className="ios-check-glyph">✓</span> }
