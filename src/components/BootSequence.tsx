import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'
import NextImage from 'next/image'
import type { BootChoice, DesktopPlatform } from '../types'

type BootEntry = {
  id: BootChoice
  label: string
  detail: string
  target: string
  script: string
}

const options: BootEntry[] = [
  {
    id: 'windows',
    label: 'AmmarOS — Windows desktop experience',
    detail: 'Boot the complete portfolio with the Windows-native shell, Explorer, taskbar and desktop applications.',
    target: '/EFI/AMMAROS/WINDOWS/BOOTX64.EFI',
    script: "set root='hd0,gpt2'\nlinux /boot/vmlinuz-ammaros root=UUID=AMMAR-2601 ro quiet splash platform=windows\ninitrd /boot/initramfs-ammaros.img\nboot",
  },
  {
    id: 'macos',
    label: 'AmmarOS — macOS desktop experience',
    detail: 'Boot the complete portfolio with Finder, menu bar, Dock, Launchpad, Spotlight and native macOS chrome.',
    target: '/EFI/AMMAROS/MACOS/BOOTX64.EFI',
    script: "insmod part_gpt\ninsmod chain\nsearch --fs-uuid --set=root AMMAR-MAC-2601\nchainloader /EFI/AMMAROS/MACOS/BOOTX64.EFI\nboot",
  },
  {
    id: 'safe',
    label: 'AmmarOS — safe graphics mode',
    detail: 'Start the accessible static portfolio with animations and accelerated desktop effects disabled.',
    target: '/boot/vmlinuz-ammaros (nomodeset)',
    script: "set root='hd0,gpt2'\nlinux /boot/vmlinuz-ammaros root=UUID=AMMAR-2601 ro nomodeset accessibility=1\ninitrd /boot/initramfs-ammaros.img\nboot",
  },
  {
    id: 'easter',
    label: 'AmmarOS memory diagnostics',
    detail: 'Run the built-in memory, curiosity and builder-resilience diagnostic utility.',
    target: '/EFI/TOOLS/AMMAR-MEMTEST.EFI',
    script: "insmod chain\nsearch --file --set=root /EFI/TOOLS/AMMAR-MEMTEST.EFI\nchainloader /EFI/TOOLS/AMMAR-MEMTEST.EFI\nboot",
  },
]

type BootSequenceProps = {
  onChoose: (choice: BootChoice) => void
  reducedMotion: boolean
}

type GrubMode = 'menu' | 'edit' | 'console'

