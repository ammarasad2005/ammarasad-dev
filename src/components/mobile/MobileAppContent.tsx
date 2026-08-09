'use client'

import NextImage from 'next/image'
import { useEffect, useRef, useState, type FormEvent, type MutableRefObject } from 'react'
import { ArrowLeft, ArrowUpRight, BatteryCharging, BookOpen, Building2, Check, ChevronLeft, Copy, Download, ExternalLink, Github, GraduationCap, Info, Linkedin, Mail, MapPin, MoreHorizontal, MoreVertical, Send, Signal, Sparkles, Star, TerminalSquare, Users, Wifi } from 'lucide-react'
import { projects } from '../../data/portfolio'

export type MobileAppId = 'profile' | 'projects' | 'skills' | 'resume' | 'contact' | 'terminal' | 'github' | 'linkedin'
export type MobileOS = 'android' | 'ios'

const EMAIL = 'ammarasad321993@gmail.com'
const GITHUB_URL = 'https://github.com/ammarasad2005'
const LINKEDIN_URL = 'https://www.linkedin.com/in/muhammad-ammar-asad/'
const RESUME_URL = '/downloads/Muhammad-Ammar-Asad-Resume.pdf'

const appTitles: Record<MobileAppId, { android: string; ios: string }> = {
  profile: { android: 'About Ammar', ios: 'Profile' },
  projects: { android: 'Projects', ios: 'Files' },
  skills: { android: 'Skill Matrix', ios: 'Developer' },
  resume: { android: 'Resume', ios: 'Preview' },
  contact: { android: 'Contact', ios: 'Mail' },
  terminal: { android: 'Terminal', ios: 'Terminal' },
  github: { android: 'GitHub', ios: 'GitHub' },
  linkedin: { android: 'LinkedIn', ios: 'LinkedIn' },
}

/** Material calls it an app bar subtitle, Apple calls it a prompt — same idea. */
const appSubtitles: Record<MobileAppId, string> = {
  profile: 'Who is behind the builds',
  projects: 'Four shipped products',
  skills: 'Proved by shipped work',
  resume: 'One page, no filler',
  contact: 'Usually replies the same day',
  terminal: 'Type help to explore',
  github: '@ammarasad2005',
  linkedin: 'Open to internships',
}

type MobileAppContentProps = {
  app: MobileAppId
  os: MobileOS
  now: Date
  resilience: number
  focusLabel?: string | null
  online?: boolean
  onBack: () => void
  onOpenApp: (app: MobileAppId) => void
  /** Lets the shell's system Back gesture pop this app's internal stack first. */
  backRef?: MutableRefObject<(() => boolean) | null>
}

