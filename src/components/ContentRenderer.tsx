import { useMemo, useState } from 'react'
import NextImage from 'next/image'
import { ArrowUpRight, Check, Copy, Download, ExternalLink, Github, Linkedin, Mail, MapPin, Sparkles } from 'lucide-react'
import { projects } from '../data/portfolio'

function HighlightedCode({ code }: { code: string }) {
  const lines = code.split('\n')
  const tokenPattern = /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\/\/.*$|\b(?:const|export|type|return|true|false|async|function|interface|readonly)\b|\b\d+(?:\.\d+)?\b|[{}[\]:,.])/g

  return (
    <div className="code-frame" aria-label="Syntax highlighted code">
      {lines.map((line, lineIndex) => (
        <div className="code-line" key={`${lineIndex}-${line}`}>
          <span className="line-number" aria-hidden="true">{lineIndex + 1}</span>
          <code>{line.split(tokenPattern).filter(Boolean).map((token, tokenIndex) => {
            let type = 'plain'
            if (/^['"`]/.test(token)) type = 'string'
            else if (/^\/\//.test(token)) type = 'comment'
            else if (/^(const|export|type|return|true|false|async|function|interface|readonly)$/.test(token)) type = 'keyword'
            else if (/^\d/.test(token)) type = 'number'
            else if (/^[{}[\]:,.]$/.test(token)) type = 'punctuation'
            return <span className={`token-${type}`} key={`${token}-${tokenIndex}`}>{token}</span>
          })}</code>
        </div>
      ))}
    </div>
  )
}

function ReadmeContent({ openFile }: { openFile: (id: string) => void }) {
  return (
    <article className="markdown-view readme-view">
      <div className="readme-kicker"><span className="pulse-dot" /> open to full-stack internships</div>
      <h1>Building full-stack products<br />that solve <em>real problems.</em></h1>
      <p className="readme-lede">I’m Muhammad Ammar Asad — a Computer Science student and full-stack developer building end-to-end web apps with TypeScript, React, Next.js, Node.js, and modern databases.</p>
      <div className="readme-actions">
        <button className="primary-action" onClick={() => openFile('signal')}>Explore selected work <ArrowUpRight size={16} /></button>
        <button className="secondary-action" onClick={() => openFile('contact')}>Start a conversation</button>
      </div>
      <div className="readme-meta">
        <div><span>Based in</span><strong>Islamabad, Pakistan</strong></div>
        <div><span>Currently</span><strong>B.S. Computer Science · FAST-NUCES</strong></div>
        <div><span>Focus</span><strong>Full-stack web · APIs · Product engineering</strong></div>
      </div>
      <section className="selected-work">
        <div className="section-heading"><span>01</span><h2>Selected work</h2><i /></div>
        <div className="project-rows">
          {projects.map((project) => (
            <button key={project.id} className="project-row" onClick={() => openFile(project.id)}>
              <span className="project-index">{project.index}</span>
              <span className="project-name"><strong>{project.title}</strong><small>{project.subtitle}</small></span>
              <span className="project-tags">{project.tags.slice(0, 2).join(' · ')}</span>
              <ArrowUpRight size={18} />
            </button>
          ))}
        </div>
      </section>
    </article>
  )
}

const profileCode = `export const ammar = {
  role: "Full-Stack Web Developer",
  location: "Islamabad, Pakistan",
  education: "B.S. CS @ FAST-NUCES",
  values: [
    "solve the actual problem",
    "learn by shipping",
    "secure by default",
  ],
  currentlyExploring: ["agentic AI", "serverless systems"],
  openToWork: true,
} as const`

function AboutContent() {
  return (
    <article className="markdown-view split-article">
      <div>
        <div className="eyebrow">ABOUT / PROFILE.TSX</div>
        <h1>Student mindset.<br /><em>Builder’s momentum.</em></h1>
        <p>I’m a sixth-semester Computer Science student at FAST-NUCES Islamabad specializing in end-to-end web applications—from accessible React interfaces to authenticated APIs and production databases.</p>
        <p>I’ve shipped four deployed projects spanning Next.js App Router, Supabase, MongoDB Atlas, Chrome Extension MV3, and multi-agent LLM orchestration. I enjoy taking an everyday frustration and turning it into software people can actually use.</p>
        <div className="principles-grid">
          <div><span>01</span><strong>Build end to end</strong><p>Understand the interface, API, data model, deployment, and the tradeoffs between them.</p></div>
          <div><span>02</span><strong>Automate repetition</strong><p>From campus data refreshes to Classroom downloads, remove work that software can do.</p></div>
          <div><span>03</span><strong>Protect the boundary</strong><p>Keep secrets server-side, constrain integrations, and treat authentication as product work.</p></div>
          <div><span>04</span><strong>Learn by shipping</strong><p>Production feedback teaches faster than a perfect project sitting on localhost.</p></div>
        </div>
      </div>
      <aside className="profile-aside">
        <div className="avatar-block"><span>MA</span><i /></div>
        <p>“The best way to understand a system is to build one people depend on.”</p>
        <div className="profile-facts"><span>Deployed projects <strong>04</strong></span><span>Campus tools unified <strong>12+</strong></span><span>Current semester <strong>06</strong></span></div>
      </aside>
      <div className="wide-code"><HighlightedCode code={profileCode} /></div>
    </article>
  )
}

function ProjectContent({ id, openFile }: { id: string; openFile: (id: string) => void }) {
  const project = projects.find((item) => item.id === id) ?? projects[0]
  const next = projects[(projects.indexOf(project) + 1) % projects.length]
  return (
    <article className="markdown-view project-detail">
      <div className="project-hero" style={{ background: project.gradient }}>
        <span>CASE STUDY / {project.index}</span>
        <div><h1>{project.title}</h1><p>{project.subtitle}</p></div>
        <div className="abstract-ui" aria-hidden="true"><i /><i /><i /><b /><b /></div>
      </div>
      <div className="project-summary">
        <div><span>ROLE</span><strong>{project.role}</strong></div>
        <div><span>STATUS</span><strong>{project.timeline}</strong></div>
        <div><span>STACK</span><strong>{project.tags.join(' · ')}</strong></div>
      </div>
      <div className="project-story">
        <section><div className="eyebrow">THE BUILD</div><h2>Start with a real frustration. Ship the shortest useful path.</h2><p>{project.description}</p><div className="case-links">{project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer">Live project <ExternalLink size={14} /></a>}<a href={project.githubUrl} target="_blank" rel="noreferrer">Source code <Github size={14} /></a></div></section>
        <aside><strong>{project.metric}</strong><span>{project.metricLabel}</span><p>A concrete measure of what the product makes easier.</p></aside>
      </div>
      <div className="outcomes">{project.outcomes.map((outcome) => <div key={outcome}><Check size={16} /><span>{outcome}</span></div>)}</div>
      <button className="next-case" onClick={() => openFile(next.id)}><span>Next case study</span><strong>{next.title}</strong><ArrowUpRight /></button>
    </article>
  )
}

const skillsCode = `{
  "languages": ["TypeScript", "JavaScript", "Python", "C++", "SQL"],
  "frontend": ["React", "Next.js", "Tailwind", "Framer Motion"],
  "backend": ["Node.js", "Express", "REST", "OAuth 2.0"],
  "data": ["PostgreSQL", "Supabase", "MongoDB Atlas"],
  "principle": "Understand the problem, then ship the useful thing."
}`

function SkillsContent() {
  const skills = [
    ['TypeScript & React', 92], ['Next.js full stack', 89], ['Node.js & REST APIs', 84], ['PostgreSQL & MongoDB', 80], ['OAuth & integrations', 82],
  ] as const
  return (
    <article className="markdown-view skills-view">
      <div className="eyebrow">SKILLS / STACK.JSON</div>
      <h1>Across the stack.<br /><em>Focused on outcomes.</em></h1>
      <p className="readme-lede">My current toolkit covers frontend, backend, databases, authentication, serverless deployment, and third-party integrations.</p>
      <div className="skill-layout">
        <div className="skill-bars">{skills.map(([name, value]) => <div key={name}><span><strong>{name}</strong><small>{value}%</small></span><i><b style={{ width: `${value}%` }} /></i></div>)}</div>
        <HighlightedCode code={skillsCode} />
      </div>
      <div className="tool-cloud">{['TypeScript', 'React 19', 'Next.js', 'Tailwind', 'Framer Motion', 'Node.js', 'Express', 'PostgreSQL', 'Supabase', 'MongoDB Atlas', 'NextAuth', 'OAuth 2.0', 'Vercel', 'GitHub Actions', 'Linux'].map((tool) => <span key={tool}>{tool}</span>)}</div>
    </article>
  )
}

function ContactContent() {
  const [copied, setCopied] = useState(false)
  const email = 'ammarasad321993@gmail.com'
  async function copyEmail() {
    await navigator.clipboard?.writeText(email)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }
  return (
    <article className="markdown-view contact-view">
      <div className="contact-copy">
        <div className="readme-kicker"><span className="pulse-dot" /> open to internship opportunities</div>
        <h1>Let’s build something<br /><em>genuinely useful.</em></h1>
        <p>I’m looking for a full-stack development internship where I can contribute to production software, learn from a strong team, and keep shipping thoughtful solutions.</p>
        <div className="contact-actions">
          <a className="primary-action" href={`mailto:${email}`}>Write an email <Mail size={16} /></a>
          <button className="secondary-action" onClick={copyEmail}>{copied ? <Check size={16} /> : <Copy size={16} />}{copied ? 'Copied' : 'Copy address'}</button>
        </div>
        <div className="contact-details"><span><MapPin size={15} /> Islamabad, Pakistan</span><span><Sparkles size={15} /> Open to on-site and remote roles</span></div>
      </div>
      <aside className="social-card">
        <span>ELSEWHERE</span>
        <a href="https://github.com/ammarasad2005" target="_blank" rel="noreferrer"><Github /> GitHub <ArrowUpRight /></a>
        <a href="https://www.linkedin.com/in/muhammad-ammar-asad/" target="_blank" rel="noreferrer"><Linkedin /> LinkedIn <ArrowUpRight /></a>
        <a href={`mailto:${email}`}><Mail /> {email} <ArrowUpRight /></a>
      </aside>
    </article>
  )
}

function ResumeContent() {
  const sourcePdf = 'https://files.catbox.moe/u9kv8a.pdf'

  function openPdf() {
    const opened = window.open(sourcePdf, '_blank')
    if (opened) opened.opener = null
    else window.location.assign(sourcePdf)
  }

  return (
    <article className="resume-document">
      <header className="pdf-toolbar"><div><span className="eyebrow">RESUME PREVIEW · PNG</span><strong>Muhammad Ammar Asad</strong><small>High-resolution in-editor preview · original available as PDF</small></div><div><button type="button" onClick={openPdf}><ExternalLink size={15} /> Open PDF</button><a className="pdf-download-button" href="/downloads/Muhammad-Ammar-Asad-Resume.pdf" download="Muhammad-Ammar-Asad-Resume.pdf"><Download size={15} /> Download PDF</a></div></header>
      <div className="resume-preview-scroll" tabIndex={0} aria-label="Scroll through Muhammad Ammar Asad's résumé preview">
        <NextImage className="resume-preview-image" src="/resume-preview.png" width={1489} height={2105} sizes="(max-width: 1000px) 90vw, 820px" alt="Muhammad Ammar Asad résumé showing professional summary, education, technical skills, projects, hackathons, and volunteer experience" />
      </div>
    </article>
  )
}

export function ContentRenderer({ fileId, openFile }: { fileId: string; openFile: (id: string) => void }) {
  const content = useMemo(() => {
    if (fileId === 'readme') return <ReadmeContent openFile={openFile} />
    if (fileId === 'about') return <AboutContent />
    if (['signal', 'atlas', 'tempo', 'drama'].includes(fileId)) return <ProjectContent id={fileId} openFile={openFile} />
    if (fileId === 'skills') return <SkillsContent />
    if (fileId === 'contact') return <ContactContent />
    return <ResumeContent />
  }, [fileId, openFile])
  return <>{content}</>
}