export function BootSequence({ onChoose, reducedMotion }: BootSequenceProps) {
  const [selected, setSelected] = useState(0)
  const [progress, setProgress] = useState(100)
  const [autoBoot, setAutoBoot] = useState(true)
  const [mode, setMode] = useState<GrubMode>('menu')
  const [editBuffer, setEditBuffer] = useState(options[0].script)
  const [consoleInput, setConsoleInput] = useState('')
  const [consoleLines, setConsoleLines] = useState<string[]>(['GNU GRUB command-line interface', 'Type “help” for a list of supported commands. Press Esc to return.', ''])
  const rootRef = useRef<HTMLDivElement>(null)
  const consoleInputRef = useRef<HTMLInputElement>(null)

  const choose = useCallback((index = selected) => {
    onChoose(options[index].id)
  }, [onChoose, selected])

  useEffect(() => {
    rootRef.current?.focus()
  }, [])

  useEffect(() => {
    if (mode === 'console') window.setTimeout(() => consoleInputRef.current?.focus(), 20)
  }, [mode])

  useEffect(() => {
    if (mode !== 'menu' || !autoBoot) return
    if (reducedMotion) {
      const reducedTimer = window.setTimeout(() => choose(0), 650)
      return () => window.clearTimeout(reducedTimer)
    }
    const started = performance.now()
    const duration = 2900
    const timer = window.setInterval(() => {
      const remaining = Math.max(0, 100 - ((performance.now() - started) / duration) * 100)
      setProgress(remaining)
      if (remaining <= 0) {
        window.clearInterval(timer)
        choose(0)
      }
    }, 40)
    return () => window.clearInterval(timer)
  }, [autoBoot, choose, mode, reducedMotion])

  function pauseAutoBoot() {
    setAutoBoot(false)
    setProgress(100)
  }

  function enterEditMode() {
    pauseAutoBoot()
    setEditBuffer(options[selected].script)
    setMode('edit')
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    if (mode !== 'menu') return
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      pauseAutoBoot()
      setSelected((value) => (value + 1) % options.length)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      pauseAutoBoot()
      setSelected((value) => (value - 1 + options.length) % options.length)
    } else if (event.key === 'Home') {
      event.preventDefault(); pauseAutoBoot(); setSelected(0)
    } else if (event.key === 'End') {
      event.preventDefault(); pauseAutoBoot(); setSelected(options.length - 1)
    } else if (event.key === 'Enter') {
      event.preventDefault(); choose()
    } else if (event.key.toLowerCase() === 'e') {
      event.preventDefault(); enterEditMode()
    } else if (event.key.toLowerCase() === 'c') {
      event.preventDefault(); pauseAutoBoot(); setMode('console')
    } else if (/^[1-4]$/.test(event.key)) {
      event.preventDefault(); pauseAutoBoot(); setSelected(Number(event.key) - 1)
    }
  }

  function runConsoleCommand(event: FormEvent) {
    event.preventDefault()
    const raw = consoleInput.trim()
    const command = raw.toLowerCase()
    if (!raw) return
    const next = [`grub> ${raw}`]
    if (command === 'help') next.push('boot  clear  exit  help  ls  set  version')
    else if (command === 'ls') next.push('(hd0) (hd0,gpt1) (hd0,gpt2) (memdisk)')
    else if (command.startsWith('ls ')) next.push('EFI/ boot/ portfolio/ resume/ projects/')
    else if (command === 'set') next.push(`root=(hd0,gpt2)  prefix=(hd0,gpt2)/boot/grub  selected=${options[selected].id}`)
    else if (command === 'version') next.push('GNU GRUB 2.12-ammar.1  x86_64-efi')
    else if (command === 'clear') { setConsoleLines([]); setConsoleInput(''); return }
    else if (command === 'exit') { setMode('menu'); setConsoleInput(''); return }
    else if (command === 'boot') { choose(); return }
    else next.push(`error: unknown command '${raw}'.`)
    setConsoleLines((lines) => [...lines, ...next])
    setConsoleInput('')
  }

  const seconds = Math.max(1, Math.ceil((progress / 100) * 3))
  const entry = options[selected]

  return (
    <div className="boot-screen" ref={rootRef} tabIndex={0} onKeyDown={handleKeyDown} aria-label="AmmarOS GNU GRUB bootloader">
      <div className="boot-noise" aria-hidden="true" />
      <div className="boot-firmware" aria-hidden="true"><span>AMMAR UEFI</span><span>Firmware 2.70 · x86_64 · Secure Boot: portfolio mode</span></div>
      <main className="boot-console">
        <div className="boot-brand">GNU GRUB <span>version 2.12-ammar.1</span></div>

        {mode === 'menu' && <div className="boot-frame">
          <p className="boot-instructions">Use the ↑ and ↓ keys to select which entry is highlighted. Press Enter to boot the selected OS.</p>
          <div className="boot-options" role="listbox" aria-label="Boot entries">
            {options.map((option, index) => (
              <button
                key={option.id}
                role="option"
                aria-selected={selected === index}
                className={selected === index ? 'boot-option selected' : 'boot-option'}
                onClick={() => choose(index)}
              >
                <span>{option.label}</span><kbd>{index + 1}</kbd>
              </button>
            ))}
          </div>
          <div className="boot-entry-info"><span>Selected entry</span><strong>{entry.id === 'macos' ? 'Darwin-compatible EFI chainloader' : entry.id === 'windows' ? 'AmmarOS hybrid desktop kernel' : entry.id === 'safe' ? 'Fallback portfolio renderer' : 'UEFI diagnostic image'}</strong><p>{entry.detail}</p><code>{entry.target}</code></div>
          <div className="boot-countdown">
            <span>{autoBoot ? `The highlighted entry will be executed automatically in ${seconds}s.` : 'Automatic boot paused by keyboard input.'}</span>
            <span>{autoBoot ? 'Press any navigation key to stop the countdown.' : 'Press Enter to boot the selected entry.'}</span>
          </div>
          {autoBoot && !reducedMotion && <div className="boot-progress"><i style={{ width: `${progress}%` }} /></div>}
        </div>}

        {mode === 'edit' && <div className="grub-edit-screen">
          <p>Editing “{entry.label}”</p>
          <textarea value={editBuffer} onChange={(event) => setEditBuffer(event.target.value)} autoFocus spellCheck={false} onKeyDown={(event) => {
            if (event.key === 'Escape') { event.preventDefault(); setMode('menu') }
            if (event.key === 'F10' || (event.ctrlKey && event.key.toLowerCase() === 'x')) { event.preventDefault(); choose() }
          }} aria-label="Editable GRUB boot commands" />
          <footer><span>Ctrl-x or F10 boots this entry</span><span>Esc discards edits and returns to the menu</span></footer>
        </div>}

        {mode === 'console' && <div className="grub-command-screen" onClick={() => consoleInputRef.current?.focus()}>
          <div>{consoleLines.map((line, index) => <p key={`${line}-${index}`}>{line || '\u00A0'}</p>)}</div>
          <form onSubmit={runConsoleCommand}><span>grub&gt;</span><input ref={consoleInputRef} value={consoleInput} onChange={(event) => setConsoleInput(event.target.value)} onKeyDown={(event) => { if (event.key === 'Escape') { event.preventDefault(); setMode('menu') } }} autoComplete="off" spellCheck={false} aria-label="GRUB command" /></form>
          <footer>Press Esc to return to the boot menu.</footer>
        </div>}

        <div className="boot-keymap">
          {mode === 'menu' ? <><span><kbd>Enter</kbd> boot</span><span><kbd>e</kbd> edit commands</span><span><kbd>c</kbd> command line</span><span><kbd>↑↓</kbd> navigate</span></> : <span>GNU GRUB minimal BASH-like line editing is supported.</span>}
        </div>
        <p className="boot-footer">Platform: x86_64-efi · Memory: 65536K/65536K available · github.com/ammarasad2005</p>
      </main>
    </div>
  )
}

