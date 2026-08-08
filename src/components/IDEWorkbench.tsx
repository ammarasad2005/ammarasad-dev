import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Braces, ChevronDown, ChevronRight, CircleUserRound, Code2, Command, Files, GitBranch, PanelBottom, Search, Settings, Sparkles, X } from 'lucide-react'
import { fileById, portfolioFiles } from '../data/portfolio'
import { ContentRenderer } from './ContentRenderer'

const groups = [
  { id: 'about', label: 'about' },
  { id: 'projects', label: 'projects' },
  { id: 'skills', label: 'skills' },
] as const

function FileIcon({ language }: { language: string }) {
  if (language === 'typescript') return <span className="file-glyph ts">TS</span>
  if (language === 'json') return <span className="file-glyph json">{'{}'}</span>
  if (language === 'pdf') return <span className="file-glyph pdf">PDF</span>
  return <span className="file-glyph md">M↓</span>
}

type IDEWorkbenchProps = {
  initialFile?: string
  onRestart: () => void
  onMinimize: () => void
  reducedMotion: boolean
}

export function IDEWorkbench({ initialFile = 'readme', onRestart, onMinimize, reducedMotion }: IDEWorkbenchProps) {
  const [openTabs, setOpenTabs] = useState<string[]>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('alexos:tabs') ?? '[]') as string[]
      return saved.length ? saved.filter((id) => fileById[id]) : ['readme', 'about']
    } catch { return ['readme', 'about'] }
  })
  const [activeFile, setActiveFile] = useState(fileById[initialFile] ? initialFile : 'readme')
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ about: true, projects: true, skills: true })
  const [activity, setActivity] = useState<'files' | 'search'>('files')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [paletteQuery, setPaletteQuery] = useState('')
  const [terminalOpen, setTerminalOpen] = useState(false)
  const [theme, setTheme] = useState(() => localStorage.getItem('alexos:theme') || 'midnight')
  const [searchQuery, setSearchQuery] = useState('')
  const [terminalLines, setTerminalLines] = useState<string[]>(['AmmarOS shell 1.0.0 — type “help” for commands.'])
  const [terminalInput, setTerminalInput] = useState('')
  const paletteInputRef = useRef<HTMLInputElement>(null)
  const terminalInputRef = useRef<HTMLInputElement>(null)

  const openFile = useCallback((id: string) => {
    if (!fileById[id]) return
    setOpenTabs((tabs) => tabs.includes(id) ? tabs : [...tabs, id])
    setActiveFile(id)
    setPaletteOpen(false)
  }, [])

  useEffect(() => {
    if (!initialFile || !fileById[initialFile]) return
    const timer = window.setTimeout(() => openFile(initialFile), 0)
    return () => window.clearTimeout(timer)
  }, [initialFile, openFile])

  useEffect(() => {
    localStorage.setItem('alexos:tabs', JSON.stringify(openTabs))
  }, [openTabs])

  useEffect(() => {
    localStorage.setItem('alexos:theme', theme)
  }, [theme])

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const command = event.metaKey || event.ctrlKey
      if (command && event.key.toLowerCase() === 'p') {
        event.preventDefault(); setPaletteOpen(true)
      }
      if (command && event.key === '`') {
        event.preventDefault(); setTerminalOpen((value) => !value)
      }
      if (command && event.key.toLowerCase() === 'w') {
        event.preventDefault(); closeTab(activeFile)
      }
      if (event.key === 'Escape') setPaletteOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  })

  useEffect(() => {
    if (paletteOpen) window.setTimeout(() => paletteInputRef.current?.focus(), 20)
  }, [paletteOpen])

  function closeTab(id: string) {
    setOpenTabs((tabs) => {
      const index = tabs.indexOf(id)
      const next = tabs.filter((tab) => tab !== id)
      if (activeFile === id) setActiveFile(next[Math.max(0, index - 1)] ?? 'readme')
      return next.length ? next : ['readme']
    })
  }

  const filteredFiles = useMemo(() => portfolioFiles.filter((file) => `${file.name} ${file.path}`.toLowerCase().includes((paletteOpen ? paletteQuery : searchQuery).toLowerCase())), [paletteOpen, paletteQuery, searchQuery])

  function runCommand(raw: string) {
    const command = raw.trim().toLowerCase()
    const output: string[] = [`ammar@portfolio:~$ ${raw}`]
    if (!command) return
    if (command === 'clear') { setTerminalLines([]); setTerminalInput(''); return }
    if (command === 'help') output.push('help · about · projects · skills · contact · theme · date · whoami · restart · clear')
    else if (command === 'whoami') output.push('Muhammad Ammar Asad — full-stack developer and CS student at FAST-NUCES.')
    else if (command === 'date') output.push(new Date().toString())
    else if (command === 'theme') { toggleTheme(); output.push(`Theme toggled.`) }
    else if (command === 'restart') { onRestart(); return }
    else if (['about', 'skills', 'contact'].includes(command)) { openFile(command); output.push(`Opened ${fileById[command].path}`) }
    else if (command === 'projects') { openFile('signal'); output.push('Opened projects/fast-isb-utilities.md') }
    else output.push(`command not found: ${command}. Try “help”.`)
    setTerminalLines((lines) => [...lines, ...output])
    setTerminalInput('')
  }

  function toggleTheme() {
    setTheme((value) => value === 'midnight' ? 'contrast' : 'midnight')
  }

  function showTerminalMessage(message: string) {
    setTerminalOpen(true)
    setTerminalLines((lines) => [...lines, message])
  }

  return (
    <div className={`ide-workbench theme-${theme}`} aria-label="Portfolio code editor">
      <div className="ide-titlebar">
        <div className="window-mark"><Code2 size={17} /><span>MA</span></div>
        <nav aria-label="Application menu"><button onClick={() => setPaletteOpen(true)}>File</button><button onClick={() => setPaletteOpen(true)}>Edit</button><button onClick={() => setSidebarOpen((value) => !value)}>View</button><button onClick={() => setTerminalOpen((value) => !value)}>Terminal</button><button onClick={() => showTerminalMessage('Tip: press Ctrl/Cmd+P to open any portfolio file.')}>Help</button></nav>
        <button className="title-command" onClick={() => setPaletteOpen(true)}><Search size={13} /><span>{fileById[activeFile]?.path ?? 'portfolio'}</span><kbd>⌘P</kbd></button>
        <div className="title-actions"><button aria-label="Minimize window" onClick={onMinimize}>—</button><span aria-hidden="true">□</span><button aria-label="Close portfolio window" onClick={onMinimize}>×</button></div>
      </div>

      <div className="ide-main">
        <aside className="activity-bar" aria-label="Activity bar">
          <div>
            <button className={activity === 'files' ? 'active' : ''} aria-label="Explorer" onClick={() => { setActivity('files'); setSidebarOpen(true) }}><Files /></button>
            <button className={activity === 'search' ? 'active' : ''} aria-label="Search" onClick={() => { setActivity('search'); setSidebarOpen(true) }}><Search /></button>
            <button aria-label="Source control status" onClick={() => showTerminalMessage('git status — 4 deployed projects ready to explore.')}><GitBranch /><span className="activity-badge">4</span></button>
            <button aria-label="Open skills and extensions" onClick={() => openFile('skills')}><Braces /></button>
          </div>
          <div><button aria-label="Open profile" onClick={() => openFile('about')}><CircleUserRound /></button><button aria-label="Toggle color theme" onClick={toggleTheme}><Settings /></button></div>
        </aside>

        {sidebarOpen && <aside className="explorer-sidebar">
          <div className="sidebar-heading"><span>{activity === 'files' ? 'EXPLORER' : 'SEARCH'}</span><button aria-label="Close sidebar" onClick={() => setSidebarOpen(false)}>···</button></div>
          {activity === 'search' ? (
            <div className="search-panel"><label><Search size={13} /><input autoFocus value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search files" /></label><small>{filteredFiles.length} results in portfolio</small>{filteredFiles.map((file) => <button key={file.id} onClick={() => openFile(file.id)}><FileIcon language={file.language} /><span>{file.name}<small>{file.path}</small></span></button>)}</div>
          ) : (
            <div className="file-tree" role="tree" aria-label="Portfolio files">
              <div className="tree-root"><ChevronDown size={14} /> PORTFOLIO</div>
              {portfolioFiles.filter((file) => file.group === 'root').slice(0, 1).map((file) => <FileButton key={file.id} file={file} active={activeFile === file.id} onClick={() => openFile(file.id)} />)}
              {groups.map((group) => <div key={group.id}>
                <button className="folder-row" onClick={() => setExpanded((value) => ({ ...value, [group.id]: !value[group.id] }))}>{expanded[group.id] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}<span>{group.label}</span></button>
                {expanded[group.id] && <div className="folder-children">{portfolioFiles.filter((file) => file.group === group.id).map((file) => <FileButton key={file.id} file={file} active={activeFile === file.id} onClick={() => openFile(file.id)} />)}</div>}
              </div>)}
              {portfolioFiles.filter((file) => file.group === 'root').slice(1).map((file) => <FileButton key={file.id} file={file} active={activeFile === file.id} onClick={() => openFile(file.id)} />)}
              <div className="tree-outline"><ChevronRight size={14} /> OUTLINE</div><div className="tree-outline"><ChevronRight size={14} /> TIMELINE</div>
            </div>
          )}
        </aside>}

        <main className="editor-area">
          <div className="tab-strip" role="tablist" aria-label="Open files">
            {openTabs.map((id) => { const file = fileById[id]; return <div role="tab" aria-selected={activeFile === id} className={activeFile === id ? 'editor-tab active' : 'editor-tab'} key={id} onClick={() => setActiveFile(id)}><FileIcon language={file.language} /><span>{file.name}</span><button aria-label={`Close ${file.name}`} onClick={(event) => { event.stopPropagation(); closeTab(id) }}><X size={13} /></button></div> })}
          </div>
          <div className="breadcrumbs"><span>portfolio</span><ChevronRight />{fileById[activeFile]?.path.split('/').slice(1).map((part) => <span key={part}>{part}<ChevronRight /></span>)}</div>
          <div className="editor-scroll" role="tabpanel" tabIndex={0}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={activeFile} initial={reducedMotion ? false : { opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={reducedMotion ? undefined : { opacity: 0 }} transition={{ duration: 0.16 }}>
                <ContentRenderer fileId={activeFile} openFile={openFile} />
              </motion.div>
            </AnimatePresence>
          </div>

          {terminalOpen && <section className="terminal-panel" aria-label="Integrated terminal">
            <div className="panel-tabs"><span>PROBLEMS&nbsp; 0</span><span>OUTPUT</span><span>DEBUG CONSOLE</span><strong>TERMINAL</strong><div /><button onClick={() => setTerminalOpen(false)} aria-label="Close terminal"><X size={15} /></button></div>
            <div className="terminal-body" onClick={() => terminalInputRef.current?.focus()}>{terminalLines.map((line, index) => <div key={`${line}-${index}`}>{line}</div>)}<form onSubmit={(event) => { event.preventDefault(); runCommand(terminalInput) }}><span>ammar@portfolio:~$</span><input ref={terminalInputRef} value={terminalInput} onChange={(event) => setTerminalInput(event.target.value)} aria-label="Terminal command" autoComplete="off" /></form></div>
          </section>}
        </main>
      </div>

      <footer className="status-bar">
        <div><span className="status-item"><GitBranch size={13} /> main*</span><span>↻</span><span>ⓧ 0&nbsp;&nbsp; △ 0</span></div>
        <div><button onClick={() => setTerminalOpen((value) => !value)}><PanelBottom size={13} /> Terminal</button><span>Ln 1, Col 1</span><span>Spaces: 2</span><span>UTF-8</span><span>{fileById[activeFile]?.language}</span><button onClick={toggleTheme}><Sparkles size={13} /> {theme}</button><span>◯ Prettier</span></div>
      </footer>

      <AnimatePresence>
        {paletteOpen && <motion.div className="palette-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={() => setPaletteOpen(false)}>
          <motion.div className="command-palette" role="dialog" aria-modal="true" aria-label="Command palette" initial={reducedMotion ? false : { opacity: 0, y: -16, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10 }} onMouseDown={(event) => event.stopPropagation()}>
            <label><Command size={17} /><input ref={paletteInputRef} value={paletteQuery} onChange={(event) => setPaletteQuery(event.target.value)} placeholder="Search files by name" onKeyDown={(event) => { if (event.key === 'Enter' && filteredFiles[0]) openFile(filteredFiles[0].id) }} /><kbd>esc</kbd></label>
            <div><span className="palette-label">files</span>{filteredFiles.map((file, index) => <button key={file.id} onClick={() => openFile(file.id)}><FileIcon language={file.language} /><span>{file.name}<small>{file.path}</small></span>{index === 0 && <kbd>↵</kbd>}</button>)}{!filteredFiles.length && <p className="empty-result">No matching files</p>}</div>
          </motion.div>
        </motion.div>}
      </AnimatePresence>
    </div>
  )
}

function FileButton({ file, active, onClick }: { file: (typeof portfolioFiles)[number]; active: boolean; onClick: () => void }) {
  return <button role="treeitem" aria-selected={active} className={active ? 'file-row active' : 'file-row'} onClick={onClick}><FileIcon language={file.language} /><span>{file.name}</span></button>
}