export function MobileAppContent({ app, os, now, resilience, focusLabel = null, online = true, onBack, onOpenApp, backRef }: MobileAppContentProps) {
  const [projectId, setProjectId] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(null), 1800)
    return () => window.clearTimeout(timer)
  }, [toast])

  /** True when the press was consumed by in-app navigation instead of leaving the app. */
  function popInternal() {
    if (menuOpen) { setMenuOpen(false); return true }
    if (app === 'projects' && projectId) { setProjectId(null); return true }
    return false
  }

  useEffect(() => {
    if (!backRef) return
    backRef.current = popInternal
    return () => { backRef.current = null }
  })

  function handleBack() { if (!popInternal()) onBack() }

  async function copyEmail() {
    try { await navigator.clipboard?.writeText(EMAIL); setToast('Email address copied') }
    catch { setToast(EMAIL) }
    setMenuOpen(false)
  }

  function openExternal(url: string, message: string) {
    window.open(url, '_blank', 'noopener,noreferrer')
    setToast(message)
    setMenuOpen(false)
  }

  const contextualItem = app === 'resume'
    ? { id: 'pdf', label: 'Open the PDF', icon: ExternalLink, run: () => openExternal(RESUME_URL, 'Opening résumé') }
    : app === 'linkedin'
      ? { id: 'linkedin', label: 'Open LinkedIn profile', icon: Linkedin, run: () => openExternal(LINKEDIN_URL, 'Opening LinkedIn') }
      : { id: 'github', label: 'Open GitHub profile', icon: Github, run: () => openExternal(GITHUB_URL, 'Opening GitHub') }

  const menuItems = [
    contextualItem,
    { id: 'copy', label: 'Copy email address', icon: Copy, run: copyEmail },
    { id: 'resume', label: 'Download résumé', icon: Download, run: () => openExternal(RESUME_URL, 'Résumé downloading') },
    { id: 'terminal', label: 'Open Terminal', icon: TerminalSquare, run: () => { setMenuOpen(false); onOpenApp('terminal') } },
    { id: 'about', label: 'About this workspace', icon: Info, run: () => { setMenuOpen(false); onOpenApp('profile') } },
  ]

  const title = appTitles[app][os]
  const project = projects.find((item) => item.id === projectId) ?? null

  return <section className={`mobile-native-app mobile-native-app-${os}`} aria-label={title}>
    <AppStatusBar os={os} now={now} resilience={resilience} focusLabel={focusLabel} online={online} />

    <header className="mobile-app-header">
      <button className="mobile-app-back" onClick={handleBack} aria-label={project ? 'Back to the list' : 'Return to home'}>{os === 'ios' ? <><ChevronLeft /> {project ? title : 'Home'}</> : <ArrowLeft />}</button>
      <span className="mobile-app-title"><strong>{title}</strong>{os === 'android' && <small>{appSubtitles[app]}</small>}</span>
      <button className={`mobile-app-more ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen((value) => !value)} aria-label="More options" aria-expanded={menuOpen}>{os === 'ios' ? <MoreHorizontal /> : <MoreVertical />}</button>
    </header>

    <div className="mobile-app-scroll" ref={scrollRef}>
      {app === 'profile' && <ProfileApp onOpenApp={onOpenApp} />}
      {app === 'projects' && <ProjectsApp os={os} projectId={projectId} onSelect={setProjectId} />}
      {app === 'skills' && <SkillsApp />}
      {app === 'resume' && <ResumeApp />}
      {app === 'contact' && <ContactApp os={os} onToast={setToast} />}
      {app === 'terminal' && <TerminalApp os={os} onOpenApp={onOpenApp} />}
      {app === 'github' && <GitHubApp />}
      {app === 'linkedin' && <LinkedInApp />}
    </div>

    {menuOpen && <>
      <button className="mobile-app-menu-scrim" onClick={() => setMenuOpen(false)} aria-label="Dismiss menu" />
      {os === 'android'
        ? <div className="android-overflow-menu" role="menu">{menuItems.map(({ id, label, icon: Icon, run }) => <button key={id} role="menuitem" onClick={run}><Icon /> {label}</button>)}</div>
        : <div className="ios-action-sheet" role="menu"><span>{title}</span><div>{menuItems.map(({ id, label, icon: Icon, run }) => <button key={id} role="menuitem" onClick={run}><Icon /> {label}</button>)}</div><button className="ios-action-cancel" onClick={() => setMenuOpen(false)}>Cancel</button></div>}
    </>}

    {toast && <div className="mobile-app-toast" role="status"><Check /> {toast}</div>}
  </section>
}

function AppStatusBar({ os, now, resilience, focusLabel, online }: { os: MobileOS; now: Date; resilience: number; focusLabel: string | null; online: boolean }) {
  return <div className={`mobile-app-status mobile-app-status-${os}`} aria-hidden="true">
    <span>{now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
    {os === 'ios' && <i className="mobile-app-island" />}
    <div>{focusLabel && <em>{focusLabel}</em>}<Signal />{online && <Wifi />}<BatteryCharging /><small>{resilience}%</small></div>
  </div>
}

function ProfileApp({ onOpenApp }: { onOpenApp: (app: MobileAppId) => void }) {
  return <div className="mobile-profile-app">
    <div className="mobile-profile-hero"><span><NextImage src="/ammar-avatar.png" width={180} height={180} alt="Photograph of Muhammad Ammar Asad" /></span><div><small>FULL-STACK DEVELOPER</small><h1>Muhammad<br />Ammar Asad</h1><p><MapPin /> Islamabad, Pakistan</p></div></div>
    <p className="mobile-profile-intro">Computer Science student at FAST-NUCES building useful end-to-end products with TypeScript, React, Next.js, Node.js, and modern databases.</p>
    <div className="mobile-profile-stats"><div><strong>04</strong><span>deployed projects</span></div><div><strong>12+</strong><span>campus tools</span></div><div><strong>06</strong><span>semester</span></div></div>
    <section className="mobile-profile-now"><span>NOW</span><h2>Open to full-stack internships</h2><p>Looking for a team where I can contribute to production software, learn deeply, and keep shipping.</p><button onClick={() => onOpenApp('contact')}>Start a conversation <ArrowUpRight /></button></section>
    <section className="mobile-profile-principles"><h3>How I build</h3>{['Solve the actual problem', 'Learn by shipping', 'Secure integrations by default', 'Automate repetitive work'].map((item, index) => <div key={item}><span>0{index + 1}</span><strong>{item}</strong></div>)}</section>
    <section className="mobile-profile-education"><h3>Education</h3><div><GraduationCap /><span><strong>FAST-NUCES Islamabad</strong><small>B.S. Computer Science · 2023–2027 · 6th semester</small></span></div></section>
    <section className="mobile-profile-environment"><h3>Build environment</h3><div>{['Linux-first workflow', 'VS Code · Neovim keymaps', 'Vercel serverless', 'Chrome Extension MV3', 'GitHub Actions CI', 'Responsive device testing'].map((item) => <span key={item}><Check /> {item}</span>)}</div></section>
    <footer className="mobile-app-footnote">AmmarOS mobile · profile service</footer>
  </div>
}

function ProjectsApp({ os, projectId, onSelect }: { os: MobileOS; projectId: string | null; onSelect: (id: string | null) => void }) {
  const project = projects.find((item) => item.id === projectId)
  if (project) return <div className="mobile-project-native-detail">
    <button className="mobile-inline-back" onClick={() => onSelect(null)}><ChevronLeft /> {os === 'ios' ? 'Files' : 'All projects'}</button>
    <div className="mobile-project-cover" style={{ background: project.gradient }}><span>PROJECT {project.index}</span><h1>{project.title}</h1><p>{project.subtitle}</p><strong>{project.metric}<small>{project.metricLabel}</small></strong></div>
    <section><span>THE BUILD</span><p>{project.description}</p><div>{project.tags.map((tag) => <i key={tag}>{tag}</i>)}</div></section>
    <section className="mobile-outcomes"><span>OUTCOMES</span>{project.outcomes.map((outcome) => <p key={outcome}><Check />{outcome}</p>)}</section>
    <section className="mobile-project-meta"><div><small>ROLE</small><strong>{project.role}</strong></div><div><small>TIMELINE</small><strong>{project.timeline}</strong></div></section>
    <footer>{project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer"><ExternalLink /> Live product</a>}<a href={project.githubUrl} target="_blank" rel="noreferrer"><Github /> Source</a></footer>
  </div>
  return <div className="mobile-projects-app">
    <header><span>PROJECT LIBRARY</span><h1>Things I&rsquo;ve shipped.</h1><p>Four products built around real, specific problems.</p></header>
    {projects.map((item) => <button className="mobile-project-file" key={item.id} onClick={() => onSelect(item.id)}><span className="mobile-project-file-icon" style={{ background: item.gradient }}>{item.index}</span><span><strong>{item.title}</strong><small>{item.subtitle}</small><i>{item.tags.slice(0, 2).join(' · ')}</i></span><ChevronLeft /></button>)}
    <footer className="mobile-app-footnote">4 items · sorted by ship date</footer>
  </div>
}

function SkillsApp() {
  const [category, setCategory] = useState('Frontend')
  const categories: Record<string, { tools: string[]; proof: string }> = {
    Frontend: { tools: ['TypeScript', 'React 19', 'Next.js App Router', 'Tailwind CSS', 'Framer Motion'], proof: 'Every product below ships a typed React front end.' },
    Backend: { tools: ['Node.js', 'Express', 'REST APIs', 'NextAuth', 'OAuth 2.0'], proof: 'GCR Fetch keeps its OAuth client secret off the extension.' },
    Data: { tools: ['PostgreSQL', 'Supabase', 'MongoDB Atlas', 'SQL'], proof: 'DramaGhar catalogues 200+ dramas with per-episode analytics.' },
    Platform: { tools: ['Git', 'GitHub Actions', 'Vercel', 'Linux', 'Chrome MV3'], proof: 'FAST Isb Utilities refreshes itself on Vercel Cron.' },
  }
  const active = categories[category]
  return <div className="mobile-skills-app">
    <header><span>CAPABILITY CENTER</span><h1>Across the stack.</h1><p>Skills represented by shipped work, not decorative percentages.</p></header>
    <nav>{Object.keys(categories).map((item) => <button className={category === item ? 'active' : ''} key={item} onClick={() => setCategory(item)}>{item}</button>)}</nav>
    <section><small>{category.toUpperCase()} / INSTALLED</small>{active.tools.map((tool, index) => <div key={tool}><span>{String(index + 1).padStart(2, '0')}</span><strong>{tool}</strong><Check /></div>)}</section>
    <p className="mobile-skill-proof-note"><Sparkles /> {active.proof}</p>
    <div className="mobile-skill-proof"><div><strong>04</strong><span>products</span></div><div><strong>12+</strong><span>utilities</span></div><div><strong>2027</strong><span>graduation</span></div></div>
  </div>
}

function ResumeApp() {
  return <div className="mobile-resume-app">
    <div className="mobile-resume-actions"><a href="https://files.catbox.moe/u9kv8a.pdf" target="_blank" rel="noreferrer"><ExternalLink /> Open PDF</a><a href={RESUME_URL} download="Muhammad-Ammar-Asad-Resume.pdf"><Download /> Download</a></div>
    <div><NextImage src="/resume-preview.png" width={1489} height={2105} sizes="100vw" alt="Muhammad Ammar Asad résumé" /></div>
    <footer className="mobile-app-footnote">1 page · updated for the 2026 internship cycle</footer>
  </div>
}

function ContactApp({ os, onToast }: { os: MobileOS; onToast: (message: string) => void }) {
  const [subject, setSubject] = useState('Full-stack internship opportunity')
  const [message, setMessage] = useState('Hi Ammar, I found your portfolio and would like to connect about...')
  const [copied, setCopied] = useState(false)
  function send(event: FormEvent) { event.preventDefault(); window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}` }
  async function copy() {
    try { await navigator.clipboard?.writeText(EMAIL) } catch { /* clipboard unavailable */ }
    setCopied(true); onToast('Email address copied'); window.setTimeout(() => setCopied(false), 1400)
  }
  return <div className="mobile-contact-app">
    <header><span><NextImage src="/ammar-avatar.png" width={100} height={100} alt="Ammar account avatar" /></span><div><small>{os === 'ios' ? 'NEW MESSAGE TO' : 'CONTACT'}</small><h1>Muhammad Ammar</h1><p>{EMAIL}</p></div></header>
    <form onSubmit={send}><label>Subject<input value={subject} onChange={(event) => setSubject(event.target.value)} /></label><textarea value={message} onChange={(event) => setMessage(event.target.value)} /><button type="submit"><Send /> Send with email app</button></form>
    <button className="mobile-copy-email" onClick={copy}>{copied ? <Check /> : <Copy />}{copied ? 'Address copied' : 'Copy email address'}</button>
    <div className="mobile-social-links"><a href={GITHUB_URL} target="_blank" rel="noreferrer"><Github /> GitHub <ArrowUpRight /></a><a href={LINKEDIN_URL} target="_blank" rel="noreferrer"><Linkedin /> LinkedIn <ArrowUpRight /></a><a href={`mailto:${EMAIL}`}><Mail /> Email <ArrowUpRight /></a></div>
  </div>
}