export function LoadingScreen({ reducedMotion, platform }: { reducedMotion: boolean; platform: DesktopPlatform }) {
  return (
    <div className={`loading-screen loading-${platform}`} role="status" aria-live="polite">
      {platform === 'macos' ? <div className="mac-login-account"><span className="mac-login-avatar"><NextImage src="/ammar-avatar.png" width={160} height={160} priority alt="Abstract developer profile avatar for Muhammad Ammar Asad" /><i /></span><strong>Muhammad Ammar Asad</strong><small>Developer Account · AmmarOS</small></div> : <div className="os-mark" aria-hidden="true"><i /><i /><i /><i /></div>}
      {platform === 'macos' ? <div className={`mac-login-progress ${reducedMotion ? 'still' : ''}`} aria-label="Signing in to AmmarOS"><i /></div> : <div className={reducedMotion ? 'loading-dots still' : 'loading-dots'} aria-label="Starting AmmarOS"><i /><i /><i /><i /><i /></div>}
      <p className={platform === 'macos' ? 'mac-login-message' : ''}>{platform === 'macos' ? 'Signing in…' : 'starting Windows workspace'}</p>
      <button className="skip-link visible-skip" onClick={() => window.dispatchEvent(new Event('alexos:skip'))}>Skip intro</button>
    </div>
  )
}
