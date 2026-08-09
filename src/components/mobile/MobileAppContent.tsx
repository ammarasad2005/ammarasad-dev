'use client'

import NextImage from 'next/image'
import { useRef, useState, type FormEvent } from 'react'
import { ArrowLeft, ArrowUpRight, Check, ChevronLeft, Copy, Download, ExternalLink, Github, Linkedin, Mail, MapPin, MoreHorizontal, Send, TerminalSquare } from 'lucide-react'
import { projects } from '../../data/portfolio'

export type MobileAppId = 'profile' | 'projects' | 'skills' | 'resume' | 'contact' | 'terminal'
export type MobileOS = 'android' | 'ios'

const appTitles: Record<MobileAppId, { android: string; ios: string }> = {
  profile: { android: 'About Ammar', ios: 'Profile' },
  projects: { android: 'Projects', ios: 'Files' },
  skills: { android: 'Skill Matrix', ios: 'Developer' },
  resume: { android: 'Resume', ios: 'Preview' },
  contact: { android: 'Contact', ios: 'Mail' },
  terminal: { android: 'Terminal', ios: 'Terminal' },
}

type MobileAppContentProps = {
  app: MobileAppId
  os: MobileOS
  onBack: () => void
  onOpenApp: (app: MobileAppId) => void
}

export function MobileAppContent({ app, os, onBack, onOpenApp }: MobileAppContentProps) {
  return <section className={`mobile-native-app mobile-native-app-${os}`} aria-label={appTitles[app][os]}>
    <header className="mobile-app-header"><button onClick={onBack} aria-label="Return to home">{os === 'ios' ? <><ChevronLeft /> Home</> : <ArrowLeft />}</button><strong>{appTitles[app][os]}</strong><button aria-label="More options"><MoreHorizontal /></button></header>
    <div className="mobile-app-scroll">
      {app === 'profile' && <ProfileApp onOpenApp={onOpenApp} />}
      {app === 'projects' && <ProjectsApp os={os} />}
      {app === 'skills' && <SkillsApp />}
      {app === 'resume' && <ResumeApp />}
      {app === 'contact' && <ContactApp os={os} />}
      {app === 'terminal' && <TerminalApp os={os} onOpenApp={onOpenApp} />}
    </div>
    <div className="mobile-home-indicator" onClick={onBack} aria-hidden="true"><i /></div>
  </section>
}

function ProfileApp({ onOpenApp }: { onOpenApp: (app: MobileAppId) => void }) {
  return <div className="mobile-profile-app"><div className="mobile-profile-hero"><span><NextImage src="/ammar-avatar.png" width={180} height={180} alt="Abstract developer account avatar" /></span><div><small>FULL-STACK DEVELOPER</small><h1>Muhammad<br />Ammar Asad</h1><p><MapPin /> Islamabad, Pakistan</p></div></div><p className="mobile-profile-intro">Computer Science student at FAST-NUCES building useful end-to-end products with TypeScript, React, Next.js, Node.js, and modern databases.</p><div className="mobile-profile-stats"><div><strong>04</strong><span>deployed projects</span></div><div><strong>12+</strong><span>campus tools</span></div><div><strong>06</strong><span>semester</span></div></div><section className="mobile-profile-now"><span>NOW</span><h2>Open to full-stack internships</h2><p>Looking for a team where I can contribute to production software, learn deeply, and keep shipping.</p><button onClick={() => onOpenApp('contact')}>Start a conversation <ArrowUpRight /></button></section><section className="mobile-profile-principles"><h3>How I build</h3>{['Solve the actual problem', 'Learn by shipping', 'Secure integrations by default', 'Automate repetitive work'].map((item, index) => <div key={item}><span>0{index + 1}</span><strong>{item}</strong></div>)}</section></div>
}