const languageMix = [
  { label: 'TypeScript', share: 58, tone: '#3178c6' },
  { label: 'JavaScript', share: 19, tone: '#f1e05a' },
  { label: 'CSS', share: 13, tone: '#663399' },
  { label: 'Python', share: 6, tone: '#3572a5' },
  { label: 'Other', share: 4, tone: '#5b6b7d' },
]

function GitHubApp() {
  return <div className="mobile-github-app">
    <header><span><NextImage src="/ammar-avatar.png" width={120} height={120} alt="Ammar developer avatar" /></span><div><h1>Muhammad Ammar Asad</h1><p>@ammarasad2005</p><small>Full-stack developer · Islamabad</small></div></header>
    <p className="mobile-social-bio">Building practical products with Next.js, React, Node.js, PostgreSQL, MongoDB and browser extension APIs.</p>
    <div className="mobile-github-stats"><span><strong>04</strong> featured repos</span><span><strong>12+</strong> campus tools</span><span><strong>2027</strong> graduating</span></div>
    <section className="mobile-github-languages"><h2>Languages</h2><i>{languageMix.map((item) => <b key={item.label} style={{ width: `${item.share}%`, background: item.tone }} />)}</i><div>{languageMix.map((item) => <span key={item.label}><em style={{ background: item.tone }} />{item.label} <small>{item.share}%</small></span>)}</div></section>
    <a className="mobile-social-primary" href={GITHUB_URL} target="_blank" rel="noreferrer"><Github /> View GitHub profile <ArrowUpRight /></a>
    <section><h2><BookOpen /> Featured repositories</h2>{projects.map((project) => <a key={project.id} href={project.githubUrl} target="_blank" rel="noreferrer"><div><strong>{project.title}</strong><p>{project.description}</p><span>{project.tags.slice(0, 3).join(' · ')}</span></div><small><Star /> {project.metric}</small></a>)}</section>
  </div>
}

