import { useState } from 'react'
import { ArrowUpRight, Check, Code2, Copy, Github, Linkedin, Mail, Menu, X } from 'lucide-react'
import { projects } from '../data/portfolio'

type MobilePortfolioProps = {
  safeMode?: boolean
  canLaunchFull?: boolean
  onLaunchFull?: () => void
}

export function MobilePortfolio({ safeMode = false, canLaunchFull = false, onLaunchFull }: MobilePortfolioProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const email = 'ammarasad321993@gmail.com'
  async function copy() { await navigator.clipboard?.writeText(email); setCopied(true); window.setTimeout(() => setCopied(false), 1400) }
  function scrollTo(id: string) { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); setMenuOpen(false) }

  return <div className="mobile-portfolio">
    <header className="mobile-nav"><button className="mobile-logo" onClick={() => scrollTo('home')}><Code2 /><span>ammar<em>.dev</em></span></button><nav><button onClick={() => scrollTo('work')}>Work</button><button onClick={() => scrollTo('about')}>About</button><button onClick={() => scrollTo('contact')}>Contact</button></nav><button className="menu-toggle" onClick={() => setMenuOpen((value) => !value)} aria-label="Toggle menu">{menuOpen ? <X /> : <Menu />}</button></header>
    {menuOpen && <div className="mobile-menu"><button onClick={() => scrollTo('work')}>01 / Work</button><button onClick={() => scrollTo('about')}>02 / About</button><button onClick={() => scrollTo('contact')}>03 / Contact</button></div>}
    <main>
      <section className="mobile-hero" id="home">
        <div className="readme-kicker"><span className="pulse-dot" /> {safeMode ? 'safe graphics mode' : 'open to full-stack internships'}</div>
        <h1>I build full-stack products that solve <em>real problems.</em></h1>
        <p>Muhammad Ammar Asad is a Computer Science student at FAST-NUCES and a full-stack developer shipping end-to-end products with TypeScript, React, Next.js, Node.js, and modern databases.</p>
        <div><button className="primary-action" onClick={() => scrollTo('work')}>See selected work <ArrowUpRight /></button><button className="mobile-text-action" onClick={() => scrollTo('contact')}>Say hello →</button></div>
        {safeMode && canLaunchFull && <button className="launch-full" onClick={onLaunchFull}>Launch immersive desktop experience</button>}
        <footer><span>Islamabad, Pakistan</span><span>Full-Stack Developer · FAST-NUCES</span></footer>
      </section>
      <section className="mobile-work" id="work"><div className="mobile-section-label"><span>01</span><h2>Selected work</h2></div>{projects.map((project) => <article key={project.id}><div className="mobile-project-art" style={{ background: project.gradient }}><span>{project.index}</span><div><i /><i /><b /></div></div><div className="mobile-project-copy"><span>{project.tags.join(' · ')}</span><h3>{project.title}</h3><p>{project.description}</p><div><strong>{project.metric}</strong><small>{project.metricLabel}</small></div></div></article>)}</section>
      <section className="mobile-about" id="about"><div className="mobile-section-label"><span>02</span><h2>About</h2></div><h2>Student mindset.<br /><em>Builder’s momentum.</em></h2><p>I’m a sixth-semester B.S. Computer Science student specializing in end-to-end web apps, authenticated APIs, serverless backends, databases, and third-party integrations. I learn fastest by shipping software people can use.</p><div className="mobile-stats"><span><strong>04</strong>deployed projects</span><span><strong>12+</strong>campus tools unified</span><span><strong>06</strong>current semester</span></div><div className="mobile-tools">{['TypeScript', 'React 19', 'Next.js', 'Tailwind', 'Node.js', 'Express', 'PostgreSQL', 'MongoDB', 'OAuth 2.0'].map((item) => <span key={item}>{item}</span>)}</div></section>
      <section className="mobile-contact" id="contact"><div className="mobile-section-label"><span>03</span><h2>Contact</h2></div><h2>Let’s build something<br /><em>genuinely useful.</em></h2><p>I’m looking for a full-stack development internship where I can contribute to production software, learn from a strong team, and keep shipping.</p><a className="primary-action" href={`mailto:${email}`}>Write an email <Mail /></a><button className="copy-mobile" onClick={copy}>{copied ? <Check /> : <Copy />}{copied ? 'Copied to clipboard' : email}</button><div className="mobile-social"><a href="https://github.com/ammarasad2005" target="_blank" rel="noreferrer"><Github /> GitHub</a><a href="https://www.linkedin.com/in/muhammad-ammar-asad/" target="_blank" rel="noreferrer"><Linkedin /> LinkedIn</a><a href="/resume.pdf" target="_blank" rel="noreferrer">Résumé ↗</a></div></section>
    </main>
    <footer className="mobile-footer"><span>© 2026 Muhammad Ammar Asad</span><button onClick={() => scrollTo('home')}>Back to top ↑</button></footer>
  </div>
}
