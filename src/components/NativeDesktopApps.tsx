import { motion, useDragControls } from 'framer-motion'
import NextImage from 'next/image'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import type { LucideIcon } from 'lucide-react'
import { ArrowLeft, ArrowUpRight, AtSign, Braces, Check, ChevronRight, CircleUserRound, Code2, Copy, Database, Download, ExternalLink, FileCode2, FileText, Folder, FolderGit2, Github, GraduationCap, HardDrive, Home, Linkedin, Mail, MapPin, Maximize2, Minus, Search, Send, Server, TerminalSquare, X } from 'lucide-react'
import { nativeAppMeta, type NativeAppId } from '../data/nativeApps'
import { projects } from '../data/portfolio'
import type { DesktopPlatform } from '../types'

type NativeDesktopAppsProps = {
  openApps: NativeAppId[]
  minimizedApps: NativeAppId[]
  activeApp: NativeAppId | null
  reducedMotion: boolean
  onFocus: (app: NativeAppId) => void
  onClose: (app: NativeAppId) => void
  onMinimize: (app: NativeAppId) => void
  onOpenApp: (app: NativeAppId) => void
  onOpenIDE: (file?: string) => void
  requestedProjectId?: string | null
  platform: DesktopPlatform
}

type NativeWindowProps = {
  app: NativeAppId
  title: string
  icon: LucideIcon
  active: boolean
  reducedMotion: boolean
  children: React.ReactNode
  onFocus: () => void
  onClose: () => void
  onMinimize: () => void
  platform: DesktopPlatform
}

function NativeWindow({ app, title, icon: Icon, active, reducedMotion, children, onFocus, onClose, onMinimize, platform }: NativeWindowProps) {
  const controls = useDragControls()
  const [maximized, setMaximized] = useState(false)

  return (
    <motion.section
      className={`native-window ${app}-window native-window-${platform} ${active ? 'active' : ''} ${maximized ? 'maximized' : ''}`}
      role="dialog"
      aria-label={title}
      drag={!maximized}
      dragControls={controls}
      dragListener={false}
      dragMomentum={false}
      dragElastic={0}
      onPointerDown={onFocus}
      initial={reducedMotion ? false : { opacity: 0, scale: .94, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: .96, y: 10 }}
      transition={{ duration: .2 }}
    >
      <header className={`native-titlebar titlebar-${platform}`} onPointerDown={(event) => { onFocus(); if (!maximized) controls.start(event) }} onDoubleClick={() => setMaximized((value) => !value)}>
        {platform === 'macos' && <nav className="mac-traffic-lights" aria-label={`${title} window controls`} onPointerDown={(event) => event.stopPropagation()}><button className="mac-close" onClick={onClose} aria-label={`Close ${title}`}><X /></button><button className="mac-minimize" onClick={onMinimize} aria-label={`Minimize ${title}`}><Minus /></button><button className="mac-maximize" onClick={() => setMaximized((value) => !value)} aria-label={`${maximized ? 'Restore' : 'Maximize'} ${title}`}><Maximize2 /></button></nav>}
        <div><Icon /><span>{title}</span></div>
        {platform === 'windows' && <nav aria-label={`${title} window controls`} onPointerDown={(event) => event.stopPropagation()}><button onClick={onMinimize} aria-label={`Minimize ${title}`}><Minus /></button><button onClick={() => setMaximized((value) => !value)} aria-label={`${maximized ? 'Restore' : 'Maximize'} ${title}`}><Maximize2 /></button><button onClick={onClose} aria-label={`Close ${title}`}><X /></button></nav>}
      </header>
      <div className="native-window-body">{children}</div>
    </motion.section>
  )
}