function LinkedInApp() {
  return <div className="mobile-linkedin-app">
    <div className="mobile-linkedin-cover" />
    <header><span><NextImage src="/ammar-avatar.png" width={140} height={140} alt="Ammar professional avatar" /></span><h1>Muhammad Ammar Asad</h1><p>Full-Stack Web Developer · CS @ FAST-NUCES</p><small><MapPin /> Islamabad, Pakistan</small><i>OPEN TO WORK</i></header>
    <div className="mobile-linkedin-actions"><a href={LINKEDIN_URL} target="_blank" rel="noreferrer"><Linkedin /> Open LinkedIn</a><a href={`mailto:${EMAIL}`}><Mail /> Message</a></div>
    <section><h2>About</h2><p>Sixth-semester Computer Science student specializing in end-to-end web applications, authenticated APIs, serverless backends, databases, and third-party integrations.</p></section>
    <section className="mobile-linkedin-list"><h2>Background</h2><div><GraduationCap /><span><strong>FAST-NUCES Islamabad</strong><small>B.S. Computer Science · 2023–2027</small></span></div><div><Building2 /><span><strong>Full-stack product engineering</strong><small>Next.js · Node.js · TypeScript</small></span></div><div><Users /><span><strong>Open to internships</strong><small>On-site and remote opportunities</small></span></div></section>
    <section className="mobile-linkedin-skills"><h2>Top skills</h2><div>{['TypeScript', 'React 19', 'Next.js', 'Node.js', 'PostgreSQL', 'MongoDB', 'OAuth 2.0', 'Supabase'].map((skill) => <span key={skill}>{skill}</span>)}</div></section>
  </div>
}

