import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState, type MouseEvent as ReactMouseEvent } from 'react'
import { ArrowUpRight, BatteryCharging, Braces, BrainCircuit, CalendarDays, CircleUserRound, Code2, FileText, FolderGit2, Github, Linkedin, Mail, Menu, RefreshCw, Search, ShieldCheck, Sparkles, TerminalSquare, Volume1, Volume2, VolumeX, Wifi, X, Zap } from 'lucide-react'
import { nativeAppMeta, type NativeAppId } from '../data/nativeApps'
import { projects } from '../data/portfolio'
import type { DesktopPlatform } from '../types'
import { DesktopShortcuts } from './DesktopShortcuts'
import { IDEWorkbench } from './IDEWorkbench'
import { NativeDesktopApps } from './NativeDesktopApps'

const icons = [
  { id: 'readme', label: 'VS Code', icon: Code2 },
  { id: 'projects', label: 'Explorer', icon: FolderGit2 },
  { id: 'terminal', label: 'Terminal', icon: TerminalSquare },
  { id: 'resume', label: 'Resume', icon: FileText },
  { id: 'about', label: 'About Ammar', icon: CircleUserRound },
  { id: 'skills', label: 'Skill Matrix', icon: Braces },
  { id: 'contact', label: 'Contact', icon: Mail },
] as const

type DesktopShellProps = {
  ideOpen: boolean
  initialFile: string
  onOpen: (file?: string) => void
  onMinimize: () => void
  onRestart: () => void
  reducedMotion: boolean
  platform: DesktopPlatform
}