function ProjectsExplorer({ onOpenApp, onOpenIDE, requestedProjectId, platform }: { onOpenApp: (app: NativeAppId) => void; onOpenIDE: (file?: string) => void; requestedProjectId?: string | null; platform: DesktopPlatform }) {
  const [query, setQuery] = useState('')
  const [view, setView] = useState<'home' | 'projects'>(requestedProjectId ? 'projects' : 'home')
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(requestedProjectId ?? null)
  const visibleProjects = projects.filter((project) => `${project.title} ${project.tags.join(' ')}`.toLowerCase().includes(query.toLowerCase()))
  const selectedProject = projects.find((project) => project.id === selectedProjectId)

  useEffect(() => {
    if (!requestedProjectId) return
    const timer = window.setTimeout(() => {
      setView('projects')
      setSelectedProjectId(requestedProjectId)
    }, 0)
    return () => window.clearTimeout(timer)
  }, [requestedProjectId])

  return <div className="native-explorer">
    <aside>
      <strong>{platform === 'macos' ? 'Favorites' : 'Quick access'}</strong>
      <button className={view === 'home' ? 'selected' : ''} onClick={() => { setView('home'); setSelectedProjectId(null) }}><Home /> Home</button>
      <button className={view === 'projects' ? 'selected' : ''} onClick={() => { setView('projects'); setSelectedProjectId(null) }}><FolderGit2 /> Projects <span>4</span></button>
      <button onClick={() => onOpenApp('skills')}><FileCode2 /> Skill Matrix</button>
      <button onClick={() => onOpenApp('resume')}><FileText /> Resume</button>
      <div />
      <strong>{platform === 'macos' ? 'Locations' : 'This PC'}</strong>
      <button onClick={() => { setView('home'); setSelectedProjectId(null) }}><HardDrive /> {platform === 'macos' ? 'Macintosh HD' : 'AmmarOS (C:)'}</button>
    </aside>
    <main>
      <div className="explorer-toolbar"><button aria-label="Back" disabled={!selectedProject} onClick={() => setSelectedProjectId(null)}>←</button><button aria-label="Forward" disabled>→</button><div><Home /><ChevronRight /> {platform === 'macos' ? 'Macintosh HD / Users' : 'Ammar'} <ChevronRight /> {platform === 'macos' ? 'ammar' : ''} {view === 'home' ? 'Home' : 'Projects'}{selectedProject && <><ChevronRight /> {selectedProject.title}</>}</div><label><Search /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={platform === 'macos' ? 'Search in Finder' : 'Search Projects'} /></label></div>
      {selectedProject ? <>
        <div className="native-project-detail-head" style={{ background: selectedProject.gradient }}><button onClick={() => setSelectedProjectId(null)}><ArrowLeft /> All projects</button><div><span>PROJECT {selectedProject.index}</span><h2>{selectedProject.title}</h2><p>{selectedProject.subtitle}</p></div><strong>{selectedProject.metric}<small>{selectedProject.metricLabel}</small></strong></div>
        <div className="native-project-detail-body"><section><span>ABOUT THIS BUILD</span><p>{selectedProject.description}</p><div>{selectedProject.tags.map((tag) => <i key={tag}>{tag}</i>)}</div></section><aside><span>OUTCOMES</span>{selectedProject.outcomes.map((outcome) => <p key={outcome}><Check />{outcome}</p>)}</aside><footer>{selectedProject.liveUrl && <a href={selectedProject.liveUrl} target="_blank" rel="noreferrer"><ExternalLink /> Launch live product</a>}<a href={selectedProject.githubUrl} target="_blank" rel="noreferrer"><Github /> View source</a><button onClick={() => onOpenIDE(selectedProject.id)}><Code2 /> Open markdown in Ammar Code</button></footer></div>
        <footer><span>{selectedProject.role}</span><span>{selectedProject.timeline}</span></footer>
      </> : view === 'home' ? <>
        <div className="explorer-heading"><div><span>AMMAR / HOME</span><h2>Personal workspace</h2></div><small>6th-semester CS student · Islamabad</small></div>
        <div className="explorer-home-grid"><button onClick={() => setView('projects')}><FolderGit2 /><span><strong>Projects</strong><small>4 deployed products</small></span></button><button onClick={() => onOpenApp('skills')}><Braces /><span><strong>Skill Matrix</strong><small>Full-stack capabilities</small></span></button><button onClick={() => onOpenApp('resume')}><FileText /><span><strong>Resume</strong><small>Professional profile</small></span></button><button onClick={() => onOpenApp('contact')}><Mail /><span><strong>Contact</strong><small>Let’s build together</small></span></button><button onClick={() => onOpenApp('about')}><CircleUserRound /><span><strong>Profile</strong><small>Education and background</small></span></button></div>
        <footer><span>5 folders</span><span>{platform === 'macos' ? 'Finder remains open while apps launch independently.' : 'Explorer remains open while destinations launch independently.'}</span></footer>
      </> : <>
        <div className="explorer-heading"><div><span>PROJECT LIBRARY</span><h2>Things I’ve shipped</h2></div><small>{visibleProjects.length} items · deployed & open source</small></div>
        <div className="native-project-grid">
          {visibleProjects.map((project) => <article key={project.id} onDoubleClick={() => setSelectedProjectId(project.id)}>
            <div className="native-project-icon" style={{ background: project.gradient }}><Folder /><span>{project.index}</span></div>
            <div className="native-project-info"><strong>{project.title}</strong><small>{project.subtitle}</small><div>{project.tags.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}</div></div>
            <div className="native-project-actions"><button onClick={() => setSelectedProjectId(project.id)}>Open</button>{project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer" aria-label={`Open ${project.title} live`}><ExternalLink /></a>}<a href={project.githubUrl} target="_blank" rel="noreferrer" aria-label={`Open ${project.title} source`}><Github /></a></div>
          </article>)}
          {!visibleProjects.length && <div className="native-empty"><Search /><strong>No projects found</strong><span>Try a technology like Next.js or Supabase.</span></div>}
        </div>
        <footer><span>{visibleProjects.length} items</span><span>Double-click a project for its native detail view.</span></footer>
      </>}
    </main>
  </div>
}

function NativeTerminal({ onOpenApp, onOpenIDE, platform }: { onOpenApp: (app: NativeAppId) => void; onOpenIDE: (file?: string) => void; platform: DesktopPlatform }) {
  const initialHistory = platform === 'macos' ? ['Last login: today on ttys001', 'AmmarBook-Pro · zsh · type “help” to explore.', ''] : ['AmmarOS Terminal [Version 26.1.0]', 'Type “help” to discover this workspace.', '']
  const [history, setHistory] = useState<string[]>(initialHistory)
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  function execute(raw: string) {
    const command = raw.trim().toLowerCase()
    if (!command) return
    if (command === 'clear') { setHistory([]); setInput(''); return }
    const lines = [platform === 'macos' ? `ammar@AmmarBook-Pro ~ % ${raw}` : `C:\\Users\\ammar> ${raw}`]
    if (command === 'help') lines.push('about  projects  skills  resume  code  github  linkedin  contact  education  clear')
    else if (command === 'about') { onOpenApp('about'); lines.push('Opening About Ammar...') }
    else if (command === 'whoami') lines.push('Muhammad Ammar Asad — full-stack developer and 6th-semester CS student at FAST-NUCES.')
    else if (command === 'education') lines.push('B.S. Computer Science · FAST-NUCES Islamabad · 2023–2027')
    else if (command === 'projects' || command === 'explorer') { onOpenApp('projects'); lines.push('Opening Explorer...') }
    else if (command === 'resume') { onOpenApp('resume'); lines.push('Opening Resume...') }
    else if (command === 'code') { onOpenIDE('readme'); lines.push('Launching Ammar Code...') }
    else if (command === 'skills') { onOpenApp('skills'); lines.push('Opening Skill Matrix...') }
    else if (command === 'contact') { onOpenApp('contact'); lines.push('Opening Contact...') }
    else if (command === 'github') { window.open('https://github.com/ammarasad2005', '_blank', 'noopener,noreferrer'); lines.push('Opening github.com/ammarasad2005...') }
    else if (command === 'linkedin') { window.open('https://www.linkedin.com/in/muhammad-ammar-asad/', '_blank', 'noopener,noreferrer'); lines.push('Opening LinkedIn profile...') }
    else lines.push(`'${command}' is not recognized. Type “help” for available commands.`)
    setHistory((current) => [...current, ...lines])
    setInput('')
  }

  return <div className="native-terminal" onClick={() => inputRef.current?.focus()}>
    <div className="terminal-tabs"><span><TerminalSquare /> {platform === 'macos' ? 'zsh' : 'PowerShell'}</span><button onClick={() => setHistory([...initialHistory.slice(0, 1), 'New session started.', ''])} aria-label="Start a new terminal session">+</button><button onClick={() => setHistory((current) => [...current, platform === 'macos' ? 'Profiles: zsh · bash · Developer Shell' : 'Profiles: PowerShell · Command Prompt · Developer Shell'])} aria-label="Show terminal profiles">⌄</button></div>
    <div className="native-terminal-scroll">{history.map((line, index) => <div key={`${line}-${index}`}>{line || '\u00A0'}</div>)}<form onSubmit={(event) => { event.preventDefault(); execute(input) }}><span>{platform === 'macos' ? 'ammar@AmmarBook-Pro ~ %' : 'C:\\Users\\ammar>'}</span><input ref={inputRef} autoFocus value={input} onChange={(event) => setInput(event.target.value)} spellCheck={false} autoComplete="off" aria-label="AmmarOS terminal command" /></form></div>
  </div>
}

function NativeResume() {
  const [zoom, setZoom] = useState(100)
  return <div className="native-resume">
    <div className="native-resume-toolbar"><div><button onClick={() => setZoom((value) => Math.max(60, value - 10))} aria-label="Zoom out">−</button><span>{zoom}%</span><button onClick={() => setZoom((value) => Math.min(160, value + 10))} aria-label="Zoom in">+</button></div><span>1 / 1</span><div><a href="https://files.catbox.moe/u9kv8a.pdf" target="_blank" rel="noreferrer"><ExternalLink /> Open original</a><a href="/downloads/Muhammad-Ammar-Asad-Resume.pdf" download="Muhammad-Ammar-Asad-Resume.pdf"><Download /> Download</a></div></div>
    <div className="native-resume-canvas"><NextImage style={{ width: `${zoom}%`, maxWidth: 'none', height: 'auto' }} width={1489} height={2105} sizes="(max-width: 1000px) 90vw, 720px" src="/resume-preview.png" alt="Muhammad Ammar Asad résumé" /></div>
  </div>
}

function NativeSkills() {
  const categories = {
    Frontend: { icon: Code2, summary: 'Interfaces that are fast, responsive, and maintainable.', tools: ['TypeScript', 'React 19', 'Next.js App Router', 'Tailwind CSS', 'Framer Motion'] },
    Backend: { icon: Server, summary: 'APIs, authentication, and serverless systems built for real use.', tools: ['Node.js', 'Express', 'REST APIs', 'NextAuth', 'OAuth 2.0', 'Vercel Serverless'] },
    Data: { icon: Database, summary: 'Practical data models across relational and document stores.', tools: ['PostgreSQL', 'Supabase', 'MongoDB Atlas', 'SQL', 'Scheduled data pipelines'] },
    Platform: { icon: TerminalSquare, summary: 'The tooling that takes an idea from local to production.', tools: ['Git', 'GitHub Actions', 'Linux', 'Vercel', 'Chrome Extension MV3'] },
  }
  const [activeCategory, setActiveCategory] = useState<keyof typeof categories>('Frontend')
  const active = categories[activeCategory]
  const ActiveIcon = active.icon
  return <div className="native-skills-app"><aside><div><span>MA</span><strong>Capability Center</strong><small>Installed skills</small></div>{(Object.keys(categories) as (keyof typeof categories)[]).map((category) => { const Icon = categories[category].icon; return <button className={activeCategory === category ? 'active' : ''} key={category} onClick={() => setActiveCategory(category)}><Icon />{category}<span>✓</span></button> })}<footer><i />Available for internships</footer></aside><main><header><div><span>SKILL MATRIX / {activeCategory.toUpperCase()}</span><h2>{activeCategory} engineering</h2><p>{active.summary}</p></div><ActiveIcon /></header><section className="native-skill-tools">{active.tools.map((tool, index) => <div key={tool}><span>{String(index + 1).padStart(2, '0')}</span><strong>{tool}</strong><small>Ready to build</small><Check /></div>)}</section><section className="native-skill-proof"><div><strong>04</strong><span>deployed projects</span></div><div><strong>12+</strong><span>campus utilities</span></div><div><strong>06</strong><span>current semester</span></div><p>Skills are represented by shipped work—not decorative progress bars.</p></section></main></div>
}

function NativeContact() {
  const [subject, setSubject] = useState('Full-stack internship opportunity')
  const [message, setMessage] = useState('Hi Ammar, I came across your portfolio and would like to connect about...')
  const [copied, setCopied] = useState(false)
  const email = 'ammarasad321993@gmail.com'
  function sendEmail(event: FormEvent) { event.preventDefault(); window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}` }
  async function copyAddress() { await navigator.clipboard?.writeText(email); setCopied(true); window.setTimeout(() => setCopied(false), 1400) }
  return <div className="native-contact-app"><aside><div className="contact-account"><span>MA</span><div><strong>Muhammad Ammar</strong><small>Available for opportunities</small></div></div><div className="compose-label"><Send /> New message</div><button onClick={copyAddress}><Copy /> {copied ? 'Address copied' : 'Copy email'}</button><i /><strong>PROFILES</strong><a href="https://github.com/ammarasad2005" target="_blank" rel="noreferrer"><Github /> GitHub</a><a href="https://www.linkedin.com/in/muhammad-ammar-asad/" target="_blank" rel="noreferrer"><Linkedin /> LinkedIn</a></aside><main><header><AtSign /><div><strong>Start a conversation</strong><small>Opens in your preferred mail application</small></div></header><form onSubmit={sendEmail}><label>To<input value={`${email} — Muhammad Ammar Asad`} readOnly /></label><label>Subject<input value={subject} onChange={(event) => setSubject(event.target.value)} /></label><textarea value={message} onChange={(event) => setMessage(event.target.value)} aria-label="Email message" /><footer><button type="submit"><Send /> Send with email app</button><span>Islamabad, Pakistan · open to on-site and remote roles</span></footer></form></main></div>
}

function AboutAmmar({ platform }: { platform: DesktopPlatform }) {
  const [copied, setCopied] = useState(false)
  const [section, setSection] = useState('System')
  const [settingsQuery, setSettingsQuery] = useState('')
  const sections = ['System', 'Devices', 'Online profiles', 'Principles', 'Tech stack', 'Account']
  const visibleSections = sections.filter((item) => item.toLowerCase().includes(settingsQuery.toLowerCase()))
  const details: Record<string, { title: string; description: string; items: string[] }> = {
    Devices: { title: 'Devices & environments', description: 'The environments where I build, test, and ship.', items: ['Linux-first development workflow', 'Chrome Extension Manifest V3', 'Vercel serverless deployments', 'Responsive testing across desktop and mobile'] },
    'Online profiles': { title: 'Online profiles', description: 'The places where my work and professional journey live.', items: ['GitHub · @ammarasad2005', 'LinkedIn · muhammad-ammar-asad', 'Email · ammarasad321993@gmail.com', 'Location · Islamabad, Pakistan'] },
    Principles: { title: 'How I work', description: 'A few defaults I carry into every build.', items: ['Solve the actual problem', 'Learn by shipping', 'Secure integrations by default', 'Automate repetitive work'] },
    'Tech stack': { title: 'Installed capabilities', description: 'Tools I currently use across the product stack.', items: ['TypeScript · JavaScript · Python · C++ · SQL', 'React 19 · Next.js · Tailwind · Framer Motion', 'Node.js · Express · REST APIs · OAuth 2.0', 'PostgreSQL · Supabase · MongoDB Atlas'] },
    Account: { title: 'Developer account', description: 'Education, availability, and current direction.', items: ['B.S. Computer Science · FAST-NUCES', '6th semester · graduating 2027', 'Open to full-stack internships', 'Interested in agentic AI and useful product systems'] },
  }
  async function copyEmail() { await navigator.clipboard?.writeText('ammarasad321993@gmail.com'); setCopied(true); window.setTimeout(() => setCopied(false), 1500) }
  return <div className="native-about">
    <aside><button onClick={() => setSection('System')} aria-label="Return to system overview">‹</button><div className="about-mini-user"><span>MA</span><div><strong>Muhammad Ammar</strong><small>Local account</small></div></div><label><Search /><input value={settingsQuery} onChange={(event) => setSettingsQuery(event.target.value)} placeholder="Find a setting" /></label>{visibleSections.map((item, index) => <button onClick={() => setSection(item)} className={section === item ? 'selected' : ''} key={item}>{index === 0 && item === 'System' ? <Code2 /> : <span>•</span>}{item}</button>)}</aside>
    <main><div className="about-crumb">Ammar <ChevronRight /> {section}</div><section className="about-hero"><div className="about-avatar">MA<i /></div><div><h2>Muhammad Ammar Asad</h2><p>Full-Stack Web Developer</p><span><MapPin /> Islamabad, Pakistan</span></div><button onClick={copyEmail}>{copied ? <Check /> : <Copy />}{copied ? 'Copied' : 'Copy email'}</button></section>
      {section === 'System' ? <section className="about-specs"><h3>Builder specifications</h3><div><span><GraduationCap /> Education</span><strong>B.S. Computer Science · FAST-NUCES</strong></div><div><span><Code2 /> Current focus</span><strong>Next.js · Node.js · TypeScript · Product engineering</strong></div><div><span><FolderGit2 /> Shipped</span><strong>4 deployed projects · 12+ campus utilities</strong></div><div><span><CircleUserRound /> Availability</span><strong className="available">Open to full-stack internships</strong></div></section> : <section className="native-settings-detail"><span>PERSONAL SETTINGS</span><h3>{details[section].title}</h3><p>{details[section].description}</p><div>{details[section].items.map((item) => <span key={item}><Check />{item}</span>)}</div></section>}
      <section className="about-links"><a href="mailto:ammarasad321993@gmail.com"><Mail /> Email <ArrowUpRight /></a><a href="https://github.com/ammarasad2005" target="_blank" rel="noreferrer"><Github /> GitHub <ArrowUpRight /></a><a href="https://www.linkedin.com/in/muhammad-ammar-asad/" target="_blank" rel="noreferrer"><Linkedin /> LinkedIn <ArrowUpRight /></a></section>
      <footer>{platform === 'macos' ? 'macOS-tailored interface · AmmarOS Darwin build 26.1' : 'Windows-tailored interface · AmmarOS build 26.1'} · crafted with React & TypeScript</footer>
    </main>
  </div>
}

export function NativeDesktopApps({ openApps, minimizedApps, activeApp, reducedMotion, onFocus, onClose, onMinimize, onOpenApp, onOpenIDE, requestedProjectId, platform }: NativeDesktopAppsProps) {
  return <>{openApps.filter((app) => !minimizedApps.includes(app)).map((app) => {
    const meta = nativeAppMeta[app]
    const macTitles: Record<NativeAppId, string> = { projects: 'Finder', terminal: 'Terminal', resume: 'Preview', about: 'System Settings', skills: 'Developer Profile', contact: 'Mail' }
    const title = platform === 'macos' ? macTitles[app] : meta.label
    return <NativeWindow key={app} app={app} title={title} icon={meta.icon} active={activeApp === app} reducedMotion={reducedMotion} onFocus={() => onFocus(app)} onClose={() => onClose(app)} onMinimize={() => onMinimize(app)} platform={platform}>
      {app === 'projects' && <ProjectsExplorer onOpenApp={onOpenApp} onOpenIDE={onOpenIDE} requestedProjectId={requestedProjectId} platform={platform} />}
      {app === 'terminal' && <NativeTerminal onOpenApp={onOpenApp} onOpenIDE={onOpenIDE} platform={platform} />}
      {app === 'resume' && <NativeResume />}
      {app === 'about' && <AboutAmmar platform={platform} />}
      {app === 'skills' && <NativeSkills />}
      {app === 'contact' && <NativeContact />}
    </NativeWindow>
  })}</>
}