const terminalHelp = 'about · projects · skills · resume · contact · github · linkedin · email · whoami · neofetch · clear'

function TerminalApp({ os, onOpenApp }: { os: MobileOS; onOpenApp: (app: MobileAppId) => void }) {
  const prompt = os === 'ios' ? 'AmmarPhone:~ mobile$' : 'ammar@pixel:~$'
  const [lines, setLines] = useState<string[]>([`${prompt} help`, terminalHelp])
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const bodyRef = useRef<HTMLElement>(null)

  useEffect(() => { bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight }) }, [lines])

  function run(event: FormEvent) {
    event.preventDefault()
    const command = input.trim().toLowerCase()
    setInput('')
    if (!command) return
    if (command === 'clear') { setLines([]); return }
    const output: string[] = [`${prompt} ${command}`]
    if (['about', 'projects', 'skills', 'resume', 'contact', 'terminal'].includes(command)) {
      onOpenApp(command === 'about' ? 'profile' : command as MobileAppId)
      output.push(`Opening ${command}…`)
    } else if (command === 'github' || command === 'linkedin') {
      onOpenApp(command as MobileAppId)
      output.push(`Opening the native ${command === 'github' ? 'GitHub' : 'LinkedIn'} app…`)
    } else if (command === 'email') {
      window.location.href = `mailto:${EMAIL}`
      output.push(`Composing to ${EMAIL}…`)
    } else if (command === 'whoami') {
      output.push('ammar — full-stack developer, 6th-semester CS @ FAST-NUCES Islamabad.')
    } else if (command === 'ls') {
      output.push('profile  projects  skills  resume  contact  github  linkedin')
    } else if (command === 'neofetch') {
      output.push(
        `OS       AmmarOS mobile (${os === 'ios' ? 'iOS build' : 'Android build'})`,
        'Host     AmmarPhone Developer Edition',
        'Shell    portfolio-sh 1.4',
        'Stack    TypeScript · React 19 · Next.js · Node.js',
        'Uptime   2023 → 2027 · graduating with a shipped portfolio',
        'Status   Open to full-stack internships',
      )
    } else if (command === 'sudo') {
      output.push('ammar is not in the sudoers file. This incident will be shipped anyway.')
    } else if (command === 'help') {
      output.push(terminalHelp)
    } else if (command === 'exit') {
      output.push('Session ended. Swipe up to go home.')
    } else {
      output.push(`command not found: ${command}`, 'Type “help” for the available commands.')
    }
    setLines((current) => [...current, ...output])
  }

  return <div className="mobile-terminal-app" onClick={() => inputRef.current?.focus()}>
    <header><TerminalSquare /><span>{os === 'ios' ? 'zsh — mobile' : 'AmmarOS shell'}</span></header>
    <main ref={bodyRef}>
      {lines.map((line, index) => <p key={`${line}-${index}`}>{line || '\u00A0'}</p>)}
      <form onSubmit={run}><span>{os === 'ios' ? 'mobile %' : '~ $'}</span><input ref={inputRef} autoFocus value={input} onChange={(event) => setInput(event.target.value)} autoComplete="off" autoCapitalize="none" spellCheck={false} aria-label="Terminal command" /></form>
    </main>
  </div>
}