export function DesktopShell({ ideOpen, initialFile, onOpen, onMinimize, onRestart, reducedMotion, platform }: DesktopShellProps) {
  const [now, setNow] = useState(new Date())
  const [startOpen, setStartOpen] = useState(false)
  const [startQuery, setStartQuery] = useState('')
  const [socialPreview, setSocialPreview] = useState<'github' | 'linkedin' | null>(null)
  const [openApps, setOpenApps] = useState<NativeAppId[]>([])
  const [minimizedApps, setMinimizedApps] = useState<NativeAppId[]>([])
  const [activeNative, setActiveNative] = useState<NativeAppId | null>(null)
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null)
  const [welcomeVisible, setWelcomeVisible] = useState(true)
  const [quickSettingsOpen, setQuickSettingsOpen] = useState(false)
  const [clockOpen, setClockOpen] = useState(false)
  const [focusMode, setFocusMode] = useState(false)
  const [focusStartedAt, setFocusStartedAt] = useState<number | null>(null)
  const [resilience, setResilience] = useState(87)
  const [noiseMode, setNoiseMode] = useState<'shielded' | 'ambient' | 'open'>('shielded')
  const [focusIntent, setFocusIntent] = useState<'Build' | 'Learn' | 'Debug'>('Build')
  const [devLanguage, setDevLanguage] = useState<'TS' | 'JS' | 'PY'>('TS')
  const [requestedProjectId, setRequestedProjectId] = useState<string | null>(null)
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => setWelcomeVisible(false), 6500)
    return () => window.clearTimeout(timer)
  }, [])

  function openNative(app: NativeAppId) {
    setOpenApps((apps) => apps.includes(app) ? apps : [...apps, app])
    setMinimizedApps((apps) => apps.filter((item) => item !== app))
    setActiveNative(app)
    setSocialPreview(null)
    setStartOpen(false)
    setQuickSettingsOpen(false)
    setClockOpen(false)
  }

  function closeNative(app: NativeAppId) {
    setOpenApps((apps) => apps.filter((item) => item !== app))
    setMinimizedApps((apps) => apps.filter((item) => item !== app))
    setActiveNative((active) => active === app ? null : active)
  }

  function minimizeNative(app: NativeAppId) {
    setMinimizedApps((apps) => apps.includes(app) ? apps : [...apps, app])
    setActiveNative((active) => active === app ? null : active)
  }

  function toggleNative(app: NativeAppId) {
    if (!openApps.includes(app) || minimizedApps.includes(app)) openNative(app)
    else if (activeNative === app) minimizeNative(app)
    else setActiveNative(app)
  }

  function launch(id: string) {
    if (id === 'readme') openIDE('readme')
    else {
      if (id === 'projects') setRequestedProjectId(null)
      openNative(id as NativeAppId)
    }
  }

  function openProjectNative(projectId: string) {
    setRequestedProjectId(projectId)
    openNative('projects')
  }

  function openIDE(file = 'readme') {
    setActiveNative(null)
    setStartOpen(false)
    setSocialPreview(null)
    setQuickSettingsOpen(false)
    setClockOpen(false)
    onOpen(file)
  }

  function toggleFocusMode() {
    setFocusMode((active) => {
      const next = !active
      setFocusStartedAt(next ? Date.now() : null)
      if (next) {
        setNoiseMode('shielded')
        setResilience((value) => Math.min(100, value + 7))
      }
      return next
    })
  }

  function cycleNoiseMode() {
    const modes = ['shielded', 'ambient', 'open'] as const
    setNoiseMode((mode) => modes[(modes.indexOf(mode) + 1) % modes.length])
  }

  function openQuickSettings() {
    setQuickSettingsOpen((value) => !value)
    setClockOpen(false)
    setStartOpen(false)
    setSocialPreview(null)
  }

  function openClock() {
    setClockOpen((value) => !value)
    setQuickSettingsOpen(false)
    setStartOpen(false)
    setSocialPreview(null)
  }

  function handleContextMenu(event: ReactMouseEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement
    if (target.closest('.ide-window-wrap, .native-window, .taskbar, .start-menu, .social-preview, .mac-menu-bar, .mac-dock')) return
    event.preventDefault()
    setContextMenu({ x: Math.min(event.clientX, window.innerWidth - 190), y: Math.min(event.clientY, window.innerHeight - 235) })
  }

  const desktopIcons = icons.map((item) => platform === 'macos' && item.id === 'projects' ? { ...item, label: 'Finder' } : item)
  const desktopShortcutIcons = platform === 'macos' ? desktopIcons.filter((item) => ['projects', 'resume'].includes(item.id)).map((item) => item.id === 'projects' ? { ...item, label: 'Projects' } : { ...item, label: 'Resume.pdf' }) : desktopIcons
  const visibleIcons = desktopIcons.filter((item) => item.label.toLowerCase().includes(startQuery.toLowerCase()))
  const visibleProjectResults = projects.filter((project) => `${project.title} ${project.tags.join(' ')}`.toLowerCase().includes(startQuery.toLowerCase()))
  const greeting = now.getHours() < 12 ? 'Good morning' : now.getHours() < 18 ? 'Good afternoon' : 'Good evening'
  const noiseLabels = { shielded: 'Noise shielded', ambient: 'Ambient allowed', open: 'Open listening' }
  const NoiseIcon = noiseMode === 'shielded' ? VolumeX : noiseMode === 'ambient' ? Volume1 : Volume2
  const focusMinutes = focusStartedAt ? Math.max(1, Math.floor((now.getTime() - focusStartedAt) / 60000)) : 0
  const firstWeekday = new Date(now.getFullYear(), now.getMonth(), 1).getDay()
  const monthDays = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
  const calendarDays = [...Array(firstWeekday).fill(null), ...Array.from({ length: monthDays }, (_, index) => index + 1)]
  const macAppTitles: Record<NativeAppId, string> = { projects: 'Finder', terminal: 'Terminal', resume: 'Preview', about: 'System Settings', skills: 'Developer Profile', contact: 'Mail' }
  const activeAppTitle = activeNative ? (platform === 'macos' ? macAppTitles[activeNative] : nativeAppMeta[activeNative].label) : ideOpen ? 'Ammar Code' : platform === 'macos' ? 'Finder' : 'AmmarOS'

  return (
    <div className={`desktop-shell platform-${platform} ${focusMode ? 'focus-mode' : ''}`} onContextMenu={handleContextMenu} onPointerDown={(event) => { if (!(event.target as HTMLElement).closest('.desktop-context-menu')) setContextMenu(null) }}>
      <img className="desktop-wallpaper" src="/wallpaper.webp" alt="" />
      <div className="wallpaper-vignette" />
      <div className="desktop-brand"><Code2 /><div><strong>{platform === 'macos' ? 'AmmarOS Sonoma' : 'AmmarOS'}</strong><span>{platform === 'macos' ? 'Darwin 26.1 · portfolio edition' : 'build 26.01 · portfolio edition'}</span></div></div>
      <DesktopShortcuts shortcuts={desktopShortcutIcons} onLaunch={launch} platform={platform} />
      <button className="desktop-person-widget" onClick={() => { setRequestedProjectId(null); openNative('projects') }}><span className="widget-avatar">MA<i /></span><span><small>CENTRALIZED WORKSPACE</small><strong>Open {platform === 'macos' ? 'Finder' : 'Explorer'}</strong><em>Projects · skills · resume · contact</em></span><ChevronStats /></button>
      <AnimatePresence>{focusMode && <motion.div className="focus-zone-badge" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}><BrainCircuit /><span><strong>{focusIntent} zone active</strong><small>{focusMinutes} min · external noise shielded</small></span><button onClick={toggleFocusMode}>End session</button></motion.div>}</AnimatePresence>

      <AnimatePresence>
        {ideOpen && <motion.div className={`ide-window-wrap ${activeNative ? '' : 'focused'}`} onPointerDown={() => setActiveNative(null)} initial={reducedMotion ? false : { opacity: 0, scale: .96, y: 26 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: .98 }} transition={{ type: 'spring', stiffness: 260, damping: 28 }}>
          <IDEWorkbench initialFile={initialFile} onRestart={onRestart} onMinimize={onMinimize} reducedMotion={reducedMotion} platform={platform} />
        </motion.div>}
      </AnimatePresence>

      <AnimatePresence>
        <NativeDesktopApps openApps={openApps} minimizedApps={minimizedApps} activeApp={activeNative} reducedMotion={reducedMotion} onFocus={setActiveNative} onClose={closeNative} onMinimize={minimizeNative} onOpenApp={openNative} onOpenIDE={openIDE} requestedProjectId={requestedProjectId} platform={platform} />
      </AnimatePresence>

      <AnimatePresence>{startOpen && (platform === 'macos' ? <motion.section className="mac-launchpad" initial={{ opacity: 0, scale: 1.03 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.02 }}>
        <header><div><span>AMMAROS</span><h2>Launchpad</h2></div><label><Search size={15} /><input placeholder="Search applications" autoFocus value={startQuery} onChange={(event) => setStartQuery(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') { if (visibleIcons[0]) launch(visibleIcons[0].id); else if (visibleProjectResults[0]) openProjectNative(visibleProjectResults[0].id) } }} /></label><button onClick={() => setStartOpen(false)} aria-label="Close Launchpad"><X /></button></header>
        <div className="mac-app-grid">{visibleIcons.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => launch(id)}><span><Icon /></span><small>{label}</small></button>)}</div>
        {startQuery && visibleProjectResults.length > 0 && <section className="mac-launchpad-results"><span>Projects</span><div>{visibleProjectResults.slice(0, 3).map((project) => <button key={project.id} onClick={() => openProjectNative(project.id)}><FolderGit2 /><strong>{project.title}</strong><small>{project.tags.slice(0, 2).join(' · ')}</small><ArrowUpRight /></button>)}</div></section>}
        <footer><span className="mini-avatar">MA</span><div><strong>{greeting}, Ammar</strong><small>{focusMode ? `${focusIntent} zone · ${focusMinutes} min` : 'Everything you need, without the clutter.'}</small></div><button className={focusMode ? 'active' : ''} onClick={toggleFocusMode}><BrainCircuit />{focusMode ? 'End focus' : 'Start focus'}</button></footer>
      </motion.section> : <motion.div className="start-menu" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}>
        <label><Search size={16} /><input placeholder="Search apps, projects, or technologies" autoFocus value={startQuery} onChange={(event) => setStartQuery(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') { if (visibleIcons[0]) launch(visibleIcons[0].id); else if (visibleProjectResults[0]) openProjectNative(visibleProjectResults[0].id) } }} /></label>
        <section className="start-personal"><div><span>{greeting}, Ammar.</span><strong>{focusMode ? `${focusIntent} zone is active` : 'What are we building next?'}</strong><small>{focusMode ? `${focusMinutes} focused minutes · resilience ${resilience}%` : 'Your projects, tools, and professional story are ready.'}</small></div><button className={focusMode ? 'active' : ''} onClick={toggleFocusMode}><BrainCircuit />{focusMode ? 'Leave focus' : 'Enter focus'}</button></section>
        <span>PINNED</span><div>{visibleIcons.filter((item) => item.id !== 'about').map(({ id, label, icon: Icon }) => <button key={id} onClick={() => { launch(id); setStartOpen(false) }}><Icon /><small>{label}</small></button>)}</div>
        {startQuery && visibleProjectResults.length > 0 && <><span>PROJECT MATCHES</span><section className="start-search-results">{visibleProjectResults.slice(0, 3).map((project) => <button key={project.id} onClick={() => openProjectNative(project.id)}><FolderGit2 /><span><strong>{project.title}</strong><small>{project.tags.slice(0, 2).join(' · ')}</small></span><ArrowUpRight /></button>)}</section></>}
        <span>RECENT</span><section className="start-recent"><button onClick={() => openProjectNative('signal')}><FileText /><span><strong>FAST Isb Utilities</strong><small>Explorer · native detail</small></span></button><button onClick={() => openNative('skills')}><Braces /><span><strong>Skill Matrix</strong><small>Capabilities · native app</small></span></button></section>
        <footer><span className="mini-avatar">MA</span><strong>Muhammad Ammar Asad</strong><span className="start-footer-status"><i />{focusMode ? 'Focused' : 'Available'}</span><button onClick={onRestart}>Restart</button></footer>
      </motion.div>)}</AnimatePresence>

      <AnimatePresence>{socialPreview && <motion.aside className={`social-preview ${socialPreview}`} initial={{ opacity: 0, y: 12, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8 }}>
        <header>{socialPreview === 'github' ? <Github /> : <Linkedin />}<span>{socialPreview === 'github' ? 'GitHub profile' : 'LinkedIn profile'}</span><button onClick={() => setSocialPreview(null)} aria-label="Close profile preview"><X /></button></header>
        <div className="social-preview-cover"><span>MA</span></div>
        <section><strong>Muhammad Ammar Asad</strong><small>{socialPreview === 'github' ? '@ammarasad2005' : 'Full-Stack Developer · CS @ FAST-NUCES'}</small><p>{socialPreview === 'github' ? 'Open-source projects across Next.js, Chrome extensions, campus tooling, and full-stack product builds.' : 'Computer Science student in Islamabad building end-to-end web products with TypeScript, React, Next.js, and Node.js.'}</p><div><span>{socialPreview === 'github' ? '4 featured projects' : 'Islamabad, Pakistan'}</span><a href={socialPreview === 'github' ? 'https://github.com/ammarasad2005' : 'https://www.linkedin.com/in/muhammad-ammar-asad/'} target="_blank" rel="noreferrer">Open profile <ArrowUpRight /></a></div></section>
      </motion.aside>}</AnimatePresence>

      <AnimatePresence>{welcomeVisible && platform === 'windows' && <motion.button className="desktop-notification" onClick={() => { setWelcomeVisible(false); setRequestedProjectId(null); openNative('projects') }} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}><FolderGit2 /><span><strong>Explorer is ready</strong><small>One persistent place for projects, skills, résumé, contact, and profile.</small></span><X onClick={(event) => { event.stopPropagation(); setWelcomeVisible(false) }} /></motion.button>}</AnimatePresence>

      <AnimatePresence>{contextMenu && <motion.div className={`desktop-context-menu context-${platform}`} style={{ left: contextMenu.x, top: contextMenu.y }} initial={{ opacity: 0, scale: .97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} onPointerDown={(event) => event.stopPropagation()}><button onClick={() => openNative('projects')}><FolderGit2 /> Open {platform === 'macos' ? 'Finder' : 'Explorer'}</button><button onClick={() => openNative('skills')}><Braces /> Open Skill Matrix</button><button onClick={() => openNative('terminal')}><TerminalSquare /> Open in Terminal</button><i /><button onClick={() => openNative('about')}><CircleUserRound /> {platform === 'macos' ? 'Get Info' : 'Profile properties'}</button><button onClick={() => { window.dispatchEvent(new Event('ammaros:reset-icons')); setContextMenu(null) }}><RefreshCw /> {platform === 'macos' ? 'Clean Up' : 'Arrange icons'}</button><button onClick={onRestart}><Code2 /> Restart AmmarOS</button></motion.div>}</AnimatePresence>

      <AnimatePresence>{quickSettingsOpen && <motion.aside className="developer-quick-settings" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}>
        <header><div><Sparkles /><span><strong>Developer Zone</strong><small>Personal workspace controls</small></span></div><b>{devLanguage} mode</b></header>
        <div className="quick-setting-grid">
          <button className={focusMode ? 'active' : ''} onClick={toggleFocusMode}><BrainCircuit /><span><strong>Focus zone</strong><small>{focusMode ? `${focusMinutes} min active` : 'Ready when you are'}</small></span></button>
          <button className={noiseMode === 'shielded' ? 'active' : ''} onClick={cycleNoiseMode}><NoiseIcon /><span><strong>{noiseLabels[noiseMode]}</strong><small>{noiseMode === 'shielded' ? 'No external disruption' : 'Click to cycle'}</small></span></button>
          <button onClick={() => { setSocialPreview('github'); setQuickSettingsOpen(false) }}><Wifi /><span><strong>Builder network</strong><small>GitHub · cloud connected</small></span></button>
          <button onClick={() => setResilience(100)}><BatteryCharging /><span><strong>Resilience {resilience}%</strong><small>{resilience === 100 ? 'Fully recharged' : 'Tap to mentally recharge'}</small></span></button>
        </div>
        <section className="resilience-meter"><span><ShieldCheck /> Mental resilience</span><strong>{resilience}%</strong><i><b style={{ width: `${resilience}%` }} /></i><small>Built through iteration, debugging, and showing up again.</small></section>
        <section className="focus-intent"><span>SESSION INTENT</span><div>{(['Build', 'Learn', 'Debug'] as const).map((intent) => <button className={focusIntent === intent ? 'active' : ''} key={intent} onClick={() => setFocusIntent(intent)}>{intent}</button>)}</div></section>
        <footer><Zap /> {focusMode ? `${focusIntent} zone protects your attention.` : 'Choose an intent, then enter the zone.'}</footer>
      </motion.aside>}</AnimatePresence>

      <AnimatePresence>{clockOpen && <motion.aside className="personal-clock-panel" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}>
        <header><time>{now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</time><span>{now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span><small>Islamabad · PKT workspace time</small></header>
        <section className="mini-calendar"><div><strong>{now.toLocaleDateString([], { month: 'long', year: 'numeric' })}</strong><span>Today is for progress, not perfection.</span></div><div className="calendar-week"><span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span></div><div className="calendar-days">{calendarDays.map((day, index) => <span className={day === now.getDate() ? 'today' : ''} key={`${day}-${index}`}>{day ?? ''}</span>)}</div></section>
        <section className="focus-plan"><div><CalendarDays /><span><strong>Today’s builder rhythm</strong><small>A suggested cadence for Ammar</small></span></div><ul><li><i />Deep build <span>90 min</span></li><li><i />Learn deliberately <span>45 min</span></li><li><i />Ship one useful thing <span>Today</span></li></ul><button className={focusMode ? 'active' : ''} onClick={toggleFocusMode}>{focusMode ? `End ${focusIntent} session · ${focusMinutes} min` : `Start ${focusIntent} session`}</button></section>
      </motion.aside>}</AnimatePresence>

      {platform === 'macos' && <>
        <header className="mac-menu-bar">
          <nav className="mac-menu-left" aria-label="macOS application menu"><button className="mac-ammar-menu" onClick={() => { setStartOpen((value) => !value); setQuickSettingsOpen(false); setClockOpen(false) }}><Code2 /></button><strong>{activeAppTitle}</strong><button onClick={() => openNative('projects')}>File</button><button onClick={() => setStartOpen(true)}>Edit</button><button onClick={openQuickSettings}>View</button><button onClick={() => openNative('projects')}>Go</button><button onClick={() => activeNative ? setActiveNative(null) : openNative('projects')}>Window</button><button onClick={() => openNative('about')}>Help</button></nav>
          <nav className="mac-menu-right" aria-label="macOS status menu"><button onClick={() => setDevLanguage((language) => language === 'TS' ? 'JS' : language === 'JS' ? 'PY' : 'TS')}>{devLanguage}</button>{focusMode && <button className="mac-focus-status" onClick={toggleFocusMode}><BrainCircuit />{focusMinutes}m</button>}<button onClick={openQuickSettings}><Wifi /></button><button onClick={() => { cycleNoiseMode(); setQuickSettingsOpen(true) }}><NoiseIcon /></button><button onClick={openQuickSettings}><BatteryCharging /><small>{resilience}%</small></button><button onClick={openClock}>{now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}&nbsp; {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</button></nav>
        </header>
        <footer className="mac-dock" aria-label="AmmarOS Dock"><button className={startOpen ? 'active' : ''} data-label="Launchpad" onClick={() => { setStartOpen((value) => !value); setQuickSettingsOpen(false); setClockOpen(false) }}><Menu /></button><button className={`${openApps.includes('projects') ? 'running' : ''} ${activeNative === 'projects' ? 'active' : ''}`} data-label="Finder" onClick={() => toggleNative('projects')}><FolderGit2 /></button><button className={`${ideOpen ? 'running' : ''} ${ideOpen && !activeNative ? 'active' : ''}`} data-label="Ammar Code" onClick={() => { if (ideOpen && activeNative) setActiveNative(null); else if (ideOpen) onMinimize(); else openIDE(initialFile) }}><Code2 /></button>{(['terminal', 'resume', 'about', 'skills', 'contact'] as NativeAppId[]).map((app) => { const MetaIcon = nativeAppMeta[app].icon; return <button key={app} data-label={platform === 'macos' && app === 'resume' ? 'Preview' : platform === 'macos' && app === 'contact' ? 'Mail' : nativeAppMeta[app].label} className={`${openApps.includes(app) ? 'running' : ''} ${activeNative === app ? 'active' : ''}`} onClick={() => toggleNative(app)}><MetaIcon /></button>})}<i /><button data-label="GitHub" onClick={() => setSocialPreview((value) => value === 'github' ? null : 'github')}><Github /></button><button data-label="LinkedIn" onClick={() => setSocialPreview((value) => value === 'linkedin' ? null : 'linkedin')}><Linkedin /></button></footer>
      </>}

      {platform === 'windows' && <footer className="taskbar">
        <button className={`taskbar-weather ${startOpen ? 'active' : ''}`} onClick={() => { setStartOpen((value) => !value); setQuickSettingsOpen(false); setClockOpen(false); setSocialPreview(null) }} aria-label="Open AmmarOS Start menu"><span className="pk-start-mark"><Menu /><b>PK</b></span><small>AmmarOS<br />Start menu</small></button>
        <div className="taskbar-center"><button aria-label="Search from Start" onClick={() => { setStartOpen(true); setQuickSettingsOpen(false); setClockOpen(false) }}><Search /></button><button className={`${ideOpen ? 'running' : ''} ${ideOpen && !activeNative ? 'active' : ''}`} onClick={() => { if (ideOpen && activeNative) setActiveNative(null); else if (ideOpen) onMinimize(); else openIDE(initialFile) }} aria-label="Ammar Code"><Code2 /></button>{(['projects', 'terminal', 'resume', 'about', 'skills', 'contact'] as NativeAppId[]).map((app) => { const MetaIcon = nativeAppMeta[app].icon; return <button key={app} className={`${openApps.includes(app) ? 'running' : ''} ${activeNative === app ? 'active' : ''}`} onClick={() => toggleNative(app)} aria-label={`${nativeAppMeta[app].label} app`}><MetaIcon /></button> })}<button className={socialPreview === 'github' ? 'active' : ''} onClick={() => setSocialPreview((value) => value === 'github' ? null : 'github')} aria-label="Preview GitHub profile"><Github /></button><button className={socialPreview === 'linkedin' ? 'active' : ''} onClick={() => setSocialPreview((value) => value === 'linkedin' ? null : 'linkedin')} aria-label="Preview LinkedIn profile"><Linkedin /></button></div>
        <div className="taskbar-tray"><button className="tray-language" onClick={() => setDevLanguage((language) => language === 'TS' ? 'JS' : language === 'JS' ? 'PY' : 'TS')} title="Active developer language">{devLanguage}</button><button onClick={openQuickSettings} title="Builder network connected"><Wifi /></button><button className={noiseMode === 'shielded' ? 'shielded' : ''} onClick={() => { cycleNoiseMode(); setQuickSettingsOpen(true); setClockOpen(false) }} title={noiseLabels[noiseMode]}><NoiseIcon /></button><button className="resilience-tray" onClick={openQuickSettings} title={`Mental resilience ${resilience}%`}><BatteryCharging /><small>{resilience}</small></button><button className="tray-clock" onClick={openClock}><time>{now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}<small>{now.toLocaleDateString([], { month: 'short', day: 'numeric' })}</small></time></button></div>
      </footer>}
    </div>
  )
}

function ChevronStats() {
  return <span className="widget-stats"><b>04<small>projects</small></b><b>06<small>semester</small></b><b>12+<small>tools</small></b></span>
}