function ProjectsApp({ os }: { os: MobileOS }) {
  const [selected, setSelected] = useState<string | null>(null)
  const project = projects.find((item) => item.id === selected)
  if (project) return <div className="mobile-project-native-detail"><button className="mobile-inline-back" onClick={() => setSelected(null)}><ChevronLeft /> {os === 'ios' ? 'Files' : 'All projects'}</button><div className="mobile-project-cover" style={{ background: project.gradient }}><span>PROJECT {project.index}</span><h1>{project.title}</h1><p>{project.subtitle}</p><strong>{project.metric}<small>{project.metricLabel}</small></strong></div><section><span>THE BUILD</span><p>{project.description}</p><div>{project.tags.map((tag) => <i key={tag}>{tag}</i>)}</div></section><section className="mobile-outcomes"><span>OUTCOMES</span>{project.outcomes.map((outcome) => <p key={outcome}><Check />{outcome}</p>)}</section><footer>{project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer"><ExternalLink /> Live product</a>}<a href={project.githubUrl} target="_blank" rel="noreferrer"><Github /> Source</a></footer></div>
  return <div className="mobile-projects-app"><header><span>PROJECT LIBRARY</span><h1>Things I’ve shipped.</h1><p>Four products built around real, specific problems.</p></header>{projects.map((item) => <button className="mobile-project-file" key={item.id} onClick={() => setSelected(item.id)}><span className="mobile-project-file-icon" style={{ background: item.gradient }}>{item.index}</span><span><strong>{item.title}</strong><small>{item.subtitle}</small><i>{item.tags.slice(0, 2).join(' · ')}</i></span><ChevronLeft /></button>)}</div>
}

function SkillsApp() {
  const [category, setCategory] = useState('Frontend')
  const categories: Record<string, string[]> = {
    Frontend: ['TypeScript', 'React 19', 'Next.js App Router', 'Tailwind CSS', 'Framer Motion'],
    Backend: ['Node.js', 'Express', 'REST APIs', 'NextAuth', 'OAuth 2.0'],
    Data: ['PostgreSQL', 'Supabase', 'MongoDB Atlas', 'SQL'],
    Platform: ['Git', 'GitHub Actions', 'Vercel', 'Linux', 'Chrome MV3'],
  }
  return <div className="mobile-skills-app"><header><span>CAPABILITY CENTER</span><h1>Across the stack.</h1><p>Skills represented by shipped work, not decorative percentages.</p></header><nav>{Object.keys(categories).map((item) => <button className={category === item ? 'active' : ''} key={item} onClick={() => setCategory(item)}>{item}</button>)}</nav><section><small>{category.toUpperCase()} / INSTALLED</small>{categories[category].map((tool, index) => <div key={tool}><span>{String(index + 1).padStart(2, '0')}</span><strong>{tool}</strong><Check /></div>)}</section><div className="mobile-skill-proof"><div><strong>04</strong><span>products</span></div><div><strong>12+</strong><span>utilities</span></div><div><strong>2027</strong><span>graduation</span></div></div></div>
}

function ResumeApp() {
  return <div className="mobile-resume-app"><div className="mobile-resume-actions"><a href="https://files.catbox.moe/u9kv8a.pdf" target="_blank" rel="noreferrer"><ExternalLink /> Open PDF</a><a href="/downloads/Muhammad-Ammar-Asad-Resume.pdf" download="Muhammad-Ammar-Asad-Resume.pdf"><Download /> Download</a></div><div><NextImage src="/resume-preview.png" width={1489} height={2105} sizes="100vw" alt="Muhammad Ammar Asad résumé" /></div></div>
}

function ContactApp({ os }: { os: MobileOS }) {
  const [subject, setSubject] = useState('Full-stack internship opportunity')
  const [message, setMessage] = useState('Hi Ammar, I found your portfolio and would like to connect about...')
  const [copied, setCopied] = useState(false)
  const email = 'ammarasad321993@gmail.com'
  function send(event: FormEvent) { event.preventDefault(); window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}` }
  async function copy() { await navigator.clipboard?.writeText(email); setCopied(true); window.setTimeout(() => setCopied(false), 1400) }
  return <div className="mobile-contact-app"><header><span><NextImage src="/ammar-avatar.png" width={100} height={100} alt="Ammar account avatar" /></span><div><small>{os === 'ios' ? 'NEW MESSAGE TO' : 'CONTACT'}</small><h1>Muhammad Ammar</h1><p>{email}</p></div></header><form onSubmit={send}><label>Subject<input value={subject} onChange={(event) => setSubject(event.target.value)} /></label><textarea value={message} onChange={(event) => setMessage(event.target.value)} /><button type="submit"><Send /> Send with email app</button></form><button className="mobile-copy-email" onClick={copy}>{copied ? <Check /> : <Copy />}{copied ? 'Address copied' : 'Copy email address'}</button><div className="mobile-social-links"><a href="https://github.com/ammarasad2005" target="_blank" rel="noreferrer"><Github /> GitHub <ArrowUpRight /></a><a href="https://www.linkedin.com/in/muhammad-ammar-asad/" target="_blank" rel="noreferrer"><Linkedin /> LinkedIn <ArrowUpRight /></a><a href={`mailto:${email}`}><Mail /> Email <ArrowUpRight /></a></div></div>
}

function TerminalApp({ os, onOpenApp }: { os: MobileOS; onOpenApp: (app: MobileAppId) => void }) {
  const [lines, setLines] = useState<string[]>([os === 'ios' ? 'AmmarPhone:~ mobile$ help' : 'ammar@pixel:~$ help', 'about · projects · skills · resume · contact · github · clear'])
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  function run(event: FormEvent) { event.preventDefault(); const command = input.trim().toLowerCase(); if (!command) return; if (command === 'clear') { setLines([]); setInput(''); return } const prompt = os === 'ios' ? 'AmmarPhone:~ mobile$' : 'ammar@pixel:~$'; const output = [`${prompt} ${command}`]; if (['about', 'projects', 'skills', 'resume', 'contact'].includes(command)) { onOpenApp(command === 'about' ? 'profile' : command as MobileAppId); output.push(`Opening ${command}…`) } else if (command === 'github') { window.open('https://github.com/ammarasad2005', '_blank', 'noopener,noreferrer'); output.push('Opening GitHub…') } else if (command === 'help') output.push('about · projects · skills · resume · contact · github · clear')
  else output.push(`command not found: ${command}`); setLines((current) => [...current, ...output]); setInput('') }
  return <div className="mobile-terminal-app" onClick={() => inputRef.current?.focus()}><header><TerminalSquare /><span>{os === 'ios' ? 'zsh — mobile' : 'AmmarOS shell'}</span></header><main>{lines.map((line, index) => <p key={`${line}-${index}`}>{line || '\u00A0'}</p>)}<form onSubmit={run}><span>{os === 'ios' ? 'mobile %' : '~ $'}</span><input ref={inputRef} autoFocus value={input} onChange={(event) => setInput(event.target.value)} autoComplete="off" spellCheck={false} /></form></main></div>
}
